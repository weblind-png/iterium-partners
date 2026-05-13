/**
 * 🧰 Outil de gestion de la base ITERIUM PARTNERS
 * Permet de : créer la table, vider les paiements, insérer un test, afficher les paiements
 * Exécution : node scripts/db-tools.js
 */

const Database = require("better-sqlite3");
const readline = require("readline");

const dbPath = "./data/itrium.db";
const db = new Database(dbPath);

console.log(`✅ Base de données connectée : ${dbPath}`);

// === Création de la table si absente ===
db.prepare(`
CREATE TABLE IF NOT EXISTS paiements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stripe_id TEXT UNIQUE,
  client_nom TEXT,
  client_email TEXT,
  montant REAL,
  date_paiement TEXT,
  statut TEXT,
  contrat_pdf TEXT,
  facture_pdf TEXT
);
`).run();

// === Fonctions principales ===
function clearTable() {
  db.prepare("DELETE FROM paiements;").run();
  console.log("🧹 Table 'paiements' vidée avec succès !");
}

function insertTest() {
  const stripeId = `test_${Date.now()}`;
  db.prepare(`
    INSERT INTO paiements (
      stripe_id,
      client_nom,
      client_email,
      montant,
      date_paiement,
      statut,
      contrat_pdf,
      facture_pdf
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `).run(
    stripeId,
    "Eric Blind",
    "eric@itriumconseil.com",
    350.0,
    new Date().toLocaleString("fr-FR"),
    "payé",
    "exports/contracts/contrat_test.pdf",
    "exports/invoices/facture_test.pdf"
  );
  console.log(`✅ Paiement test ajouté : ${stripeId}`);
}

function showTable() {
  const rows = db.prepare("SELECT * FROM paiements ORDER BY id DESC").all();
  if (rows.length === 0) {
    console.log("⚠️ Aucun paiement trouvé dans la base.");
  } else {
    console.log("📊 Contenu de la table paiements :");
    console.table(rows);
  }
}

// === Menu interactif CLI ===
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(`
──────────────────────────────
 ITRIUM CONSEIL — DB TOOLS
──────────────────────────────
1️⃣  Créer/Vérifier la table
2️⃣  Vider la table paiements
3️⃣  Insérer un paiement test
4️⃣  Afficher le contenu de la table
0️⃣  Quitter
──────────────────────────────
`);

rl.question("👉 Que veux-tu faire ? (1-4) ", (answer) => {
  switch (answer.trim()) {
    case "1":
      console.log("✅ Table déjà vérifiée ou créée au démarrage.");
      break;
    case "2":
      clearTable();
      break;
    case "3":
      insertTest();
      break;
    case "4":
      showTable();
      break;
    default:
      console.log("👋 Fermeture du script.");
  }
  rl.close();
});