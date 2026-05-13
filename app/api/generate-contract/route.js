import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

// === CONFIG RÉPERTOIRE DE SORTIE ===
const contractsDir = path.join(process.cwd(), "exports", "contracts");
if (!fs.existsSync(contractsDir)) fs.mkdirSync(contractsDir, { recursive: true });

export async function POST(req) {
  try {
    const body = await req.json();
    const { missionId, client, expert, domaine, description, duree, tjm, type, paiementId } = body;

    const date = new Date().toISOString().split("T")[0];
    const filePath = path.join(contractsDir, `contrat_${missionId}_${date}.pdf`);

    // === Génération du PDF avec pdfkit ===
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- En-tête ---
    doc
      .fontSize(20)
      .fillColor("#0A2942")
      .text("CONTRAT D’INTERVENTION PROFESSIONNELLE", { align: "center" })
      .moveDown(1);

    doc
      .fontSize(10)
      .fillColor("black")
      .text(`Date : ${date}`)
      .text(`Mission n° : ${missionId}`)
      .text(`Référence paiement Stripe : ${paiementId}`)
      .moveDown(1);

    // --- Parties contractantes ---
    doc
      .fontSize(12)
      .text(`Client : ${client.nom} (${client.email})`)
      .text(`Expert : ${expert.nom} (${expert.email})`)
      .text(`Société opératrice : Itrium Conseil`)
      .moveDown(1);

    // --- Détails de la mission ---
    doc
      .fontSize(13)
      .fillColor("#0A2942")
      .text("Détails de la mission :", { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(11)
      .fillColor("black")
      .text(`Domaine : ${domaine}`)
      .text(`Description : ${description}`)
      .text(`Durée estimée : ${duree} jour(s)`)
      .text(`TJM : ${tjm} €`)
      .text(`Type d’intervention : ${type}`)
      .moveDown(1);

    // --- Clauses légales principales ---
    doc
      .fontSize(13)
      .fillColor("#0A2942")
      .text("Clauses contractuelles :", { underline: true })
      .moveDown(0.5)
      .fontSize(10)
      .fillColor("black")
      .text(
        `1️⃣ Objet du contrat : L’expert s’engage à réaliser la mission décrite ci-dessus selon les termes convenus et validés par le client via la plateforme Itrium Conseil.`
      )
      .moveDown(0.5)
      .text(
        `2️⃣ Confidentialité : Les parties conviennent de ne divulguer aucune information sensible échangée dans le cadre de la mission. Itrium Conseil agit en tiers de confiance et assure la conformité RGPD.`
      )
      .moveDown(0.5)
      .text(
        `3️⃣ Engagements de l’expert : L’expert garantit sa disponibilité selon le type d’intervention (immédiate ou programmée), et le respect des délais annoncés. Tout retard injustifié peut entraîner suspension du compte.`
      )
      .moveDown(0.5)
      .text(
        `4️⃣ Paiement et facturation : Le paiement est réalisé via la plateforme sécurisée Stripe au moment de la validation du devis. Itrium Conseil conserve une trace numérique de la transaction et reverse la rémunération à l’expert selon les conditions convenues.`
      )
      .moveDown(0.5)
      .text(
        `5️⃣ Responsabilité : Chaque partie demeure responsable de la qualité et des conséquences de ses actions dans le cadre de la mission.`
      )
      .moveDown(0.5)
      .text(
        `6️⃣ Conservation du contrat : Ce contrat est généré électroniquement, signé de manière implicite par double validation (paiement client + envoi expert) et archivé automatiquement par Itrium Conseil.`
      )
      .moveDown(0.5)
      .text(
        `7️⃣ Litiges : En cas de différend, les parties conviennent de rechercher une résolution amiable avant toute procédure judiciaire.`
      )
      .moveDown(1);

    // --- Signature électronique ---
    doc
      .fontSize(13)
      .fillColor("#0A2942")
      .text("Signature électronique :", { underline: true })
      .moveDown(0.5)
      .fontSize(10)
      .fillColor("black")
      .text(`Date et heure de validation : ${new Date().toLocaleString()}`)
      .text(`IP du client : ${client.ip || "non enregistrée"}`)
      .text(`Validation électronique : Oui (via paiement Stripe)`)
      .moveDown(2)
      .text("Signature client : ___________________________", { continued: true })
      .text("     Signature expert : ___________________________");

    doc.end();

    await new Promise((resolve) => stream.on("finish", resolve));

    // === Envoi automatique du PDF par mail ===
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
      to: `${client.email}, ${expert.email}, contact@itriumconseil.com`,
      subject: `📄 Contrat d’intervention – Mission ${missionId}`,
      text: `Contrat d’intervention validé entre ${client.nom} et ${expert.nom}.`,
      attachments: [
        {
          filename: path.basename(filePath),
          path: filePath,
        },
      ],
    };

    await transporter.sendMail(message);

    return NextResponse.json({
      ok: true,
      message: "Contrat généré et envoyé avec succès.",
      file: filePath,
    });
  } catch (error) {
    console.error("Erreur génération contrat :", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}