import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { nom, email, message, expert } = await req.json();

    // --- Configuration du transporteur (Zimbra OVH) ---
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass:
          process.env.MAIL_PASSWORD ||
          process.env.EMAIL_PASS ||
          process.env.EMAIL_PASSWORD,
      },
    });

    // --- Envoi de l'email ---
    await transporter.sendMail({
      from: `"Itrium Conseil" <${process.env.EMAIL_USER}>`,
      to: expert.email, // destinataire : l’expert
      subject: `Nouveau contact client via Itrium Conseil (${expert.name})`,
      html: `
        <p><b>Nom :</b> ${nom}</p>
        <p><b>Email :</b> ${email}</p>
        <p><b>Message :</b><br/>${message}</p>
        <hr/>
        <p style="font-size:12px;color:gray;">
          Ce message provient de la plateforme Itrium Conseil.<br/>
          Merci de ne pas répondre directement à cet e-mail.<br/>
          Répondez via l’espace sécurisé : <a href="${process.env.NEXT_PUBLIC_BASE_URL}/expert/repondre?exp=${expert.id}" target="_blank">Ouvrir l’espace réponse</a>.
        </p>
      `,
    });

    console.log(`✅ Mail envoyé avec succès à : ${expert.email}`);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("❌ Erreur contact expert :", err);
    return new Response(JSON.stringify({ error: "Erreur d’envoi" }), { status: 500 });
  }
}