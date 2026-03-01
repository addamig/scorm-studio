// GET /api/shared.js?id=abc123 — Load shared course from Vercel Blob
import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id.' });

  try {
    // List blobs with the course prefix to find the file
    const { blobs } = await list({ prefix: `shared-courses/${id}` });

    if (!blobs || blobs.length === 0) {
      return res.status(404).json({ error: 'Kursen hittades inte.' });
    }

    // Fetch the blob content
    const blobUrl = blobs[0].url;
    const response = await fetch(blobUrl);
    if (!response.ok) throw new Error('Kunde inte hämta kursdata.');

    const courseData = await response.json();
    return res.status(200).json(courseData);

  } catch (err) {
    console.error('Shared course error:', err);
    return res.status(500).json({ error: err.message });
  }
}
