import { useState } from 'react';

const EMOJI_LIST = [
  '📚', '📖', '✏️', '🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎲',
  '🏆', '🎸', '🎺', '🎻', '🎤', '🎧', '🎹', '🥁', '🎪', '🎨',
  '🌟', '⭐', '✨', '💫', '🌈', '🌸', '🌺', '🌻', '🌼', '🌷',
  '🦄', '🐉', '🦋', '🐝', '🐞', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🚀', '🛸', '🌙', '☀️', '🌍', '🔥', '💧', '🌊', '⚡', '🌀',
  '❤️', '💙', '💚', '💛', '💜', '🧡', '🖤', '🤍', '🤎', '💗'
];

export default function EmojiPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiSelect = (emoji) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-4 text-black font-poppins font-black text-lg md:text-2xl leading-[1.5] text-center focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-gray-50 transition-colors"
      >
        {value || '🎮'}
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le picker en cliquant à l'extérieur */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Popup du picker */}
          <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-[320px] max-h-[300px] overflow-y-auto">
            <div className="mb-3">
              <p className="font-poppins font-semibold text-sm text-gray-700">
                Choisir un emoji
              </p>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_LIST.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`text-2xl p-2 rounded hover:bg-blue-100 transition-colors ${
                    value === emoji ? 'bg-blue-200' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Option pour entrer un emoji personnalisé */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <input
                type="text"
                placeholder="ou tapez un emoji..."
                maxLength={2}
                className="w-full text-center text-2xl border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => handleEmojiSelect(e.target.value)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
