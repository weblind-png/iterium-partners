const Database = require("better-sqlite3");

// Ouvre la base
const db = new Database("./data/itrium.db");

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
  ) VALUES (
    'test_stripe_124',
    'Eric Blind',
    'eric@itriumconseil.com',
    350.00,
    '2025-11-02 16:45',
    'payé',
    'exports/contracts/contrat_test.pdf',
    'exports/invoices/facture_test.pdf'
  );
`).run();

console.log("✅ Paiement test ajouté avec succès !");