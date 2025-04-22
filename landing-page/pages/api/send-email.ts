import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fullName, email, address } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"האתר שלי" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "אישור הזמנה",
      html: `<h2>שלום ${fullName}!</h2><p>הזמנתך התקבלה. נשלח ל: ${address}</p>`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("שגיאה בשליחת מייל:", err);
    res.status(500).json({ success: false });
  }
}
