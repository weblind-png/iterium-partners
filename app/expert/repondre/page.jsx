export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 1. Crée un composant interne qui contient ta logique actuelle
function FormulaireExpert() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Ta logique actuelle

  return (
    <div>
      {/* Tout ton code HTML/JSX actuel ici */}
      <h1>Répondre à l'expertise {id}</h1>
    </div>
  );
}

// 2. Ta page principale doit juste appeler le composant dans un Suspense
export default function PageExpert() {
  return (
    <Suspense fallback={<div>Chargement du formulaire...</div>}>
      <FormulaireExpert />
    </Suspense>
  );
}