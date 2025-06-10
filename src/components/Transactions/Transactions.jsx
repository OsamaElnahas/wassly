import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faTruck, faExclamationTriangle, faMotorcycle } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Transaction.module.css'; // Custom CSS for additional styling
import Loader from '../Loader/Loader';
import Errors from '../Error/Errors';

export default function Transactions() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch transactions using useQuery
  const fetchTransactions = async () => {
    try {
      const res = await axios.get('https://wassally.onrender.com/api/transactions/', {
        headers: { Authorization: 'Token ' + localStorage.getItem('token') },
        params: { page, page_size: pageSize },
      });
      console.log(res?.data);
      return res?.data || { data: [] };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['transactions', page],
    queryFn: fetchTransactions,
    keepPreviousData: true,
  });

  const transactionStyles = {
    order_picked: { icon: faMotorcycle, color: 'text-primary' },
    balance_charged: { icon: faMoneyBillWave, color: 'text-success' },
    warning_fine: { icon: faExclamationTriangle, color: 'text-danger' },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="container" style={{ maxWidth: '1400px' }}>
      <h2 className="mb-4 text-center fw-bold" style={{ color: 'var(--mainColor, #007bff)' }}>
        Transactions
      </h2>

      {isLoading && <Loader/>}
      {isError && <Errors message={error.message || 'Failed to load transactions'} />}

      {/* Transactions Table (Visible on md and larger screens) */}
      <div className="d-none d-md-block card shadow-sm mb-4">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Amount</th>
                <th scope="col" className="px-4 py-3">Details</th>
                <th scope="col" className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.length > 0 ? (
                data.data.map((transaction, index) => (
                  <tr key={index} className="align-middle">
                    <td className="px-4 py-3">
                      <FontAwesomeIcon
                        icon={transactionStyles[transaction.transaction_type]?.icon}
                        className={transactionStyles[transaction.transaction_type]?.color}
                        size="lg"
                      />
                      <span className="ms-2 text-capitalize">
                        {transaction.transaction_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">{transaction.amount} LE</td>
                    <td className="px-4 py-3">{transaction.details || 'N/A'}</td>
                    <td className="px-4 py-3">{formatDate(transaction.date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions Cards (Visible on sm and smaller screens) */}
      <div className="d-md-none row g-3">
        {data?.data?.length > 0 ? (
          data.data.map((transaction, index) => (
            <div key={index} className="col-12">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon
                      icon={transactionStyles[transaction.transaction_type]?.icon}
                      className={transactionStyles[transaction.transaction_type]?.color}
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
            <p className="text-center text-muted py-4">No transactions found</p>
          </div>
        )}
      </div>

      {data?.data?.length > 0 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="fw-bold" style={{ color: 'var(--mainColor, #007bff)' }}>
            Page {page}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data?.next || data?.data.length < pageSize}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}