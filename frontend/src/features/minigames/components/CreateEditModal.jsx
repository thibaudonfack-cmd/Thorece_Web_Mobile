import { useState, useEffect } from 'react'
import Input from '../../../components/ui/Input'
import NumberStepper from '../../../components/ui/NumberStepper'
import { DIFFICULTY_LEVELS, MINI_GAME_TYPES, MINI_GAMES_IMAGES } from "../../../constants/images"

export default function MiniGameModal({ game, isEditMode, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gameType: 'digital-lock',
    difficulty: 'medium',
    successPage: 4,
    failPage: 9,
    introductionText: '',
    image: ''
  })

  // Initialize form with game data if editing
  useEffect(() => {
    if (game && isEditMode) {
      setFormData({
        name: game.name || '',
        description: game.description || '',
        difficulty: game.difficulty || 'medium',
        successPage: game.successPage || 8,
        failPage: game.failPage || 9,
        introductionText: game.introductionText || '',
        image: game.image || ''
      })
    }
  }, [game, isEditMode])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Page') || name.includes('difficulty') ?
        isNaN(value) ? value : parseInt(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      alert('Veuillez entrer le nom du mini-jeu')
      return
    }
    if (!formData.description.trim()) {
      alert('Veuillez entrer la description')
      return
    }
    if (!formData.introductionText.trim()) {
      alert('Veuillez entrer le texte d\'introduction')
      return
    }

    onSave(formData)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 px-6 md:px-8 py-5 md:py-6 flex items-center justify-between border-b border-blue-400 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-white">
            {isEditMode ? 'Modifier l\'épreuve' : 'Créer une nouvelle épreuve'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg w-11 h-11 flex items-center justify-center transition-colors duration-200 text-xl font-bold flex-shrink-0"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Modal content */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Game type selection (only in create mode) */}
          {!isEditMode && (
            <div>
              <label className="block text-sm font-inter font-semibold text-black mb-4">
                Sélectionnez le type de mini-jeu
              </label>
              <div className="grid grid-cols-2 gap-4">
                {MINI_GAME_TYPES.map(gameType => (
                  <button
                    key={gameType.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        gameType: gameType.id,
                        name: gameType.label,
                        description: gameType.description
                      }))
                    }}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden group ${
                      formData.gameType === gameType.id
                        ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    {/* Selected indicator */}
                    {formData.gameType === gameType.id && (
                      <div className="absolute top-2 right-2 bg-blue-400 rounded-full w-6 h-6 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-3">
                      {/* Image container */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:shadow-md transition-shadow">
                        <img
                          src={MINI_GAMES_IMAGES[gameType.id]}
                          alt={gameType.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Title */}
                      <span className="text-sm font-inter font-semibold text-center text-black line-clamp-2">
                        {gameType.label}
                      </span>

                      {/* Description */}
                      <span className="text-xs font-inter text-gray-600 text-center line-clamp-2">
                        {gameType.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-inter font-semibold text-black mb-3">
              Nom du mini-jeu <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Cadenas numérique"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-inter font-semibold text-black mb-3">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez l'objectif et le concept de cet mini-jeu..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
              rows="3"
              required
            />
          </div>

          {/* Introduction text */}
          <div>
            <label className="block text-sm font-inter font-semibold text-black mb-3">
              Texte d'introduction <span className="text-red-500">*</span>
            </label>
            <textarea
              name="introductionText"
              value={formData.introductionText}
              onChange={handleInputChange}
              placeholder="Le texte que verra l'utilisateur avant de jouer (ex: « Trouve le code du coffre »)..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
              rows="2"
              required
            />
          </div>

          {/* Difficulty level - EXCLUSIVE SELECTION */}
          <div>
            <label className="block text-sm font-inter font-semibold text-black mb-3">
              Niveau de difficulté
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTY_LEVELS.map(level => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, difficulty: level.id }))}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 font-inter font-semibold text-sm ${
                    formData.difficulty === level.id
                      ? 'border-blue-400 bg-blue-400 text-white shadow-md'
                      : 'border-gray-300 text-black hover:border-blue-300 bg-white'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Success and Fail pages - IN CREATE AND EDIT MODE */}
          <div>
            <h3 className="text-sm font-inter font-semibold text-black mb-5">
              Configuration des pages de résultat
            </h3>
            <div className="grid grid-cols-2 gap-8">
              {/* Success page */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-3xl">✅</div>
                  <label className="block text-sm font-inter font-semibold text-green-800 mb-4 text-center">
                    Page en cas de succès
                  </label>
                  <NumberStepper
                    value={formData.successPage}
                    onChange={(value) => setFormData(prev => ({ ...prev, successPage: value }))}
                    min={1}
                  />
                  <p className="text-xs font-inter text-green-700 mt-3 text-center">
                    Page affichée en cas de réussite du mini-jeu
                  </p>
                </div>
              </div>

              {/* Fail page */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-3xl">❌</div>
                  <label className="block text-sm font-inter font-semibold text-red-800 mb-4 text-center">
                    Page en cas d'échec
                  </label>
                  <NumberStepper
                    value={formData.failPage}
                    onChange={(value) => setFormData(prev => ({ ...prev, failPage: value }))}
                    min={1}
                  />
                  <p className="text-xs font-inter text-red-700 mt-3 text-center">
                    Page affichée en cas d'échec du mini-jeu
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="flex gap-3 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 md:py-4 rounded-lg font-inter font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 md:py-4 rounded-lg font-inter font-semibold hover:bg-blue-600 transition-all duration-200 shadow-md"
            >
              {isEditMode ? 'Mettre à jour' : 'Créer l\'épreuve'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
