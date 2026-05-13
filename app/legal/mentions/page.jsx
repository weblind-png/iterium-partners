"use client";
import React from "react";

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] text-slate-800">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto flex items-center gap-4 px-6 py-6">
          <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-12 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-[#0A2942]">
              Mentions légales
            </h1>
            <p className="text-sm text-slate-500">
              Informations légales et conformité réglementaire
            </p>
          </div>
        </div>
      </header>

      {/* CONTENU */}
      <section className="max-w-5xl mx-auto px-6 py-12 leading-relaxed">
        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          1. Éditeur du site
        </h2>
        <p className="mb-4">
          Le présent site est édité par <strong>ITERIUM PARTNERS</strong>, société
          spécialisée dans la mise en relation B2B et les solutions digitales à
          destination des entreprises et experts indépendants.
        </p>

        <p className="mb-6">
          Adresse : Paris, France<br />
          Email :{" "}
          <a
            href="mailto:contact@itriumconseil.com"
            className="text-[#0A2942] hover:text-[#F8B400]"
          >
            contact@itriumconseil.com
          </a>
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          2. Hébergement
        </h2>
        <p className="mb-6">
          Le site est hébergé par : <br />
          <strong>Vercel Inc.</strong> — 340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
          Site web :{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0A2942] hover:text-[#F8B400]"
          >
            vercel.com
          </a>
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          3. Propriété intellectuelle
        </h2>
        <p className="mb-6">
          L’ensemble du contenu présent sur le site (textes, images, logos,
          icônes, structure, code source, etc.) est protégé par le droit de la
          propriété intellectuelle. Toute reproduction totale ou partielle sans
          autorisation préalable est interdite.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          4. Responsabilité
        </h2>
        <p className="mb-6">
          ITERIUM PARTNERS agit uniquement en tant qu’intermédiaire numérique entre
          clients et experts. La responsabilité d’ITERIUM PARTNERS ne saurait être engagée
          pour les prestations réalisées par les experts référencés.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          5. Données personnelles
        </h2>
        <p className="mb-6">
          Le traitement des données personnelles est régi par notre{" "}
          <a
            href="/privacy"
            className="text-[#0A2942] hover:text-[#F8B400]"
          >
            Politique de confidentialité
          </a>
          , conforme au Règlement Général sur la Protection des Données (RGPD).
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          6. Cookies
        </h2>
        <p className="mb-6">
          Le site utilise des cookies nécessaires à son bon fonctionnement et à
          la mesure d’audience. Vous pouvez gérer vos préférences à tout moment
          dans les paramètres de votre navigateur.
        </p>

        <p className="text-center text-slate-500 text-sm mt-12">
          © {new Date().getFullYear()} ITERIUM PARTNERS — Tous droits réservés.
        </p>
      </section>
    </main>
  );
}