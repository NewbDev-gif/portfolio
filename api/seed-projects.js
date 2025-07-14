import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

const resend = new Resend(process.env.re_SqvFJ2qT_FnpAbZXBfnFcHXhmeFU3xV3g);

export default async function handler(req, res) {
  try {
    await sql`DELETE FROM projects;`; // This prevents creating duplicate projects
    await sql`
      INSERT INTO projects (title, description, link, imageUrl)
      VALUES 
        ('Lifewood Rebranding', 'A rebranding for a company website.', 'https://lifewood-test.vercel.app', 'https://placehold.co/600x400/0d0d1a/00ffff?text=Lifewood+Rebranding'),
        ('Aether Framework', 'CSS framework for building holographic-style UIs.', 'https://example.com/aether', 'https://placehold.co/600x400/0d0d1a/ff00ff?text=ProjectB'),
        ('Quantum Leap', 'An interactive educational game about quantum physics.', 'https://example.com/quantum', 'https://placehold.co/600x400/0d0d1a/9f00ff?text=ProjectC');
    `;
    const { rows: projects } = await sql`SELECT * FROM projects;`;
    
    await resend.emails.send({
      from: 'Portfolio System <onboarding@resend.dev>',
      to: ['rhobertcarwana@gmail.com'], // <-- CHANGE THIS TO YOUR EMAIL
      subject: '✅ Success! Portfolio Database Has Been Seeded.',
      html: `<h3>Database seeding was successful!</h3><p>Your database now contains ${projects.length} projects.</p>`
    });

    res.status(200).json({ message: 'Seeding successful! A confirmation email has been sent.', projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
