import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maz</title>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <iframe src="https://www.appsheet.com/start/52935ea8-3bc8-4ef1-bee3-9bb476f0bea2?platform=desktop" title="Maz"></iframe>
</body>
</html>`;

    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8"
        }
    });
}
