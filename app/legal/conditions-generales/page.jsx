"use client";
 
export default function ConditionsGeneralesPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-16 px-8 md:px-24 lg:px-48">
      <h1 className="text-3xl font-bold text-[#0A2942] mb-8 text-center">
        Conditions Générales d'Utilisation (CGU)
      </h1>
 
      <p className="text-sm text-gray-500 mb-10 text-center">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>
 
      <section className="space-y-6 leading-relaxed">
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de
          définir les modalités et conditions dans lesquelles la plateforme{" "}
          <strong>ITERIUM PARTNERS</strong> met en relation des clients professionnels
          ("Clients") avec des experts indépendants ("Experts") dans le domaine
          des services informatiques, numériques et du conseil en transformation
          d'entreprise.
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          1. Objet du service
        </h2>
        <p>
          ITERIUM PARTNERS est une plateforme digitale de mise en relation B2B. Elle
          permet aux Clients de publier des besoins et aux Experts de proposer leurs
          prestations. ITERIUM PARTNERS n'intervient pas dans la réalisation des
          prestations ni dans la relation contractuelle entre les parties.
        </p>
        <p>
          En utilisant la plateforme, les utilisateurs reconnaissent qu'ITERIUM PARTNERS agit exclusivement comme un{" "}
          <strong>tiers de confiance technique et administratif</strong> et non comme
          partie prenante au contrat de prestation conclu entre Client et Expert.
        </p>
        <p>
          L'accès complet aux profils experts est conditionné à la souscription d'un
          abonnement. Deux formules sont proposées :
        </p>
        <ul className="list-disc ml-6">
          <li>
            <strong>Forfait Essentiel</strong> : accès limité, adapté aux besoins
            ponctuels avec un nombre de prises de contact restreint.
          </li>
          <li>
            <strong>Forfait Premium</strong> : accès complet, dédié aux entreprises
            ayant des besoins multiples et récurrents.
          </li>
        </ul>
        <p className="mt-3">
          Sans abonnement actif, seules les informations publiques des experts sont
          visibles (photo, métier, compétences, disponibilité, TJM et résumé de
          parcours).
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          2. Responsabilités et rôle d'ITERIUM PARTNERS
        </h2>
        <p>
          ITERIUM PARTNERS assure uniquement la mise à disposition d'un espace
          numérique sécurisé permettant :
        </p>
        <ul className="list-disc ml-6">
          <li>la création et la gestion de profils Clients et Experts,</li>
          <li>la publication d'offres et de missions,</li>
          <li>le matching intelligent entre Clients et Experts via intelligence artificielle,</li>
          <li>la gestion des paiements via un prestataire externe (Stripe),</li>
          <li>et la génération automatique de documents contractuels (contrat de mise
          en relation, NDA, clauses RGPD, facture).</li>
        </ul>
        <p className="mt-3">
          ITERIUM PARTNERS n'est <strong>ni l'employeur</strong>, <strong>ni le
          donneur d'ordre</strong>, <strong>ni le sous-traitant</strong> de
          l'Expert. Les contrats et engagements sont exclusivement conclus entre
          les parties.
        </p>
        <p>
          En cas de litige entre Client et Expert, la responsabilité d'ITERIUM
          PARTNERS ne saurait être engagée. Le règlement du différend relève
          exclusivement des deux parties concernées.
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          3. Obligations des utilisateurs
        </h2>
        <p>
          Les utilisateurs s'engagent à fournir des informations exactes,
          actualisées et conformes à la réalité. Tout usage frauduleux ou abusif
          du service pourra entraîner la suspension ou la suppression du compte.
        </p>
        <p>
          Le Client s'engage à régler les sommes dues pour les prestations
          commandées via la plateforme.
        </p>
        <p>
          L'Expert s'engage à :
        </p>
        <ul className="list-disc ml-6">
          <li>fournir des informations exactes sur son profil, notamment son TJM,
          ses disponibilités réelles et ses compétences,</li>
          <li>exécuter la prestation conformément aux termes convenus avec le Client,</li>
          <li>maintenir son profil à jour afin de garantir la pertinence du matching.</li>
        </ul>
        <p className="mt-3">
          Tout profil jugé incomplet, inexact ou frauduleux pourra être désactivé
          sans préavis par ITERIUM PARTNERS.
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          4. Abonnements, paiement et facturation
        </h2>
        <p>
          Les paiements sont traités de manière sécurisée via le prestataire{" "}
          <strong>Stripe</strong>. Une fois le paiement confirmé, un contrat et
          une facture sont générés automatiquement. Ces documents font foi entre
          le Client et l'Expert.
        </p>
        <p>
          ITERIUM PARTNERS perçoit un abonnement mensuel fixe dont le montant 
          est précisé lors de la souscription. Aucune commission n'est prélevée 
          sur les transactions entre Client et Expert.
        </p>
        <p>
          Les abonnements sont sans engagement sauf mention contraire au moment
          de la souscription. Toute période commencée est due dans son intégralité.
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          5. Accès restreint avant abonnement
        </h2>
        <p>
          Sans abonnement valide, le Client n'a accès qu'aux informations publiques
          des experts :
        </p>
        <ul className="list-disc ml-6">
          <li>Photo professionnelle</li>
          <li>Métier / Fonction</li>
          <li>Compétences clés</li>
          <li>Disponibilité</li>
          <li>TJM indicatif</li>
          <li>Résumé de parcours</li>
        </ul>
        <p className="mt-3">
          Les coordonnées complètes, le profil LinkedIn, les détails d'expérience
          et la prise de contact directe sont accessibles uniquement après
          souscription à l'un des forfaits proposés.
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          6. Données personnelles (RGPD)
        </h2>
        <p>
          Les données collectées sur la plateforme sont traitées conformément au
          Règlement Général sur la Protection des Données (RGPD). Elles sont
          exclusivement utilisées pour le bon fonctionnement de la plateforme et
          ne sont jamais revendues à des tiers.
        </p>
        <p>
          Chaque utilisateur dispose d'un droit d'accès, de rectification et de
          suppression de ses données via l'adresse{" "}
          <a
            href="mailto:contact@itriumconseil.fr"
            className="text-[#00AEEF] underline"
          >
            contact@itriumconseil.fr
          </a>.
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          7. Limitation de responsabilité
        </h2>
        <p>
          ITERIUM PARTNERS ne saurait être tenue responsable d'un dommage direct ou
          indirect résultant de l'utilisation de la plateforme ou d'un différend
          entre utilisateurs. Le rôle d'ITERIUM PARTNERS est strictement limité à
          la mise en relation et à la fourniture d'un outil technique.
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          8. Propriété intellectuelle
        </h2>
        <p>
          Tous les contenus, marques et éléments graphiques présents sur la
          plateforme sont protégés par le droit de la propriété intellectuelle.
          Toute reproduction non autorisée est strictement interdite.
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          9. Modifications des CGU
        </h2>
        <p>
          ITERIUM PARTNERS se réserve le droit de modifier à tout moment les
          présentes CGU afin de les adapter à l'évolution du service ou à la
          législation en vigueur. Les utilisateurs seront informés de toute
          modification majeure par email ou notification sur la plateforme.
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          10. Résiliation et suppression de compte
        </h2>
        <p>
          Tout utilisateur peut demander la suppression de son compte et de ses
          données personnelles à tout moment en envoyant une demande à{" "}
          <a
            href="mailto:contact@itriumconseil.fr"
            className="text-[#00AEEF] underline"
          >
            contact@itriumconseil.fr
          </a>.
          Les données seront supprimées dans un délai de 30 jours suivant la
          demande, sous réserve des obligations légales de conservation.
        </p>
        <p>
          ITERIUM PARTNERS se réserve le droit de suspendre ou supprimer tout
          compte ne respectant pas les présentes CGU, sans préavis ni
          indemnité.
        </p>
 
        <h2 className="text-xl font-semibold text-[#0A2942] mt-10">
          11. Droit applicable et juridiction compétente
        </h2>
        <p>
          Les présentes conditions sont régies par le droit français. Tout litige
          relatif à leur interprétation ou leur exécution relève de la compétence
          exclusive des tribunaux de Paris.
        </p>
 
        <p className="text-center text-sm text-gray-500 mt-16">
          © {new Date().getFullYear()} ITERIUM PARTNERS — Tous droits réservés.
        </p>
      </section>
    </div>
  );
}
