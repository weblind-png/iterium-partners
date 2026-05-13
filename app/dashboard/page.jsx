"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart3,
  CreditCard,
  Euro,
  CalendarDays,
  Users,
  FileText,
  TrendingUp,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    abonnements: 0,
    commissions: 0,
    paiements: 0,
    visios: 0,
    revenusTotaux: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // Simulation : données de test
    setStats({
      abonnements: 42,
      commissions: 1780,
      paiements: 9200,
      visios: 37,
      revenusTotaux: 10980,
    });

    setRecentTransactions([
      { id: "TX-001", type: "Abonnement Standard", montant: 490, client: "TechNova", date: "2025-10-26" },
      { id: "TX-002", type: "Mission (commission 10%)", montant: 120, client: "SecureOps", date: "2025-10-27" },
      { id: "TX-003", type: "Abonnement Premium Groupe", montant: 1290, client: "DataCorp", date: "2025-10-28" },
      { id: "TX-004", type: "Mission (commission 10%)", montant: 200, client: "GreenSoft", date: "2025-10-29" },
    ]);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="ITERIUM PARTNERS" className="h-10 w-auto" />
            <div>
              <p className="font-semibold text-[#0A2942]">Itrium Conseil</p>
              <p className="text-xs text-slate-500">Tableau de bord administrateur</p>
            </div>
          </div>
          <a href="/" className="text-sm text-slate-600 hover:text-[#0A2942]">
            Déconnexion
          </a>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#0A2942] mb-8 flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-[#F8B400]" />
          Tableau de bord global
        </h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <StatCard icon={<Users />} label="Abonnements actifs" value={stats.abonnements} />
          <StatCard icon={<Euro />} label="Commissions (€)" value={stats.commissions} />
          <StatCard icon={<CreditCard />} label="Paiements encaissés (€)" value={stats.paiements} />
          <StatCard icon={<CalendarDays />} label="Visios planifiées" value={stats.visios} />
          <StatCard icon={<TrendingUp />} label="Revenus totaux (€)" value={stats.revenusTotaux} />
        </div>

        {/* Transactions récentes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0A2942]" />
            Transactions récentes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Montant (€)</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">{tx.id}</td>
                    <td className="p-3">{tx.type}</td>
                    <td className="p-3">{tx.client}</td>
                    <td className="p-3 font-medium text-[#0A2942]">{tx.montant}</td>
                    <td className="p-3 text-slate-500">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 text-sm text-slate-500 flex items-center gap-2 justify-center">
          <ShieldCheck className="h-4 w-4 text-[#F8B400]" />
          Données simulées — connexion Stripe Dashboard à activer pour les flux réels.
        </div>
      </section>
    </main>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 flex flex-col items-center justify-center">
      <div className="text-[#0A2942] mb-1">{icon}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}