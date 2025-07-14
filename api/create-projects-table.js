javascript
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const result = await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        link VARCHAR(255),
        imageUrl VARCHAR(255)
      );
    `;
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}