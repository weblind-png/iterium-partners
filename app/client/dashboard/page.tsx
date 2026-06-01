"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ClientDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [filteredExperts, setFilteredExperts] = useState<any[]>([]);
  const [demandes, setDemandes] = useState<any[]>([]);
  const [propositions, setPropositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("recherche");
  const [abonnement, setAbonnement] = useState<"aucun" | "standard" | "premium">("aucun");
  const [generatingContrat, setGeneratingContrat] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData?.role !== "client") {
        router.push("/auth/login");
        return;
      }

      setProfile(profileData);

      if (profileData.abonnement === "standard") setAbonnement("standard");
      else if (profileData.abonnement === "premium") setAbonnement("premium");
      else setAbonnement("aucun");

      const params = new URLSearchParams(window.location.search);
      if (params.get("abonnement") === "success") {
        setAbonnement("standard");
        setActiveTab("recherche");
      }

      // Charger les demandes
      const { data: demandesData } = await supabase
        .from("demandes")
        .select("*, experts(prenom, nom, metier, photo_url)")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      setDemandes(demandesData || []);

      // Charger les propositions reçues
      const { data: propositionsData } = await supabase
        .from("propositions")
        .select("*, experts(prenom, nom, metier)")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      setPropositions(propositionsData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleStripeCheckout = (forfait: "standard" | "premium") => {
    if (forfait === "standard") {
      window.location.href = "https://buy.stripe.com/aFaeV5eKA1yiaAS4jHbsc06";
    } else {
      window.location.href = "https://buy.stripe.com/5kQfZ9byo1yigZg7vTbsc07";
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setHasSearched(true);

    const { data: experts } = await supabase
      .from("experts")
      .select("*")
      .eq("visible", true);

    const query = searchQuery.toLowerCase();
    const results = (experts || []).filter((expert) =>
      expert.metier?.toLowerCase().includes(query) ||
      expert.expertises?.toLowerCase().includes(query) ||
      expert.experience?.toLowerCase().includes(query) ||
      expert.localisation?.toLowerCase().includes(query) ||
      expert.disponibilite?.toLowerCase().includes(query)
    );

    const scored = results.map((expert) => {
      let score = 0;
      if (expert.metier?.toLowerCase().includes(query)) score += 3;
      if (expert.expertises?.toLowerCase().includes(query)) score += 2;
      if (expert.experience?.toLowerCase().includes(query)) score += 1;
      return { ...expert, score };
    }).sort((a, b) => b.score - a.score);

    setFilteredExperts(scored);
    setSearching(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleContact = (expert: any) => {
    if (abonnement === "aucun") {
      setActiveTab("abonnement");
      return;
    }
    router.push(`/client/contact?expert=${expert.id}`);
  };

  const handleValiderProposition = async (propositionId: string, demandeId: string) => {
    const proposition = propositions.find((p) => p.id === propositionId);

    await supabase
      .from("propositions")
      .update({ statut: "validee" })
      .eq("id", propositionId);

    await supabase
      .from("demandes")
      .update({ statut: "validee" })
      .eq("id", demandeId);

    setPropositions(propositions.map((p) =>
      p.id === propositionId ? { ...p, statut: "validee" } : p
    ));

    // ✅ Notifier l'expert
    if (proposition?.experts?.email) {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "proposition_validee",
          to: proposition.experts.email,
          data: {
            expertPrenom: proposition.experts?.prenom,
            clientPrenom: profile?.prenom,
            clientNom: profile?.nom,
            clientSociete: profile?.societe,
            domaine: proposition.domaine,
            duree: proposition.duree,
            montantTotal: (proposition.duree * proposition.tjm).toLocaleString("fr-FR"),
          },
        }),
      });
    }
  };

  const handleGenererContrats = async (demandeId: string) => {
    setGeneratingContrat(demandeId);

    try {
      // Générer NDA
      await fetch("/api/contrats/generer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demandeId, type: "nda" }),
      });

      // Générer contrat de mise en relation
      await fetch("/api/contrats/generer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demandeId, type: "mise_en_relation" }),
      });

      alert("✅ NDA et contrat de mise en relation générés ! Vous les retrouverez dans l'onglet 'Mes contrats'.");
      setActiveTab("contrats");

    } catch (error) {
      alert("Erreur lors de la génération des contrats.");
    }

    setGeneratingContrat(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2942] flex items-center justify-center">
        <p className="text-white text-lg">Chargement de votre espace...</p>
      </div>
    );
  }

  const demandesEnAttente = demandes.filter((d) => d.statut === "en_attente");
  const propositionsEnAttente = propositions.filter((p) => p.statut === "en_attente");

  return (
    <div className="min-h-screen bg-[#f9fafb]">

      {/* HEADER */}
      <header className="bg-[#0A2942] text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-10 w-auto" />
            <div>
              <p className="text-xs text-slate-400">Espace Client</p>
              <p className="font-bold">{profile?.prenom} {profile?.nom}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              abonnement === "premium" ? "bg-yellow-100 text-yellow-800" :
              abonnement === "standard" ? "bg-blue-100 text-blue-800" :
              "bg-slate-100 text-slate-600"
            }`}>
              {abonnement === "premium" && "⭐ Premium"}
              {abonnement === "standard" && "✔ Standard"}
              {abonnement === "aucun" && "Sans abonnement"}
            </span>
            <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white transition">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 flex gap-6 overflow-x-auto">
          {["recherche", "demandes", "contrats", "abonnement"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === tab ? "border-[#F8B400] text-[#0A2942]" : "border-transparent text-slate-500 hover:text-[#0A2942]"
              }`}
            >
              {tab === "recherche" && "🔍 Rechercher un expert"}
              {tab === "demandes" && (
                <span className="flex items-center gap-2">
                  📬 Mes demandes
                  {(demandesEnAttente.length + propositionsEnAttente.length) > 0 && (
                    <span className="bg-yellow-400 text-[#0A2942] text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {demandesEnAttente.length + propositionsEnAttente.length}
                    </span>
                  )}
                </span>
              )}
              {tab === "contrats" && "📄 Mes contrats"}
              {tab === "abonnement" && "💳 Mon abonnement"}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ONGLET RECHERCHE */}
        {activeTab === "recherche" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold text-[#0A2942] mb-1">🤖 Recherche IA d'experts</h2>
              <p className="text-slate-500 text-sm mb-4">
                Décrivez votre besoin en quelques mots et notre IA sélectionne les meilleurs profils.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ex: RSSI NIS2 urgence, DSI de transition, DAF clôture groupe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="bg-[#F8B400] text-[#0A2942] font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {searching ? "..." : "Rechercher"}
                </button>
              </div>
            </div>

            {!hasSearched && (
              <div className="bg-white rounded-3xl shadow p-12 text-center">
                <p className="text-6xl mb-4">🎯</p>
                <h3 className="text-xl font-bold text-[#0A2942] mb-2">Trouvez votre expert en quelques secondes</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Décrivez votre besoin ci-dessus : type de mission, compétences recherchées, urgence, localisation...
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {["RSSI NIS2", "DSI de transition", "DAF groupe", "CTO startup", "Expert SAP", "Audit cybersécurité"].map((s) => (
                    <button key={s} onClick={() => setSearchQuery(s)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasSearched && (
              <>
                {abonnement === "aucun" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
                    <p className="text-yellow-800 font-semibold mb-2">⚠️ Abonnement requis</p>
                    <p className="text-yellow-700 text-sm mb-4">Souscrivez pour contacter les experts.</p>
                    <button onClick={() => setActiveTab("abonnement")}
                      className="bg-[#F8B400] text-[#0A2942] font-bold px-6 py-2 rounded-xl hover:bg-yellow-400 transition text-sm">
                      Voir les formules
                    </button>
                  </div>
                )}

                {filteredExperts.length === 0 ? (
                  <div className="bg-white rounded-3xl shadow p-12 text-center text-slate-400">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="font-semibold text-slate-600">Aucun expert trouvé</p>
                    <p className="text-sm mt-1">Essayez avec d'autres mots clés</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-500">
                      <strong className="text-[#0A2942]">{filteredExperts.length} expert{filteredExperts.length > 1 ? "s" : ""}</strong> trouvé{filteredExperts.length > 1 ? "s" : ""} pour "{searchQuery}"
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredExperts.map((expert) => (
                        <div key={expert.id} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition">
                          <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden mb-3 flex items-center justify-center">
                            {expert.photo_url ? (
                              <img src={expert.photo_url} alt={expert.prenom} className="w-full h-full object-cover" />
                            ) : (
                              <svg className="w-12 h-12 text-slate-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            )}
                          </div>
                          <p className="font-bold text-[#0A2942]">{expert.prenom} {expert.nom?.charAt(0)}.</p>
                          <p className="text-sm text-slate-500 mb-2">{expert.metier}</p>
                          <div className="flex flex-wrap gap-1 justify-center mb-2">
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✔ Expert Vérifié</span>
                            {expert.disponibilite && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🟢 Disponible</span>}
                          </div>
                          <p className="text-xs text-slate-400 mb-1">📍 {expert.localisation}</p>
                          <p className="text-xs font-semibold text-[#0A2942] mb-2">💶 {expert.tjm} €/jour</p>
                          <p className="text-xs text-slate-500 mb-4 line-clamp-2">{expert.expertises}</p>
                          {expert.score > 0 && <p className="text-xs font-bold text-[#F8B400] mb-3">🤖 Score IA : {expert.score}/6</p>}
                          <button
                            onClick={() => handleContact(expert)}
                            className={`w-full py-2 rounded-xl text-sm font-bold transition ${
                              abonnement !== "aucun"
                                ? "bg-[#0A2942] text-white hover:bg-slate-800"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            {abonnement !== "aucun" ? "Contacter cet expert" : "🔒 Abonnement requis"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* ONGLET DEMANDES */}
        {activeTab === "demandes" && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-[#0A2942]">Mes demandes et propositions</h2>

            {/* Propositions reçues */}
            {propositions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  📋 Propositions reçues ({propositions.length})
                </h3>
                {propositions.map((proposition) => (
                  <div key={proposition.id} className={`bg-white rounded-2xl shadow p-6 border-l-4 ${
                    proposition.statut === "validee" ? "border-emerald-400" : "border-blue-400"
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-[#0A2942]">
                          {proposition.experts?.prenom} {proposition.experts?.nom?.charAt(0)}.
                        </p>
                        <p className="text-xs text-slate-500">{proposition.experts?.metier}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(proposition.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        proposition.statut === "validee"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {proposition.statut === "validee" ? "✅ Validée" : "📋 À valider"}
                      </span>
                    </div>

                    {/* Détails proposition */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-4 grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-slate-400">Durée</p>
                        <p className="font-bold text-[#0A2942]">{proposition.duree} jour(s)</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">TJM</p>
                        <p className="font-bold text-[#0A2942]">{proposition.tjm} €/j</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Total estimé</p>
                        <p className="font-bold text-[#F8B400]">
                          {(proposition.duree * proposition.tjm).toLocaleString("fr-FR")} €
                        </p>
                      </div>
                    </div>

                    {proposition.description && (
                      <div className="bg-slate-50 rounded-xl p-3 mb-4">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Approche proposée :</p>
                        <p className="text-sm text-slate-700">{proposition.description}</p>
                      </div>
                    )}

                    {proposition.statut === "en_attente" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleValiderProposition(proposition.id, proposition.demande_id)}
                          className="flex-1 bg-emerald-500 text-white font-bold py-2 rounded-xl hover:bg-emerald-600 transition text-sm"
                        >
                          ✅ Valider la proposition
                        </button>
                      </div>
                    )}

                    {proposition.statut === "validee" && (
                      <button
                        onClick={() => handleGenererContrats(proposition.demande_id)}
                        disabled={generatingContrat === proposition.demande_id}
                        className="w-full bg-[#0A2942] text-white font-bold py-2 rounded-xl hover:bg-slate-800 transition text-sm disabled:opacity-50"
                      >
                        {generatingContrat === proposition.demande_id
                          ? "⏳ Génération en cours..."
                          : "📄 Générer NDA + Contrat de mise en relation"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Demandes envoyées */}
            {demandes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  📬 Demandes envoyées ({demandes.length})
                </h3>
                {demandes.map((demande) => (
                  <div key={demande.id} className={`bg-white rounded-2xl shadow p-6 border-l-4 ${
                    demande.statut === "acceptee" || demande.statut === "validee" ? "border-emerald-400" :
                    demande.statut === "refusee" ? "border-red-300" : "border-yellow-400"
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                          {demande.experts?.photo_url ? (
                            <img src={demande.experts.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#0A2942]">{demande.experts?.prenom} {demande.experts?.nom?.charAt(0)}.</p>
                          <p className="text-xs text-slate-500">{demande.experts?.metier}</p>
                          <p className="text-xs text-slate-400">{new Date(demande.created_at).toLocaleDateString("fr-FR")}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        demande.statut === "acceptee" || demande.statut === "proposition_envoyee" || demande.statut === "validee"
                          ? "bg-emerald-100 text-emerald-700" :
                        demande.statut === "refusee" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {demande.statut === "en_attente" && "⏳ En attente"}
                        {demande.statut === "acceptee" && "✅ Acceptée"}
                        {demande.statut === "proposition_envoyee" && "📋 Proposition reçue"}
                        {demande.statut === "validee" && "✅ Validée"}
                        {demande.statut === "refusee" && "❌ Refusée"}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-sm text-slate-600 line-clamp-2">{demande.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {demandes.length === 0 && propositions.length === 0 && (
              <div className="bg-white rounded-3xl shadow p-12 text-center text-slate-400">
                <p className="text-4xl mb-4">📬</p>
                <p className="font-semibold">Aucune demande envoyée</p>
                <button onClick={() => setActiveTab("recherche")}
                  className="mt-4 bg-[#F8B400] text-[#0A2942] font-bold px-6 py-2 rounded-xl hover:bg-yellow-400 transition text-sm">
                  Rechercher un expert
                </button>
              </div>
            )}
          </div>
        )}

        {/* ONGLET CONTRATS */}
        {activeTab === "contrats" && (
          <ContratsList clientId={profile?.id} />
        )}

        {/* ONGLET ABONNEMENT */}
        {activeTab === "abonnement" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0A2942]">Mon abonnement</h2>

            {abonnement !== "aucun" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-700 text-sm font-semibold">
                ✅ Vous êtes abonné au forfait {abonnement === "standard" ? "Essentiel" : "Groupe"}. Merci pour votre confiance !
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className={`bg-white rounded-3xl shadow p-8 border-2 ${abonnement === "standard" ? "border-[#0A2942]" : "border-transparent"}`}>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-[#0A2942]">Forfait Essentiel</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-[#0A2942]">199€</span>
                    <span className="text-sm text-slate-500"> /mois</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">ou 1 990€/an (2 mois offerts)</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 mb-6">
                  <li>✅ Accès moteur de recherche IA</li>
                  <li>✅ Consultation profils experts</li>
                  <li>✅ 5 mises en relation / mois</li>
                  <li>✅ Génération contrat automatique</li>
                  <li>✅ Support email</li>
                </ul>
                {abonnement === "standard" ? (
                  <div className="text-center text-sm font-bold text-emerald-600">✔ Votre abonnement actuel</div>
                ) : (
                  <button onClick={() => handleStripeCheckout("standard")}
                    className="w-full bg-[#0A2942] text-white font-bold py-3 rounded-2xl hover:bg-slate-800 transition">
                    Souscrire — 199€/mois
                  </button>
                )}
              </div>

              <div className={`bg-[#0A2942] rounded-3xl shadow p-8 border-2 ${abonnement === "premium" ? "border-[#F8B400]" : "border-transparent"}`}>
                <div className="text-center mb-6">
                  <span className="text-xs bg-[#F8B400] text-[#0A2942] font-bold px-3 py-1 rounded-full">⭐ PREMIUM</span>
                  <h3 className="text-xl font-bold text-white mt-3">Forfait Groupe</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-[#F8B400]">490€</span>
                    <span className="text-sm text-slate-400"> /mois</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">ou 4 900€/an (2 mois offerts)</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-300 mb-6">
                  <li>✅ Tout le forfait Essentiel</li>
                  <li>✅ Mises en relation illimitées</li>
                  <li>✅ Multi-utilisateurs</li>
                  <li>✅ Reporting & suivi missions</li>
                  <li>✅ Account manager dédié</li>
                  <li>✅ NDA automatique inclus</li>
                </ul>
                {abonnement === "premium" ? (
                  <div className="text-center text-sm font-bold text-[#F8B400]">✔ Votre abonnement actuel</div>
                ) : (
                  <button onClick={() => handleStripeCheckout("premium")}
                    className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition">
                    Souscrire — 490€/mois
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Composant liste des contrats avec badge certification
function ContratsList({ clientId }: { clientId: string }) {
  const [contrats, setContrats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchContrats = async () => {
      const { data } = await supabase
        .from("contrats")
        .select("*, experts(prenom, nom, metier)")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      setContrats(data || []);
      setLoading(false);
    };

    if (clientId) fetchContrats();
  }, [clientId]);

  if (loading) return <div className="text-center py-12 text-slate-400">Chargement...</div>;

  if (contrats.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow p-12 text-center text-slate-400">
        <p className="text-4xl mb-4">📄</p>
        <p className="font-semibold">Aucun contrat pour le moment</p>
        <p className="text-sm mt-1">Vos contrats apparaîtront ici après validation d'une proposition</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#0A2942]">Mes contrats</h2>
      {contrats.map((contrat) => (
        <div key={contrat.id} className="bg-white rounded-2xl shadow p-6 border-l-4 border-[#0A2942]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-bold text-[#0A2942]">
                {contrat.type === "nda" ? "🔒 NDA — Accord de confidentialité" : "📋 Contrat de mise en relation"}
              </p>
              <p className="text-xs text-slate-500">
                avec {contrat.experts?.prenom} {contrat.experts?.nom} — {contrat.experts?.metier}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(contrat.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-full">
              ✅ Généré
            </span>
          </div>

          {/* Aperçu du contrat */}
          <details className="mt-2">
            <summary className="text-xs text-[#0A2942] font-semibold cursor-pointer hover:underline">
              Voir le contenu
            </summary>
            <pre className="mt-3 bg-slate-50 rounded-xl p-4 text-xs text-slate-600 whitespace-pre-wrap font-mono overflow-auto max-h-64">
              {contrat.contenu}
            </pre>
          </details>

          {/* Badge certification */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400 italic">
              Document généré et certifié par ITERIUM PARTNERS
            </p>
            <img
              src="/certif/certified_stamp.png"
              alt="Certified by ITERIUM Digital Trust"
              className="h-16 opacity-90"
            />
          </div>

        </div>
      ))}
    </div>
  );
}
