export default function CircularProgress({
  total,
  processed,
  label,
  onClick,
  icon
}) {
  // Calculer les pourcentages
  const processedPercent = (processed / total) * 100;
  const unprocessedPercent = 100 - processedPercent;

  // Constantes pour le cercle SVG - utiliser viewBox pour responsive
  const size = 200;
  const center = size / 2;
  const radius = 90;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  // Calculer les dashoffsets pour créer les arcs
  // L'arc vert (traité) commence à -90° (haut du cercle)
  const processedDashoffset = circumference - (circumference * processedPercent / 100);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-[20px] w-full max-w-[328px] min-h-[220px] sm:min-h-[260px] p-4 sm:p-6 shadow-md flex flex-col items-center justify-center relative hover:shadow-lg transition-shadow"
    >
      {/* Label */}
      <p className="font-poppins text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{label}</p>

      {/* Graphique circulaire */}
      <div className="relative w-full max-w-[160px] sm:max-w-[200px] aspect-square">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Cercle rouge (non traités) - fond complet */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#dc2626"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Cercle vert (traités) - par-dessus */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#10b981"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={processedDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        {/* Nombre au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-black">
            {total}
          </span>
        </div>
      </div>

      {/* Icône d'action */}
      {icon && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <img src={icon} alt="Icon" className="w-[40px] h-[40px] sm:w-[51px] sm:h-[51px]" />
        </div>
      )}

      {/* Info au survol */}
      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-xs opacity-0 hover:opacity-100 transition-opacity px-2">
        <div className="flex items-center justify-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
          <span className="font-poppins text-gray-700">Traités: {processed}</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className="w-3 h-3 bg-red-600 rounded-full flex-shrink-0" />
          <span className="font-poppins text-gray-700">Non traités: {total - processed}</span>
        </div>
      </div>
    </button>
  );
}
