import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 md:px-8 py-6 mb-12 flex justify-center">
      <div className="bg-white rounded-2xl p-2 max-w-fit flex items-center gap-2 shadow-sm border border-gray-100">
        <button
          onClick={() => onPageChange(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-slate-600 hover:bg-gray-100 hover:text-blue-600'}`}
        >
          <ChevronLeftIcon className="w-5 h-5" strokeWidth={2.5} />
        </button>
        
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg font-poppins font-bold text-sm transition-all flex items-center justify-center ${
                currentPage === page ? 'bg-blue-500 text-white shadow-md transform scale-105' : 'text-slate-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-slate-600 hover:bg-gray-100 hover:text-blue-600'}`}
        >
          <ChevronRightIcon className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}