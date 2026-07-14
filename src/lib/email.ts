import nodemailer from "nodemailer";
import { company } from "./company";
import { formatPrice } from "./format";

export interface EmailOrder {
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryMethod: string;
  comments: string | null;
  subtotalCents: number;
  shippingCents: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentProvider: string | null;
  shippingCarrier: string | null;
  pickupPointName: string | null;
  items: Array<{
    productName: string;
    volume: string;
    unitPriceCents: number;
    quantity: number;
  }>;
}

interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

const brand = {
  ink: "#0B0A09",
  inkSoft: "#14110E",
  gold: "#C9A15A",
  goldLight: "#E4C98B",
  cream: "#F4E9D6",
  muted: "#B9AD9B",
  line: "rgba(244,233,214,0.14)",
} as const;

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function configured() {
  return (
    process.env.EMAIL_ENABLED !== "false" &&
    Boolean(
      process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASSWORD &&
        (process.env.EMAIL_FROM || process.env.SMTP_USER)
    )
  );
}

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    // Port 465 uses implicit TLS; 587 uses STARTTLS (secure: false).
    const secure =
      port === 465 ? true : process.env.SMTP_SECURE === "true";

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

function fromAddress() {
  const address = process.env.EMAIL_FROM || process.env.SMTP_USER || company.email;
  const name = process.env.EMAIL_FROM_NAME || company.brand;
  return `"${name.replaceAll('"', "")}" <${address}>`;
}

