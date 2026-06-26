"use client";

import { useState, useEffect, useRef } from "react";
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
  const [propositions, setPropositions] = useState<any[]>([]);
  const [contrats, setContrats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profil");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "expert") { router.push("/auth/login"); return; }

      const { data: expertData } = await supabase
        .from("experts").select("*").eq("email", user.email).single();
      setExpert(expertData);

      if (expertData) {
        const { data: demandesData } = await supabase
          .from("demandes")
          .select("*, profiles(prenom, nom, email, societe)")
          .eq("expert_id", expertData.id)
          .order("created_at", { ascending: false });
        setDemandes(demandesData || []);

        const { data: propositionsData } = await supabase
          .from("propositions")
          .select("*, profiles(prenom, nom, societe)")
          .eq("expert_id", expertData.id)
          .order("created_at", { ascending: false });
        setPropositions(propositionsData || []);

        const { data: contratsData } = await supabase
          .from("contrats")
          .select("*")
          .eq("expert_id", expertData.id)
          .order("created_at", { ascending: false });
        setContrats(contratsData || []);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setExpert({ ...expert, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setPreviewUrl(URL.createObjectURL(file));
    setUploadingPhoto(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${expert.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("photos-experts")
      .upload(fileName, file, { upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("photos-experts")
        .getPublicUrl(fileName);

      await supabase
        .from("experts")
        .update({ photo_url: urlData.publicUrl })
        .eq("id", expert.id);

      setExpert({ ...expert, photo_url: urlData.publicUrl });
      setSuccess("Photo mise à jour !");
      setTimeout(() => setSuccess(""), 3000);
    }
    setUploadingPhoto(false);
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

    if (error) { setError("Erreur lors de la sauvegarde."); }
    else { setSuccess("Profil mis à jour !"); setTimeout(() => setSuccess(""), 3000); }
    setSaving(false);
  };

  const handleDemande = async (demandeId: string, statut: "acceptee" | "refusee") => {
    const { error } = await supabase.from("demandes").update({ statut }).eq("id", demandeId);
    if (!error) {
      setDemandes(demandes.map((d) => d.id === demandeId ? { ...d, statut } : d));
      if (statut === "acceptee") {
        const demande = demandes.find((d) => d.id === demandeId);
        if (demande?.profiles?.email) {
          await fetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "demande_acceptee",
              to: demande.profiles.email,
              data: {
                clientPrenom: demande.profiles?.prenom || "Client",
                expertPrenom: expert.prenom,
                expertNom: expert.nom,
                expertMetier: expert.metier,
              },
            }),
          });
        }
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  // Calculs CA
  const propositionsValidees = propositions.filter((p) => p.statut === "validee");
  const caTotal = propositionsValidees.reduce((sum, p) => sum + (p.duree * p.tjm), 0);
  const caParMois = propositionsValidees.reduce((acc, p) => {
    const mois = new Date(p.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    acc[mois] = (acc[mois] || 0) + (p.duree * p.tjm);
    return acc;
  }, {} as Record<string, number>);

  // Score complétude profil
  const getProfileScore = () => {
    if (!expert) return 0;
    const fields = [
      expert.prenom, expert.nom, expert.email, expert.telephone,
      expert.linkedin, expert.metier, expert.experience, expert.expertises,
      expert.localisation, expert.tjm, expert.photo_url
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
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
          <a href="/expert" className="bg-[#F8B400] text-[#0A2942] font-bold py-3 px-6 rounded-2xl hover:bg-yellow-400 transition">
            Créer mon profil expert
          </a>
        </div>
      </div>
    );
  }

  const profileScore = getProfileScore();
  const demandesEnAttente = demandes.filter((d) => d.statut === "en_attente");
  const demandesAcceptees = demandes.filter((d) => d.statut === "acceptee" || d.statut === "proposition_envoyee");
  const demandesRefusees = demandes.filter((d) => d.statut === "refusee");

  return (
    <div className="min-h-screen bg-[#f9fafb]">

      {/* HEADER */}
      <header className="bg-[#0A2942] text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="hover:opacity-80 transition">
  <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-14 w-auto" />
</a>
            <div>
              <p className="text-xs text-slate-400">Espace Expert</p>
              <p className="font-bold">{expert.prenom} {expert.nom}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              expert.visible ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"
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

      {/* STATS RAPIDES */}
      <div className="bg-[#0A2942] px-6 pb-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{demandes.length}</p>
            <p className="text-xs text-slate-400 mt-1">Demandes reçues</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{propositionsValidees.length}</p>
            <p className="text-xs text-slate-400 mt-1">Missions validées</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[#F8B400]">{caTotal.toLocaleString("fr-FR")} €</p>
            <p className="text-xs text-slate-400 mt-1">CA total plateforme</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{profileScore}%</p>
            <p className="text-xs text-slate-400 mt-1">Complétude profil</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 flex gap-6 overflow-x-auto">
          {["profil", "apercu", "demandes", "ca", "documents"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === tab ? "border-[#F8B400] text-[#0A2942]" : "border-transparent text-slate-500 hover:text-[#0A2942]"
              }`}>
              {tab === "profil" && "👤 Mon Profil"}
              {tab === "apercu" && "👁️ Aperçu client"}
              {tab === "demandes" && (
                <span className="flex items-center gap-2">
                  📬 Demandes
                  {demandesEnAttente.length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {demandesEnAttente.length}
                    </span>
                  )}
                </span>
              )}
              {tab === "ca" && "💶 Mon CA"}
              {tab === "documents" && "📄 Documents"}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ONGLET PROFIL */}
        {activeTab === "profil" && (
          <div className="space-y-6">

            {/* Score complétude */}
            {profileScore < 100 && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-blue-800">Complétude de votre profil</p>
                  <p className="text-sm font-bold text-blue-800">{profileScore}%</p>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${profileScore}%` }}></div>
                </div>
                <p className="text-xs text-blue-600 mt-2">Un profil complet augmente vos chances d'être contacté !</p>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow p-8">

              {/* Photo */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-[#F8B400] flex items-center justify-center">
                    {(previewUrl || expert.photo_url) ? (
                      <img src={previewUrl || expert.photo_url} alt={expert.prenom}
                        className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-14 h-14 text-slate-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                  <button type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-[#F8B400] text-[#0A2942] rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-yellow-400 transition shadow">
                    +
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoChange}
                    accept=".jpg,.jpeg,.png" className="hidden" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A2942]">{expert.prenom} {expert.nom}</h2>
                  <p className="text-slate-500">{expert.metier}</p>
                  <p className="text-xs text-slate-400 mt-1">📍 {expert.localisation}</p>
                  {uploadingPhoto && <p className="text-xs text-blue-600 mt-1">⏳ Upload en cours...</p>}
                </div>
              </div>

              {/* Formulaire */}
              <div className="space-y-5">
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

                <div className="grid md:grid-cols-3 gap-4">
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
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Localisation</label>
                    <input type="text" name="localisation" value={expert.localisation || ""} onChange={handleChange}
                      className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800" />
                  </div>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
                {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3">{success}</div>}

                <button onClick={handleSave} disabled={saving}
                  className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50">
                  {saving ? "Sauvegarde..." : "Sauvegarder mon profil"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET APERCU CLIENT */}
        {activeTab === "apercu" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A2942]">Aperçu de votre profil côté client</h2>
            <p className="text-slate-500 text-sm">Voici comment les clients vous voient dans le trombinoscope.</p>

            <div className="bg-white rounded-2xl shadow p-6 max-w-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-[#F8B400] overflow-hidden mb-4 flex items-center justify-center">
                {expert.photo_url ? (
                  <img src={expert.photo_url} alt={expert.prenom} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-14 h-14 text-slate-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <p className="font-bold text-[#0A2942] text-lg">{expert.prenom} {expert.nom?.charAt(0)}.</p>
              <p className="text-slate-500 mb-3">{expert.metier}</p>

              <div className="flex flex-wrap gap-1 justify-center mb-3">
                {expert.visible && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✔ Expert Vérifié</span>
                )}
                {expert.disponibilite && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🟢 Disponible</span>
                )}
                {propositionsValidees.length > 0 && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                    🏆 {propositionsValidees.length} mission{propositionsValidees.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-1">📍 {expert.localisation}</p>
              <p className="text-xs font-semibold text-[#0A2942] mb-3">💶 {expert.tjm} €/jour</p>
              <p className="text-xs text-slate-500 mb-4 line-clamp-3">{expert.expertises}</p>

              <div className="w-full bg-slate-100 text-slate-400 font-bold py-2 rounded-xl text-sm">
                🔒 Coordonnées masquées
              </div>
            </div>
          </div>
        )}

        {/* ONGLET DEMANDES */}
        {activeTab === "demandes" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0A2942]">Demandes de contact</h2>

            {demandesEnAttente.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">⏳ En attente ({demandesEnAttente.length})</h3>
                {demandesEnAttente.map((demande) => (
                  <div key={demande.id} className="bg-white rounded-2xl shadow p-6 border-l-4 border-[#F8B400]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-[#0A2942]">{demande.profiles?.prenom} {demande.profiles?.nom}</p>
                        {demande.profiles?.societe && <p className="text-xs text-slate-500">{demande.profiles.societe}</p>}
                        <p className="text-xs text-slate-400">{new Date(demande.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded-full">⏳ En attente</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                      <p className="text-sm text-slate-700">{demande.message}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleDemande(demande.id, "acceptee")}
                        className="flex-1 bg-emerald-500 text-white font-bold py-2 rounded-xl hover:bg-emerald-600 transition text-sm">
                        ✅ Accepter
                      </button>
                      <button onClick={() => handleDemande(demande.id, "refusee")}
                        className="flex-1 bg-red-100 text-red-700 font-bold py-2 rounded-xl hover:bg-red-200 transition text-sm">
                        ❌ Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {demandesAcceptees.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">✅ Acceptées ({demandesAcceptees.length})</h3>
                {demandesAcceptees.map((demande) => (
                  <div key={demande.id} className="bg-white rounded-2xl shadow p-6 border-l-4 border-emerald-400">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-[#0A2942]">{demande.profiles?.prenom} {demande.profiles?.nom}</p>
                        {demande.profiles?.societe && <p className="text-xs text-slate-500">{demande.profiles.societe}</p>}
                        <p className="text-xs text-slate-400">{new Date(demande.created_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        demande.statut === "proposition_envoyee" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {demande.statut === "proposition_envoyee" ? "📤 Proposition envoyée" : "✅ Acceptée"}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                      <p className="text-sm text-slate-600 line-clamp-2">{demande.message}</p>
                    </div>
                    {demande.statut === "acceptee" && (
                      <button onClick={() => router.push(`/expert/proposition?id=${demande.id}`)}
                        className="w-full bg-[#0A2942] text-white font-bold py-2 rounded-xl hover:bg-slate-800 transition text-sm">
                        📋 Envoyer ma proposition
                      </button>
                    )}
                    {demande.statut === "proposition_envoyee" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
                        ✅ En attente de validation client
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {demandesRefusees.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">❌ Refusées ({demandesRefusees.length})</h3>
                {demandesRefusees.map((demande) => (
                  <div key={demande.id} className="bg-white rounded-2xl shadow p-6 border-l-4 border-red-300 opacity-60">
                    <p className="font-bold text-[#0A2942]">{demande.profiles?.prenom} {demande.profiles?.nom}</p>
                    <p className="text-xs text-slate-400">{new Date(demande.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                ))}
              </div>
            )}

            {demandes.length === 0 && (
              <div className="bg-white rounded-3xl shadow p-12 text-center text-slate-400">
                <p className="text-4xl mb-4">📬</p>
                <p className="font-semibold">Aucune demande pour le moment</p>
              </div>
            )}
          </div>
        )}

        {/* ONGLET CA */}
        {activeTab === "ca" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0A2942]">Mon Chiffre d'Affaires</h2>
            <p className="text-slate-500 text-sm">Suivi de votre CA généré via ITERIUM PARTNERS — utile pour vos déclarations URSSAF et impôts.</p>

            {/* CA Global */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#0A2942] rounded-2xl p-6 text-center">
                <p className="text-xs text-slate-400 mb-1">CA Total</p>
                <p className="text-3xl font-bold text-[#F8B400]">{caTotal.toLocaleString("fr-FR")} €</p>
                <p className="text-xs text-slate-400 mt-1">depuis votre inscription</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-xs text-slate-500 mb-1">Missions validées</p>
                <p className="text-3xl font-bold text-[#0A2942]">{propositionsValidees.length}</p>
                <p className="text-xs text-slate-400 mt-1">via ITERIUM PARTNERS</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-xs text-slate-500 mb-1">TJM moyen</p>
                <p className="text-3xl font-bold text-[#0A2942]">
                  {propositionsValidees.length > 0
                    ? Math.round(propositionsValidees.reduce((sum, p) => sum + p.tjm, 0) / propositionsValidees.length).toLocaleString("fr-FR")
                    : 0} €
                </p>
                <p className="text-xs text-slate-400 mt-1">par jour</p>
              </div>
            </div>

            {/* CA par période */}
            {Object.keys(caParMois).length > 0 && (
              <div className="bg-white rounded-3xl shadow p-6">
                <h3 className="font-bold text-[#0A2942] mb-4">📅 CA par période</h3>
                <div className="space-y-3">
                  {Object.entries(caParMois).map(([mois, montant]) => (
                    <div key={mois} className="flex items-center justify-between">
                      <p className="text-sm text-slate-600 capitalize">{mois}</p>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-slate-100 rounded-full h-2">
                          <div className="bg-[#F8B400] h-2 rounded-full"
                            style={{ width: `${Math.min((montant / caTotal) * 100, 100)}%` }}></div>
                        </div>
                        <p className="text-sm font-bold text-[#0A2942] w-24 text-right">{montant.toLocaleString("fr-FR")} €</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Détail missions */}
            {propositionsValidees.length > 0 && (
              <div className="bg-white rounded-3xl shadow p-6">
                <h3 className="font-bold text-[#0A2942] mb-4">📋 Détail des missions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Client</th>
                        <th className="px-4 py-3 text-left">Domaine</th>
                        <th className="px-4 py-3 text-center">Durée</th>
                        <th className="px-4 py-3 text-center">TJM</th>
                        <th className="px-4 py-3 text-right">Montant</th>
                        <th className="px-4 py-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {propositionsValidees.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-[#0A2942]">
                            {p.profiles?.prenom} {p.profiles?.nom?.charAt(0)}.
                            {p.profiles?.societe && <span className="text-xs text-slate-400 block">{p.profiles.societe}</span>}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{p.domaine}</td>
                          <td className="px-4 py-3 text-center text-slate-600">{p.duree}j</td>
                          <td className="px-4 py-3 text-center text-slate-600">{p.tjm} €</td>
                          <td className="px-4 py-3 text-right font-bold text-[#0A2942]">
                            {(p.duree * p.tjm).toLocaleString("fr-FR")} €
                          </td>
                          <td className="px-4 py-3 text-right text-slate-400 text-xs">
                            {new Date(p.created_at).toLocaleDateString("fr-FR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#F8B400]/10">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 font-bold text-[#0A2942]">TOTAL</td>
                        <td className="px-4 py-3 text-right font-bold text-[#0A2942] text-lg">
                          {caTotal.toLocaleString("fr-FR")} €
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Export URSSAF */}
                <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-2">🧾 Pour votre déclaration URSSAF</p>
                  <p className="text-xs text-slate-500 mb-3">
                    CA total à déclarer : <strong className="text-[#0A2942]">{caTotal.toLocaleString("fr-FR")} €</strong>
                    {" "}— Cotisations estimées (~22%) : <strong className="text-red-600">{Math.round(caTotal * 0.22).toLocaleString("fr-FR")} €</strong>
                  </p>
                  <button
                    onClick={() => {
                      const csv = [
                        "Date,Client,Domaine,Durée (jours),TJM (€),Montant (€)",
                        ...propositionsValidees.map(p =>
                          `${new Date(p.created_at).toLocaleDateString("fr-FR")},${p.profiles?.prenom} ${p.profiles?.nom},${p.domaine},${p.duree},${p.tjm},${p.duree * p.tjm}`
                        ),
                        `,,,,TOTAL,${caTotal}`
                      ].join("\n");
                      const blob = new Blob([csv], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `CA_ITERIUM_${new Date().getFullYear()}.csv`;
                      a.click();
                    }}
                    className="bg-[#0A2942] text-white font-bold py-2 px-4 rounded-xl text-sm hover:bg-slate-800 transition"
                  >
                    📥 Exporter en CSV (Excel/Comptable)
                  </button>
                </div>
              </div>
            )}

            {propositionsValidees.length === 0 && (
              <div className="bg-white rounded-3xl shadow p-12 text-center text-slate-400">
                <p className="text-4xl mb-4">💶</p>
                <p className="font-semibold">Aucune mission validée pour le moment</p>
                <p className="text-sm mt-1">Votre CA apparaîtra ici dès votre première mission</p>
              </div>
            )}
          </div>
        )}

        {/* ONGLET DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A2942]">Mes documents</h2>
            {contrats.length === 0 ? (
              <div className="bg-white rounded-3xl shadow p-12 text-center text-slate-400">
                <p className="text-4xl mb-4">📄</p>
                <p className="font-semibold">Aucun document pour le moment</p>
                <p className="text-sm mt-1">Vos contrats apparaîtront ici après validation d'une mission</p>
              </div>
            ) : (
              contrats.map((contrat) => (
                <div key={contrat.id} className="bg-white rounded-2xl shadow p-6 border-l-4 border-[#0A2942]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-[#0A2942]">
                        {contrat.type === "nda" ? "🔒 NDA — Accord de confidentialité" : "📋 Contrat de mise en relation"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(contrat.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-full">✅ Généré</span>
                  </div>
                  <details className="mt-2">
                    <summary className="text-xs text-[#0A2942] font-semibold cursor-pointer hover:underline">Voir le contenu</summary>
                    <pre className="mt-3 bg-slate-50 rounded-xl p-4 text-xs text-slate-600 whitespace-pre-wrap font-mono overflow-auto max-h-64">
                      {contrat.contenu}
                    </pre>
                  </details>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400 italic">Document certifié par ITERIUM PARTNERS</p>
                    <img src="/certif/certified_stamp.png" alt="Certified" className="h-12 opacity-80" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
