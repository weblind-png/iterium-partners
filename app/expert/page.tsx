"use client";

import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ExpertPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    telephone: "",
    linkedin: "",
    metier: "",
    experience: "",
    expertises: "",
    localisation: "",
    tjm: "",
  });

  const [interventionChoices, setInterventionChoices] = useState({
    teletravail: false,
    hybride: false,
    surSite: false,
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setInterventionChoices({
      ...interventionChoices,
      [e.target.name]: e.target.checked,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGoogleConnect = () => {
    setIsGoogleConnected(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.password || form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    try {
      const selectedInterventions = Object.keys(interventionChoices)
        .filter((key) => interventionChoices[key])
        .map((key) => {
          if (key === "teletravail") return "Télétravail";
          if (key === "hybride") return "Hybride";
          if (key === "surSite") return "Sur site";
          return key;
        })
        .join(", ");

      // 1. Créer le compte Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) {
        setError("Erreur création compte : " + authError.message);
        setLoading(false);
        return;
      }

      // 2. Upload photo si présente
      let photoUrl = null;
      if (photoFile && authData.user) {
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${authData.user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("photos-experts")
          .upload(fileName, photoFile, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("photos-experts")
            .getPublicUrl(fileName);
          photoUrl = urlData.publicUrl;
        }
      }

      // 3. Mettre à jour le profil avec rôle expert
      if (authData.user) {
        await supabase
          .from("profiles")
          .update({
            role: "expert",
            prenom: form.prenom,
            nom: form.nom,
            email: form.email,
          })
          .eq("id", authData.user.id);
      }

      // 4. Insérer dans la table experts
      const { error: expertError } = await supabase.from("experts").insert([{
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        linkedin: form.linkedin,
        metier: form.metier,
        experience: form.experience,
        expertises: form.expertises,
        localisation: form.localisation,
        tjm: form.tjm,
        disponibilite: selectedInterventions,
        photo_url: photoUrl,
        cv_url: null,
        visible: false,
      }]);

      if (expertError) {
        setError("Erreur lors de l'enregistrement du profil.");
        setLoading(false);
        return;
      }

      setSuccess("✅ Votre candidature a bien été envoyée ! Vérifiez votre email pour confirmer votre compte, puis connectez-vous.");
      setForm({
        prenom: "", nom: "", email: "", password: "",
        telephone: "", linkedin: "", metier: "",
        experience: "", expertises: "", localisation: "", tjm: "",
      });
      setInterventionChoices({ teletravail: false, hybride: false, surSite: false });
      setPhotoFile(null);
      setPreviewUrl(null);
      setIsGoogleConnected(false);

    } catch (err) {
      console.error(err);
      setError("Erreur serveur. Veuillez réessayer.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A2942] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Rejoindre le Cercle ITERIUM PARTNERS
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            ITERIUM PARTNERS met en relation des PME, ETI et grands groupes
            avec des experts seniors immédiatement disponibles pour des missions
            stratégiques, ponctuelles ou de transition.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 text-green-800 rounded-3xl p-8 text-center shadow-2xl">
            <p className="text-4xl mb-4">🎉</p>
            <p className="font-bold text-xl mb-2">Candidature envoyée !</p>
            <p className="text-sm leading-relaxed mb-6">{success}</p>
            <a href="/auth/login"
              className="inline-block bg-[#0A2942] text-white font-bold py-3 px-8 rounded-2xl hover:bg-slate-800 transition">
              Aller à la page de connexion
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}
            className="bg-white text-slate-800 rounded-3xl p-8 shadow-2xl space-y-5">

            {/* Prénom et Nom */}
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" name="prenom" placeholder="Prénom *"
                value={form.prenom} onChange={handleChange} required
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-800 placeholder-slate-400" />
              <input type="text" name="nom" placeholder="Nom *"
                value={form.nom} onChange={handleChange} required
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-800 placeholder-slate-400" />
            </div>

            <input type="email" name="email" placeholder="Email professionnel *"
              value={form.email} onChange={handleChange} required
              className="w-full border border-slate-300 rounded-xl p-4 text-slate-800 placeholder-slate-400" />

            <input type="password" name="password"
              placeholder="Choisissez un mot de passe * (8 caractères min)"
              value={form.password} onChange={handleChange} required
              className="w-full border border-slate-300 rounded-xl p-4 text-slate-800 placeholder-slate-400" />

            <input type="text" name="telephone" placeholder="Téléphone"
              value={form.telephone} onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-4 text-slate-800 placeholder-slate-400" />

            <input type="text" name="linkedin" placeholder="LinkedIn ou site professionnel"
              value={form.linkedin} onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-4 text-slate-800 placeholder-slate-400" />

            <div className="grid md:grid-cols-2 gap-4">
              <select name="localisation" value={form.localisation} onChange={handleChange} required
                className="w-full border border-slate-300 rounded-xl p-4 bg-white text-slate-800 appearance-none cursor-pointer">
                <option value="" disabled>Région principale de résidence</option>
                 <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</option>
                </optgroup>

            <textarea name="experience" placeholder="Résumé de votre parcours et expériences *"
              rows={4} value={form.experience} onChange={handleChange} required
              className="w-full border border-slate-300 rounded-xl p-4 text-slate-800 placeholder-slate-400" />

            <textarea name="expertises" placeholder="Expertises clés (SAP, Azure, NIS2, Cloud, Finance...)"
              rows={3} value={form.expertises} onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-4 text-slate-800 placeholder-slate-400" />

            <div className="grid md:grid-cols-2 gap-4">
              <select name="localisation" value={form.localisation} onChange={handleChange} required
                className="w-full border border-slate-300 rounded-xl p-4 bg-white text-slate-800 appearance-none cursor-pointer">
                <option value="" disabled>Région principale de résidence</option>
                <optgroup label="France Métropolitaine">
                  <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
                  <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
                  <option value="Bretagne">Bretagne</option>
                  <option value="Centre-Val de Loire">Centre-Val de Loire</option>
                  <option value="Corse">Corse</option>
                  <option value="Grand Est">Grand Est</option>
                  <option value="Hauts-de-France">Hauts-de-France</option>
                  <option value="Île-de-France">Île-de-France</option>
                  <option value="Normandie">Normandie</option>
                  <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
                  <option value="Occitanie">Occitanie</option>
                  <option value="Pays de la Loire">Pays de la Loire</option>
                  <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</option>
                </optgroup>
                <optgroup label="DROM-COM / International">
                  <option value="Guadeloupe">Guadeloupe</option>
                  <option value="Guyane">Guyane</option>
                  <option value="La Réunion">La Réunion</option>
                  <option value="Martinique">Martinique</option>
                  <option value="Mayotte">Mayotte</option>
                  <option value="Nouvelle-Calédonie">Nouvelle-Calédonie</option>
                  <option value="Polynésie française">Polynésie française</option>
                  <option value="Saint-Barthélemy / Saint-Martin">Saint-Barthélemy / Saint-Martin</option>
                  <option value="Saint-Pierre-et-Miquelon">Saint-Pierre-et-Miquelon</option>
                  <option value="Wallis-et-Futuna">Wallis-et-Futuna</option>
                  <option value="International / Autre">International / Étranger</option>
                </optgroup>
              </select>

              {/* Google Agenda */}
              <div className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500">Disponibilités réelles :</span>
                  <span className="text-xs text-slate-600 mt-0.5">
                    {isGoogleConnected ? "🟢 Agenda Synchronisé" : "Synchroniser mon calendrier"}
                  </span>
                </div>
                <button type="button" onClick={handleGoogleConnect}
                  className={`text-xs font-bold py-2 px-3 rounded-lg transition flex items-center gap-2 ${
                    isGoogleConnected
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
                  }`}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"/>
                  </svg>
                  {isGoogleConnected ? "Connecté" : "Connecter Google"}
                </button>
              </div>

              <input type="text" name="tjm" placeholder="TJM indicatif (€ / jour)"
                value={form.tjm} onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-800 placeholder-slate-400" />

              <div className="border border-slate-300 rounded-xl p-4 flex flex-col justify-center space-y-2">
                <span className="text-sm font-semibold text-slate-500 mb-1 block">Mode d'intervention souhaité :</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
                  {[
                    { name: "teletravail", label: "Télétravail" },
                    { name: "hybride", label: "Hybride" },
                    { name: "surSite", label: "Sur site" },
                  ].map(({ name, label }) => (
                    <label key={name} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" name={name}
                        checked={interventionChoices[name]}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-[#0A2942] border-slate-300 rounded focus:ring-[#0A2942]" />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Ajouter votre Photo (Carrée & Professionnelle)
              </label>
              <div className="grid sm:grid-cols-2 gap-4 items-center">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-white rounded-xl p-4 text-center">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png" className="hidden" />
                  {previewUrl ? (
                    <div>
                      <img src={previewUrl} alt="Aperçu" className="w-20 h-20 object-cover rounded-xl mx-auto border" />
                      <button type="button" onClick={() => fileInputRef.current.click()}
                        className="mt-2 text-xs text-blue-600 font-semibold underline">Changer</button>
                    </div>
                  ) : (
                    <div>
                      <button type="button" onClick={() => fileInputRef.current.click()}
                        className="bg-[#0A2942] text-white text-sm font-bold py-2 px-4 rounded-xl hover:bg-slate-800 transition">
                        CHARGER MA PHOTO
                      </button>
                      <p className="text-[11px] text-slate-500 mt-2">Format carré uniquement (.jpg, .png)</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 overflow-hidden shrink-0">
                    <svg className="w-12 h-12 text-slate-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-0.5">Style de photo accepté :</span>
                    Gros plan professionnel, centré et cadré carré.
                  </div>
                </div>
              </div>
            </div>

            {/* Mentions RGPD */}
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
              Les informations transmises restent strictement confidentielles.
              Les entreprises clientes n'accèdent pas directement à vos coordonnées
              avant validation de la mise en relation et contractualisation via ITERIUM PARTNERS.
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-4 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50">
              {loading ? "Envoi en cours..." : "Rejoindre le réseau ITERIUM PARTNERS"}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
