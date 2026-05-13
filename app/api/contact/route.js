import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, company, phone, message } = await req.json();

    // Création du transport SMTP OVH
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // contourne certains certificats OVH
      },
    });

    // Envoi du mail
    await transporter.sendMail({
      from: `"Itrium Conseil" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // ta boîte pro reçoit le message
      replyTo: email, // pour répondre directement au client
      subject: `Nouveau message depuis Itrium Conseil - ${company}`,
      text: `
Nom : ${name}
Entreprise : ${company}
Email : ${email}
Téléphone : ${phone}

Message :
${message}
      `,
    });

    console.log("✅ Email envoyé avec succès");
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error("❌ Erreur envoi email :", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}