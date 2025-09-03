import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const MAX_EMAILS_PER_HOUR = 5;

export async function sendMailWithLog({
  to,
  subject,
  html,
  orderId,
}: {
  to: string;
  subject: string;
  html: string;
  orderId?: string;
}) {
  // Rate limiting: Check how many emails sent to this address in the last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const sentCount = await prisma.emailLog.count({
    where: {
      to,
      status: 'SENT',
      createdAt: { gte: oneHourAgo },
    },
  });
  if (sentCount >= MAX_EMAILS_PER_HOUR) {
    throw new Error('Rate limit exceeded for this email address.');
  }

  // Log the email attempt
  const log = await prisma.emailLog.create({
    data: {
      to,
      subject,
      body: html,
      status: 'PENDING',
      orderId,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html,
    });
    await prisma.emailLog.update({
      where: { id: log.id },
      data: { status: 'SENT', retryCount: log.retryCount + 1 },
    });
    return true;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    await prisma.emailLog.update({
      where: { id: log.id },
      data: { status: 'FAILED', error: errorMsg, retryCount: log.retryCount + 1 },
    });
    throw error;
  }
}