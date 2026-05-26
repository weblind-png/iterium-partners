import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Body reçu:", JSON.stringify(body));
    console.log("PRICE_ESSENTIEL:", process.env.PRICE_ESSENTIEL);
    console.log("PRICE_GROUPE:", process.env.PRICE_GROUPE);

    const { forfait, clientId, email } = body;

    console.log("forfait:", forfait);
    console.log("clientId:", clientId);
    console.log("email:", email);

    const priceId = forfait === "standard"
      ? process.env.PRICE_ESSENTIEL
      : process.env.PRICE_GROUPE;

    console.log("priceId:", priceId);

    if (!priceId || !clientId || !email) {
      console.log("Paramètre manquant - priceId:", priceId, "clientId:", clientId, "email:", email);
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { clientId },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/client/dashboard?abonnement=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/client/dashboard?abonnement=cancel`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Stripe error complet:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
