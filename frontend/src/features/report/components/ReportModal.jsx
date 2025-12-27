import { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useCreateReport } from '../hooks/useReport';

const REASONS = [
    { value: 'VIOLENCE', label: 'Violence ou contenu choquant' },
    { value: 'CONTENU_INAPPROPRIE', label: 'Contenu inapproprié pour enfants' },
    { value: 'LANGAGE_OFFENSANT', label: 'Langage grossier ou offensant' },
    { value: 'HARCELEMENT', label: 'Harcèlement ou intimidation' },
    { value: 'AUTRE', label: 'Autre problème' }
];

export default function ReportModal({ isOpen, onClose, bookId, bookTitle }) {
    const [reason, setReason] = useState(REASONS[0].value);
    const [description, setDescription] = useState('');

    const createReportMutation = useCreateReport();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createReportMutation.mutateAsync({
                bookId,
                reason,
                description
            });

            alert("Merci ! Votre signalement a été envoyé aux administrateurs.");
            onClose();
            setDescription('');
            setReason(REASONS[0].value);

        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

                <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
                    <h3 className="font-poppins font-bold text-lg text-red-600 flex items-center gap-2">
                        <ExclamationTriangleIcon className="w-6 h-6" />
                        Signaler ce livre
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors text-red-400"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <p className="font-inter text-sm text-gray-600">
                        Vous souhaitez signaler le livre <span className="font-bold text-gray-800">"{bookTitle}"</span>.
                        Ce signalement sera traité par nos modérateurs.
                    </p>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Motif du signalement</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 bg-white font-inter text-sm"
                        >
                            {REASONS.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Détails (Optionnel)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[100px] resize-none font-inter text-sm"
                            placeholder="Décrivez le problème rencontré (numéro de page, contexte...)"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={createReportMutation.isPending}
                            className="w-full py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                        >
                            {createReportMutation.isPending ? (
                                <span>Envoi en cours...</span>
                            ) : (
                                <span>Envoyer le signalement</span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={createReportMutation.isPending}
                            className="w-full mt-3 py-3 text-gray-500 font-medium hover:text-gray-700 text-sm"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}