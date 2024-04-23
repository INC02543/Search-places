import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchPlaces.css";

const SearchPlaces = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(3); 

  const fetchData = async () => {
    setIsLoading(true);
    const options = {
      method: "GET",
      url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
      params: {
        countryIds: "IN",
        namePrefix: searchTerm,
        limit: resultsPerPage,
        offset: (currentPage - 1) * resultsPerPage,
      },
      headers: {
        "x-rapidapi-host": import.meta.REACT_APP_API_URL,
        "x-rapidapi-key": import.meta.env.REACT_APP_API_KEY,
      },
    };

    try {
      const response = await axios.request(options);
      setSearchResults(response.data.data);
      setTotalPages(
        Math.ceil(response.data.metadata.totalCount / resultsPerPage)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ currentPage, resultsPerPage]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        document.getElementById('search-input').focus();
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
  
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
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



  return (
    <div className="container">
      <div className="search-container">
      
  <input
    id="search-input"
    type="text"
    placeholder="Search places..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={handleKeyPress}
    className="search-input"
  />
  <div className="keyboard-shortcut">Ctrl + /</div>


      </div>
      <div className="table-container">
      {isLoading && <div className="loader-container"><div className="loader"></div></div>}
        {!isLoading && searchResults.length === 0 && <div>No result found</div>}
        {!isLoading && searchResults.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Place Name</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result, index) => (
                <tr key={result.id}>
                  <td>{index + 1}</td>
                  <td>{result.name}</td>
                  <td>
                    <div className="country-info">
                      <span>{result.country}</span>
                      <img
                        src={`https://flagsapi.com/${result.countryCode.toUpperCase()}/flat/24.png`}
                        alt={result.country}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="footer-container">
        {totalPages > 1 && (
          <div className="pagination-container">
            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, index) => index + 1
            ).map((page) => (
              <button key={page} onClick={() => handlePaginationClick(page)}>
                {page}
              </button>
            ))}
            {totalPages > 5 && <span>...</span>}
            {currentPage !== totalPages && (
              <button onClick={() => handlePaginationClick(currentPage + 1)}>
                Next
              </button>
            )}
          </div>
        )}
        <div className="results-per-page-container">
          <input
            type="number"
            min="1"
            max="10"
            value={resultsPerPage}
            onChange={(e) => setResultsPerPage(e.target.value)}
            className="results-per-page"
          />
          <span>Results Per Page</span>
        </div>
      </div>
    </div>
  );
};

export default SearchPlaces;
