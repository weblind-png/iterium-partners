"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // ✅ Récupérer le token depuis l'URL et établir la session
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (error) {
          setError("Lien invalide ou expiré. Veuillez refaire une demande de réinitialisation.");
        } else {
          setSessionReady(true);
        }
      });
    } else {
      // Vérifier si une session existe déjà (cas callback route)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSessionReady(true);
        } else {
          setError("Lien invalide ou expiré. Veuillez refaire une demande de réinitialisation.");
        }
      });
    }
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!password || !confirm) {
      setError("Veuillez remplir les deux champs.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Erreur lors de la mise à jour. Veuillez réessayer.");
    } else {
      setSuccess("Mot de passe mis à jour avec succès !");
      await supabase.auth.signOut();
      setTimeout(() => router.push("/auth/login"), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A2942] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0A2942]">Nouveau mot de passe</h1>
          <p className="text-slate-500 text-sm mt-1">Choisissez un nouveau mot de passe sécurisé</p>
        </div>

        {error && !sessionReady ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>
            <a href="/auth/reset-password"
              className="block w-full text-center bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition">
              Refaire une demande
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <input type="password" placeholder="Nouveau mot de passe *"
              value={password} onChange={(e) => setPassword(e.target.value)}
              disabled={!sessionReady}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm disabled:bg-slate-50" />
            <input type="password" placeholder="Confirmer le mot de passe *"
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              disabled={!sessionReady}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm disabled:bg-slate-50" />
            <p className="text-xs text-slate-400">Le mot de passe doit contenir au moins 8 caractères.</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3">
                {success} Redirection en cours...
              </div>
            )}

            <button onClick={handleUpdate} disabled={loading || !sessionReady}
              className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50">
              {loading ? "Mise à jour..." : "Mettre à jour mon mot de passe"}
            </button>

            <div className="text-center">
              <a href="/auth/login" className="text-xs text-slate-500 hover:text-[#0A2942]">
                ← Retour à la connexion
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
