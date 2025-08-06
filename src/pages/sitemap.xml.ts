export const prerender = true;

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
      <loc>https://theoldsiam.co.th/event</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://theoldsiam.co.th/event/2025/pride-month-vote</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://theoldsiam.co.th/event/2025/mothers-day-activity</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
