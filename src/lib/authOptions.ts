import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // --- Rate limiting and lockout logic ---
        const MAX_ATTEMPTS = 5;
        const LOCKOUT_MINUTES = 15;
        const COOL_DOWN_MINUTES = 10;
        const email = credentials.email.toLowerCase();
        const now = new Date();

        const attempt = await prisma.loginAttempt.findUnique({ where: { email } });

        if (attempt?.lockedUntil && now < attempt.lockedUntil) {
          throw new Error("Account locked due to too many failed attempts. Try again later.");
        }

        let currentAttemptCount = attempt?.count || 0;
        if (attempt?.lastAttempt) {
          const timeSinceLastAttempt = now.getTime() - attempt.lastAttempt.getTime();
          if (timeSinceLastAttempt > COOL_DOWN_MINUTES * 60 * 1000) {
            currentAttemptCount = 0;
          }
        }

        const user = await prisma.user.findUnique({ where: { email } });
        const isPasswordCorrect = user && user.hashedPassword && await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!isPasswordCorrect) {
          const newAttemptCount = currentAttemptCount + 1;
          const lockedUntil = newAttemptCount >= MAX_ATTEMPTS
            ? new Date(now.getTime() + LOCKOUT_MINUTES * 60 * 1000)
            : null;

          await prisma.loginAttempt.upsert({
            where: { email },
            update: { count: newAttemptCount, lastAttempt: now, lockedUntil },
            create: { email, count: 1, lastAttempt: now, lockedUntil: null },
          });

          if (newAttemptCount >= MAX_ATTEMPTS) {
            throw new Error("Account locked due to too many failed attempts. Try again later.");
          } else {
            throw new Error("Invalid credentials");
          }
        }

        if (attempt) {
          await prisma.loginAttempt.update({
            where: { email },
            data: { count: 0, lockedUntil: null },
          });
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};