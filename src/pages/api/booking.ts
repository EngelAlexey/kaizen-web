import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

interface BookingPayload {
    name: string;
    email: string;
    phone: string;
    company: string;
    role?: string;
    products: string[];
    turnstileToken: string;
    lang: "es" | "en";
}

const PRODUCT_LABELS: Record<string, string> = {
    kaizen: "Kaizen",
    seiri: "Seiri",
    bayco: "BayCo",
};

const formatProducts = (products: string[]) =>
    products.map((p) => PRODUCT_LABELS[p] || p).join(", ");

function validate(body: unknown): { ok: true; data: BookingPayload } | { ok: false; reason: string } {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { ok: false, reason: "invalid_body" };
    }
    const b = body as Record<string, unknown>;

    const str = (v: unknown, max: number) =>
        typeof v === "string" && v.trim().length > 0 && v.length <= max;

    if (!str(b.name, 100)) return { ok: false, reason: "invalid_name" };
    if (!str(b.email, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email as string))
        return { ok: false, reason: "invalid_email" };
    if (typeof b.phone !== "string" || b.phone.length > 30)
        return { ok: false, reason: "invalid_phone" };
    if (!str(b.company, 100)) return { ok: false, reason: "invalid_company" };
    if (!Array.isArray(b.products) || b.products.length === 0)
        return { ok: false, reason: "invalid_products" };
    if (!str(b.turnstileToken, 2048)) return { ok: false, reason: "invalid_token" };

    const lang = b.lang === "en" ? "en" : "es";

    return {
        ok: true,
        data: {
            name: (b.name as string).trim(),
            email: (b.email as string).trim(),
            phone: (b.phone as string).trim(),
            company: (b.company as string).trim(),
            role: typeof b.role === "string" ? b.role.trim() : "",
            products: (b.products as string[]).map(String),
            turnstileToken: b.turnstileToken as string,
            lang,
        },
    };
}

const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const SHARED_STYLES = `body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f4f5;margin:0;padding:32px 16px}
.card{background:#fff;border-radius:12px;max-width:560px;margin:0 auto;padding:36px;border:1px solid #e5e7eb}
h1{font-size:22px;color:#111;margin:0 0 16px}
p{font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px}
.badge{display:inline-block;color:#fff;font-size:11px;font-weight:700;letter-spacing:.06em;padding:4px 10px;border-radius:99px;margin-bottom:24px}
table{width:100%;border-collapse:collapse;font-size:14px;margin-top:8px}
td{padding:10px 0;border-bottom:1px solid #f0f0f0;vertical-align:top}
td:first-child{color:#6b7280;width:130px;font-weight:600}
.footer{margin-top:28px;font-size:12px;color:#9ca3af;text-align:center}`;

function buildEmailHtml(data: BookingPayload): string {
    const products = formatProducts(data.products);

    return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><style>
${SHARED_STYLES}
.badge{background:#b22222}
</style></head>
<body>
<div class="card">
  <div class="badge">NUEVA SOLICITUD</div>
  <h1>Demo solicitada</h1>
  <table>
    <tr><td>Nombre</td><td>${esc(data.name)}</td></tr>
    <tr><td>Email</td><td><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
    <tr><td>Teléfono</td><td>${esc(data.phone) || "—"}</td></tr>
    <tr><td>Empresa</td><td>${esc(data.company)}</td></tr>
    <tr><td>Cargo</td><td>${esc(data.role || "—")}</td></tr>
    <tr><td>Productos</td><td>${esc(products)}</td></tr>
  </table>
  <div class="footer">Kaizen Apps · kaizenapps.net</div>
</div>
</body>
</html>`;
}

function buildUserEmailHtml(data: BookingPayload): string {
    const products = formatProducts(data.products);
    const t = data.lang === "en"
        ? {
            badge: "REQUEST RECEIVED",
            title: `Thanks, ${esc(data.name)}!`,
            intro: "We've received your demo request successfully. Our team will be in touch shortly to coordinate the next steps.",
            summary: "Summary of your request:",
            company: "Company",
            role: "Role",
            productsLabel: "Products",
            reply: "If you have any urgent questions, feel free to reply to this email directly.",
            sign: "Kaizen Apps team",
        }
        : {
            badge: "SOLICITUD RECIBIDA",
            title: `¡Gracias, ${esc(data.name)}!`,
            intro: "Hemos recibido tu solicitud de demostración correctamente. Nuestro equipo se pondrá en contacto contigo a la brevedad para coordinar los siguientes pasos.",
            summary: "Resumen de tu solicitud:",
            company: "Empresa",
            role: "Cargo",
            productsLabel: "Productos",
            reply: "Si tienes alguna pregunta urgente, puedes responder a este correo directamente.",
            sign: "El equipo de Kaizen Apps",
        };

    return `<!DOCTYPE html>
<html lang="${data.lang}">
<head><meta charset="UTF-8"><style>
${SHARED_STYLES}
.badge{background:#16a34a}
</style></head>
<body>
<div class="card">
  <div class="badge">${t.badge}</div>
  <h1>${t.title}</h1>
  <p>${t.intro}</p>
  <p style="margin-bottom:4px;font-weight:600;color:#111">${t.summary}</p>
  <table>
    <tr><td>${t.company}</td><td>${esc(data.company)}</td></tr>
    <tr><td>${t.role}</td><td>${esc(data.role || "—")}</td></tr>
    <tr><td>${t.productsLabel}</td><td>${esc(products)}</td></tr>
  </table>
  <p style="margin-top:24px">${t.reply}</p>
  <p style="margin-bottom:0">${t.sign}</p>
  <div class="footer">Kaizen Apps · kaizenapps.net</div>
</div>
</body>
</html>`;
}

function ok(): Response {
    return new Response(JSON.stringify({ status: "success" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

function fail(status = 400): Response {
    return new Response(JSON.stringify({ status: "error" }), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export const POST: APIRoute = async ({ request }) => {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        console.error("[booking] invalid_json");
        return fail(400);
    }

    const result = validate(body);
    if (!result.ok) {
        console.error("[booking] validation:", result.reason);
        return fail(400);
    }
    const data = result.data;

    // Server-side Turnstile verification
    const tsRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                secret: import.meta.env.TURNSTILE_SECRET_KEY,
                response: data.turnstileToken,
            }),
        }
    );
    const tsData = (await tsRes.json()) as { success: boolean; "error-codes"?: string[] };
    if (!tsData.success) {
        console.error("[booking] turnstile_failed:", tsData["error-codes"]);
        return fail(400);
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
        from: "Kaizen Apps <no-reply@kaizenapps.net>",
        to: import.meta.env.RESEND_TO_EMAIL,
        replyTo: data.email,
        subject: `Nueva demo — ${data.company} (${formatProducts(data.products)})`,
        html: buildEmailHtml(data),
    });

    if (error) {
        console.error("[booking] resend_failed:", error);
        return fail(500);
    }

    const userSubject = data.lang === "en"
        ? "We received your request — Kaizen Apps"
        : "Hemos recibido tu solicitud — Kaizen Apps";

    const { error: userError } = await resend.emails.send({
        from: "Kaizen Apps <no-reply@kaizenapps.net>",
        to: data.email,
        replyTo: import.meta.env.RESEND_TO_EMAIL,
        subject: userSubject,
        html: buildUserEmailHtml(data),
    });

    if (userError) {
        console.error("[booking] user_confirmation_failed:", userError);
    }

    return ok();
};
