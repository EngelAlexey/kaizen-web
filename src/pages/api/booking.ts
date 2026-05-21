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
}

function validate(body: unknown): { ok: true; data: BookingPayload } | { ok: false; message: string } {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { ok: false, message: "invalid_body" };
    }
    const b = body as Record<string, unknown>;

    const str = (v: unknown, max: number) =>
        typeof v === "string" && v.trim().length > 0 && v.length <= max;

    if (!str(b.name, 100)) return { ok: false, message: "invalid_name" };
    if (!str(b.email, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email as string))
        return { ok: false, message: "invalid_email" };
    if (typeof b.phone !== "string" || b.phone.length > 30)
        return { ok: false, message: "invalid_phone" };
    if (!str(b.company, 100)) return { ok: false, message: "invalid_company" };
    if (!Array.isArray(b.products) || b.products.length === 0)
        return { ok: false, message: "invalid_products" };
    if (!str(b.turnstileToken, 2048)) return { ok: false, message: "invalid_token" };

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
        },
    };
}

function buildEmailHtml(data: BookingPayload): string {
    const products = data.products.join(", ");
    const esc = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><style>
body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f4f5;margin:0;padding:32px 16px}
.card{background:#fff;border-radius:12px;max-width:560px;margin:0 auto;padding:36px;border:1px solid #e5e7eb}
h1{font-size:22px;color:#111;margin:0 0 24px}
.badge{display:inline-block;background:#b22222;color:#fff;font-size:11px;font-weight:700;letter-spacing:.06em;padding:4px 10px;border-radius:99px;margin-bottom:24px}
table{width:100%;border-collapse:collapse;font-size:14px}
td{padding:10px 0;border-bottom:1px solid #f0f0f0;vertical-align:top}
td:first-child{color:#6b7280;width:130px;font-weight:600}
.footer{margin-top:28px;font-size:12px;color:#9ca3af;text-align:center}
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

function json(data: Record<string, string>, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export const POST: APIRoute = async ({ request }) => {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return json({ status: "error", message: "invalid_json" }, 400);
    }

    const result = validate(body);
    if (!result.ok) return json({ status: "error", message: result.message }, 400);
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
    const tsData = (await tsRes.json()) as { success: boolean };
    if (!tsData.success) return json({ status: "error", message: "captcha_failed" }, 400);

    // Send email via Resend
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
        from: "Kaizen Web <noreply@kaizenapps.net>",
        to: import.meta.env.RESEND_TO_EMAIL,
        replyTo: data.email,
        subject: `Nueva demo — ${data.company} (${data.products.join(", ")})`,
        html: buildEmailHtml(data),
    });

    if (error) return json({ status: "error", message: "email_failed" }, 500);

    return json({ status: "success" });
};
