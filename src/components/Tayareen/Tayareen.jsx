import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import AccessCard from '../AccessCard/AccessCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import Errors from '../Error/Errors';
import RechargeCoin from './ChargeCoins';

export default function Tayareen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showChargePopUp, setChargePopUp] = useState(false);
  const [selectedTayar, setSelectedTayar] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  async function getTayareen() {
    try {
      const res = await axios.get('https://wassally.onrender.com/api/drivers/', {
        headers: { Authorization: 'Token ' + localStorage.getItem('token') },
        params: { page, page_size: pageSize },
      });
      console.log(res?.data);
      return res?.data || [];
    } catch (error) {
      console.error('Error fetching tayareen:', error);
      throw error;
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tayareen', page],
    queryFn: getTayareen,
    keepPreviousData: true,
  });

  const filteredData = data?.data?.filter((tayar) => {
    const matchSearch =
      tayar.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tayar.phone_number.toString().includes(searchTerm);
    return matchSearch;
  }) || [];

  return (
    <div className="container py-4" style={{ maxWidth: '1400px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
        <div className="row g-4 w-100 justify-content-between align-items-center" style={{ maxWidth: '1200px' }}>
          <div className="col-md-6 col-lg-3 col-sm-6 col-12">
            <AccessCard link="/" title="Add Tayaar" iconProp={faUserPlus} />
          </div>
          <div className="col-lg-4 col-12 mb-1 mb-lg-0">
            <div className="search-container d-flex align-items-center gap-2 border p-1 px-2 rounded bg-white">
              <FontAwesomeIcon icon={faSearch} style={{ color: 'var(--mainColor)', fontSize: '20px' }} />
              <input
                className="w-100 border-0 p-1"
                type="search"
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ outline: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {isLoading && <Loader />}
        {isError && (
          <Errors errorMessage={error.response ? `Error: ${error.message}` : 'No Internet Connection'} />
        )}
        {filteredData.length > 0 ? (
          filteredData.map((tayar) => (
            <div className="col-sm-12 col-lg-6" key={tayar.id}>
              <div
                className="d-block bg-white rounded p-3 shadow-sm border position-relative overflow-hidden"
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
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '60px', height: '60px', backgroundColor: 'var(--mainColor)' }}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="text-white fs-3 w-100" />
                  </div>
                  <div className="flex-grow-1 overflow-hidden d-flex flex-column gap-2">
                    <div className="fw-bold text-truncate text-dark">{tayar.username}</div>
                    <div className="text-muted small">{tayar.phone_number}</div>
                    <div className="text-primary small fw-semibold">in Wassly {tayar.crew_type}</div>
                    <div className="text-muted small">Active</div>
                    <div className="d-flex align-items-center gap-3 justify-content-between">
                      <div className="text-muted small">Balance: {tayar.balance} LE</div>
                      <button
                        className="btn px-4 py-1 rounded-3 shadow-sm"
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
                        Charge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted">No Tayareen found</p>
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
          disabled={!data?.next || data?.data.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
}