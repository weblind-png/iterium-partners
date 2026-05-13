import { NextResponse } from "next/server";
import db from "@/lib/db";

/**
 * ✅ Route API : /api/paiements
 * Objectif : Renvoyer la liste complète des paiements enregistrés dans la base SQLite.
 */

export async function GET() {
  try {
    // Vérifie et crée la table si elle n'existe pas encore
    db.prepare(`
      CREATE TABLE IF NOT EXISTS paiements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stripe_id TEXT,
        client_nom TEXT,
        client_email TEXT,
        montant REAL,
        date_paiement TEXT,
        statut TEXT,
        contrat_pdf TEXT
      )
    `).run();

    // Vérifie si la colonne facture_pdf existe, sinon on l'ajoute
    const pragma = db.prepare(`PRAGMA table_info(paiements)`).all();
    const hasFacturePdf = pragma.some(col => col.name === "facture_pdf");
    if (!hasFacturePdf) {
      console.log("🛠 Ajout de la colonne 'facture_pdf' manquante...");
      db.prepare(`ALTER TABLE paiements ADD COLUMN facture_pdf TEXT;`).run();
    }

    // Récupération des paiements triés par date
    const paiements = db.prepare(`
      SELECT id, stripe_id, client_nom, client_email, montant, date_paiement, statut, contrat_pdf, facture_pdf
      FROM paiements
      ORDER BY date_paiement DESC
    `).all();

    return NextResponse.json({ data: paiements }, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur récupération paiements :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des paiements." },
      { status: 500 }
    );
  }
}

/**
 * (Optionnel) POST : permet d’ajouter manuellement un paiement test
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { stripe_id, client_nom, client_email, montant, date_paiement, statut, contrat_pdf, facture_pdf } = body;

    db.prepare(`
      INSERT INTO paiements (stripe_id, client_nom, client_email, montant, date_paiement, statut, contrat_pdf, facture_pdf)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(stripe_id, client_nom, client_email, montant, date_paiement, statut, contrat_pdf, facture_pdf);

    return NextResponse.json({ success: true, message: "Paiement ajouté avec succès" }, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur ajout paiement :", error);
    return NextResponse.json(
      { error: "Impossible d'ajouter le paiement." },
      { status: 500 }
    );
  }
}