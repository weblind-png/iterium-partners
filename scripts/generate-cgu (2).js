import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "public", "legal");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath  = path.join(outDir, "CGU_Itrium_Conseil.pdf");
const logoPath = path.join(process.cwd(), "public", "Logo_ITRIUM.png");
const stampPath = path.join(process.cwd(), "public", "certified_stamp.png");

// === PDF (marges confortables)
const doc = new PDFDocument({ margin: 60, size: "A4" });
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

// --- fond blanc (utile si un lecteur PDF passe en dark-mode)
doc.save();
doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FFFFFF");
doc.restore();

// --- bandeau top
const headerH = 90;
doc.save();
doc.rect(0, 0, doc.page.width, headerH).fill("#0A2942");
doc.restore();

// --- logo + titre, bien alignés
const logoY = 20;
if (fs.existsSync(logoPath)) {
  // largeur fixe + y constant -> pas de décalage
  doc.image(logoPath, 50, logoY, { width: 110 });
}

// Titre centré, calé verticalement dans le bandeau
doc.fillColor("#FFFFFF")
   .fontSize(22)
   .text(
     "Conditions Générales d’Utilisation / Terms of Use",
     0, headerH / 2 - 12,   // -12 ≈ correction optique
     { align: "center" }
   );

// --- corps
doc.moveDown(2);
doc.fillColor("#000000").fontSize(12);

const sections = [
  ["1. Objet / Purpose",
   "La plateforme ITERIUM PARTNERS met en relation des clients et des experts IT. / The ITERIUM PARTNERS platform connects clients and IT experts."],
  ["2. Rôle de la plateforme / Platform Role",
   "ITERIUM PARTNERS agit uniquement en tant qu’intermédiaire numérique et n’est pas partie aux contrats conclus entre les utilisateurs. / ITERIUM PARTNERS acts only as a digital intermediary and is not a party to any contracts concluded between users."],
  ["3. Inscription et utilisation / Registration & Use",
   "L’accès est réservé aux utilisateurs inscrits et validés. / Access is reserved for registered and approved users."],
  ["4. Responsabilités / Responsibilities",
   "Clients et experts sont seuls responsables de leurs engagements contractuels. / Clients and experts are solely responsible for honoring their contractual obligations."],
  ["5. Paiement et sécurité / Payment & Security",
   "Paiements gérés via Stripe pour garantir la sécurité des transactions. / Payments are processed through Stripe to ensure secure transactions."],
  ["6. Protection des données / Data Protection (RGPD / GDPR)",
   "ITERIUM PARTNERS respecte le RGPD pour la protection des données. / ITERIUM PARTNERS complies with GDPR data protection regulations."],
  ["7. Résiliation / Termination",
   "Chaque partie peut résilier son compte selon les présentes conditions. / Each party may terminate their account according to these Terms of Use."],
  ["8. Loi applicable / Applicable Law",
   "Soumises au droit français. / Governed by French law."]
];

sections.forEach(([title, text]) => {
  doc.moveDown(0.8);
  doc.fontSize(13).fillColor("#0A2942").text(title);
  doc.fontSize(11).fillColor("#000000").text(text, { align: "justify" });
});

// --- cachet en bas-droite (toujours en dehors du texte)
if (fs.existsSync(stampPath)) {
  const w = 120;
  const x = doc.page.width - w - 40;
  const y = doc.page.height - w - 60;
  doc.image(stampPath, x, y, { width: w });
}

// --- pied de page
doc.moveDown(2);
doc.fontSize(9).fillColor("#777").text(
  "Document généré automatiquement par la plateforme ITERIUM PARTNERS.",
  { align: "center" }
);

doc.end();
stream.on("finish", () => console.log("✅ CGU PDF généré :", outPath));
});