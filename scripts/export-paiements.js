/**
 * SCRIPT AUTOMATIQUE D'EXPORT DES PAIEMENTS STRIPE + ENVOI EMAIL
 * Planifié pour s’exécuter 1x par mois.
 */

import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function exportPaiements() {
  try {
    console.log("📦 Récupération des paiements Stripe...");

    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });

    const payments = sessions.data.map((s) => ({
      date: new Date(s.created * 1000).toLocaleDateString("fr-FR"),
      client: s.customer_details?.email || "—",
      description: s.metadata?.product_name || s.description || "—",
      montant: (s.amount_total / 100).toFixed(2),
      statut: s.payment_status,
    }));

    const csvHeader = "Date;Client;Description;Montant (€);Statut\n";
    const csvRows = payments
      .map((p) => `${p.date};${p.client};${p.description};${p.montant};${p.statut}`)
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const fileName = `paiements_itrium_conseil_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    const outputPath = path.join(process.cwd(), "exports", fileName);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, csvContent, "utf-8");

    console.log(`✅ Fichier généré : ${outputPath}`);

    // Envoi par e-mail
    console.log("📧 Envoi du rapport par e-mail...");

    const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true", // true = SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // utile sur OVH
  },
});

    await transporter.sendMail({
      from: `"Itrium Conseil - Automate" <${process.env.EMAIL_USER}>`,
      to: "contact@itriumconseil.com",
      subject: `📊 Export mensuel des paiements — ITERIUM PARTNERS`,
      text: `Bonjour Eric,\n\nVeuillez trouver ci-joint le rapport mensuel des paiements enregistrés via Stripe.\n\nBonne journée,\nItrium Conseil`,
      attachments: [
        {
          filename: fileName,
          path: outputPath,
        },
      ],
    });

    console.log("✅ Rapport envoyé avec succès !");
  } catch (err) {
    console.error("❌ Erreur lors de l’export :", err);
  }
}

// Lancer le script
exportPaiements();