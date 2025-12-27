import { useState } from 'react';
import { IMAGES } from '../../constants/images';

export default function FilterButton({ onFilterChange, filterType = 'users' }) {
  const [isOpen, setIsOpen] = useState(false);

  // Filtres par défaut selon le type de page
  const getDefaultFilters = () => {
    if (filterType === 'books') {
      return { sortBy: 'title' };
    }
    if (filterType === 'collections') {
      return { sortBy: 'title' };
    }
    if (filterType === 'reports') {
      return {
        type: 'all',
        status: 'all',
        sortBy: 'date-desc'
      };
    }
    return {
      role: 'all',
      status: 'all',
      sortBy: 'name'
    };
  };

  const [selectedFilters, setSelectedFilters] = useState(getDefaultFilters());

  const handleApplyFilters = () => {
    onFilterChange(selectedFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultFilters = getDefaultFilters();
    setSelectedFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[34px] h-[34px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
      >
        <img src={IMAGES.filterIcon} alt="Filtrer" className="w-6 h-6" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />

          {/* Filter Panel */}
          <div className="absolute right-0 top-12 w-[280px] bg-white rounded-lg shadow-lg p-4 z-50">
            <h3 className="font-poppins font-bold text-lg text-black mb-4">
              Filtres et tri
            </h3>

            {/* Type Filter - For reports */}
            {filterType === 'reports' && (
              <div className="mb-4">
                <label className="font-poppins text-sm font-medium text-gray-700 mb-2 block">
                  Type de signalement
                </label>
                <select
                  value={selectedFilters.type}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="all">Tous les types</option>
                  <option value="Violence">Violence</option>
                  <option value="Contenu inapproprié">Contenu inapproprié</option>
                  <option value="Langage inapproprié">Langage inapproprié</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            )}

            {/* Role Filter - Only for users */}
            {filterType === 'users' && (
              <div className="mb-4">
                <label className="font-poppins text-sm font-medium text-gray-700 mb-2 block">
                  Rôle
                </label>
                <select
                  value={selectedFilters.role}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="Enfant">Enfant</option>
                  <option value="Auteur">Auteur</option>
                  <option value="Éditeur">Éditeur</option>
                </select>
              </div>
            )}

            {/* Status Filter - For users and reports */}
            {(filterType === 'users' || filterType === 'reports') && (
              <div className="mb-4">
                <label className="font-poppins text-sm font-medium text-gray-700 mb-2 block">
                  Statut
                </label>
                <select
                  value={selectedFilters.status}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:border-blue-400"
                >
                  {filterType === 'users' ? (
                    <>
                      <option value="all">Tous les statuts</option>
                      <option value="active">Actif</option>
                      <option value="blocked">Bloqué</option>
                      <option value="verified">Vérifié</option>
                      <option value="pending">En attente</option>
                    </>
                  ) : (
                    <>
                      <option value="all">Tous les statuts</option>
                      <option value="Lu">Lu</option>
                      <option value="Non traité">Non traité</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Sort By */}
            <div className="mb-4">
              <label className="font-poppins text-sm font-medium text-gray-700 mb-2 block">
                Trier par
              </label>
              <select
                value={selectedFilters.sortBy}
                onChange={(e) => setSelectedFilters({ ...selectedFilters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:border-blue-400"
              >
                {filterType === 'users' ? (
                  <>
                    <option value="name">Nom (A-Z)</option>
                    <option value="name-desc">Nom (Z-A)</option>
                    <option value="date-asc">Date d'inscription (ancienne)</option>
                    <option value="date-desc">Date d'inscription (récente)</option>
                    <option value="reports">Signalements</option>
                  </>
                ) : filterType === 'books' ? (
                  <>
                    <option value="title">Titre (A-Z)</option>
                    <option value="title-desc">Titre (Z-A)</option>
                    <option value="author">Auteur (A-Z)</option>
                    <option value="reads">Lectures (+ populaire)</option>
                    <option value="reports">Signalements (+ signalé)</option>
                  </>
                ) : filterType === 'collections' ? (
                  <>
                    <option value="title">Titre (A-Z)</option>
                    <option value="title-desc">Titre (Z-A)</option>
                    <option value="books">Nombre de livres</option>
                  </>
                ) : (
                  <>
                    <option value="date-desc">Date (+ récente)</option>
                    <option value="date-asc">Date (+ ancienne)</option>
                    <option value="user">Utilisateur (A-Z)</option>
                    <option value="book">Livre (A-Z)</option>
                  </>
                )}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 font-poppins text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-3 py-2 bg-blue-400 text-white font-poppins text-sm font-medium rounded-lg hover:bg-blue-500 transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
