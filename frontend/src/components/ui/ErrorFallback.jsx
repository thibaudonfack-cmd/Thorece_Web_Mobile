import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg p-6 font-inter">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-red-50">
        
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="font-poppins font-bold text-2xl text-slate-800 mb-3">
          Oups, une erreur est survenue
        </h2>
        
        <p className="text-slate-500 mb-8 text-sm md:text-base">
          Désolé, l'application a rencontré un problème inattendu. Nous avons été notifiés.
        </p>

        {/* Zone technique (optionnelle, utile pour le debug rapide) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg text-left text-xs font-mono mb-8 overflow-auto max-h-32">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Réessayer</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Accueil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
