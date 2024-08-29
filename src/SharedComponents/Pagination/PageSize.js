import React from 'react';

function PageSize({ pageSize, onPageSizeChange }) {
  return (
    <div>
      <label>
        Page Size:
        <select value={pageSize} onChange={onPageSizeChange} style={{ marginLeft: '5px' }}>
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </label>
    </div>
  );
}

export default PageSize;
