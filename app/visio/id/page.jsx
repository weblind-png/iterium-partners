"use client";
import React, { useEffect, useState } from "react";
import { CalendarDays, Video, Clock, CheckCircle2, Link as LinkIcon } from "lucide-react";

export default function VisioPage({ params }) {
  const [mission, setMission] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const id = params?.id || "REQ-2025-0001";

    // Simulation : récupération des données de la mission
    setMission({
      id,
      client: "Entreprise ABC",
      expert: "Karim — Juriste RGPD / DPO",
      title: "Audit RGPD post-incident",
      duration: "2h",
      slots: [
        "Lundi 10h00 - 12h00",
        "Lundi 14h00 - 16h00",
        "Mardi 9h30 - 11h30",
        "Mardi 15h00 - 17h00",
      ],
    });
  }, [params]);

  const handleConfirm = () => {
    setTimeout(() => setConfirmed(true), 800);
  };

  if (!mission) return null;

  if (confirmed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 text-slate-800">
        <div className="text-center p-8 max-w-md">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h1 className="text-2xl font-semibold text-[#0A2942] mb-2">
            Réunion confirmée !
          </h1>
          <p className="text-slate-600 mb-4">
            Votre créneau a été validé avec <strong>{mission.expert}</strong>.  
            Le lien Teams a été envoyé aux deux parties par e-mail.
          </p>
          <div className="bg-white border rounded-2xl shadow-md p-6 text-left text-sm text-slate-700 mb-6">
            <p className="font-medium mb-2 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-[#0A2942]" /> Lien de réunion Teams
            </p>
            <p className="break-all text-[#0A2942]">
              https://teams.microsoft.com/l/meetup-join/19%3Aitrium-conseil-{mission.id}
            </p>
            <p className="mt-2 text-slate-500 text-xs">
              Ce lien est confidentiel et unique à cette mission.
            </p>
          </div>
          <a
            href="/mon-espace"
            className="inline-block bg-[#0A2942] text-white rounded-xl px-6 py-3 hover:bg-[#062032]"
          >
            Retour à mon espace
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-10 w-auto" />
            <div>
              <p className="font-semibold text-[#0A2942]">ITERIUM PARTNERS</p>
              <p className="text-xs text-slate-500">Planification visio Teams</p>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#0A2942] mb-6">
          Planifiez votre visio Teams
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Video className="h-5 w-5 text-[#0A2942]" /> Détails de la mission
          </h2>
          <p className="text-slate-700 mb-1">
            <strong>Client :</strong> {mission.client}
          </p>
          <p className="text-slate-700 mb-1">
            <strong>Expert :</strong> {mission.expert}
          </p>
          <p className="text-slate-700 mb-1">
            <strong>Mission :</strong> {mission.title}
          </p>
          <p className="text-slate-700">
            <strong>Durée prévue :</strong> {mission.duration}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#0A2942]" /> Sélectionnez un créneau
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {mission.slots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`border rounded-xl py-3 px-4 text-sm transition ${
                  selectedSlot === slot
                    ? "bg-[#0A2942] text-white"
                    : "bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Clock className="inline h-4 w-4 mr-1 text-[#F8B400]" />
                {slot}
              </button>
            ))}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedSlot}
            className="mt-6 w-full bg-[#0A2942] text-white rounded-xl py-3 text-base font-medium hover:bg-[#062032] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmer ce créneau
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Les créneaux affichés sont simulés — intégration future avec Google Calendar & Microsoft Graph.
        </div>
      </section>
    </main>
  );
}