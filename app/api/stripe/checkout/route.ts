import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const { priceId, clientId, email } = await request.json();

    if (!priceId || !clientId || !email) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        clientId,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/client/dashboard?abonnement=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/client/dashboard?abonnement=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