function adminAddress() {
  return process.env.ADMIN_ORDER_EMAIL || company.supportEmail;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

function deliveryLabel(order: EmailOrder) {
  if (order.deliveryMethod === "pickup") {
    return order.pickupPointName
      ? `Pakiautomaat${order.shippingCarrier ? ` · ${order.shippingCarrier}` : ""} · ${order.pickupPointName}`
      : "Pakiautomaat";
  }
  if (order.deliveryMethod === "store") return "Tulen ise järele";
  return "Kuller";
}

function totalCents(order: EmailOrder) {
  return order.subtotalCents + order.shippingCents;
}

function orderRowsHtml(order: EmailOrder) {
  return order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid ${brand.line};color:${brand.cream};font-family:Arial,sans-serif;font-size:14px;">
            ${escapeHtml(item.productName)} <span style="color:${brand.muted};">· ${escapeHtml(item.volume)} × ${item.quantity}</span>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid ${brand.line};color:${brand.goldLight};font-family:Georgia,serif;font-size:16px;white-space:nowrap;">
            ${formatPrice(item.unitPriceCents * item.quantity, order.currency)}
          </td>
        </tr>`,
    )
    .join("");
}

function orderRowsText(order: EmailOrder) {
  return order.items
    .map(
      (item) =>
        `${item.productName} · ${item.volume} × ${item.quantity} — ${formatPrice(
          item.unitPriceCents * item.quantity,
          order.currency,
        )}`,
    )
    .join("\n");
}

function layout(title: string, intro: string, content: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://auraood.ee";
  return `<!doctype html>
<html lang="et">
  <body style="margin:0;background:${brand.ink};color:${brand.cream};font-family:Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(intro)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${brand.ink};">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:${brand.inkSoft};border:1px solid ${brand.line};">
          <tr><td style="padding:34px 36px 26px;border-bottom:1px solid ${brand.line};">
            <a href="${escapeHtml(baseUrl)}" style="color:${brand.goldLight};font-family:Georgia,serif;font-size:27px;letter-spacing:0.08em;text-decoration:none;">Aura &amp; Ood</a>
            <div style="margin-top:7px;color:${brand.muted};font-size:10px;letter-spacing:0.28em;text-transform:uppercase;">Morning Spirit · Koidiku Kaja</div>
          </td></tr>
          <tr><td style="padding:38px 36px 42px;">
            <div style="color:${brand.gold};font-size:11px;letter-spacing:0.28em;text-transform:uppercase;">Aura &amp; Ood</div>
            <h1 style="margin:16px 0 14px;color:${brand.cream};font-family:Georgia,serif;font-size:34px;font-weight:400;line-height:1.08;">${escapeHtml(title)}</h1>
            <p style="margin:0 0 28px;color:${brand.muted};font-size:15px;line-height:1.7;">${escapeHtml(intro)}</p>
            ${content}
          </td></tr>
          <tr><td style="padding:24px 36px;border-top:1px solid ${brand.line};color:${brand.muted};font-size:12px;line-height:1.7;">
            ${escapeHtml(company.legalName)} · ${escapeHtml(company.regNr)}<br />
            <a href="mailto:${escapeHtml(company.email)}" style="color:${brand.goldLight};">${escapeHtml(company.email)}</a> · ${escapeHtml(company.phone)}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function orderSummaryHtml(order: EmailOrder) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr><td style="padding-bottom:10px;color:${brand.muted};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">Tellimus ${escapeHtml(order.reference)}</td></tr>
      ${orderRowsHtml(order)}
      <tr><td style="padding-top:18px;color:${brand.muted};font-size:13px;">Tooted</td><td align="right" style="padding-top:18px;color:${brand.cream};font-family:Georgia,serif;font-size:16px;">${formatPrice(order.subtotalCents, order.currency)}</td></tr>
      <tr><td style="padding-top:8px;color:${brand.muted};font-size:13px;">Tarne · ${escapeHtml(deliveryLabel(order))}</td><td align="right" style="padding-top:8px;color:${brand.cream};font-family:Georgia,serif;font-size:16px;">${order.shippingCents ? formatPrice(order.shippingCents, order.currency) : "Tasuta"}</td></tr>
      <tr><td style="padding-top:14px;color:${brand.goldLight};font-size:14px;font-weight:bold;">Kokku</td><td align="right" style="padding-top:14px;color:${brand.goldLight};font-family:Georgia,serif;font-size:22px;">${formatPrice(totalCents(order), order.currency)}</td></tr>
    </table>`;
}

function orderText(order: EmailOrder) {
  return [
    `Tellimus ${order.reference}`,
    "",
    orderRowsText(order),
    "",
    `Tooted: ${formatPrice(order.subtotalCents, order.currency)}`,
    `Tarne (${deliveryLabel(order)}): ${order.shippingCents ? formatPrice(order.shippingCents, order.currency) : "Tasuta"}`,
    `Kokku: ${formatPrice(totalCents(order), order.currency)}`,
  ].join("\n");
}

async function send(mail: Mail) {
  if (!configured()) {
    console.warn("Email skipped: SMTP is not configured.");
    return false;
  }

  try {
    await getTransporter().sendMail({
      from: fromAddress(),
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

export async function sendAdminNewOrderEmail(order: EmailOrder) {
  const subject = `Uus tellimus ${order.reference} · Aura & Ood`;
  const content = `
    <p style="margin:0 0 22px;color:${brand.cream};font-size:15px;line-height:1.7;">Uus tellimus on saabunud.</p>
    <p style="margin:0 0 22px;color:${brand.muted};font-size:14px;line-height:1.7;">
      Klient: <strong style="color:${brand.cream};">${escapeHtml(order.customerName)}</strong><br />
      E-post: <a href="mailto:${escapeHtml(order.email)}" style="color:${brand.goldLight};">${escapeHtml(order.email)}</a><br />
      Telefon: ${escapeHtml(order.phone)}<br />
      Makse: ${escapeHtml(order.paymentStatus)} · Tellimuse staatus: ${escapeHtml(order.status)}
    </p>
    ${orderSummaryHtml(order)}
    ${order.comments ? `<p style="margin:24px 0 0;color:${brand.muted};font-size:14px;line-height:1.7;"><strong style="color:${brand.cream};">Kliendi kommentaar:</strong><br />${escapeHtml(order.comments)}</p>` : ""}`;

  return send({
    to: adminAddress(),
    subject,
    html: layout("Uus tellimus", `Uus tellimus ${order.reference}`, content),
    text: [
      `Uus tellimus ${order.reference}`,
      "",
      `Klient: ${order.customerName}`,
      `E-post: ${order.email}`,
      `Telefon: ${order.phone}`,
      `Makse: ${order.paymentStatus} · Staatus: ${order.status}`,
      "",
      orderText(order),
      order.comments ? `\nKliendi kommentaar: ${order.comments}` : "",
    ].join("\n"),
  });
}

export async function sendCustomerOrderConfirmationEmail(order: EmailOrder) {
  const subject = `Tellimus ${order.reference} on vastu võetud · Aura & Ood`;
  const content = `
    <p style="margin:0 0 24px;color:${brand.cream};font-size:16px;line-height:1.7;">Tere, ${escapeHtml(firstName(order.customerName))}!</p>
    <p style="margin:0 0 26px;color:${brand.muted};font-size:15px;line-height:1.7;">Täname tellimuse eest. Sinu tellimus on meieni jõudnud ja anname sulle teada, kui see teele läheb.</p>
    ${orderSummaryHtml(order)}
    <p style="margin:28px 0 0;color:${brand.muted};font-size:14px;line-height:1.7;">Kui sul on tellimuse kohta küsimusi, kirjuta meile aadressil <a href="mailto:${escapeHtml(company.email)}" style="color:${brand.goldLight};">${escapeHtml(company.email)}</a>.</p>`;

  return send({
    to: order.email,
    subject,
    html: layout("Tellimus on vastu võetud", `Tellimus ${order.reference} on vastu võetud`, content),
    text: [
      `Tere, ${firstName(order.customerName)}!`,
      "",
      "Täname tellimuse eest. Sinu tellimus on meieni jõudnud ja anname sulle teada, kui see teele läheb.",
      "",
      orderText(order),
      "",
      `Küsimuste korral: ${company.email}`,
    ].join("\n"),
  });
}

export async function sendCustomerShipmentEmail(order: EmailOrder, shipmentId?: string) {
  const subject = `Tellimus ${order.reference} on teele saadetud · Aura & Ood`;
  const content = `
    <p style="margin:0 0 24px;color:${brand.cream};font-size:16px;line-height:1.7;">Tere, ${escapeHtml(firstName(order.customerName))}!</p>
    <p style="margin:0 0 22px;color:${brand.muted};font-size:15px;line-height:1.7;">Hea uudis — sinu Aura &amp; Ood tellimus on teele saadetud.</p>
    <div style="margin:0 0 26px;padding:18px 20px;border:1px solid ${brand.line};background:${brand.ink};color:${brand.cream};font-size:14px;line-height:1.8;">
      Tarneviis: <strong>${escapeHtml(deliveryLabel(order))}</strong>${shipmentId ? `<br />Saadetise ID: <strong>${escapeHtml(shipmentId)}</strong>` : ""}
    </div>
    <p style="margin:0;color:${brand.muted};font-size:14px;line-height:1.7;">Kui sul on küsimusi, kirjuta meile aadressil <a href="mailto:${escapeHtml(company.email)}" style="color:${brand.goldLight};">${escapeHtml(company.email)}</a>.</p>`;

  return send({
    to: order.email,
    subject,
    html: layout("Tellimus on teele saadetud", `Tellimus ${order.reference} on teele saadetud`, content),
    text: [
      `Tere, ${firstName(order.customerName)}!`,
      "",
      "Hea uudis — sinu Aura & Ood tellimus on teele saadetud.",
      `Tarneviis: ${deliveryLabel(order)}`,
      shipmentId ? `Saadetise ID: ${shipmentId}` : "",
      "",
      `Küsimuste korral: ${company.email}`,
    ].join("\n"),
  });
}
