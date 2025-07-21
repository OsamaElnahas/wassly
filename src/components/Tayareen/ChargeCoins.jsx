import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CheckStatus from '../Checker';
import { faArrowCircleRight, faCoins, faMoneyBill, faMoneyBill1Wave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { selectBaseUrl } from '../../features/api/apiSlice';

const RechargeCoin = ({ id, username, onClose }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const baseUrl = useSelector(selectBaseUrl);

  const validateAmount = (value) => {
    const amountValue = parseFloat(value);
    if (!value) return 'Amount is required';
    if (isNaN(amountValue) || amountValue <= 0) {
      return 'Please enter a valid positive number (e.g., 12.5)';
    }
    return '';
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setError(validateAmount(value));
  };

  const rechargeMutation = useMutation({
    mutationFn: async () => {
      const amountValue = parseFloat(amount);
      const res = await axios.post(
        `${baseUrl}api/crews/recharge/${id}/`,
        { amount: amountValue },
        {
          headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
          },
        }
      );
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tayareen']);
    },
    onError: (err) => {
      setError(err.message || 'An error occurred during recharge');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error && amount) {
      rechargeMutation.mutate();
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
      style={{ zIndex: 1050 }}
    >
      <div
        className="bg-white rounded-4 p-4 shadow-lg w-100 d-flex flex-column gap-5"
        style={{
          maxWidth: '700px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          className="fs-5 fw-semibold text-center d-flex flex-column align-items-center gap-1"
          style={{
            color: 'var(--mainColor)',
            marginBottom: '10px',
          }}
        >
          <p>
            Recharge {amount} EGP 
          </p>
          <p>
            <FontAwesomeIcon icon={faArrowCircleRight} /> {username}
          </p>
        </div>

        {rechargeMutation.isLoading && <CheckStatus status="loading" />}
        {rechargeMutation.isSuccess && (
          <div className="mt-3 d-flex flex-column align-items-center">
            <CheckStatus status="success" />
            <button
              onClick={onClose}
              className="btn btn-primary mt-5 fw-semibold w-50"
            >
              Close
            </button>
          </div>
        )}
        {rechargeMutation.isError && (
          <div className="mt-3 d-flex flex-column align-items-center">
            <CheckStatus status="error" />
            <div className="text-danger fw-semibold mb-3">{error}</div>
            <button
              onClick={onClose}
              className="btn btn-primary mt-3 fw-semibold w-50"
            >
              Close
            </button>
          </div>
        )}
        {!rechargeMutation.isLoading && !rechargeMutation.isSuccess && !rechargeMutation.isError && (
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <input
              type="text"
              placeholder="Enter amount (e.g., 12.5)"
              className="p-2 w-100 rounded-3 outline-0 border-1"
              value={amount}
              onChange={handleAmountChange}
            />
            {error && <div className="text-danger fw-semibold">{error}</div>}
            <div className="d-flex justify-content-center gap-3 mt-5">
              <button
                type="submit"
                className="btn btn-primary w-50 fw-semibold"
                disabled={rechargeMutation.isLoading || error || !amount}
                style={{ backgroundColor: 'var(--mainColor)' }}
              >
                {rechargeMutation.isLoading ? 'Submitting...' : 'Confirm'}
              </button>
              <button
                onClick={onClose}
                className="btn btn-danger w-50 fw-semibold"
                disabled={rechargeMutation.isLoading}
              >
                Close
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RechargeCoin;