import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db;

// Détection de l'environnement Vercel + Phase de Build
const isVercel = process.env.VERCEL === '1';
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production';

if (isVercel && isBuildPhase) {
  // On exporte un objet simulé (mock) pour que Next.js ne fige pas
  console.log("🛠️ Mode Build Vercel détecté : Bypass SQLite");
  db = {
    prepare: () => ({
      run: () => ({}),
      all: () => [],
      get: () => null
    }),
    exec: () => ({})
  };
} else {
  // Mode normal (Local ou Runtime)
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, "itrium.db");
  db = new Database(dbPath);
  
  // Initialisation minimale pour éviter les erreurs de table manquante
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
}

export default db;
