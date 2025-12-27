import { XMarkIcon } from '@heroicons/react/24/outline';

export default function LegalNoticeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50 rounded-t-3xl">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Information Importante</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h3 className="font-bold text-red-600 mb-2">Âge et Majorité Numérique</h3>
            <p>
              En Belgique, la majorité numérique est fixée à 13 ans. L'accès à Cipe Studio par un mineur de moins de 13 ans 
              exige obligatoirement l'accompagnement et le consentement d'un adulte responsable.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-800 mb-2">Risques liés à l'accès non supervisé</h3>
            <p>
              L'utilisation autonome par un enfant peut l'exposer à des thèmes narratifs ou des choix de jeu complexes. 
              Cipe Studio décline toute responsabilité en cas de fausse déclaration de l'âge au moment de l'inscription.
            </p>
          </section>

          <section className="bg-blue-50 p-4 rounded-xl border border-blue-100 italic">
            "Le respect des conditions d'utilisation est le garant d'une expérience sécurisée pour tous nos jeunes héros."
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t text-center bg-slate-50 rounded-b-3xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-transform active:scale-95"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
