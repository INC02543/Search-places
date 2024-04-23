import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'c489289b60msh6b5882cfc0e332dp1ff9a0jsn5dc596b7e814'; // Replace 'YOUR_API_KEY' with your actual API key

const SearchPlaces = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(3); // Default is 3, as per requirement

  const fetchData = async () => {
    setIsLoading(true);
    const options = {
      method: 'GET',
      url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      params: {
        countryIds: 'IN',
        namePrefix: searchTerm,
        limit: resultsPerPage,
        offset: (currentPage - 1) * resultsPerPage
      },
      headers: {
        'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
        'x-rapidapi-key': API_KEY
      }
    };

    try {
      const response = await axios.request(options);
      setSearchResults(response.data.data);
      setTotalPages(Math.ceil(response.data.metadata.totalCount / resultsPerPage));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage, resultsPerPage]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchData();
    } else if ((event.ctrlKey || event.metaKey) && event.key === '/') {
      document.getElementById('search-input').focus();
    }
  };

  const handlePaginationClick = (page) => {
    setCurrentPage(page);
  };

  const handleNextButtonClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleResultsPerPageChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setResultsPerPage(value);
    }
  };

  // Determine the start and end page numbers for pagination
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(startPage + 4, totalPages);

  return (
    <div>
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <input
          id="search-input"
          type="text"
          placeholder="Search places..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            width: '241px',
            height: '38px',
            fontSize: '16px',
            backgroundColor: searchTerm ? 'rgb(255, 255, 255)' : 'rgb(233, 236, 239)',
            borderColor: searchTerm ? '#7952b3' : 'rgb(206, 212, 218)',
            boxShadow: searchTerm ? '0 0 0 3px rgb(121 82 179 / 25%)' : 'none',
            paddingTop: '6px',
            paddingBottom: '6px',
            paddingLeft: '12px',
            paddingRight: '12px',
            borderRadius: '4px',
            border: '1px solid',
            outline: 'none',
            
          }}
        />
      </div>
      <div style={{ marginTop: '50px' }}>
        {isLoading && <div>Loading...</div>}
        {!isLoading && searchResults.length === 0 && (
          <div>No result found</div>
        )}
        {!isLoading && searchResults.length > 0 && (
          <table style={{ borderCollapse: 'collapse', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', borderBottom: '1px solid rgb(222, 226, 230)', fontWeight: 700 }}>#</th>
                <th style={{ padding: '8px', borderBottom: '1px solid rgb(222, 226, 230)', fontWeight: 700 }}>Place Name</th>
                <th style={{ padding: '8px', borderBottom: '1px solid rgb(222, 226, 230)', fontWeight: 700 }}>Country</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result, index) => (
                <tr key={result.id}>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgb(222, 226, 230)' }}>{index + 1}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgb(222, 226, 230)' }}>{result.name}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid rgb(222, 226, 230)' }}>
                    {result.country}
                    <img src={`https://countryflagsapi.com/png/${result.countryCode.toLowerCase()}`} alt={result.country} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div style={{ marginTop: '20px' }}>
          {Array.from({ length: Math.min(endPage, 5) - startPage + 1 }, (_, index) => startPage + index).map((page) => (
            <button key={page} onClick={() => handlePaginationClick(page)}>{page}</button>
          ))}
          {endPage < totalPages && <span>...</span>}
          {currentPage !== totalPages && (
            <button onClick={handleNextButtonClick}>Next</button>
          )}
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <input
          type="number"
          min="1"
          max="10"
          value={resultsPerPage}
          onChange={handleResultsPerPageChange}
          style={{
            width: '241px',
            height: '38px',
            fontSize: '16px',
            backgroundColor: searchTerm ? 'rgb(255, 255, 255)' : 'rgb(233, 236, 239)',
            borderColor: searchTerm ? '#7952b3' : 'rgb(206, 212, 218)',
            boxShadow: searchTerm ? '0 0 0 3px rgb(121 82 179 / 25%)' : 'none',
            paddingTop: '6px',
            paddingBottom: '6px',
            paddingLeft: '12px',
            paddingRight: '12px',
            borderRadius: '4px',
            border: '1px solid',
            outline: 'none'
          }}
        />
        <span style={{ fontSize: '16px', color: 'rgb(33, 37, 41)' }}>Results Per Page</span>
      </div>
    </div>
  );
};

export default SearchPlaces;
