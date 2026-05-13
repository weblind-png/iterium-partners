import { NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import crypto from "crypto";
import db from "@/lib/db";

// ✅ Config Next.js 16
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const bodyParser = false;

// ✅ Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  let event;
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Erreur vérification webhook :", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // --- Paiement réussi ---
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const clientEmail = session.customer_details.email;
    const clientName = session.customer_details.name || "Client";
    const montant = (session.amount_total / 100).toFixed(2);
    const date = new Date().toLocaleString("fr-FR");
    const stripeId = session.id;

    console.log(`✅ Paiement confirmé pour ${clientEmail} (${montant}€)`);

    // === PRÉPARATION RÉPERTOIRES ===
    const baseExport = path.join(process.cwd(), "public", "exports");
    const contractsDir = path.join(baseExport, "contracts");
    const invoicesDir = path.join(baseExport, "invoices");
    [contractsDir, invoicesDir].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    const logoPath = path.join(process.cwd(), "public", "Logo_ITRIUM.png");
    const stampPath = path.join(process.cwd(), "public", "certif", "itrium_trust_stamp_dark.png");
    const fontPath = path.join("C:", "Windows", "Fonts", "arial.ttf");

    // --- Numéro facture auto ---
    const invoiceCounterPath = path.join(baseExport, "invoice-counter.txt");
    let invoiceNumber = 1;
    if (fs.existsSync(invoiceCounterPath)) {
      const last = parseInt(fs.readFileSync(invoiceCounterPath, "utf8")) || 0;
      invoiceNumber = last + 1;
    }
    fs.writeFileSync(invoiceCounterPath, String(invoiceNumber));

    // === STYLE COMMUN ===
    function drawHeader(doc, title) {
      const headerHeight = 80;
      doc.rect(0, 0, doc.page.width, headerHeight).fill("#0A2942");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 12, { width: 110 });
      }
      doc.fillColor("#FFFFFF").fontSize(20).text("Itrium Conseil", 170, 28);
      doc.moveDown(3);
      doc.fillColor("#0A2942").fontSize(16).text(title, { align: "center" });
      doc.moveDown();
      doc.fillColor("#000000");
    }

    // === Cachet digital (bas droite) ===
    function drawStamp(doc) {
      if (fs.existsSync(stampPath)) {
        const { width, height } = doc.page;
        const imgWidth = 120;
        const imgHeight = 120;
        const x = width - imgWidth - 40;
        const y = height - imgHeight - 80;
        doc.image(stampPath, x, y, { width: imgWidth, height: imgHeight, opacity: 0.3 });
      }
    }

    // === CONTRAT bilingue ===
    async function generateContract(data, outputPath) {
      return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        doc.registerFont("Arial", fontPath);
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        drawHeader(doc, "CONTRAT D’INTERVENTION / SERVICE AGREEMENT");

        doc.moveDown(2);
        doc.fontSize(12).fillColor("#000000");
        doc.text(`Date : ${data.date} / Date: ${data.date}`);
        doc.text(`Client : ${data.clientName} / Client: ${data.clientName}`);
        doc.text(`Email : ${data.clientEmail}`);
        doc.text(`Montant payé : ${data.montant} € / Paid amount: ${data.montant} €`);
        doc.moveDown(1);

        doc.fontSize(13).fillColor("#0A2942").text("Résumé de la mission / Mission Summary :", { underline: true });
        doc.fontSize(11).fillColor("#000000").text(
          "Ce contrat formalise la mission validée entre le client et l’expert sélectionné via la plateforme Itrium Conseil.\n" +
          "L’expert s’engage à réaliser la prestation dans les conditions convenues.\n\n" +
          "This agreement formalizes the assignment validated between the client and the expert selected via the Itrium Conseil platform.\n" +
          "The expert commits to perform the service under the agreed conditions."
        );

        doc.moveDown(2);
        doc.fontSize(11).fillColor("#0A2942").text("Signature électronique / Electronic Signature :", { underline: true });
        doc.fontSize(10).fillColor("#666666").text(
          `Horodatage : ${data.date}\nEmpreinte unique (SHA-256) : ${data.hash}`
        );

        doc.moveDown(2);
        doc.fontSize(9).fillColor("#555555").text(
          "Note : Itrium Conseil agit uniquement en tant que plateforme d’intermédiation numérique entre le client et l’expert.\n" +
          "Ce document constitue un accord direct entre les deux parties.\n" +
          "Itrium Conseil ne peut être tenu responsable de l’exécution de la prestation.\n\n" +
          "Notice: Itrium Conseil acts solely as a digital intermediary platform between the client and the expert.\n" +
          "This document represents a direct agreement between both parties.\n" +
          "Itrium Conseil cannot be held liable for the execution of the service.",
          { align: "center", lineGap: 2 }
        );

        drawStamp(doc);

        doc.moveDown(2);
        doc.fontSize(10).fillColor("#0A2942").text(
          "Document généré automatiquement par la plateforme Itrium Conseil / Automatically generated by Itrium Conseil platform.",
          { align: "center" }
        );

        doc.end();
        stream.on("finish", resolve);
      });
    }

    // === FACTURE bilingue ===
    async function generateInvoice(data, outputPath) {
      return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        doc.registerFont("Arial", fontPath);
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        drawHeader(doc, "FACTURE / INVOICE");

        const montantHT = (data.montant / 1.2).toFixed(2);
        const tva = (data.montant - montantHT).toFixed(2);

        doc.moveDown(2);
        doc.fontSize(12).fillColor("#000000");
        doc.text(`Facture N° : ${data.invoiceNumber} / Invoice N°: ${data.invoiceNumber}`, { continued: true }).text(`   Date : ${data.date}`);
        doc.text(`Client : ${data.clientName} / Client: ${data.clientName}`);
        doc.text(`Email : ${data.clientEmail}`);
        doc.moveDown(1);
        doc.text(`Montant HT : ${montantHT} € / Net (excl. VAT): ${montantHT} €`);
        doc.text(`TVA (20%) : ${tva} € / VAT (20%): ${tva} €`);
        doc.text(`Montant TTC : ${data.montant} € / Total (incl. VAT): ${data.montant} €`);
        doc.moveDown(1);

        doc.fontSize(11).fillColor("#0A2942").text("Conditions de règlement / Payment Terms :", { underline: true });
        doc.fontSize(10).fillColor("#000000").text(
          "Paiement reçu via Stripe. / Payment received via Stripe.\n" +
          "Prestation conforme à la commande. / Service compliant with order.\n" +
          "Itrium Conseil agit comme tiers de confiance. / Itrium Conseil acts as a trusted intermediary."
        );

        drawStamp(doc);

        doc.moveDown(2);
        doc.fontSize(9).fillColor("#666666").text(
          "Itrium Conseil - Société de services informatiques et plateforme B2B / IT Services & B2B Platform\n" +
          "SIRET : 123 456 789 00010 | TVA : FR12 123456789 | contact@itriumconseil.fr",
          { align: "center" }
        );

        doc.end();
        stream.on("finish", resolve);
      });
    }

    // === Hash contrat ===
    const buffer = Buffer.from(`${clientName}${clientEmail}${montant}${date}${stripeId}`);
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    // === Génération fichiers ===
    const contratPath = path.join(contractsDir, `contrat_${stripeId}.pdf`);
    const facturePath = path.join(invoicesDir, `facture_${invoiceNumber}.pdf`);

    await generateContract({ clientName, clientEmail, montant, date, hash }, contratPath);
    await generateInvoice({ clientName, clientEmail, montant, date, invoiceNumber }, facturePath);

    console.log(`🧾 Contrat généré : ${contratPath}`);
    console.log(`📄 Facture générée : ${facturePath}`);

    // --- Envoi du mail ---
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    try {
      const cguPath = path.join(process.cwd(), "public", "legal", "CGU_Itrium_Conseil.pdf");
      await transporter.sendMail({
        from: `"Itrium Conseil" <${process.env.EMAIL_USER}>`,
        to: [clientEmail, process.env.EMAIL_USER],
        subject: "Votre contrat et facture / Your Contract and Invoice - Itrium Conseil",
        text: `Bonjour ${clientName},\n\nVotre paiement de ${montant}€ a bien été reçu.\nVeuillez trouver ci-joint votre contrat et votre facture bilingues.\n\nEmpreinte du contrat : ${hash}\nDate : ${date}\n\nThank you for your trust.\nBest regards,\nItrium Conseil Team.`,
        attachments: [
          { filename: "CGU_Itrium_Conseil.pdf", path: cguPath },
          { filename: path.basename(contratPath), path: contratPath },
          { filename: path.basename(facturePath), path: facturePath },
        ],
      });
      console.log("📧 Contrat et facture bilingues envoyés par mail !");
    } catch (mailErr) {
      console.error("Erreur envoi mail :", mailErr);
    }

    // --- Enregistrement BDD ---
    try {
      db.prepare(`
        INSERT INTO paiements (stripe_id, client_nom, client_email, montant, date_paiement, statut, contrat_pdf)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(stripeId, clientName, clientEmail, montant, date, "payé", contratPath);

      console.log("💾 Paiement enregistré dans la base !");
    } catch (dbErr) {
      console.error("Erreur enregistrement BDD :", dbErr);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}