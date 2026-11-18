import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-drone-gray text-white rounded-lg disabled:opacity-50 hover:bg-drone-dark transition-colors"
      >
        <i className="fas fa-chevron-left text-xs"></i>
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-4 py-2 bg-drone-gray text-white rounded-lg hover:bg-drone-dark">1</button>
          {startPage > 2 && <span className="text-gray-500">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            page === currentPage
              ? 'bg-drone-blue text-white'
              : 'bg-drone-gray text-white hover:bg-drone-dark'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-4 py-2 bg-drone-gray text-white rounded-lg hover:bg-drone-dark">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-drone-gray text-white rounded-lg disabled:opacity-50 hover:bg-drone-dark transition-colors"
      >
        <i className="fas fa-chevron-right text-xs"></i>
      </button>
    </div>
  );
};

export default Pagination;