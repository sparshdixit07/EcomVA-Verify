import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let transporter = null;

function getTransporter() {
  if (!env.mail.enabled) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.port === 465,
    auth: env.mail.user ? { user: env.mail.user, pass: env.mail.pass } : undefined
  });
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const t = getTransporter();
  if (!t) {
    logger.info(`Mail disabled. Would send to ${to}: ${subject}`);
    return { queued: false };
  }
  try {
    await t.sendMail({
      from: env.mail.from,
      to,
      subject,
      text,
      html
    });
    return { queued: true };
  } catch (err) {
    logger.warn(`Mail send failed: ${err.message}`);
    return { queued: false, error: err.message };
  }
}