import React, { useState } from 'react';
import market from '../../images/3998266.webp';
import Card from '../Cards/Card';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Errors from '../Error/Errors';
import AccessCard from '../AccessCard/AccessCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Shops() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState(''); // Track input for typing
  const [statusTerm, setStatusTerm] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  async function getShops() {
    try {
      const params = {
        page,
        page_size: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      const res = await axios.get('https://wassally.onrender.com/api/shops/', {
        headers: { Authorization: 'Token ' + localStorage.getItem('token') },
        params,
      });
      console.log('Fetched shops:', res?.data?.data);
      return res?.data?.data || [];
    } catch (error) {
      console.error('Error fetching shops:', error);
      throw error;
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['shops', page, searchTerm, statusTerm],
    queryFn: getShops,
    keepPreviousData: true,
    staleTime: 1000, // Prevent rapid refetches
  });

  if (isLoading) return <Loader />;
  if (isError)
    return <Errors message={error.response?.data?.message || error.message || 'No Internet Connection'} />;

  const filteredData = data?.filter((shop) =>
    statusTerm === 'All' || shop.status.toLowerCase() === statusTerm.toLowerCase()
  ) || [];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(inputValue);
      setPage(1);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center">
      <div className="row g-0 mb-4 align-items-center w-100" style={{ maxWidth: '1200px' }}>
        <div className="col-md-6 col-lg-3 col-sm-6 col-12">
          <AccessCard link="/AddShop" title="Add Shop" iconProp={faPlus} BGC="var(--mainColor)" />
        </div>
      </div>

      <div
        className="row align-items-center mb-4 gx-0 w-100 justify-content-between"
        style={{ maxWidth: '1200px' }}
      >
        <div className="d-flex flex-wrap align-items-center gap-3 col-lg-7 col-12 mb-3">
          <div className="fs-5" style={{ color: 'var(--mainColor)' }}>Filter by</div>
          {['All', 'Online', 'Offline'].map((status) => (
            <div key={status} className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="status"
                id={status}
                value={status}
                onChange={(e) => {
                  setStatusTerm(e.target.value);
                  setPage(1);
                }}
                checked={statusTerm === status}
              />
              <label className="form-check-label" htmlFor={status} style={{ color: 'var(--mainColor)' }}>
                {status}
              </label>
            </div>
          ))}
        </div>
        <div className="col-lg-5 col-12">
          <div className="search-container d-flex align-items-center gap-2 border p-1 px-2 rounded bg-white position-relative">
            <FontAwesomeIcon icon={faSearch} style={{ color: 'var(--mainColor)', fontSize: '18px' }} />
            <input
              className="w-100 border-0 p-1"
              type="search"
              placeholder="Search by shop name or Shop Phone (press Enter)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ outline: 'none', paddingRight: '40px' }}
            />
            {inputValue && (
              <button
                className="btn btn-sm p-0 position-absolute end-0 me-2"
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

      <div className="row align-items-center mb-4 gx-0 w-100" style={{ maxWidth: '1200px' }}>
        <div
          className="col-md-2 col-12"
          style={{ fontWeight: '800', color: 'var(--mainColor)', marginBottom: '8px' }}
        >
          Shops ({filteredData?.length || 0})
        </div>
      </div>

      <div className="row g-3 w-100" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {filteredData?.length > 0 ? (
          filteredData.map((shop) => (
            <div className="col-lg-2 col-md-4 col-sm-6 col-12 px-1" key={shop.id}>
              <Card
                image={shop.shop_image_url ? shop.shop_image_url : market}
                title={shop.shop_name}
                description={shop.shop_description}
                offer={shop.has_offer}
                id={shop.id}
                status={shop.status}
              />
            </div>
          ))
        ) : (
          <p
            className="text-center w-100"
            style={{ fontSize: '16px', fontWeight: '600', color: 'var(--mainColor)' }}
          >
            {searchTerm ? `No shops found for "${searchTerm}"` : 'No shops found.'}
          </p>
        )}
      </div>

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
          disabled={!data?.next || filteredData?.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
}