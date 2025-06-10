import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import Errors from '../Error/Errors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch,faCartShopping, faBoxOpen, faClipboardList, faShoppingBag, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function Orders() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [hoveredIndex, setHoveredIndex] = useState(null);  

    async function getOrders() {
        try {
            const params = {};
            if (statusFilter !== "All") {
                params.status = statusFilter;
            }

            const res = await axios.get("https://wassally.onrender.com/api/orders/", {
                headers: {
                    Authorization: "Token " + localStorage.getItem("token")
                },
                params: params
            });
            return res?.data?.data;
        } catch (error) {
            throw error;
        }
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["orders", statusFilter],
        queryFn: getOrders,
    });

    const filteredData = data?.filter((order) => {
        const matchesSearch = order.receiver_phone.toString().includes(searchTerm) || order.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) || order.total_price.toString().includes(searchTerm);
        return matchesSearch;
    });

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
            <div className="d-flex align-items-center justify-content-between mb-4 gx-0 flex-wrap">
                <div className="d-flex align-items-center gap-2 flex-wrap col-lg-8 col-12 mb-3 mb-lg-0">
                    <div style={{ color: "var(--mainColor)" }}>Filter by</div>
                    {["All", "PENDING", "IN_PROGRESS", "DELIVERED", "CANCELED"].map((status) => (
                        <div key={status} className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="status"
                                id={status}
                                value={status}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                checked={statusFilter === status}
                            />
                            <label className="form-check-label" htmlFor={status} style={{ color: "var(--mainColor)" }}>
                                {status.toLowerCase().replace("_", " ")}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="col-lg-4 col-12 mb-1 mb-lg-0">
                    <div className="search-container d-flex align-items-center gap-2 border p-1 px-2 rounded bg-white">
                        <FontAwesomeIcon icon={faSearch} style={{ color: "var(--mainColor)", fontSize: "20px" }} />
                        <input
                            className='w-100 border-0 p-1'
                            type="search"
                            placeholder="Search"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ outline: 'none' }}
                        />
                    </div>
                </div>
            </div>

            <div className="fw-bold mb-3" style={{ color: "var(--mainColor)" }}>
                Orders ({filteredData?.length})
            </div>

            <div className="row g-3">
                {filteredData?.map((item, idx) => (
                    <div key={idx} className="col-12 col-lg-6">
                        <Link
                            to={`/orderDetails/${item.id}`}
                            className={`d-block order bg-white rounded p-2 h-100 text-muted`}
                            onMouseEnter={() => setHoveredIndex(idx)}  
                            onMouseLeave={() => setHoveredIndex(null)}  
                            style={{
                                transition: "all 0.3s ease",
                                transform: hoveredIndex === idx ? "scale(1.04)" : "scale(1)",
                                boxShadow: hoveredIndex === idx ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "none",
                            }}
                        >
                            <FontAwesomeIcon icon={faCartArrowDown} className=" mb-2" style={{ fontSize: "24px",
                                color: "var(--mainColor)"
                             }} />
                            <div className="d-flex align-items-center justify-content-between">
                                <div className='fw-bold'>Status</div>
                                <div className='text-warning rounded p-2'>{item.status}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className='fw-bold'>Picked</div>
                                <div className={`p-2 ${item.is_picked ? "text-success" : "text-danger"}`}>
                                    {item.is_picked ? "نعم" : "لا"}
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className='fw-bold'>Delivered</div>
                                <div className={`p-2 ${item.is_delivered ? "text-success" : "text-danger"}`}>
                                    {item.is_delivered ? "نعم" : "لا"}
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className='fw-bold'>Receiver Name</div>
                                <div className='p-2'>{item.receiver_name}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className='fw-bold'>Receiver Phone</div>
                                <div className='p-2'>{item.receiver_phone}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className='fw-bold'>Total Price</div>
                                <div className='p-2'>{item.order_price} LE</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
