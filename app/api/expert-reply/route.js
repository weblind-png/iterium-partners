import nodemailer from "nodemailer";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const { expertName, message, addInvoice, amount, description } = await req.json();

    if (!expertName || !message) {
      return new Response("Champs manquants", { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let paymentLink = null;

    if (addInvoice && amount) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: description || `Intervention ${expertName}`,
              },
              unit_amount: Math.round(Number(amount) * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/mon-espace?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/mon-espace?payment=cancel`,
      });
      paymentLink = session.url;
    }

    const htmlBody = `
      <p><strong>${expertName}</strong> a répondu à un client depuis la plateforme :</p>
      <blockquote style="border-left:3px solid #F8B400;padding-left:10px;margin:10px 0;">
        ${message}
      </blockquote>
      ${paymentLink ? `
        <p><strong>Un devis a été ajouté :</strong></p>
        <p>Montant : <b>${amount} € HT</b><br>
        Description : ${description || "—"}<br>
        <a href="${paymentLink}" style="color:#0A2942;font-weight:bold;">👉 Cliquer ici pour régler en ligne</a></p>
      ` : ""}
      <p>Ce message a été transmis automatiquement par <strong>Itrium Conseil</strong>.</p>
    `;

    await transporter.sendMail({
      from: `"Itrium Conseil - ${expertName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Réponse de ${expertName} via Itrium Conseil`,
      html: htmlBody,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Erreur envoi réponse + facture :", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}