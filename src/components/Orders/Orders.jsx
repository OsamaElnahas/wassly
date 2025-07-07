import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import Errors from '../Error/Errors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCartShopping, faBoxOpen, faClipboardList, faShoppingBag, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function Orders() {
     // Track input for typing
    const [searchTerm, setSearchTerm] = useState('');
      const [inputValue, setInputValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [page, setPage] = useState(1);
  const pageSize = 6;
const getStatusClass = (status) => {
  switch (status) {
    case 'قيد الانتظار':
      return 'text-warning bg-warning bg-opacity-10'; // أصفر خفيف
    case 'قيد التنفيذ':
      return 'text-primary bg-primary bg-opacity-10'; // أزرق خفيف
    case 'قيد العمل':
      return 'text-muted bg-info bg-opacity-10'; // سماوي خفيف
    case 'تم التوصيل':
      return 'text-success bg-success bg-opacity-10'; // أخضر خفيف
    case 'ملغي':
      return 'text-danger bg-danger bg-opacity-10'; // أحمر خفيف
    default:
      return 'text-muted bg-light'; // افتراضي
  }
};

    async function getOrders() {
        try {
            const params = {
                page,
                page_size: pageSize
            };
            if (statusFilter !== 'All') {
                params.status = statusFilter;
            }
                  if (searchTerm) params.search = searchTerm;


            const res = await axios.get('https://wassally.onrender.com/api/orders/', {
                headers: {
                    Authorization: 'Token ' + localStorage.getItem('token')
                },
                params: params
            });
            console.log(res?.data);
            
            return res?.data || [];
        } catch (error) {
            console.log(error);
            
            throw error;
        }
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['orders', statusFilter,page, pageSize,searchTerm],
        queryFn: getOrders,
        keepPreviousData: true,
        // staleTime: 1000, // Prevent rapid refetches
    });



    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setSearchTerm(inputValue.trim());
        }
    };

    if (isError) {
        if (!error.response) return <Errors errorMessage="No Internet Connection" />;
        const status = error.response.status;
        if (status === 401 || status === 403) return <Errors errorMessage="Unauthorized Access" />;
        if (status === 404) return <Errors errorMessage="Not Found" />;
        if (status >= 500) return <Errors errorMessage="Server Error, Please Try Again;" />;
        return <Errors errorMessage={`Error: ${error.message}`} />;
    }

    if (isLoading) return <Loader />;

    return (
<div className="container">
  <div className="row align-items-center justify-content-between mb-4 gx-0">
    <div className="col-lg-7 col-12 mb-3 mb-lg-0">
      <div className="d-flex align-items-center gap-2 flex-wrap w-100">
        {/* <div style={{ color: 'var(--mainColor)' }}>Filter by</div> */}
        <select
          className="form-select border-1 rounded-2 px-2 py-1 w-50"
          name="status"
          id="status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {['All', 'PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELED'].map((status) => (
            <option key={status} value={status}>
              {status.toLowerCase().replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="col-lg-5 col-12 mb-1 mb-lg-0">
      <div className="search-container d-flex align-items-center gap-2 border p-1 px-2 rounded bg-white position-relative w-100">
        <FontAwesomeIcon icon={faSearch} style={{ color: 'var(--mainColor)', fontSize: '18px' }} />
        <input
          className="w-100 border-0 p-1"
          type="search"
          placeholder="Search by Receiver name or Receiver Phone (press Enter)"
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


            <div className="fw-bold mb-3" style={{ color: 'var(--mainColor)' }}>
                Orders ({data?.count || 0})
            </div>

            <div className="row g-3">
                {data?.data?.length > 0 ? (
                    data?.data.map((item, idx) => (
                        <div key={idx} className="col-12 col-lg-6">
                            <NavLink
                                to={`/orderDetails/${item.id}`}
                                className="d-block order bg-white rounded p-2 h-100 text-muted"
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{
                                    transition: 'all 0.3s ease',
                                    transform: hoveredIndex === idx ? 'scale(1.04)' : 'scale(1)',
                                    boxShadow: hoveredIndex === idx ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faCartArrowDown}
                                    className="mb-2"
                                    style={{ fontSize: '24px', color: 'var(--mainColor)' }}
                                />
                                <div className="d-flex align-items-center justify-content-between">
  <div className="fw-bold">Status</div>
  <div className={`rounded p-2 ${getStatusClass(item.status)}`}>
    {item.status}
  </div>
</div>

                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="fw-bold">Picked</div>
                                    <div className={`p-2 ${item.is_picked ? 'text-success' : 'text-danger'}`}>
                                        {item.is_picked ? 'نعم' : 'لا'}
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="fw-bold">Delivered</div>
                                    <div className={`p-2 ${item.is_delivered ? 'text-success' : 'text-danger'}`}>
                                        {item.is_delivered ? 'نعم' : 'لا'}
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="fw-bold">Receiver Name</div>
                                    <div className="p-2">{item.receiver_name}</div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="fw-bold">Receiver Phone</div>
                                    <div className="p-2">{item.receiver_phone}</div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="fw-bold">Total Price</div>
                                    <div className="p-2">{item.total_price} LE</div>
                                </div>
                            </NavLink>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center text-muted" style={{ fontSize: '16px', fontWeight: '600' }}>
                            {searchTerm ? `No orders found for "${searchTerm}"` : 'No orders found'}
                        </p>
                    </div>
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
          disabled={!data?.next || data?.length < pageSize}
        >
          Next
        </button>
      </div>
            </div>
        </div>
    );
}