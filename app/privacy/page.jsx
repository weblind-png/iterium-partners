"use client";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] text-slate-800">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto flex items-center gap-4 px-6 py-6">
          <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-12 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-[#0A2942]">
              Politique de confidentialité & RGPD
            </h1>
            <p className="text-sm text-slate-500">
              Conformément au Règlement Général sur la Protection des Données (UE) 2016/679
            </p>
          </div>
        </div>
      </header>

      {/* CONTENU */}
      <section className="max-w-5xl mx-auto px-6 py-12 leading-relaxed">

        <p className="mb-6">
          La présente politique de confidentialité décrit la manière dont{" "}
          <strong>ITERIUM PARTNERS</strong> collecte, utilise et protège les données
          personnelles dans le cadre de ses activités de mise en relation entre
          clients professionnels et experts indépendants.
        </p>

        <p className="text-sm text-gray-500 mb-10">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          1. Responsable du traitement
        </h2>
        <p className="mb-6">
          Le responsable du traitement est :<br /><br />
          <strong>BLIND ERIC</strong> — exploitant sous le nom commercial <strong>ITERIUM PARTNERS</strong><br />
          Entrepreneur Individuel — Micro-entreprise<br />
          SIREN : 522 800 226 — SIRET : 522 800 226 00030<br />
          174 Rue du Pont Courtin, 60430 PONCHON, France<br /><br />
          Email :{" "}
          <a href="mailto:contact@itriumconseil.com" className="text-[#0A2942] hover:text-[#F8B400]">
            contact@itriumconseil.com
          </a>
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          2. Données collectées
        </h2>
        <p className="mb-3">Nous collectons les données suivantes selon votre profil :</p>
        <p className="font-semibold mb-1">Pour les Experts :</p>
        <ul className="list-disc pl-6 mb-3">
          <li>Nom, prénom</li>
          <li>Email professionnel</li>
          <li>Numéro de téléphone</li>
          <li>Fonction / métier</li>
          <li>Expériences et compétences</li>
          <li>Localisation (région)</li>
          <li>TJM indicatif</li>
          <li>Profil LinkedIn</li>
          <li>Photo professionnelle</li>
          <li>Mode d'intervention souhaité</li>
        </ul>
        <p className="font-semibold mb-1">Pour les Clients :</p>
        <ul className="list-disc pl-6 mb-3">
          <li>Nom, prénom et raison sociale</li>
          <li>Email professionnel</li>
          <li>Informations de paiement (traitées exclusivement par Stripe)</li>
          <li>Besoins et critères de recherche</li>
        </ul>
        <p className="mb-6">
          Des données techniques (adresse IP, type de navigateur, pages visitées)
          peuvent également être collectées à des fins de sécurité et de statistiques
          d'utilisation.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          3. Bases légales et finalités du traitement
        </h2>
        <ul className="list-disc pl-6 mb-6">
          <li>
            <strong>Exécution du contrat</strong> : mise en relation entre clients et
            experts, gestion des abonnements, génération des contrats et factures.
          </li>
          <li>
            <strong>Consentement</strong> : affichage du profil expert sur la plateforme,
            communications marketing (si acceptées).
          </li>
          <li>
            <strong>Obligation légale</strong> : conservation des documents comptables
            et contractuels conformément à la législation française.
          </li>
          <li>
            <strong>Intérêt légitime</strong> : sécurité de la plateforme, prévention
            des fraudes, amélioration du service.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          4. Durées de conservation
        </h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Profils experts actifs : durée de l'inscription + 3 ans après désactivation</li>
          <li>Données clients : durée de l'abonnement + 3 ans</li>
          <li>Documents contractuels et factures : 10 ans (obligation légale comptable)</li>
          <li>Données de navigation : 13 mois maximum</li>
          <li>Demandes de suppression : traitement sous 30 jours</li>
        </ul>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          5. Sous-traitants et transferts hors UE
        </h2>
        <p className="mb-3">
          ITERIUM PARTNERS fait appel aux sous-traitants suivants, tous conformes au RGPD :
        </p>
        <ul className="list-disc pl-6 mb-3">
          <li>
            <strong>Supabase Inc.</strong> (stockage des données) — Serveurs en Europe
            (région EU West). Politique :{" "}
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
              className="text-[#0A2942] hover:text-[#F8B400]">supabase.com/privacy</a>
          </li>
          <li>
            <strong>Vercel Inc.</strong> (hébergement) — USA, couvert par les clauses
            contractuelles types (CCT) de la Commission européenne. Politique :{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
              className="text-[#0A2942] hover:text-[#F8B400]">vercel.com/legal/privacy-policy</a>
          </li>
          <li>
            <strong>Stripe Inc.</strong> (paiements) — USA, certifié PCI-DSS, couvert
            par les CCT. Politique :{" "}
            <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer"
              className="text-[#0A2942] hover:text-[#F8B400]">stripe.com/fr/privacy</a>
          </li>
        </ul>
        <p className="mb-6">
          ITERIUM PARTNERS ne vend ni ne loue vos données personnelles à des tiers.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          6. Vos droits
        </h2>
        <p className="mb-3">
          Conformément au RGPD, vous disposez des droits suivants :
        </p>
        <ul className="list-disc pl-6 mb-3">
          <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
          <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
          <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
          <li><strong>Droit d'opposition</strong> : s'opposer à certains traitements</li>
          <li><strong>Droit à la limitation</strong> : limiter temporairement un traitement</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format lisible</li>
        </ul>
        <p className="mb-6">
          Pour exercer ces droits, contactez-nous à{" "}
          <a href="mailto:contact@itriumconseil.com" className="text-[#0A2942] hover:text-[#F8B400]">
            contact@itriumconseil.com
          </a>. Nous répondrons dans un délai de 30 jours.<br /><br />
          Vous avez également le droit d'introduire une réclamation auprès de la{" "}
          <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) :{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer"
            className="text-[#0A2942] hover:text-[#F8B400]">www.cnil.fr</a>
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          7. Cookies et traceurs
        </h2>
        <p className="mb-6">
          Le site utilise uniquement des cookies strictement nécessaires à son
          fonctionnement (session utilisateur, authentification, préférences).
          Aucun cookie publicitaire ou de tracking tiers n'est déposé sans votre
          consentement explicite. Vous pouvez gérer ou supprimer les cookies à
          tout moment via les paramètres de votre navigateur.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          8. Sécurité des données
        </h2>
        <p className="mb-6">
          ITERIUM PARTNERS met en œuvre des mesures techniques et organisationnelles
          appropriées pour protéger vos données : chiffrement des communications (HTTPS),
          accès restreint aux données, Row Level Security (RLS) sur la base de données,
          paiements sécurisés via Stripe (certifié PCI-DSS).
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          9. Modifications de la politique
        </h2>
        <p className="mb-6">
          ITERIUM PARTNERS se réserve le droit de modifier la présente politique à tout
          moment. Les utilisateurs seront informés de toute modification substantielle
          par email ou notification sur la plateforme. La date de dernière mise à jour
          est indiquée en haut de ce document.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          10. Contact
        </h2>
        <p className="mb-6">
          Pour toute question relative à cette politique ou à la protection de vos
          données personnelles :<br /><br />
          <strong>ITERIUM PARTNERS — Eric BLIND</strong><br />
          174 Rue du Pont Courtin, 60430 PONCHON<br />
          Email :{" "}
          <a href="mailto:contact@itriumconseil.com" className="text-[#0A2942] hover:text-[#F8B400]">
            contact@itriumconseil.com
          </a>
        </p>

        <p className="text-center text-slate-500 text-sm mt-12">
          © {new Date().getFullYear()} ITERIUM PARTNERS (BLIND ERIC) — Document conforme au RGPD.
        </p>
      </section>
    </main>
  );
}
