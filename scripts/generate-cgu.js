import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const outputDir = path.join(process.cwd(), "public", "legal");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const outputPath = path.join(outputDir, "CGU_Itrium_Conseil.pdf");
const doc = new PDFDocument({ margin: 60 });
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// === Définition des chemins
const logoPath = path.join(process.cwd(), "public", "Logo_ITRIUM.png");
const stampPath = path.join(process.cwd(), "public", "certified_stamp.png");

// === En-tête bleu foncé
doc.rect(0, 0, doc.page.width, 100).fill("#0A2942");

// === Logo
if (fs.existsSync(logoPath)) {
  doc.image(logoPath, 50, 25, { width: 100 });
}

// === Titre principal
doc.fillColor("white")
   .fontSize(20)
   .text("Conditions Générales d’Utilisation / Terms of Use", 0, 40, {
     align: "center",
   });

doc.moveDown(3);
doc.fillColor("black").fontSize(12);

// === Contenu bilingue harmonisé
const sections = [
  ["1. Objet / Purpose", "La plateforme ITERIUM PARTNERS met en relation des clients et des experts IT. / The ITERIUM PARTNERS platform connects clients and IT experts."],
  ["2. Rôle de la plateforme / Platform Role", "ITERIUM PARTNERS agit uniquement en tant qu’intermédiaire numérique et ne participe pas aux contrats conclus entre les parties. / ITERIUM PARTNERS acts only as a digital intermediary and is not a party to any contracts concluded between users."],
  ["3. Inscription et utilisation / Registration & Use", "L’accès à la plateforme est réservé aux utilisateurs inscrits et validés. / Access is reserved for registered and approved users."],
  ["4. Responsabilités / Responsibilities", "Les clients et experts sont seuls responsables du respect de leurs engagements contractuels. / Clients and experts are solely responsible for honoring their contractual obligations."],
  ["5. Paiement et sécurité / Payment & Security", "Les paiements sont gérés via Stripe pour garantir la sécurité des transactions. / Payments are processed through Stripe to ensure secure transactions."],
  ["6. Protection des données / Data Protection (RGPD / GDPR)", "ITERIUM PARTNERS s’engage à protéger les données conformément au RGPD. / ITERIUM PARTNERS complies with GDPR data protection regulations."],
  ["7. Résiliation / Termination", "Chaque partie peut résilier son compte conformément aux conditions d’utilisation. / Each party may terminate their account according to the Terms of Use."],
  ["8. Loi applicable / Applicable Law", "Les présentes CGU sont soumises au droit français. / These terms are governed by French law."],
];

sections.forEach(([title, text]) => {
  doc.moveDown(0.8);
  doc.fontSize(13).fillColor("#0A2942").text(title);
  doc.fontSize(11).fillColor("black").text(text, { align: "justify" });
});

// === Timbre certification (bas à droite)
if (fs.existsSync(stampPath)) {
  const bottomY = doc.page.height - 120;
  const rightX = doc.page.width - 180;
  doc.image(stampPath, rightX, bottomY, { width: 120 });
}

// === Pied de page
doc.fontSize(9).fillColor("#555555");
doc.text(
  "\n\nDocument généré automatiquement par la plateforme ITERIUM PARTNERS.",
  { align: "center" }
);

doc.end();

stream.on("finish", () => {
  console.log("✅ CGU PDF généré avec succès :", outputPath);
});