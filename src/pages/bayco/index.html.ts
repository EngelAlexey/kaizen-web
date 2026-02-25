import type { APIRoute } from 'astro';

const bubbleHTML = `
    <!-- Kaizen Bubble Menu -->
    <script src="https://cdn.lordicon.com/lordicon.js"><\/script>

    <button class="kz-bubble-btn" aria-label="Menú Kaizen" onclick="kzToggleMenu()">
        <img src="/favicon.png" alt="Kaizen" width="34" height="34" />
    </button>

    <div id="kz-menu-flotante" class="kz-menu kz-menu-oculto">
        <a class="kz-menu-item" href="https://wa.me/+50687672300" target="_blank" rel="noopener">
            <span class="kz-menu-icon" aria-hidden="true">
                <lord-icon src="https://cdn.lordicon.com/goexrefk.json" trigger="hover" stroke="bold" state="loop-roll" colors="primary:#ffffff,secondary:#b4b4b4"></lord-icon>
            </span>
            <span>Soporte</span>
        </a>
        <a class="kz-menu-item" href="https://www.kaizenapps.net/es/agendar" target="_blank" rel="noopener">
            <span class="kz-menu-icon" aria-hidden="true">
                <lord-icon src="https://cdn.lordicon.com/kkzqhhmn.json" trigger="hover" stroke="bold" state="loop-roll" colors="primary:#ffffff,secondary:#b4b4b4"></lord-icon>
            </span>
            <span>Agendar</span>
        </a>
        <a class="kz-menu-item" href="https://kaizenapps.net/" target="_blank" rel="noopener">
            <span class="kz-menu-icon" aria-hidden="true">
                <lord-icon src="https://cdn.lordicon.com/trkmlure.json" trigger="hover" stroke="bold" state="loop-roll" colors="primary:#ffffff,secondary:#b4b4b4"></lord-icon>
            </span>
            <span>Sitio web</span>
        </a>
        <a class="kz-menu-item" href="https://kaizenapps.net/gpt" target="_blank" rel="noopener">
            <span class="kz-menu-icon" aria-hidden="true">
                <lord-icon src="https://cdn.lordicon.com/ayhtotha.json" trigger="hover" stroke="bold" state="loop" colors="primary:#ffffff,secondary:#4bb3fd"></lord-icon>
            </span>
            <span>Chat</span>
        </a>
    </div>

    <style>
        .kz-bubble-btn {
            position: fixed; bottom: 24px; right: 24px; z-index: 9999;
            width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer;
            background: #b22222;
            box-shadow: 0 4px 20px rgba(178, 34, 34, 0.45), 0 2px 8px rgba(0,0,0,0.2);
            display: grid; place-items: center;
            transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease;
            outline: none;
        }
        .kz-bubble-btn:hover { transform: scale(1.08) translateY(-2px); box-shadow: 0 8px 28px rgba(178, 34, 34, 0.55), 0 4px 12px rgba(0,0,0,0.25); }
        .kz-bubble-btn:active { transform: scale(0.96); }
        .kz-bubble-btn img { width: 34px; height: 34px; object-fit: contain; pointer-events: none; }
        .kz-menu { position: fixed; bottom: 92px; right: 24px; z-index: 9998; display: flex; flex-direction: column; gap: 8px; transform-origin: bottom right; transition: opacity 0.2s ease, transform 0.25s cubic-bezier(.22,1,.36,1); }
        .kz-menu-oculto { opacity: 0; transform: scale(0.85) translateY(8px); pointer-events: none; }
        .kz-menu-visible { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
        .kz-menu-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px 10px 12px; border-radius: 40px; background: #b22222; color: #fff; text-decoration: none; font-family: 'Outfit', system-ui, sans-serif; font-size: 14px; font-weight: 500; white-space: nowrap; box-shadow: 0 3px 14px rgba(178, 34, 34, 0.35), 0 1px 6px rgba(0,0,0,0.18); transition: transform 0.18s cubic-bezier(.22,1,.36,1), box-shadow 0.18s ease, filter 0.18s ease; align-self: flex-end; }
        .kz-menu-item:hover { transform: translateX(-4px) scale(1.03); box-shadow: 0 6px 20px rgba(178, 34, 34, 0.5), 0 2px 8px rgba(0,0,0,0.2); filter: brightness(1.08); }
        .kz-menu-icon { width: 32px; height: 32px; flex-shrink: 0; display: grid; place-items: center; }
        .kz-menu-icon lord-icon { width: 28px; height: 28px; }
        .kz-menu-visible .kz-menu-item:nth-child(1) { animation: kzIn 0.2s ease 0.00s both; }
        .kz-menu-visible .kz-menu-item:nth-child(2) { animation: kzIn 0.2s ease 0.04s both; }
        .kz-menu-visible .kz-menu-item:nth-child(3) { animation: kzIn 0.2s ease 0.08s both; }
        .kz-menu-visible .kz-menu-item:nth-child(4) { animation: kzIn 0.2s ease 0.12s both; }
        @keyframes kzIn { from { opacity:0; transform: translateX(12px); } to { opacity:1; transform: translateX(0); } }
    </style>

    <script>
        function kzToggleMenu() {
            var menu = document.getElementById('kz-menu-flotante');
            menu.classList.toggle('kz-menu-visible');
            menu.classList.toggle('kz-menu-oculto');
        }
        document.addEventListener('click', function(e) {
            var menu = document.getElementById('kz-menu-flotante');
            var btn = document.querySelector('.kz-bubble-btn');
            if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.add('kz-menu-oculto');
                menu.classList.remove('kz-menu-visible');
            }
        });
    <\/script>
`;

export const GET: APIRoute = async () => {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bayco</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <iframe src="https://www.appsheet.com/start/08cab2fb-f4ed-42fe-a4e0-0a00603c57fe?platform=desktop" title="Bayco"></iframe>
    ${bubbleHTML}
</body>
</html>`;

    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8"
        }
    });
}
