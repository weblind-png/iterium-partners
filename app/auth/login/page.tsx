"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "expert">("login");
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
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Récupérer le paramètre redirect depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) setRedirectUrl(redirect);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Si on a un redirect ET que l'utilisateur est déjà connecté
        // On vérifie que le rôle correspond avant de rediriger
        if (redirect) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          // Vérifier que le rôle correspond au redirect demandé
          if (redirect.includes("/expert") && profile?.role === "expert") {
            router.push(redirect);
            return;
          } else if (redirect.includes("/client") && profile?.role === "client") {
            router.push(redirect);
            return;
          } else if (redirect.includes("/admin") && profile?.role === "admin") {
            router.push(redirect);
            return;
          }
          // Si le rôle ne correspond pas, on déconnecte et on reste sur la page login
          await supabase.auth.signOut();
          return;
        }
        redirectByRole(session.user.id);
      }
    };
    checkSession();
  }, []);

  const redirectByRole = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    // ✅ Si un redirect est spécifié, on l'utilise
    if (redirectUrl) {
      router.push(redirectUrl);
      return;
    }

    if (profile?.role === "admin") {
      router.push("/admin/dashboard");
    } else if (profile?.role === "expert") {
      router.push("/expert/dashboard");
    } else {
      router.push("/client/dashboard");
    }
  };

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

    await redirectByRole(data.user.id);
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

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError("Erreur lors de la création du compte : " + error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase
        .from("profiles")
        .update({
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          societe: form.societe,
          role: "client",
        })
        .eq("id", data.user.id);
    }

    setSuccess("✅ Compte créé ! Vérifiez votre email pour confirmer votre inscription, puis connectez-vous.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A2942] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        {/* Retour accueil */}
        <div className="text-center mb-4">
          <a href="/" className="text-xs text-slate-400 hover:text-[#0A2942] transition">
            ← Retour à l'accueil
          </a>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0A2942]">
            {mode === "login" && "Connexion"}
            {mode === "register" && "Créer un compte client"}
            {mode === "expert" && "Espace Expert"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {mode === "login" && "Accédez à votre espace ITERIUM PARTNERS"}
            {mode === "register" && "Rejoignez la plateforme premium"}
            {mode === "expert" && "Vous êtes un expert senior ?"}
          </p>
          {/* ✅ Message contextuel si redirect depuis email */}
          {redirectUrl && mode === "login" && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-2 text-xs text-blue-700">
              🔐 Veuillez vous connecter pour accéder à votre espace
            </div>
          )}
        </div>

        {/* Onglets */}
        <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-6">
          <button
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 text-xs font-semibold transition ${
              mode === "login" ? "bg-[#0A2942] text-white" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 text-xs font-semibold transition border-x border-slate-200 ${
              mode === "register" ? "bg-[#0A2942] text-white" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Nouveau client
          </button>
          <button
            onClick={() => { setMode("expert"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 text-xs font-semibold transition ${
              mode === "expert" ? "bg-[#F8B400] text-[#0A2942]" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Je suis expert
          </button>
        </div>

        {/* FORMULAIRE CONNEXION */}
        {mode === "login" && (
          <div className="space-y-4">
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
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white"
            />
            <div className="text-right">
              <a href="/auth/reset-password" className="text-xs text-[#0A2942] hover:text-[#F8B400]">
                Mot de passe oublié ?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        )}

        {/* FORMULAIRE INSCRIPTION CLIENT */}
        {mode === "register" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="prenom" placeholder="Prénom *"
                value={form.prenom} onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white" />
              <input type="text" name="nom" placeholder="Nom *"
                value={form.nom} onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white" />
            </div>
            <input type="text" name="societe" placeholder="Société (optionnel)"
              value={form.societe} onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white" />
            <input type="email" name="email" placeholder="Email professionnel *"
              value={form.email} onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white" />
            <input type="password" name="password" placeholder="Mot de passe * (8 caractères min)"
              value={form.password} onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 bg-white" />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3">{success}</div>
            )}

            <button onClick={handleRegister} disabled={loading}
              className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50">
              {loading ? "Création..." : "Créer mon compte client"}
            </button>

            <p className="text-xs text-slate-400 text-center">
              En créant un compte, vous acceptez nos{" "}
              <a href="/legal/conditions" className="underline hover:text-[#0A2942]">CGU</a>{" "}
              et notre{" "}
              <a href="/privacy" className="underline hover:text-[#0A2942]">politique de confidentialité</a>.
            </p>
          </div>
        )}

        {/* ESPACE EXPERT */}
        {mode === "expert" && (
          <div className="space-y-4 text-center">
            <div className="bg-slate-50 rounded-2xl p-6">
              <p className="text-4xl mb-3">🏅</p>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                Vous êtes un expert senior et souhaitez rejoindre le réseau ITERIUM PARTNERS ?
                L'inscription est <strong>gratuite</strong> et votre profil sera validé par nos équipes.
              </p>
              <a href="/expert"
                className="block w-full bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition text-sm">
                Rejoindre le réseau d'experts →
              </a>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500 mb-3">Déjà inscrit comme expert ? Connectez-vous ici :</p>
              <button onClick={() => setMode("login")}
                className="w-full border border-[#0A2942] text-[#0A2942] font-bold py-2 rounded-2xl hover:bg-slate-50 transition text-sm">
                Se connecter
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
