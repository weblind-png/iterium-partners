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
          personnelles dans le cadre de ses activités de conseil, d'assistance et
          de mise en relation d'experts.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          1. Responsable du traitement
        </h2>
        <p>
          Le responsable du traitement est <strong>ITERIUM PARTNERS</strong>, basé à Paris, France. <br />
          Email de contact :{" "}
          <a
            href="mailto:contact@itriumconseil.com"
            className="text-[#0A2942] hover:text-[#F8B400]"
          >
            contact@itriumconseil.com
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          2. Collecte de données
        </h2>
        <p>
          Nous collectons uniquement les données strictement nécessaires à la fourniture de nos services :
          nom, prénom, email professionnel, fonction et informations communiquées dans les formulaires
          de contact. Les données techniques (adresse IP, navigateur, etc.) peuvent être transmises à
          des fins de sécurité et de statistiques.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          3. Finalités du traitement
        </h2>
        <ul className="list-disc pl-6">
          <li>Répondre à vos demandes via le formulaire de contact ;</li>
          <li>Mettre en relation les entreprises et les experts ;</li>
          <li>Assurer le suivi administratif et contractuel ;</li>
          <li>Garantir la conformité légale et la sécurité des échanges.</li>
        </ul>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          4. Conservation des données
        </h2>
        <p>
          Vos données sont conservées pour la durée nécessaire à la gestion de la relation
          commerciale et conformément aux obligations légales et fiscales applicables.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          5. Partage des données
        </h2>
        <p>
          ITERIUM PARTNERS ne vend ni ne loue vos données personnelles. Les informations peuvent être
          partagées uniquement avec des prestataires techniques ou experts intervenant dans le cadre
          des missions, sous réserve de leur conformité RGPD.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          6. Vos droits
        </h2>
        <p>
          Conformément au RGPD, vous disposez des droits d’accès, de rectification, d’opposition, de
          limitation et de suppression de vos données personnelles. Vous pouvez exercer ces droits en
          nous contactant à l’adresse suivante :{" "}
          <a
            href="mailto:contact@itriumconseil.com"
            className="text-[#0A2942] hover:text-[#F8B400]"
          >
            contact@itriumconseil.com
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          7. Sécurité
        </h2>
        <p>
          ITERIUM PARTNERS met en œuvre des mesures techniques et organisationnelles appropriées pour
          garantir la sécurité et la confidentialité de vos données personnelles.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mt-8 mb-2">
          8. Contact
        </h2>
        <p>
          Pour toute question relative à cette politique ou à la protection de vos données, vous
          pouvez nous contacter à{" "}
          <a
            href="mailto:contact@itriumconseil.com"
            className="text-[#0A2942] hover:text-[#F8B400]"
          >
            contact@itriumconseil.com
          </a>
          .
        </p>

        <p className="text-center text-slate-500 text-sm mt-12">
          © {new Date().getFullYear()} ITERIUM PARTNERS — Document conforme au RGPD.
        </p>
      </section>
    </main>
  );
}