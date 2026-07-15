const AI_ORIGIN = import.meta.env.PUBLIC_AI_ORIGIN ?? "https://ai.kaizenapps.net";

const WIDGET_CSS = `
<style>
    .kz-ai-panel { position:fixed; bottom:92px; left:24px; z-index:10000; width:400px; height:min(620px, calc(100dvh - 116px)); background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 18px 60px rgba(0,0,0,.28),0 4px 16px rgba(0,0,0,.16); transform-origin:bottom left; transition:opacity .2s ease, transform .25s cubic-bezier(.22,1,.36,1); }
    .kz-ai-hidden { opacity:0; transform:scale(.9) translateY(12px); pointer-events:none; }
    .kz-ai-panel iframe { width:100%; height:100%; border:none; display:block; }
    button.kz-menu-item { border:none; font-family:inherit; font-size:14px; cursor:pointer; text-align:left; width:100%; }
    @media (max-width: 640px) {
        .kz-ai-panel { left:12px; right:12px; width:auto; bottom:88px; height:calc(100dvh - 108px); }
    }
</style>
`;

export function aiWidgetHtml(productSlug?: string): string {
  return `
${WIDGET_CSS}
<div
    id="kz-ai-panel"
    class="kz-ai-panel kz-ai-hidden"
    role="dialog"
    aria-label="Kaizen AI"
    aria-modal="false"
    data-astro-transition-persist="kz-ai-panel"
>
    <iframe
        id="kz-ai-frame"
        title="Kaizen AI"
        allow="microphone"
        referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
</div>

<script>
(function () {
    if (window.__kzAiInit) return;
    window.__kzAiInit = true;

    var AI_ORIGIN = ${JSON.stringify(AI_ORIGIN)};
    var PRODUCT = ${JSON.stringify(productSlug ?? "")};
    var CHAT_KEY = "kz-ai-chat";

    function panel() { return document.getElementById("kz-ai-panel"); }
    function frame() { return document.getElementById("kz-ai-frame"); }

    function storedChat() {
        try { return sessionStorage.getItem(CHAT_KEY) || ""; } catch (e) { return ""; }
    }

    function rememberChat(id) {
        try { sessionStorage.setItem(CHAT_KEY, id); } catch (e) { void 0; }
    }

    function buildSrc() {
        var url = AI_ORIGIN + "/embed?host=" + encodeURIComponent(window.location.origin);
        if (PRODUCT) url += "&product=" + encodeURIComponent(PRODUCT);
        var chat = storedChat();
        if (chat) url += "&chat=" + encodeURIComponent(chat);
        return url;
    }

    function closeBubbleMenu() {
        var menu = document.getElementById("kz-menu-flotante");
        if (!menu) return;
        menu.classList.add("kz-menu-oculto");
        menu.classList.remove("kz-menu-visible");
    }

    function open() {
        var p = panel();
        var f = frame();
        if (!p || !f) return;
        if (!f.getAttribute("src")) f.src = buildSrc();
        p.classList.remove("kz-ai-hidden");
        closeBubbleMenu();
    }

    function close() {
        var p = panel();
        if (p) p.classList.add("kz-ai-hidden");
    }

    window.kzAiOpen = open;
    window.kzAiClose = close;

    window.addEventListener("message", function (e) {
        if (e.origin !== AI_ORIGIN) return;
        var d = e.data;
        if (!d || d.source !== "kaizen-ai-embed") return;
        if (d.type === "close") close();
        else if (d.type === "chat" && typeof d.chatId === "string") rememberChat(d.chatId);
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
    });
})();
<\/script>
`;
}
