import { useState } from 'react'
import { MINI_GAMES_IMAGES, DIFFICULTY_LEVELS } from '../../../constants/images'

export default function MiniGameCard({ game, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Get difficulty label
  const getDifficultyLabel = (difficultyId) => {
    const level = DIFFICULTY_LEVELS.find(l => l.id === difficultyId)
    return level ? level.label : difficultyId
  }

  const handleDelete = () => {
    onDelete()
    setShowDeleteConfirm(false)
  }

  const getGameImage = () => {
    return MINI_GAMES_IMAGES[game.gameType] || game.image || MINI_GAMES_IMAGES['digital-lock']
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative h-full flex flex-col border border-gray-100">
      {/* Game image - Optimized height */}
      <div className="relative h-40 md:h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden flex items-center justify-center">
        <img
          src={getGameImage()}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Delete button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowDeleteConfirm(true)
          }}
          className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold text-sm md:text-base shadow-lg"
          title="Supprimer ce mini-jeu"
        >
          ✕
        </button>
      </div>

      {/* Game content */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        {/* Title and description */}
        <h3 className="font-poppins font-semibold text-base md:text-lg text-black mb-2 line-clamp-2">
          {game.name}
        </h3>
        <p className="font-inter font-light text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {game.description}
        </p>

        {/* Difficulty section */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="font-inter font-semibold text-xs text-gray-700 mb-2 uppercase tracking-wide">Difficulté</p>
          <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-lg">
            <p className="font-inter font-normal text-sm text-gray-800">
              {getDifficultyLabel(game.difficulty)}
            </p>
          </div>
        </div>

        {/* Introduction text */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="font-inter font-semibold text-xs text-gray-700 mb-2 uppercase tracking-wide">Texte d'introduction</p>
          <p className="font-inter font-normal text-sm text-gray-800 bg-gray-50 rounded-lg p-3 text-center line-clamp-2">
            {game.introductionText}
          </p>
        </div>

        {/* Success/Fail pages - Display only */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="font-inter font-semibold text-xs text-gray-700 mb-3 uppercase tracking-wide">Pages de résultat</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="font-inter font-medium text-xs text-gray-600 mb-2">Réussite</p>
              <div className="bg-green-100 border border-green-300 rounded-lg py-2 text-center font-inter font-bold text-lg text-green-700">
                {game.successPage}
              </div>
            </div>
            <div className="text-center">
              <p className="font-inter font-medium text-xs text-gray-600 mb-2">Échec</p>
              <div className="bg-red-100 border border-red-300 rounded-lg py-2 text-center font-inter font-bold text-lg text-red-700">
                {game.failPage}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDeleteConfirm(true)
            }}
            className="flex-1 border-2 border-red-400 text-red-600 py-2.5 rounded-lg font-inter font-semibold text-sm hover:bg-red-50 hover:border-red-500 transition-all duration-200"
          >
            Supprimer
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="flex-1 bg-blue-400 text-white py-2.5 rounded-lg font-inter font-semibold text-sm hover:bg-blue-500 transition-all duration-200 shadow-sm"
          >
            Modifier
          </button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-sm mx-4 animate-fadeIn">
            <h3 className="text-lg font-poppins font-semibold text-black mb-2">
              Supprimer ce mini-jeu ?
            </h3>
            <p className="text-gray-600 font-inter text-sm mb-6">
              Êtes-vous sûr de vouloir supprimer "{game.name}" ? Cette action ne peut pas être annulée.
            </p>
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteConfirm(false)
                }}
                className="flex-1 border border-gray-300 text-black py-2 rounded-lg font-inter font-semibold text-sm hover:bg-gray-50 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-inter font-semibold text-sm hover:bg-red-600 transition-colors duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
