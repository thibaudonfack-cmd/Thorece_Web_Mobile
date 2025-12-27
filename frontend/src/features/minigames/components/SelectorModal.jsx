import { useState } from 'react'
import { MINI_GAMES_IMAGES } from "../../../constants/images"

export default function SelectorEpreuveModal({ epreuves, onSelect, onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEpreuves = epreuves.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = () => {
    if (selectedId) {
      const selected = epreuves.find(e => e.id === selectedId)
      if (selected) {
        onSelect(selected)
      }
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 px-6 md:px-8 py-6 flex items-center justify-between sticky top-0">
          <h2 className="text-2xl font-poppins font-bold text-white">
            Ajouter un mini-jeu
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center transition-colors duration-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-6 md:px-8 py-4 border-b bg-gray-50">
          <input
            type="text"
            placeholder="Chercher une épreuve..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-inter focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          {filteredEpreuves.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-600 font-poppins">
                {searchTerm ? 'Aucune épreuve trouvée' : 'Aucune épreuve disponible'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredEpreuves.map((epreuve) => (
                <button
                  key={epreuve.id}
                  onClick={() => setSelectedId(epreuve.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedId === epreuve.id
                      ? 'border-blue-400 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-24 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-blue-100 to-purple-100">
                    <img
                      src={MINI_GAMES_IMAGES[epreuve.gameType]}
                      alt={epreuve.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-poppins font-semibold text-black mb-1 line-clamp-2">
                    {epreuve.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 font-poppins mb-3 line-clamp-2">
                    {epreuve.description}
                  </p>

                  {/* Difficulty badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-inter font-semibold px-2 py-1 rounded-full ${
                      epreuve.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700'
                        : epreuve.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {epreuve.difficulty === 'easy' ? '📗 Facile' : epreuve.difficulty === 'medium' ? '📙 Moyen' : '📕 Difficile'}
                    </span>
                    <span className={`text-lg transition-all duration-200 ${selectedId === epreuve.id ? 'scale-125' : ''}`}>
                      {selectedId === epreuve.id ? '✅' : '○'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 p-6 md:p-8 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-black py-3 rounded-lg font-inter font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedId}
            className={`flex-1 py-3 rounded-lg font-inter font-semibold transition-colors duration-200 ${
              selectedId
                ? 'bg-blue-400 text-neutral-100 hover:bg-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Ajouter le mini-jeu
          </button>
        </div>
      </div>
    </div>
  )
}
