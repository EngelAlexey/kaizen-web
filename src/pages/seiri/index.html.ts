import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seiri</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <iframe src="https://www.appsheet.com/start/5650fb74-c0e3-4b63-8cd6-29cfe26505d2?platform=desktop#appName=Seiri-535180224&vss=H4sIAAAAAAAAA6WOzQ7CIBCE32XOPAFX48EYvWj0IB6wbBNSCk2hakN4d6H156weZ3a-2Ym4arrtgqwa8FP8qDWN4IgC-7EjAS6wcDb0zggwga1sZ1M2RzKVKyohndmrIJAHj1_y_M__DFqRDbrW1JeyguaSJ5jPBcvGG0JiaIcgL4amzRNU1By0gzEp5UztqsGTOuRxv4zyK7u8d9KqjVO5tpbGU3oAmD7eynoBAAA=&view=akWelcome" title="Seiri"></iframe>
</body>
</html>`;

    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8"
        }
    });
}
