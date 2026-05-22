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
        <p className="mb-6">
          Le présent site est édité par :<br /><br />
          <strong>BLIND ERIC</strong> — exploitant sous le nom commercial <strong>ITERIUM PARTNERS</strong><br />
          Entrepreneur Individuel — Micro-entreprise<br />
          Activité : Prestation et conseil informatique et création digital<br />
          Code NAF/APE : 62.02A — Conseil en systèmes et logiciels informatiques<br /><br />
          <strong>SIREN :</strong> 522 800 226<br />
          <strong>SIRET (siège) :</strong> 522 800 226 00030<br />
          <strong>Numéro RCS :</strong> 522 800 226 R.C.S. Beauvais<br />
          <strong>Numéro de TVA intracommunautaire :</strong> FR27522800226<br /><br />
          <strong>Adresse du siège social :</strong><br />
          174 Rue du Pont Courtin<br />
          60430 PONCHON, France<br /><br />
          <strong>Directeur de la publication :</strong> Eric BLIND<br /><br />
          <strong>Email :</strong>{" "}
          <a
            href="mailto:contact@itriumconseil.fr"
            className="text-[#0A2942] hover:text-[#F8B400]"
          >
            contact@itriumconseil.fr
          </a>
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          2. Hébergement
        </h2>
        <p className="mb-6">
          Le site est hébergé par :<br />
          <strong>Vercel Inc.</strong><br />
          340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
          Site web :{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0A2942] hover:text-[#F8B400]"
          >
            vercel.com
          </a><br /><br />
          Les données sont stockées via :<br />
          <strong>Supabase Inc.</strong><br />
          970 Toa Payoh North, Singapour<br />
          Site web :{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0A2942] hover:text-[#F8B400]"
          >
            supabase.com
          </a>
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          3. Propriété intellectuelle
        </h2>
        <p className="mb-6">
          L'ensemble du contenu présent sur le site (textes, images, logos,
          icônes, structure, code source, etc.) est la propriété exclusive
          d'ITERIUM PARTNERS et est protégé par le droit de la propriété
          intellectuelle français et international. Toute reproduction totale
          ou partielle sans autorisation préalable écrite est strictement interdite.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          4. Responsabilité
        </h2>
        <p className="mb-6">
          ITERIUM PARTNERS agit uniquement en tant qu'intermédiaire numérique
          entre clients et experts indépendants. La responsabilité d'ITERIUM
          PARTNERS ne saurait être engagée pour les prestations réalisées par
          les experts référencés, ni pour tout dommage direct ou indirect
          résultant de l'utilisation du site ou des services proposés.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          5. Données personnelles
        </h2>
        <p className="mb-6">
          Le traitement des données personnelles est régi par notre{" "}
          <a href="/privacy" className="text-[#0A2942] hover:text-[#F8B400]">
            Politique de confidentialité
          </a>
          , conforme au Règlement Général sur la Protection des Données (RGPD —
          Règlement UE 2016/679). Le responsable du traitement des données est
          Eric BLIND, joignable à{" "}
          <a
            href="mailto:contact@itriumconseil.fr"
            className="text-[#0A2942] hover:text-[#F8B400]"
          >
            contact@itriumconseil.fr
          </a>.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          6. Cookies
        </h2>
        <p className="mb-6">
          Le site utilise des cookies strictement nécessaires à son bon
          fonctionnement (session, authentification, préférences). Aucun cookie
          publicitaire ou de tracking tiers n'est utilisé sans votre consentement
          explicite. Vous pouvez gérer vos préférences à tout moment dans les
          paramètres de votre navigateur.
        </p>

        <h2 className="text-xl font-semibold text-[#0A2942] mb-2">
          7. Droit applicable et juridiction
        </h2>
        <p className="mb-6">
          Les présentes mentions légales sont régies par le droit français.
          En cas de litige, et après tentative de résolution amiable, les
          tribunaux compétents sont ceux de Beauvais (Oise), lieu du siège
          social d'ITERIUM PARTNERS.
        </p>

        <p className="text-center text-slate-500 text-sm mt-12">
          © {new Date().getFullYear()} ITERIUM PARTNERS (BLIND ERIC) — Tous droits réservés.
        </p>
      </section>
    </main>
  );
}
