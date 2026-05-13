export default function ClientFormPage() {
  return (
    <main className="max-w-3xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold text-[#0A2942] mb-4">Formulaire Client</h1>
      <p className="text-slate-600 mb-6">
        Cette page accueillera le formulaire d'inscription des clients.
      </p>
      <a
        href="/client/validation"
        className="bg-[#F8B400] text-[#0A2942] px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition"
      >
        Valider l’inscription
      </a>
    </main>
  );
}