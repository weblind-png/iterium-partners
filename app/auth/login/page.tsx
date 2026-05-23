"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    prenom: "",
    nom: "",
    societe: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    // Récupérer le rôle de l'utilisateur
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "admin") {
      router.push("/admin/dashboard");
    } else if (profile?.role === "expert") {
      router.push("/expert/dashboard");
    } else if (profile?.role === "client") {
      router.push("/client/dashboard");
    } else {
      router.push("/");
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    if (!form.email || !form.password || !form.prenom || !form.nom) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    // Créer le compte Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError("Erreur lors de la création du compte : " + error.message);
      setLoading(false);
      return;
    }

    // Créer le profil dans la table profiles
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert([{
        id: data.user.id,
        role: "client",
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        societe: form.societe,
      }]);

      if (profileError) {
        setError("Erreur lors de la création du profil.");
        setLoading(false);
        return;
      }
    }

    setSuccess("Compte créé ! Vérifiez votre email pour confirmer votre inscription.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A2942] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0A2942]">
            {mode === "login" ? "Connexion" : "Créer un compte client"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {mode === "login"
              ? "Accédez à votre espace ITERIUM PARTNERS"
              : "Rejoignez la plateforme premium"}
          </p>
        </div>

        {/* Onglets */}
        <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-6">
          <button
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-[#0A2942] text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              mode === "register"
                ? "bg-[#0A2942] text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Nouveau client
          </button>
        </div>

        {/* Formulaire */}
        <div className="space-y-4">

          {mode === "register" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom *"
                  value={form.prenom}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white"
                />
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom *"
                  value={form.nom}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white"
                />
              </div>
              <input
                type="text"
                name="societe"
                placeholder="Société (optionnel)"
                value={form.societe}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email professionnel *"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe *"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white"
          />

          {mode === "login" && (
            <div className="text-right">
              <a href="/auth/reset-password" className="text-xs text-[#0A2942] hover:text-[#F8B400]">
                Mot de passe oublié ?
              </a>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3">
              {success}
            </div>
          )}

          {/* Bouton */}
          <button
            onClick={mode === "login" ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading
              ? "Chargement..."
              : mode === "login"
              ? "Se connecter"
              : "Créer mon compte"}
          </button>

          {/* Séparateur expert */}
          <div className="border-t border-slate-200 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Vous êtes un expert ?{" "}
              <a href="/expert" className="text-[#0A2942] font-semibold hover:text-[#F8B400]">
                Rejoindre le réseau →
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
