import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const isBuilding = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production';

let db;

// Si on build sur Vercel, on simule une db vide pour ne pas bloquer le processus
if (isBuilding && process.env.VERCEL) {
    db = {
        prepare: () => ({ run: () => ({}), all: () => [], get: () => ({}) }),
    };
} else {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, "itrium.db");
    db = new Database(dbPath);
    
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