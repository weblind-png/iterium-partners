export default function LegalPage() {
  return (
    <main className="min-h-screen p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#0A2942]">Mentions légales</h1>
      <p className="text-slate-600 mb-4">
        Le présent site est édité par <strong>ITERIUM PARTNERS</strong>, société de conseil et de services informatiques.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Éditeur du site</h2>
      <p className="text-slate-600 mb-4">
        ITERIUM PARTNERS — Paris, France  
        <br />
        Email : <a href="mailto:contact@itriumconseil.com" className="text-[#0A2942] hover:underline">contact@itriumconseil.com</a>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Hébergement</h2>
      <p className="text-slate-600 mb-4">
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Propriété intellectuelle</h2>
      <p className="text-slate-600 mb-4">
        Tous les éléments de ce site (textes, visuels, logos, code) sont la propriété exclusive d’ITERIUM PARTNERS.
        Toute reproduction totale ou partielle sans autorisation écrite est interdite.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Données personnelles</h2>
      <p className="text-slate-600 mb-4">
        Les informations collectées via le formulaire de contact sont strictement confidentielles et destinées uniquement
        à ITERIUM PARTNERS. Aucune donnée n’est vendue ou transmise à des tiers.
      </p>

      <p className="mt-8 text-sm text-slate-500">
        © {new Date().getFullYear()} ITERIUM PARTNERS — Tous droits réservés.
      </p>
    </main>
  );
}