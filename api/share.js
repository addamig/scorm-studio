// POST /api/share — Save course JSON to Vercel Blob, return share ID
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { course, videoJobs } = req.body;
    if (!course || !course.title) {
      return res.status(400).json({ error: 'Missing course data.' });
    }

    // Generate a short unique ID
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);

    // Strip base64 images to keep blob small (they can be huge)
    // Keep video URLs (they're just links)
    const lightCourse = JSON.parse(JSON.stringify(course));
    for (const mod of (lightCourse.modules || [])) {
      for (const slide of (mod.slides || [])) {
        if (slide.generated_image && slide.generated_image.length > 1000) {
          slide.generated_image = null; // Remove base64 images
        }
      }
    }

    const payload = JSON.stringify({
      id,
      course: lightCourse,
      videoJobs: (videoJobs || []).map(j => ({
        moduleIndex: j.moduleIndex,
        title: j.title,
        status: j.status,
        videoUrl: j.videoUrl,
        duration: j.duration
      })),
      sharedAt: new Date().toISOString()
    });

    const blob = await put(`shared-courses/${id}.json`, payload, {
      access: 'public',
      contentType: 'application/json'
    });

    return res.status(200).json({
      id,
      blobUrl: blob.url,
      shareUrl: `${req.headers.origin || 'https://scorm-studio-azure.vercel.app'}?kurs=${id}`
    });

  } catch (err) {
    console.error('Share error:', err);
    return res.status(500).json({ error: err.message });
  }
}
