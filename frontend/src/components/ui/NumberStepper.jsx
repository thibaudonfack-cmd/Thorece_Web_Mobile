export default function NumberStepper({ value, onChange, min = 1, max = 100, label }) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {label && (
        <label className="text-sm font-inter font-semibold text-black mb-3 text-center w-full">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg p-2 shadow-sm hover:border-gray-400 transition-colors duration-200">
        {/* Decrement button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-blue-600 hover:text-white hover:bg-blue-500 disabled:text-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-200 font-bold text-base rounded-md"
          title="Diminuer"
          aria-label="Diminuer"
        >
          −
        </button>

        {/* Number input */}
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-14 md:w-16 text-center font-inter font-bold text-xl md:text-2xl text-black border-none outline-none bg-white rounded-md shadow-sm"
          aria-label={label}
        />

        {/* Increment button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-blue-600 hover:text-white hover:bg-blue-500 disabled:text-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-200 font-bold text-base rounded-md"
          title="Augmenter"
          aria-label="Augmenter"
        >
          +
        </button>
      </div>
    </div>
  )
}
