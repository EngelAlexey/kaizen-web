import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sauma</title>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <iframe src="https://www.appsheet.com/start/978f7715-1b6e-4188-a323-5c8f8f5e906e?platform=desktop" title="Sauma"></iframe>
</body>
</html>`;

    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8"
        }
    });
}
