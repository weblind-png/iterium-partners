"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const router = useRouter();
  const [experts, setExperts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("attente");
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalExperts: 0,
    expertsValides: 0,
    expertsEnAttente: 0,
    totalClients: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") { router.push("/auth/login"); return; }

    const { data: expertsData } = await supabase
      .from("experts").select("*").order("created_at", { ascending: false });

    const { data: clientsData } = await supabase
      .from("profiles").select("*").eq("role", "client")
      .order("created_at", { ascending: false });

    const expertsList = expertsData || [];
    const clientsList = clientsData || [];

    setExperts(expertsList);
    setClients(clientsList);
    setStats({
      totalExperts: expertsList.length,
      expertsValides: expertsList.filter((e) => e.visible).length,
      expertsEnAttente: expertsList.filter((e) => !e.visible).length,
      totalClients: clientsList.length,
    });
    setLoading(false);
  };

  const toggleVisible = async (expert: any) => {
    const { error } = await supabase
      .from("experts").update({ visible: !expert.visible }).eq("id", expert.id);

    if (!error) {
      const updated = experts.map((e) =>
        e.id === expert.id ? { ...e, visible: !e.visible } : e
      );
      setExperts(updated);
      setStats({
        ...stats,
        expertsValides: updated.filter((e) => e.visible).length,
        expertsEnAttente: updated.filter((e) => !e.visible).length,
      });
      if (selectedExpert?.id === expert.id) {
        setSelectedExpert({ ...selectedExpert, visible: !selectedExpert.visible });
      }
    }
  };

  const deleteExpert = async (id: string) => {
    if (!confirm("Supprimer définitivement cet expert ?")) return;
    const { error } = await supabase.from("experts").delete().eq("id", id);
    if (!error) {
      const updated = experts.filter((e) => e.id !== id);
      setExperts(updated);
      setStats({
        ...stats,
        totalExperts: updated.length,
        expertsValides: updated.filter((e) => e.visible).length,
        expertsEnAttente: updated.filter((e) => !e.visible).length,
      });
      setSelectedExpert(null);
    }
  };

  const handleEditSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("experts")
      .update({
        prenom: editData.prenom,
        nom: editData.nom,
        telephone: editData.telephone,
        linkedin: editData.linkedin,
        metier: editData.metier,
        experience: editData.experience,
        expertises: editData.expertises,
        localisation: editData.localisation,
        tjm: editData.tjm,
        disponibilite: editData.disponibilite,
      })
      .eq("id", editData.id);

    if (!error) {
      const updated = experts.map((e) => e.id === editData.id ? { ...e, ...editData } : e);
      setExperts(updated);
      setSelectedExpert({ ...editData });
      setEditMode(false);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const expertsValides = experts.filter((e) => e.visible);
  const expertsEnAttente = experts.filter((e) => !e.visible);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2942] flex items-center justify-center">
        <p className="text-white text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">

      {/* HEADER */}
      <header className="bg-[#0A2942] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="hover:opacity-80 transition">
              <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-14 w-auto" />
            </a>
            <div>
              <p className="text-xs text-slate-400">Espace Administration</p>
              <p className="font-bold">ITERIUM PARTNERS</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white transition">
            Déconnexion
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-[#0A2942]">{stats.totalExperts}</p>
            <p className="text-xs text-slate-500 mt-1">Experts inscrits</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-emerald-600">{stats.expertsValides}</p>
            <p className="text-xs text-slate-500 mt-1">Experts validés</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-yellow-500">{stats.expertsEnAttente}</p>
            <p className="text-xs text-slate-500 mt-1">En attente validation</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalClients}</p>
            <p className="text-xs text-slate-500 mt-1">Clients inscrits</p>
          </div>
        </div>

        {/* ONGLETS */}
        <div className="bg-white rounded-t-2xl border-b flex gap-6 px-6">
          {[
            { key: "attente", label: `⏳ En attente (${stats.expertsEnAttente})` },
            { key: "experts", label: `👤 Experts validés (${stats.expertsValides})` },
            { key: "clients", label: `🏢 Clients (${stats.totalClients})` },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`py-4 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[#F8B400] text-[#0A2942]"
                  : "border-transparent text-slate-500 hover:text-[#0A2942]"
              }`}>
              {tab.label}
              {tab.key === "attente" && stats.expertsEnAttente > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {stats.expertsEnAttente}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ONGLET EN ATTENTE */}
        {activeTab === "attente" && (
          <div className="bg-white rounded-b-2xl shadow overflow-hidden">
            {expertsEnAttente.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-4">✅</p>
                <p className="font-semibold">Aucun expert en attente de validation</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {expertsEnAttente.map((expert) => (
                  <div key={expert.id} className="p-6 hover:bg-yellow-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                          {expert.photo_url ? (
                            <img src={expert.photo_url} alt={expert.prenom} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#0A2942] text-lg">{expert.prenom} {expert.nom}</p>
                          <p className="text-sm text-slate-500">{expert.metier}</p>
                          <p className="text-xs text-slate-400">{expert.email}</p>
                          <p className="text-xs text-slate-400">📍 {expert.localisation} · 💶 {expert.tjm} €/j</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedExpert(expert); setEditMode(false); }}
                          className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
                          👁️ Voir la fiche
                        </button>
                        <button onClick={() => toggleVisible(expert)}
                          className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition">
                          ✅ Valider
                        </button>
                        <button onClick={() => deleteExpert(expert.id)}
                          className="text-xs font-bold px-3 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition">
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                    {/* Aperçu des infos clés */}
                    <div className="mt-4 bg-slate-50 rounded-xl p-4 grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Expertises</p>
                        <p className="text-slate-700">{expert.expertises || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Disponibilité</p>
                        <p className="text-slate-700">{expert.disponibilite || "—"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-slate-400 mb-1">Parcours</p>
                        <p className="text-slate-700 line-clamp-2">{expert.experience || "—"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ONGLET EXPERTS VALIDES */}
        {activeTab === "experts" && (
          <div className="bg-white rounded-b-2xl shadow overflow-hidden">
            {expertsValides.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-4">👤</p>
                <p className="font-semibold">Aucun expert validé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left">Expert</th>
                      <th className="px-6 py-3 text-left">Métier</th>
                      <th className="px-6 py-3 text-left">Localisation</th>
                      <th className="px-6 py-3 text-left">TJM</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expertsValides.map((expert) => (
                      <tr key={expert.id}
                        className="hover:bg-slate-50 transition cursor-pointer"
                        onClick={() => { setSelectedExpert(expert); setEditMode(false); }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                              {expert.photo_url ? (
                                <img src={expert.photo_url} alt={expert.prenom} className="w-full h-full object-cover" />
                              ) : (
                                <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0A2942]">{expert.prenom} {expert.nom}</p>
                              <p className="text-xs text-slate-400">{expert.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{expert.metier}</td>
                        <td className="px-6 py-4 text-slate-600">{expert.localisation}</td>
                        <td className="px-6 py-4 font-semibold text-[#0A2942]">{expert.tjm} €/j</td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedExpert(expert); setEditMode(false); }}
                              className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
                              👁️ Fiche
                            </button>
                            <button onClick={() => toggleVisible(expert)}
                              className="text-xs font-bold px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition">
                              Désactiver
                            </button>
                            <button onClick={() => deleteExpert(expert.id)}
                              className="text-xs font-bold px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ONGLET CLIENTS */}
        {activeTab === "clients" && (
          <div className="bg-white rounded-b-2xl shadow overflow-hidden">
            {clients.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-4">🏢</p>
                <p className="font-semibold">Aucun client inscrit</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left">Client</th>
                      <th className="px-6 py-3 text-left">Société</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Abonnement</th>
                      <th className="px-6 py-3 text-left">Inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-semibold text-[#0A2942]">{client.prenom} {client.nom}</td>
                        <td className="px-6 py-4 text-slate-600">{client.societe || "—"}</td>
                        <td className="px-6 py-4 text-slate-600">{client.email}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            client.abonnement === "premium" ? "bg-yellow-100 text-yellow-700" :
                            client.abonnement === "standard" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-500"
                          }`}>
                            {client.abonnement === "premium" ? "⭐ Groupe" :
                             client.abonnement === "standard" ? "✔ Essentiel" : "Sans abonnement"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(client.created_at).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL FICHE EXPERT */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => { setSelectedExpert(null); setEditMode(false); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>

            {/* Header modal */}
            <div className="bg-[#0A2942] rounded-t-3xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-600 flex items-center justify-center">
                  {selectedExpert.photo_url ? (
                    <img src={selectedExpert.photo_url} alt={selectedExpert.prenom} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-bold text-white text-xl">{selectedExpert.prenom} {selectedExpert.nom}</p>
                  <p className="text-slate-300 text-sm">{selectedExpert.metier}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    selectedExpert.visible ? "bg-emerald-400 text-emerald-900" : "bg-yellow-400 text-yellow-900"
                  }`}>
                    {selectedExpert.visible ? "✔ Validé" : "⏳ En attente"}
                  </span>
                </div>
              </div>
              <button onClick={() => { setSelectedExpert(null); setEditMode(false); }}
                className="text-white/60 hover:text-white text-2xl font-bold">✕</button>
            </div>

            <div className="p-6 space-y-4">

              {!editMode ? (
                <>
                  {/* Vue fiche */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: "Email", value: selectedExpert.email },
                      { label: "Téléphone", value: selectedExpert.telephone || "—" },
                      { label: "LinkedIn", value: selectedExpert.linkedin || "—" },
                      { label: "Localisation", value: selectedExpert.localisation || "—" },
                      { label: "TJM", value: selectedExpert.tjm ? `${selectedExpert.tjm} €/j` : "—" },
                      { label: "Disponibilité", value: selectedExpert.disponibilite || "—" },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-[#0A2942]">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-2">Expertises clés</p>
                    <p className="text-sm text-slate-700">{selectedExpert.expertises || "—"}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-2">Résumé parcours</p>
                    <p className="text-sm text-slate-700">{selectedExpert.experience || "—"}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { setEditMode(true); setEditData({ ...selectedExpert }); }}
                      className="flex-1 bg-[#F8B400] text-[#0A2942] font-bold py-2 rounded-xl hover:bg-yellow-400 transition text-sm">
                      ✏️ Modifier la fiche
                    </button>
                    <button onClick={() => toggleVisible(selectedExpert)}
                      className={`flex-1 font-bold py-2 rounded-xl transition text-sm ${
                        selectedExpert.visible
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-emerald-500 text-white hover:bg-emerald-600"
                      }`}>
                      {selectedExpert.visible ? "Désactiver" : "✅ Valider"}
                    </button>
                    <button onClick={() => deleteExpert(selectedExpert.id)}
                      className="bg-red-100 text-red-700 font-bold py-2 px-4 rounded-xl hover:bg-red-200 transition text-sm">
                      🗑️
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Mode édition */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Prénom</label>
                      <input type="text" value={editData.prenom || ""} onChange={(e) => setEditData({ ...editData, prenom: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Nom</label>
                      <input type="text" value={editData.nom || ""} onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Téléphone</label>
                      <input type="text" value={editData.telephone || ""} onChange={(e) => setEditData({ ...editData, telephone: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">LinkedIn</label>
                      <input type="text" value={editData.linkedin || ""} onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Fonction</label>
                      <input type="text" value={editData.metier || ""} onChange={(e) => setEditData({ ...editData, metier: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">TJM (€/j)</label>
                      <input type="text" value={editData.tjm || ""} onChange={(e) => setEditData({ ...editData, tjm: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Localisation</label>
                      <input type="text" value={editData.localisation || ""} onChange={(e) => setEditData({ ...editData, localisation: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Disponibilité</label>
                      <input type="text" value={editData.disponibilite || ""} onChange={(e) => setEditData({ ...editData, disponibilite: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Expertises clés</label>
                    <textarea value={editData.expertises || ""} onChange={(e) => setEditData({ ...editData, expertises: e.target.value })}
                      rows={3} className="w-full border border-slate-300 rounded-xl p-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Résumé parcours</label>
                    <textarea value={editData.experience || ""} onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
                      rows={4} className="w-full border border-slate-300 rounded-xl p-3 text-sm" />
                  </div>

                  <div className="flex gap-3">
                    <button onClick={handleEditSave} disabled={saving}
                      className="flex-1 bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50">
                      {saving ? "Sauvegarde..." : "💾 Sauvegarder"}
                    </button>
                    <button onClick={() => setEditMode(false)}
                      className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition">
                      Annuler
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
