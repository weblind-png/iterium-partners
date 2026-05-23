import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Échanger le code contre une session
    await supabase.auth.exchangeCodeForSession(code);

    // Récupérer l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Récupérer son rôle
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      // Rediriger selon le rôle
      if (profile?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", requestUrl.origin));
      } else if (profile?.role === "expert") {
        return NextResponse.redirect(new URL("/expert/dashboard", requestUrl.origin));
      } else if (profile?.role === "client") {
        return NextResponse.redirect(new URL("/client/dashboard", requestUrl.origin));
      }
    }
  }

  // Par défaut rediriger vers la page de connexion
  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
}
