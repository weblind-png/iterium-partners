import Stripe from "stripe";

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Récupère les 20 derniers paiements (tu peux augmenter le limit)
    const sessions = await stripe.checkout.sessions.list({
      limit: 20,
    });

    // Filtrage utile
    const payments = sessions.data.map((s) => ({
      id: s.id,
      created: s.created,
      customer_email: s.customer_details?.email,
      amount_total: s.amount_total,
      status: s.payment_status,
      description: s.metadata?.description || s.metadata?.product_name,
    }));

    return new Response(JSON.stringify(payments), { status: 200 });
  } catch (err) {
    console.error("Erreur récupération paiements :", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}