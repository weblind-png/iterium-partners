import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { type, to, data } = await request.json();

    let subject = "";
    let html = "";

    switch (type) {

      // 1. Expert reçoit une demande client
      case "nouvelle_demande":
        subject = "🔔 Nouvelle demande de mise en relation — ITERIUM PARTNERS";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0A2942; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px;">ITERIUM PARTNERS</h1>
              <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">Plateforme IA B2B de mise en relation experts & entreprises</p>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #0A2942;">Bonjour ${data.expertPrenom},</h2>
              <p style="color: #475569;">Un client souhaite vous contacter pour une mission :</p>
              <div style="background: white; border-left: 4px solid #F8B400; padding: 15px; margin: 20px 0; border-radius: 8px;">
                <p style="margin: 0 0 8px;"><strong>Client :</strong> ${data.clientPrenom} ${data.clientNom}</p>
                ${data.clientSociete ? `<p style="margin: 0 0 8px;"><strong>Société :</strong> ${data.clientSociete}</p>` : ""}
                <p style="margin: 0;"><strong>Message :</strong> ${data.message}</p>
              </div>
              <p style="color: #475569;">Connectez-vous à votre espace pour accepter ou refuser cette demande :</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?redirect=/expert/dashboard" 
                   style="background: #F8B400; color: #0A2942; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Voir la demande →
                </a>
              </div>
            </div>
            <div style="background: #0A2942; padding: 15px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ITERIUM PARTNERS — contact@iteriumpartners.com
              </p>
            </div>
          </div>
        `;
        break;

      // 2. Client reçoit confirmation que l'expert a accepté
      case "demande_acceptee":
        subject = "✅ Votre demande a été acceptée — ITERIUM PARTNERS";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0A2942; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px;">ITERIUM PARTNERS</h1>
              <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">Plateforme IA B2B de mise en relation experts & entreprises</p>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #0A2942;">Bonjour ${data.clientPrenom},</h2>
              <p style="color: #475569;">Bonne nouvelle ! L'expert a accepté votre demande de mise en relation.</p>
              <div style="background: white; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 8px;">
                <p style="margin: 0 0 8px;"><strong>Expert :</strong> ${data.expertPrenom} ${data.expertNom}</p>
                <p style="margin: 0;"><strong>Fonction :</strong> ${data.expertMetier}</p>
              </div>
              <p style="color: #475569;">L'expert va maintenant vous envoyer sa proposition d'intervention. Vous serez notifié dès qu'elle sera disponible.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?redirect=/client/dashboard" 
                   style="background: #F8B400; color: #0A2942; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Voir mon espace →
                </a>
              </div>
            </div>
            <div style="background: #0A2942; padding: 15px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ITERIUM PARTNERS — contact@iteriumpartners.com
              </p>
            </div>
          </div>
        `;
        break;

      // 3. Client reçoit une proposition de l'expert
      case "nouvelle_proposition":
        subject = "📋 Nouvelle proposition d'intervention — ITERIUM PARTNERS";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0A2942; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px;">ITERIUM PARTNERS</h1>
              <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">Plateforme IA B2B de mise en relation experts & entreprises</p>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #0A2942;">Bonjour ${data.clientPrenom},</h2>
              <p style="color: #475569;">L'expert vous a envoyé une proposition d'intervention :</p>
              <div style="background: white; border-left: 4px solid #0A2942; padding: 15px; margin: 20px 0; border-radius: 8px;">
                <p style="margin: 0 0 8px;"><strong>Expert :</strong> ${data.expertPrenom} ${data.expertNom}</p>
                <p style="margin: 0 0 8px;"><strong>Domaine :</strong> ${data.domaine}</p>
                <p style="margin: 0 0 8px;"><strong>Durée :</strong> ${data.duree} jour(s)</p>
                <p style="margin: 0 0 8px;"><strong>TJM :</strong> ${data.tjm} €/jour</p>
                <p style="margin: 0;"><strong>Montant total :</strong> <span style="color: #F8B400; font-weight: bold;">${data.montantTotal} €</span></p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?redirect=/client/dashboard" 
                   style="background: #F8B400; color: #0A2942; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Voir la proposition →
                </a>
              </div>
            </div>
            <div style="background: #0A2942; padding: 15px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ITERIUM PARTNERS — contact@iteriumpartners.com
              </p>
            </div>
          </div>
        `;
        break;

      // 4. Expert reçoit confirmation que le client a validé la proposition
      case "proposition_validee":
        subject = "🎉 Votre proposition a été validée — ITERIUM PARTNERS";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0A2942; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px;">ITERIUM PARTNERS</h1>
              <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">Plateforme IA B2B de mise en relation experts & entreprises</p>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #0A2942;">Bonjour ${data.expertPrenom},</h2>
              <p style="color: #475569;">Excellente nouvelle ! Le client a validé votre proposition d'intervention.</p>
              <div style="background: white; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 8px;">
                <p style="margin: 0 0 8px;"><strong>Client :</strong> ${data.clientPrenom} ${data.clientNom}</p>
                ${data.clientSociete ? `<p style="margin: 0 0 8px;"><strong>Société :</strong> ${data.clientSociete}</p>` : ""}
                <p style="margin: 0 0 8px;"><strong>Mission :</strong> ${data.domaine}</p>
                <p style="margin: 0 0 8px;"><strong>Durée :</strong> ${data.duree} jour(s)</p>
                <p style="margin: 0;"><strong>Montant :</strong> <span style="color: #F8B400; font-weight: bold;">${data.montantTotal} €</span></p>
              </div>
              <p style="color: #475569;">Les contrats NDA et de mise en relation ont été générés automatiquement. La mission peut démarrer !</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?redirect=/expert/dashboard" 
                   style="background: #F8B400; color: #0A2942; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Voir mon espace →
                </a>
              </div>
            </div>
            <div style="background: #0A2942; padding: 15px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ITERIUM PARTNERS — contact@iteriumpartners.com
              </p>
            </div>
          </div>
        `;
        break;

      default:
        return NextResponse.json({ error: "Type de notification inconnu" }, { status: 400 });
    }

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "ITERIUM PARTNERS <contact@iteriumpartners.com>",
      to,
      subject,
      html,
    });

    if (resendError) {
      console.error("Resend error:", resendError);
      return NextResponse.json({ error: resendError.message }, { status: 500 });
    }

    console.log(`✅ Email ${type} envoyé à ${to} — ID: ${resendData?.id}`);
    return NextResponse.json({ success: true, id: resendData?.id });

  } catch (error: any) {
    console.error("Erreur envoi email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
