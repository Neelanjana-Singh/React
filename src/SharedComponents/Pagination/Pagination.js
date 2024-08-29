import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div>
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ marginRight: '5px' }}
      >
        Previous
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          disabled={totalPages === 0}
          style={{ fontWeight: number === currentPage ? 'bold' : 'normal', marginRight: '5px' }}
        >
          {number}
        </button>
      ))}
      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;

