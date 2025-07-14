import { Resend } from 'resend';

const resend = new Resend(process.env.re_SqvFJ2qT_FnpAbZXBfnFcHXhmeFU3xV3g);

export default async function handler(req, res) {
  const { name, email, message } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact Form <rhobertcarwanag@gmail.com>',
      to: ['rhobertcarwana@gmail.com'], // <-- CHANGE THIS TO YOUR EMAIL
      subject: `New Portfolio Message from ${name}`,
      html: `
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
