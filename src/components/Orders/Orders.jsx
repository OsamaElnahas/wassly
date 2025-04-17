import React, { useState } from 'react';
import styles from "./Orders.module.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import Errors from '../Error/Errors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Orders() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    async function getOrders() {
        try {
            const params = {};
            if (statusFilter !== "All") {
                params.status = statusFilter; // Only send status if it's not "All"
            }

            const res = await axios.get("https://wassally.onrender.com/api/orders/", {
                headers: {
                    Authorization: "Token " + localStorage.getItem("token")
                },
                params: params 
            });
            console.log(res?.data);
            return res?.data?.data;
        } catch (error) {
            console.error("Error fetching data", error);
            throw error;
        }
    }
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["orders", statusFilter], 
        queryFn: getOrders,
    });

    const filteredData = data?.filter((order) => {
        const matchesSearch = order.id.toString().includes(searchTerm) || order.order_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });
    if (isError) {
        if (!error.response) {
            return <Errors errorMessage="No Internet Connection" />;
        }

        const status = error.response.status;

        if (status === 401 || status === 403) {
            return <Errors errorMessage="Unauthorized Access" />;
        }

        if (status === 404) {
            return <Errors errorMessage="Not Found" />;
        }

        if (status >= 500) {
            return <Errors errorMessage="Server Error, Please Try Again;" />;
        }

        return <Errors errorMessage={`Error: ${error.message}`} />;
    }

    if (isLoading) return <Loader />;

    return (
        <div className="container">
            <div className="d-flex align-items-center justify-content-between mb-4 gx-0 flex-wrap">
                <div className={styles.ordersLength}>Orders ({filteredData?.length})</div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <div style={{ color: "var(--mainColor)", fontSize: "21px" }}>Filter by Status</div>
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
                                {status.replace("_", " ")}
                            </label>
                        </div>
                    ))}
                </div>
               <div className="col-md-4 col-12">
                                   <div className="search-container d-flex align-items-center border p-2 rounded" style={{ borderColor: "var(--mainColor)" }}>
                                       <input className="form-control border-0" type="search" placeholder="Search by ID, Phone Number, or Name" onChange={(e) => setSearchTerm(e.target.value)} />
                                       <FontAwesomeIcon icon={faSearch} className="ms-2" style={{ color: "var(--mainColor)", fontSize: "22px" }} />
                                   </div>
                               </div>
                  
            </div>
            <div className={`${styles.orders} row mb-1 gx-0`}>
                {filteredData?.length > 0 ? (
                    filteredData.map((order) => (
                    <div className="col-md-6 col-sm-12 g-2" key={order.id}>
                            <Link className={`${styles.order} d-block`} to={`/orderDetails/${order.id}`}>
                                <div className="row">
                                    <div className=" col-6">
                                        <div className="title">Name: {order.order_name}</div>
                                        <div className={styles.id}>ID: {order.id}</div>
                                        <div className={styles.totalprice}>Total Price: {order.total_price} LE</div>
                                    </div>
                                    <div className=" col-6">
                                        <div className={styles.status}>Status: {order.status}</div>
                                        <div className={styles.delevired}>Delivered: {order.is_delivered?.toString()}</div>
                                        <div className={styles.picked}>Picked: {order.is_picked?.toString()}</div>
                                    </div>
                                    <div className={`col-12 ${styles.details}`}>
                                        <div className={styles.location}>Location : {order.location.address}</div>
                                        <div className={styles.date}>Date : {order.order_date}</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: "center", padding: "12px", fontSize: "24px", fontWeight: "600", color: "var(--mainColor)" }}>
                        No orders found.
                    </p>
                )}
            </div>
        </div>
    );
}