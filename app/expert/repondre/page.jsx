"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// On sépare la logique qui utilise l'URL dans un petit composant
function FormulaireExpertContent() {
  const searchParams = useSearchParams();
  // ... ici ta logique actuelle qui utilise peut-être searchParams.get('...')
  
  return (
    <div>
       {/* Remet ici tout le contenu (le return) que tu avais avant dans ce fichier */}
       <h1>Répondre à la mission</h1>
    </div>
  );
}

// Le composant principal qui exporte la page avec la protection Suspense
export default function RepondreExpertPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A2942] text-white flex items-center justify-center">Chargement du formulaire...</div>}>
      <FormulaireExpertContent />
    </Suspense>
  );
}
