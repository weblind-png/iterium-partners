import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.auth.exchangeCodeForSession(code);

    // ✅ Reset password → rediriger vers update-password
    if (type === "recovery") {
      return NextResponse.redirect(new URL("/auth/update-password", requestUrl.origin));
    }

    // Connexion normale → rediriger selon le rôle
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", requestUrl.origin));
      } else if (profile?.role === "expert") {
        return NextResponse.redirect(new URL("/expert/dashboard", requestUrl.origin));
      } else if (profile?.role === "client") {
        return NextResponse.redirect(new URL("/client/dashboard", requestUrl.origin));
      }
    }
  }

  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
}
