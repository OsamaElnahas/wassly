import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faSearch, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import AccessCard from '../AccessCard/AccessCard';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import Errors from '../Error/Errors';
import RechargeCoin from './ChargeCoins';

export default function Tayareen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState(''); // Track input for typing
  const [showChargePopUp, setChargePopUp] = useState(false);
  const [selectedTayar, setSelectedTayar] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  async function getTayareen() {


    try {
      const params = {
        page,
        page_size: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      const res = await axios.get('https://wassally.onrender.com/api/crews/', {
        headers: { Authorization: 'Token ' + localStorage.getItem('token') },
        params,
      });
      console.log('Fetched Tayars:', res.data);
      return res?.data || { data: [] };
    } catch (error) {
      console.error('Error fetching Tayars:', error);
      throw error;
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['Tayareen', page, searchTerm,pageSize],
    queryFn: getTayareen,
    keepPreviousData: true,
    staleTime: 1000, // Prevent rapid refetches
  });
  
  if (isError) {
    if (!error.response) return <Errors errorMessage="No Internet Connection" />;
    const status = error.response.status;
    if (status === 401 || status === 403) return <Errors errorMessage="Unauthorized Access" />;
    if (status === 404) return <Errors errorMessage="Not Found" />;
    if (status >= 500) return <Errors errorMessage="Server Error, Please Try Again;" />;
    return <Errors errorMessage={`Error: ${error.message}`} />;
}

  // const data?.data = data?.data || [];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(inputValue.trim());
      setPage(1);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1400px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-1 flex-wrap">
        <div className="row g-4 w-100 justify-content-between align-items-center" style={{ maxWidth: '1200px' }}>
          <div className="col-md-6 col-lg-3 col-sm-6 col-12">
            <AccessCard link="/addTayaar" title="Add Tayaar" iconProp={faUserPlus} />
          </div>
          <div className="col-lg-5 col-md-6 col-12  mb-lg-0">
            <div className="search-container d-flex align-items-center gap-2 border p-1 px-2 rounded bg-white position-relative w-100">
              <FontAwesomeIcon icon={faSearch} style={{ color: 'var(--mainColor)', fontSize: '18px' }} />
              <input
                className="w-100 border-0 p-1"
                type="input"
                placeholder="Search by username or phone (press Enter)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ outline: 'none', paddingRight: '40px' }}
                
              />
              {inputValue && (
                <button
                  className="btn btn-sm p-0 position-absolute end-0 me-2 d-flex fs-3 text-primary  "
                  onClick={() => {
                    setInputValue('');
                    setSearchTerm('');
                    setPage(1);
                  }}
                  style={{ color: 'var(--mainColor)', fontSize: '16px' }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
        <div
          className="my-4"
          style={{ fontWeight: '800', color: 'var(--mainColor)', }}
        >
          Tayareen ({data?.count || 0})
        </div>

      <div className="row g-4">
        {isLoading && <Loader />}
        {isError && (
          <Errors message={error.response?.data?.message || error.message || 'No Internet Connection'} />
        )}
        {data?.data.length > 0 ? (
          data?.data.map((tayar) => (
            <div className="col-sm-12 col-lg-6" key={tayar.id}>
              <div
                className="bg-white rounded p-3 shadow-sm border position-relative overflow-hidden"
                style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <NavLink
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '70px', height: '70px', backgroundColor: 'var(--mainColor)' }}
            
                    to={`/tayareen/tayaarDetails/${tayar.id}`}
                      >
                        <FontAwesomeIcon icon={faUserCircle} className="text-white fs-1 w-100" />
                      </NavLink>
                  <div className="flex-grow-1 overflow-hidden d-flex flex-column gap-2">
                    <div className="fw-bold text-truncate text-dark">{tayar.username}</div>
                    <div className="text-muted small">{tayar.phone_number}</div>
                    <div className="text-primary small fw-semibold"> {tayar.crew_type}</div>
                    <div className="text-muted small">{tayar.is_active ? 'Active' : 'Inactive'}</div>
                    {/* <div className="d-flex align-items-center gap-3 justify-content-between"> */}
                      <div className='d-flex justify-content-between align-items-center gap-5 '>

                      <div className="text-muted small">Balance: {tayar.balance} EGP</div>
                      <button
                        className="btn px-4 py-1 rounded-3 shadow-sm  d-flex align-items-center"
                        onClick={() => {
                          setSelectedTayar({ id: tayar.id, username: tayar.username });
                          setChargePopUp(true);
                        }}
                        style={{
                          backgroundColor: 'var(--mainColor)',
                          color: 'white',
                          border: 'none',
                          transition: 'background-color 0.3s ease, transform 0.3s ease',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        <FontAwesomeIcon icon={faDollarSign} className="me-2" />
                        Charge
                      </button>
                      </div>
                      
                        </div>
                    </div>
                  </div>
                </div>
            // </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted" style={{ fontSize: '16px', fontWeight: '600' }}>
              {searchTerm ? `No Tayareen found for "${searchTerm}"` : 'No Tayareen found'}
            </p>
          </div>
        )}
      </div>

      {showChargePopUp && selectedTayar && (
        <RechargeCoin
          id={selectedTayar.id}
          username={selectedTayar.username}
          onClose={() => {
            setChargePopUp(false);
            setSelectedTayar(null);
          }}
        />
      )}

      {data?.data?.length > 0 && 
                  <div
        className="pagination-controls mt-4 d-flex justify-content-center align-items-center gap-3"
        style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
      >
        <button
          className="btn btn-outline-primary"
          style={{
            width: '120px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '2px solid var(--mainColor)',
            color: 'var(--mainColor)',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--mainColor)',
            minWidth: '100px',
            textAlign: 'center',
          }}
        >
          Page {page}
        </span>
        <button
          className="btn btn-outline-primary"
          style={{
            width: '120px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '2px solid var(--mainColor)',
            color: 'var(--mainColor)',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!data?.next || data?.length < pageSize}
        >
          Next
        </button>
      </div>}
    </div>
  );
}