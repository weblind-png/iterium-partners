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
  const [activeTab, setActiveTab] = useState("experts");
  const [stats, setStats] = useState({
    totalExperts: 0,
    expertsValides: 0,
    expertsEnAttente: 0,
    totalClients: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Vérifier le rôle admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        router.push("/auth/login");
        return;
      }

      // Charger tous les experts
      const { data: expertsData } = await supabase
        .from("experts")
        .select("*")
        .order("created_at", { ascending: false });

      // Charger tous les clients
      const { data: clientsData } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client")
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

    fetchData();
  }, []);

  const toggleVisible = async (expert: any) => {
    const { error } = await supabase
      .from("experts")
      .update({ visible: !expert.visible })
      .eq("id", expert.id);

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
    }
  };

  const deleteExpert = async (id: string) => {
    if (!confirm("Supprimer définitivement cet expert ?")) return;

    const { error } = await supabase
      .from("experts")
      .delete()
      .eq("id", id);

    if (!error) {
      const updated = experts.filter((e) => e.id !== id);
      setExperts(updated);
      setStats({
        ...stats,
        totalExperts: updated.length,
        expertsValides: updated.filter((e) => e.visible).length,
        expertsEnAttente: updated.filter((e) => !e.visible).length,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2942] flex items-center justify-center">
        <p className="text-white text-lg">Chargement de l'espace admin...</p>
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
          <button
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-white transition"
          >
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

        {/* NAVIGATION ONGLETS */}
        <div className="bg-white rounded-t-2xl border-b flex gap-6 px-6">
          {["experts", "clients"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-semibold border-b-2 transition ${
                activeTab === tab
                  ? "border-[#F8B400] text-[#0A2942]"
                  : "border-transparent text-slate-500 hover:text-[#0A2942]"
              }`}
            >
              {tab === "experts" && `👤 Experts (${stats.totalExperts})`}
              {tab === "clients" && `🏢 Clients (${stats.totalClients})`}
            </button>
          ))}
        </div>

        {/* ONGLET EXPERTS */}
        {activeTab === "experts" && (
          <div className="bg-white rounded-b-2xl shadow overflow-hidden">
            {experts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-4">👤</p>
                <p className="font-semibold">Aucun expert inscrit</p>
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
                      <th className="px-6 py-3 text-left">Statut</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {experts.map((expert) => (
                      <tr key={expert.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
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
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            expert.visible
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {expert.visible ? "✔ Validé" : "⏳ En attente"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleVisible(expert)}
                              className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                                expert.visible
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              }`}
                            >
                              {expert.visible ? "Désactiver" : "Valider"}
                            </button>
                            <button
                              onClick={() => deleteExpert(expert.id)}
                              className="text-xs font-bold px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                            >
                              Supprimer
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
                      <th className="px-6 py-3 text-left">Inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#0A2942]">{client.prenom} {client.nom}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{client.societe || "—"}</td>
                        <td className="px-6 py-4 text-slate-600">{client.email}</td>
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
    </div>
  );
}
