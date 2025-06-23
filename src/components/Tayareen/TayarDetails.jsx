import React, { useState } from 'react';
import CardIdentifier from '../CardIdentifier/CardIdentifier';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Errors from '../Error/Errors';
import Loader from '../Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import img from '../../images/user.png';
import { faMoneyBillWave, faMotorcycle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RechargeCoin from './ChargeCoins';

export default function TayarDetails() {
  const { id } = useParams();
  const [filterTerm, setFilterTerm] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chargePopUp, setChargePopUp] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchTransactions = async () => {
    try {
      const type = filterTerm === 'All' ? '' : filterTerm.toLowerCase().replace(' ', '_');
      const params = {
        page,
        page_size: pageSize,
        user: id,
      };
      if (type) params.transaction_type = type;
      const res = await axios.get(`https://wassally.onrender.com/api/transactions/`, {
        headers: { Authorization: 'Token ' + localStorage.getItem('token') },
        params,
      });
      console.log('Fetched transactions:', res.data.data);
      return res?.data || { data: [] };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['transactions', id, filterTerm, page],
    queryFn: fetchTransactions,
    keepPreviousData: true,
  });

  const filterData = data?.data.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const dateMatch = (!start || transactionDate >= start) && (!end || transactionDate <= end);

    return dateMatch;
  }) || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  async function getTayarDetails() {
    try {
      const res = await axios.get(`https://wassally.onrender.com/api/crews/${id}/`, {
        headers: {
          Authorization: 'Token ' + localStorage.getItem('token'),
        },
      });
      console.log('Tayar Details:', res.data.data);
      return res?.data.data;
    } catch (error) {
      console.error('Error fetching Tayar details:', error);
      throw error;
    }
  }

  const { data: tayarData, isLoading: tayarIsLoading, isError: tayarIsError, error: tayarError } = useQuery({
    queryKey: ['tayarDetails', id],
    queryFn: getTayarDetails,
  });

  if (tayarIsLoading) return <Loader />;
  if (tayarIsError) return <Errors message={tayarError.message || 'Failed to load Tayar details'} />;

  const transactionStyles = {
    order_picked: { icon: faMotorcycle, color: 'text-primary' },
    balance_recharged: { icon: faMoneyBillWave, color: 'text-success' },
  };

  return (
    <>
      <CardIdentifier
        image={tayarData?.profile_image || img}
        title={tayarData?.username || 'Tayar Name'}
        phone={tayarData?.phone_number}
        type={tayarData?.crew_type}
        TayarIsActive={tayarData?.is_active}
        nationalIdFront={tayarData?.national_id_image_front || img}
        nationalIdBack={tayarData?.national_id_image_back || img}
        balance={tayarData?.balance || 0}
      />
      <hr />
      <div className="container mt-5" style={{ maxWidth: '1400px' }}>
        <div
          className="text-center fw-bold"
          style={{
            color: 'var(--mainColor, #007bff)',
            fontSize: '1.4rem',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            marginBottom: '40px',
          }}
        >
          Transactions for {tayarData?.username || 'Tayar'}
        </div>
        <button
          className="btn px-4 py-1 rounded-3 shadow-sm mb-4"
          onClick={() => {
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
        {chargePopUp && (
          <RechargeCoin
            id={id}
            username={tayarData?.username}
            onClose={() => {
              setChargePopUp(false);
            }}
          />
        )}

        {isError && <Errors message={error.message || 'Failed to load transactions'} />}
        {isLoading && <Loader />}

        {/* Filter UI */}
        <div className="mb-4">
          <div className="d-flex flex-wrap align-items-center gap-3 col-lg-7 col-12 mb-3">
            <div className="fs-5" style={{ color: 'var(--mainColor, #007bff)' }}></div>
            {['All', 'Order Picked', 'Balance Recharged'].map((status) => (
              <div key={status} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  id={status}
                  value={status}
                  onChange={(e) => {
                    setFilterTerm(e.target.value);
                  }}
                  checked={filterTerm === status}
                />
                <label className="form-check-label" htmlFor={status} style={{ color: 'var(--mainColor, #007bff)' }}>
                  {status}
                </label>
              </div>
            ))}
          </div>
          <div className="d-flex flex-wrap align-items-center gap-3 col-lg-7 col-12">
            <div className="fs-5" style={{ color: 'var(--mainColor, #007bff)' }}></div>
            <div>
              <label htmlFor="startDate" className="form-label me-2">From:</label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                style={{ display: 'inline-block', width: 'auto' }}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="form-label me-2">To:</label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                style={{ display: 'inline-block', width: 'auto' }}
              />
            </div>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setFilterTerm('All');
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Transactions Table (Large Screens) */}
        <div className="d-none d-md-block card shadow-sm mb-4 border-0">
          <div className="card-body p-0">
            <table className="table table-hover mb-0 rounded-3 overflow-hidden">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3">Type</th>
                  <th scope="col" className="px-4 py-3">Amount</th>
                  <th scope="col" className="px-4 py-3">Details</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filterData?.length > 0 ? (
                  filterData?.map((transaction, index) => (
                    <tr key={index} className="align-middle">
                      <td className="px-4 py-3">
                        <FontAwesomeIcon
                          icon={transactionStyles[transaction?.transaction_type]?.icon || faMoneyBillWave}
                          className={transactionStyles[transaction?.transaction_type]?.color || 'text-secondary'}
                          size="lg"
                        />
                        {transaction.transaction_type.replace('_', ' ') === 'order picked' ? (
                          <Link to={`/orderDetails/${transaction.order_id}`} className="ms-2 text-capitalize">
                            {transaction.transaction_type.replace('_', ' ')}
                          </Link>
                        ) : (
                          <span className="ms-2 text-capitalize">
                            {transaction.transaction_type.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">{transaction.amount} LE</td>
                      <td className="px-4 py-3">{transaction.details || 'N/A'}</td>
                      <td className="px-4 py-3">{formatDate(transaction.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      {isLoading ? <Loader /> : 'No transactions found'}
                    </td>
                  </tr>
                )}
              </tbody>
              {filterData?.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                          disabled={page === 1}
                          style={{
                            width: '100px',
                            padding: '5px',
                            borderRadius: '8px',
                            border: '2px solid var(--mainColor, #007bff)',
                            color: 'var(--mainColor, #007bff)',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Previous
                        </button>
                        <span className="fw-bold" style={{ color: 'var(--mainColor, #007bff)' }}>
                          Page {page}
                        </span>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setPage((prev) => prev + 1)}
                          disabled={!data?.next}
                          style={{
                            width: '100px',
                            padding: '4px',
                            borderRadius: '8px',
                            border: '2px solid var(--mainColor, #007bff)',
                            color: 'var(--mainColor, #007bff)',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Transactions (Smaller Screens) */}
        <div className="d-md-none row g-3">
          {filterData?.length > 0 ? (
            filterData.map((transaction, index) => (
              <div key={index} className="col-12">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon
                        icon={transactionStyles[transaction?.transaction_type]?.icon || faMoneyBillWave}
                        className={transactionStyles[transaction?.transaction_type]?.color || 'text-secondary'}
                        size="lg"
                      />
                      <h6 className="mb-0 text-capitalize">
                        {transaction.transaction_type.replace('_', ' ')}
                      </h6>
                    </div>
                    <div className="text-muted small">
                      <strong>Amount:</strong> {transaction.amount} LE
                    </div>
                    <div className="text-muted small">
                      <strong>Details:</strong> {transaction.details || 'N/A'}
                    </div>
                    <div className="text-muted small">
                      <strong>Date:</strong> {formatDate(transaction.date)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center text-muted py-4">
                {isLoading ? <Loader /> : 'No transactions found'}
              </div>
            </div>
          )}

          {/* Pagination for Smaller Screens */}
          {filterData?.length > 0 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button
                className="btn btn-outline-primary"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                style={{
                  width: '100px',
                  padding: '4px',
                  borderRadius: '8px',
                  border: '2px solid var(--mainColor, #007bff)',
                  color: 'var(--mainColor, #007bff)',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                Previous
              </button>
              <span className="fw-bold" style={{ color: 'var(--mainColor, #007bff)' }}>
                Page {page}
              </span>
              <button
                className="btn btn-outline-primary"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!data?.next}
                style={{
                  width: '100px',
                  padding: '4px',
                  borderRadius: '8px',
                  border: '2px solid var(--mainColor, #007bff)',
                  color: 'var(--mainColor, #007bff)',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}