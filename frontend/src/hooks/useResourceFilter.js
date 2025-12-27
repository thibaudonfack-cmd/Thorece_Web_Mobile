import { useState, useMemo, useEffect } from 'react';

export const useResourceFilter = (data = [], config = { keys: ['title'], itemsPerPage: 8 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => setCurrentPage(1), [searchQuery]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter(item => 
      config.keys.some(key => {
        const value = item[key];
        if (Array.isArray(value)) return value.some(v => String(v).toLowerCase().includes(lowerQuery));
        return value && String(value).toLowerCase().includes(lowerQuery);
      })
    );
  }, [data, searchQuery, config.keys]);

  const totalPages = Math.ceil(filteredData.length / config.itemsPerPage);
  const startIndex = (currentPage - 1) * config.itemsPerPage;

  return {
    searchQuery,
    setSearchQuery,
    paginatedData: filteredData.slice(startIndex, startIndex + config.itemsPerPage),
    currentPage,
    setCurrentPage,
    totalPages,
    isEmpty: filteredData.length === 0 && searchQuery !== ''
  };
};