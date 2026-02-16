import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seiton</title>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <iframe src="https://www.appsheet.com/start/407958d3-41d6-4e6a-99dd-1251dc2afa38?platform=desktop" title="Seiton"></iframe>
</body>
</html>`;

    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8"
        }
    });
}
