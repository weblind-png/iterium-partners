import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { demandeId, type } = await request.json();

    if (!demandeId || !type) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    // Récupérer la demande avec les infos client et expert
    const { data: demande, error: demandeError } = await supabase
      .from("demandes")
      .select(`
        *,
        experts(prenom, nom, email, metier, telephone, localisation, tjm),
        profiles(prenom, nom, email, societe)
      `)
      .eq("id", demandeId)
      .single();

    if (demandeError || !demande) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    const date = new Date().toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric"
    });

    let contenu = "";

    if (type === "nda") {
      contenu = `
ACCORD DE CONFIDENTIALITÉ (NDA)
================================
Date : ${date}

ENTRE :
- ${demande.profiles?.prenom} ${demande.profiles?.nom}
  ${demande.profiles?.societe ? `Société : ${demande.profiles.societe}` : ""}
  Email : ${demande.profiles?.email}
  Ci-après dénommé "LE CLIENT"

ET :
- ${demande.experts?.prenom} ${demande.experts?.nom}
  Fonction : ${demande.experts?.metier}
  Email : ${demande.experts?.email}
  Ci-après dénommé "L'EXPERT"

OBJET :
Les parties s'engagent à maintenir strictement confidentielle toute information 
échangée dans le cadre de leur collaboration via la plateforme ITERIUM PARTNERS.

OBLIGATIONS :
1. Chaque partie s'engage à ne pas divulguer les informations confidentielles 
   reçues de l'autre partie à des tiers sans consentement écrit préalable.
2. Les informations confidentielles comprennent : données techniques, commerciales,
   financières, stratégiques et tout document échangé dans le cadre de la mission.
3. Cet accord est valable pendant toute la durée de la mission et 2 ans après 
   sa conclusion.

EXCEPTIONS :
Ne sont pas considérées comme confidentielles les informations déjà connues du 
public ou obtenues légalement d'un tiers.

DROIT APPLICABLE :
Le présent accord est soumis au droit français. Tout litige relève de la 
compétence des tribunaux de Beauvais.

Fait à Paris, le ${date}

LE CLIENT : ${demande.profiles?.prenom} ${demande.profiles?.nom}
L'EXPERT : ${demande.experts?.prenom} ${demande.experts?.nom}

--- Document généré automatiquement par ITERIUM PARTNERS ---
      `.trim();
    }

    if (type === "mise_en_relation") {
      contenu = `
CONTRAT DE MISE EN RELATION
============================
Date : ${date}
Référence : MER-${Date.now()}

PARTIES :

ITERIUM PARTNERS (Tiers de confiance)
BLIND ERIC - Entrepreneur Individuel
SIRET : 522 800 226 00030
174 Rue du Pont Courtin, 60430 PONCHON
Email : contact@itriumconseil.com

LE CLIENT :
- ${demande.profiles?.prenom} ${demande.profiles?.nom}
  ${demande.profiles?.societe ? `Société : ${demande.profiles.societe}` : ""}
  Email : ${demande.profiles?.email}

L'EXPERT :
- ${demande.experts?.prenom} ${demande.experts?.nom}
  Fonction : ${demande.experts?.metier}
  Localisation : ${demande.experts?.localisation}
  TJM : ${demande.experts?.tjm} €/jour
  Email : ${demande.experts?.email}

OBJET DE LA MISSION :
${demande.message}

CONDITIONS GÉNÉRALES :

1. RÔLE D'ITERIUM PARTNERS
   ITERIUM PARTNERS agit exclusivement en tant qu'intermédiaire numérique entre 
   le Client et l'Expert. ITERIUM PARTNERS n'est ni employeur, ni donneur d'ordre,
   ni sous-traitant de l'Expert.

2. OBLIGATIONS DU CLIENT
   Le Client s'engage à définir clairement les besoins de la mission et à régler 
   directement l'Expert selon les conditions convenues entre eux.

3. OBLIGATIONS DE L'EXPERT
   L'Expert s'engage à réaliser la prestation avec professionnalisme et à respecter 
   les engagements de confidentialité (NDA) signé avec le Client.

4. CONFIDENTIALITÉ
   Les deux parties s'engagent à respecter l'accord de confidentialité (NDA) 
   signé préalablement via la plateforme ITERIUM PARTNERS.

5. RGPD
   Les données personnelles échangées dans le cadre de cette mission sont traitées 
   conformément au RGPD (Règlement UE 2016/679). Chaque partie est responsable 
   du traitement de ses propres données.

6. RESPONSABILITÉ
   ITERIUM PARTNERS ne peut être tenu responsable de l'exécution ou de la 
   non-exécution de la prestation entre Client et Expert.

7. DROIT APPLICABLE
   Le présent contrat est soumis au droit français. Tout litige relève de la 
   compétence exclusive des tribunaux de Beauvais (Oise).

Fait à Paris, le ${date}

LE CLIENT : ${demande.profiles?.prenom} ${demande.profiles?.nom}
L'EXPERT : ${demande.experts?.prenom} ${demande.experts?.nom}
ITERIUM PARTNERS : Eric BLIND

--- Document généré automatiquement par ITERIUM PARTNERS ---
--- Cet accord constitue un engagement juridique entre les parties ---
      `.trim();
    }

    // Sauvegarder le contrat dans Supabase
    const { data: contrat, error: contratError } = await supabase
      .from("contrats")
      .insert([{
        demande_id: demandeId,
        expert_id: demande.expert_id,
        client_id: demande.client_id,
        type,
        statut: "genere",
        contenu,
      }])
      .select()
      .single();

    if (contratError) {
      return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({ contrat });

  } catch (error: any) {
    console.error("Erreur génération contrat:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
