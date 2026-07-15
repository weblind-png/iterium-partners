"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email) {
      setError("Veuillez saisir votre email.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://iteriumpartners.com/auth/callback?type=recovery",
    });

    if (error) {
      setError("Erreur lors de l'envoi. Vérifiez votre email.");
    } else {
      setSuccess("✅ Email envoyé ! Vérifiez votre boîte mail et cliquez sur le lien.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A2942] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0A2942]">Mot de passe oublié</h1>
          <p className="text-slate-500 text-sm mt-1">
            Saisissez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email professionnel *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReset()}
            className="w-full border border-slate-300 rounded-xl p-3 text-sm"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3">{success}</div>
          )}

          <button onClick={handleReset} disabled={loading}
            className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-3 rounded-2xl hover:bg-yellow-400 transition disabled:opacity-50">
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>

          <div className="text-center">
            <a href="/auth/login" className="text-xs text-slate-500 hover:text-[#0A2942]">
              ← Retour à la connexion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
