import { useState } from 'react'
import NumberStepper from '../../../components/ui/NumberStepper'
import { MINI_GAME_TYPES, MINI_GAMES_IMAGES, DIFFICULTY_LEVELS } from "../../../constants/images"

export default function ModifierMiniJeuModal({ miniGame, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: miniGame.name || '',
    description: miniGame.description || '',
    introductionText: miniGame.introductionText || '',
    difficulty: miniGame.difficulty || 'easy',
    successPage: miniGame.successPage || 8,
    failPage: miniGame.failPage || 9
  })

  const [activeTab, setActiveTab] = useState('general')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNumberChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const gameType = MINI_GAME_TYPES.find(t => t.id === miniGame.gameType)

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 px-6 md:px-8 py-6 flex items-center justify-between border-b sticky top-0">
          <div className="flex items-center gap-4">
            <img
              src={MINI_GAMES_IMAGES[miniGame.gameType]}
              alt={miniGame.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl md:text-2xl font-poppins font-bold text-white">
                Modifier l'épreuve
              </h2>
              <p className="text-blue-100 text-sm font-inter">{miniGame.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center transition-colors duration-200"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 sticky top-20">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 px-4 font-inter font-semibold text-center transition-all duration-200 ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Général
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`flex-1 py-3 px-4 font-inter font-semibold text-center transition-all duration-200 ${
              activeTab === 'pages'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pages Succès/Échec
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Type info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-inter text-gray-600 mb-2">Type d'épreuve</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={MINI_GAMES_IMAGES[miniGame.gameType]}
                      alt={miniGame.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="font-inter font-semibold text-black">
                      {gameType?.label}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-inter font-semibold text-black mb-2">
                    Nom de l'épreuve
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-inter font-semibold text-black mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                    rows="3"
                  />
                </div>

                {/* Introduction text */}
                <div>
                  <label className="block text-sm font-inter font-semibold text-black mb-2">
                    Texte d'introduction
                  </label>
                  <textarea
                    name="introductionText"
                    value={formData.introductionText}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                    rows="2"
                  />
                </div>

                {/* Difficulty - Exclusive selection */}
                <div>
                  <label className="block text-sm font-inter font-semibold text-black mb-3">
                    Niveau de difficulté
                  </label>
                  <div className="flex gap-2">
                    {DIFFICULTY_LEVELS.map(level => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => handleNumberChange('difficulty', level.id)}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 font-inter font-semibold text-sm transition-all duration-200 ${
                          formData.difficulty === level.id
                            ? 'border-blue-400 bg-blue-400 text-white shadow-md'
                            : 'border-gray-300 bg-white text-black hover:border-blue-300'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PAGES TAB */}
            {activeTab === 'pages' && (
              <div className="space-y-8">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-6">
                  <p className="text-sm font-inter text-gray-700">
                    💡 Définissez les numéros de pages que l'enfant verra en cas de succès ou d'échec de l'épreuve.
                  </p>
                </div>

                {/* Success page */}
                <div className="flex items-center justify-between p-6 bg-green-50 rounded-xl border-2 border-green-200">
                  <div>
                    <h3 className="text-lg font-inter font-semibold text-black mb-1">
                      Page en cas de succès ✓
                    </h3>
                    <p className="text-sm text-gray-600 font-poppins">
                      L'enfant verra cette page après avoir réussi l'épreuve
                    </p>
                  </div>
                  <NumberStepper
                    value={formData.successPage}
                    onChange={(value) => handleNumberChange('successPage', value)}
                    min={1}
                    max={100}
                  />
                </div>

                {/* Fail page */}
                <div className="flex items-center justify-between p-6 bg-red-50 rounded-xl border-2 border-red-200">
                  <div>
                    <h3 className="text-lg font-inter font-semibold text-black mb-1">
                      Page en cas d'échec ✗
                    </h3>
                    <p className="text-sm text-gray-600 font-poppins">
                      L'enfant verra cette page après avoir échoué l'épreuve
                    </p>
                  </div>
                  <NumberStepper
                    value={formData.failPage}
                    onChange={(value) => handleNumberChange('failPage', value)}
                    min={1}
                    max={100}
                  />
                </div>
              </div>
            )}
          </form>
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
            onClick={handleSubmit}
            className="flex-1 bg-blue-400 text-neutral-100 py-3 rounded-lg font-inter font-semibold hover:bg-blue-500 transition-colors duration-200 font-bold"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  )
}
