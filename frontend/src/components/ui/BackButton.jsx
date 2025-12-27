import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function BackButton({ onClick, label = "Retour" }) {
  return (
    <button
      onClick={onClick}
      className="group bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg px-4 py-2 hover:bg-blue-50/30 transition-all duration-300 font-poppins font-semibold text-base md:text-lg text-black hover:text-blue-500 shadow-sm hover:shadow-md hover:-translate-x-2 flex items-center gap-2"
    >
      <ChevronLeftIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
      <span className="inline-block transition-transform duration-300 group-hover:scale-105">
        {label}
      </span>
    </button>
  );
}