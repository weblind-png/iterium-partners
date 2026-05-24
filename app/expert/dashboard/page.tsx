"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ExpertDashboard() {
  const router = useRouter();
  const [expert, setExpert] = useState<any>(null);
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profil");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "expert") {
        router.push("/auth/login");
        return;
      }

      // Charger profil expert
      const { data: expertData } = await supabase
        .from("experts")
        .select("*")
        .eq("email", user.email)
        .single();

      setExpert(expertData);

      // Charger les demandes reçues
      if (expertData) {
        const { data: demandesData } = await supabase
          .from("demandes")
          .select("*, profiles(prenom, nom, email, societe)")
          .eq("expert_id", expertData.id)
          .order("created_at", { ascending: false });

        setDemandes(demandesData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setExpert({ ...expert, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("experts")
      .update({
        prenom: expert.prenom,
        nom: expert.nom,
        telephone: expert.telephone,
        linkedin: expert.linkedin,
        metier: expert.metier,
        experience: expert.experience,
        expertises: expert.expertises,
        localisation: expert.localisation,
        tjm: expert.tjm,
        disponibilite: expert.disponibilite,
      })
      .eq("email", expert.email);

    if (error) {
      setError("Erreur lors de la sauvegarde.");
    } else {
      setSuccess("Profil mis à jour avec succès !");
      setTimeout(() => setSuccess(""), 3000);
    }

    setSaving(false);
  };

  const handleDemande = async (demandeId: string, statut: "acceptee" | "refusee") => {
    const { error } = await supabase
      .from("demandes")
      .update({ statut })
      .eq("id", demandeId);

    if (!error) {
      setDemandes(demandes.map((d) =>
        d.id === demandeId ? { ...d, statut } : d
      ));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2942] flex items-center justify-center">
        <p className="text-white text-lg">Chargement de votre espace...</p>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-[#0A2942] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-[#0A2942] mb-4">Profil introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">
            Votre profil expert n'a pas encore été créé.
          </p>
          <a href="/expert" className="bg-[#F8B400] text-[#0A2942] font-bold py-3 px-6 rounded-2xl hover:bg-yellow-400 transition">
            Créer mon profil expert
          </a>
        </div>
      </div>
    );
  }

  const demandesEnAttente = demandes.filter((d) => d.statut === "en_attente");
  const demandesTraitees = demandes.filter((d) => d.statut !== "en_attente");

  return (
    <div className="min-h-screen bg-[#f9fafb]">

      {/* HEADER */}
      <header className="bg-[#0A2942] text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-10 w-auto" />
            <div>
              <p className="text-xs text-slate-400">Espace Expert</p>
              <p className="font-bold">{expert.prenom} {expert.nom}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              expert.visible
                ? "bg-emerald-100 text-emerald-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {expert.visible ? "✔ Profil validé" : "⏳ En attente validation"}
            </span>
            {demandesEnAttente.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {demandesEnAttente.length} nouvelle{demandesEnAttente.length > 1 ? "s" : ""}
              </span>
            )}
            <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white transition">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION ONGLETS */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 flex gap-6">
          {["profil", "demandes", "documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-semibold border-b-2 transition relative ${
                activeTab === tab
                  ? "border-[#F8B400] text-[#0A2942]"
                  : "border-transparent text-slate-500 hover:text-[#0A2942]"
              }`}
            >
              {tab === "profil" && "👤 Mon Profil"}
              {tab === "demandes" && (
                <span className="flex items-center gap-2">
                  📬 Demandes reçues
                  {demandesEnAttente.length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {demandesEnAttente.length}
                    </span>
                  )}
                </span>
              )}
              {tab === "documents" && "📄 Mes Documents"}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ONGLET PROFIL */}
        {activeTab === "profil" && (
          <div className="bg-white rounded-3xl shadow p-8 space-y-5">
            <h2 className="text-xl font-bold text-[#0A2942] mb-2">Mon profil expert</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Prénom</label>
                <input type="text" name="prenom" value={expert.prenom || ""} onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Nom</label>
                <input type="text" name="nom" value={expert.nom || ""} onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Email</label>
              <input type="email" value={expert.email || ""} disabled
                className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 text-slate-400" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Téléphone</label>
                <input type="text" name="telephone" value={expert.telephone || ""} onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">LinkedIn</label>
                <input type="text" name="linkedin" value={expert.linkedin || ""} onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Fonction / Métier</label>
              <input type="text" name="metier" value={expert.metier || ""} onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Expertises clés</label>
              <textarea name="expertises" value={expert.expertises || ""} onChange={handleChange} rows={3}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Résumé parcours</label>
              <textarea name="experience" value={expert.experience || ""} onChange={handleChange} rows={4}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">TJM (€/jour)</label>
                <input type="text" name="tjm" value={expert.tjm || ""} onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Disponibilité</label>
                <input type="text" name="disponibilite" value={expert.disponibilite || ""} onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Localisation</label>
              <input type="text" name="localisation" value={expert.localisation || ""} onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3">{success}</div>}

            <button onClick={handleSave} disabled={saving}
              className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50">
              {saving ? "Sauvegarde..." : "Sauvegarder mon profil"}
            </button>
          </div>
        )}

        {/* ONGLET DEMANDES */}
        {activeTab === "demandes" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0A2942]">Demandes de contact reçues</h2>

            {/* Demandes en attente */}
            {demandesEnAttente.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  En attente ({demandesEnAttente.length})
                </h3>
                {demandesEnAttente.map((demande) => (
                  <div key={demande.id} className="bg-white rounded-2xl shadow p-6 border-l-4 border-[#F8B400]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-[#0A2942]">
                          {demande.profiles?.prenom} {demande.profiles?.nom}
                        </p>
                        {demande.profiles?.societe && (
                          <p className="text-xs text-slate-500">{demande.profiles.societe}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(demande.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "long", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded-full">
                        ⏳ En attente
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                      <p className="text-sm text-slate-700 leading-relaxed">{demande.message}</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDemande(demande.id, "acceptee")}
                        className="flex-1 bg-emerald-500 text-white font-bold py-2 rounded-xl hover:bg-emerald-600 transition text-sm"
                      >
                        ✅ Accepter
                      </button>
                      <button
                        onClick={() => handleDemande(demande.id, "refusee")}
                        className="flex-1 bg-red-100 text-red-700 font-bold py-2 rounded-xl hover:bg-red-200 transition text-sm"
                      >
                        ❌ Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Demandes traitées */}
            {demandesTraitees.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Traitées ({demandesTraitees.length})
                </h3>
                {demandesTraitees.map((demande) => (
                  <div key={demande.id} className={`bg-white rounded-2xl shadow p-6 border-l-4 ${
                    demande.statut === "acceptee" ? "border-emerald-400" : "border-red-300"
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-[#0A2942]">
                          {demande.profiles?.prenom} {demande.profiles?.nom}
                        </p>
                        {demande.profiles?.societe && (
                          <p className="text-xs text-slate-500">{demande.profiles.societe}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(demande.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        demande.statut === "acceptee"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {demande.statut === "acceptee" ? "✅ Acceptée" : "❌ Refusée"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{demande.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Aucune demande */}
            {demandes.length === 0 && (
              <div className="bg-white rounded-3xl shadow p-12 text-center text-slate-400">
                <p className="text-4xl mb-4">📬</p>
                <p className="font-semibold">Aucune demande pour le moment</p>
                <p className="text-sm mt-1">Les demandes de contact apparaîtront ici</p>
              </div>
            )}
          </div>
        )}

        {/* ONGLET DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-xl font-bold text-[#0A2942] mb-6">Mes documents</h2>
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-4">📄</p>
              <p className="font-semibold">Aucun document pour le moment</p>
              <p className="text-sm mt-1">Vos contrats et rapports apparaîtront ici</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
