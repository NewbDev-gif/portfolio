import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const { rows: projects } = await sql`SELECT * FROM projects ORDER BY id;`;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}