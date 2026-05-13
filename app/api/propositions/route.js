import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// === 📦 CONFIGURATION UPLOAD ===
const uploadDir = path.join(process.cwd(), "public", "uploads", "devis");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export async function POST(req) {
  try {
    const formData = await req.formData();

    const id = formData.get("id");
    const nom = formData.get("nom");
    const domaine = formData.get("domaine");
    const description = formData.get("description");
    const duree = formData.get("duree");
    const tjm = formData.get("tjm");
    const type = formData.get("type");
    const commentaire = formData.get("commentaire");
    const devis = formData.get("devis");

    // === Sauvegarde du fichier PDF ===
    let devisFileName = null;
    if (devis && devis.name) {
      devisFileName = `${Date.now()}_${devis.name}`;
      const bytes = await devis.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.promises.writeFile(path.join(uploadDir, devisFileName), buffer);
    }

    // === Construction du lien de validation client ===
    const validationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/client/validation/${id}`;

    // === Préparation du mail au client ===
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const message = {
      from: `"Itrium Conseil" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_TEST_CLIENT || "contact@itriumconseil.com", // ✅ à remplacer par le mail réel du client
      subject: `📄 Nouvelle proposition de ${nom} – Mission #${id}`,
      html: `
        <h2>Proposition d’intervention</h2>
        <p><strong>Expert :</strong> ${nom}</p>
        <p><strong>Domaine :</strong> ${domaine}</p>
        <p><strong>Description :</strong> ${description}</p>
        <p><strong>Durée :</strong> ${duree} jour(s)</p>
        <p><strong>TJM :</strong> ${tjm} €</p>
        <p><strong>Type :</strong> ${type}</p>
        <p><strong>Commentaire :</strong> ${commentaire || "—"}</p>
        ${
          devisFileName
            ? `<p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/uploads/devis/${devisFileName}">📎 Télécharger le devis</a></p>`
            : ""
        }
        <hr/>
        <p>👉 Pour valider cette proposition, veuillez cliquer sur le lien suivant :</p>
        <p><a href="${validationLink}" style="background:#0A2942;color:white;padding:10px 15px;border-radius:8px;text-decoration:none;">Valider le devis et passer au paiement</a></p>
        <p style="font-size:12px;color:#777;">Ce lien est sécurisé et valable 48h. Itrium Conseil assure la confidentialité et la traçabilité des échanges.</p>
      `,
    };

    await transporter.sendMail(message);

    return NextResponse.json({ ok: true, message: "Proposition envoyée au client avec succès" });
  } catch (error) {
    console.error("Erreur API /propositions :", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}