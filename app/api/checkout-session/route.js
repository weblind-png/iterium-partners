import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    // ✅ Tu peux adapter ces infos selon ton produit
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Prestation Itrium Conseil",
              description: "Intervention IT entre professionnels via la plateforme Itrium Conseil",
            },
            unit_amount: 3000, // 💰 30,00€ (en centimes)
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/paiements/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/paiements/cancel`,
      customer_email: "contact@exemple.com", // ⚠️ Optionnel : à remplacer dynamiquement plus tard
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ Erreur création session Stripe :", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}