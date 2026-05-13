import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { plan } = await req.json();

    // Définition des montants selon le plan
    const plans = {
      standard: { amount: 49000, name: "Abonnement Standard Entreprise" },
      premium: { amount: 129000, name: "Abonnement Premium Groupe" },
    };

    const chosen = plans[plan] || plans.standard;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: chosen.name },
            unit_amount: chosen.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/mon-espace?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tarifs?payment=cancelled`,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error("Erreur Stripe Checkout:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}