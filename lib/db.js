import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// 📁 Vérifie et crée le dossier "data" si absent
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("📂 Dossier /data créé automatiquement");
}

// 📄 Fichier SQLite
const dbPath = path.join(dataDir, "itrium.db");
const db = new Database(dbPath);

// 🧱 Création automatique de la table si elle n’existe pas
db.prepare(`
  CREATE TABLE IF NOT EXISTS paiements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stripe_id TEXT UNIQUE,
    client_nom TEXT,
    client_email TEXT,
    montant REAL,
    date_paiement TEXT,
    statut TEXT,
    contrat_pdf TEXT
  )
`).run();

console.log("✅ Base de données prête :", dbPath);

export default db;