import NextAuth from "next-auth";
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
        // New: Cooldown period to reset the count
        const COOL_DOWN_MINUTES = 10; 
        const email = credentials.email.toLowerCase();
        const now = new Date();

        // Find login attempt record
        let attempt = await prisma.loginAttempt.findUnique({
          where: { email },
        });

        // If locked, check if lockout expired
        if (attempt?.lockedUntil && now < attempt.lockedUntil) {
          throw new Error(
            "Account locked due to too many failed attempts. Try again later."
          );
        }

        // New: Reset count if a cool-down period has passed since the last attempt
        let currentAttemptCount = attempt?.count || 0;
        if (attempt?.lastAttempt) {
            const timeSinceLastAttempt = now.getTime() - attempt.lastAttempt.getTime();
            if (timeSinceLastAttempt > COOL_DOWN_MINUTES * 60 * 1000) {
                currentAttemptCount = 0; // Reset the count
            }
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Check user and password
        const isPasswordCorrect = user && user.hashedPassword && await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!isPasswordCorrect) {
          const newAttemptCount = currentAttemptCount + 1;
          const lockedUntil = newAttemptCount >= MAX_ATTEMPTS
            ? new Date(now.getTime() + LOCKOUT_MINUTES * 60 * 1000)
            : null;
          
          await prisma.loginAttempt.upsert({
            where: { email },
            update: {
              count: newAttemptCount,
              lastAttempt: now,
              lockedUntil,
            },
            create: {
              email,
              count: 1,
              lastAttempt: now,
              lockedUntil: null,
            },
          });

          if (newAttemptCount >= MAX_ATTEMPTS) {
            throw new Error(
              "Account locked due to too many failed attempts. Try again later."
            );
          } else {
            throw new Error("Invalid credentials");
          }
        }

        // On successful login, reset attempts
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };