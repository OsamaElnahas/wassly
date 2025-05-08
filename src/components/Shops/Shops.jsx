import React, { useState } from 'react';
import logo from "../../images/3998266.webp";
import Card from '../Cards/Card';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { faPlus, faDeleteLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import Errors from '../Error/Errors';
import AccessCard from '../AccessCard/AccessCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Shops() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusTerm, setStatusTerm] = useState("All");
    const [page, setPage] = useState(1);
    const pageSize = 12;

    async function getShops() {
        try {
            const res = await axios.get("https://wassally.onrender.com/api/shops/", {
                headers: { Authorization: "Token " + localStorage.getItem("token") },
                params: { page, page_size: pageSize },
            });
            return res.data?.data || [];
        } catch (error) {
            throw error;
        }
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["shop", page],
        queryFn: getShops,
        keepPreviousData: true,
    });
    console.log(data?.results);
    
    if (isLoading) return <Loader />;
    if (isError) return <Errors errorMessage={error.response ? `Error: ${error.message}` : "No Internet Connection"} />;

    const filteredData = data?.results?.filter((shop) =>
        (statusTerm === "All" || shop.status === statusTerm) &&
        (shop.id.toString().includes(searchTerm) ||
            shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shop.shop_phone_number.toString().includes(searchTerm))
    );

    return (
        <div className="container d-flex flex-column align-items-center">
            <div className="row g-0 mb-4 align-items-center w-100" style={{ maxWidth: "1200px" }}>
                <div className='col-md-6 col-lg-3 col-sm-6 col-12'>
                    <AccessCard link="/AddShop" title="Add Shop" iconProp={faPlus} BGC="var(--mainColor)" />
                </div>
            </div>
            
            
            <div className="row align-items-center mb-4 gx-0 w-100 justify-content-between" style={{ maxWidth: "1200px" }}>
               
                <div className="d-flex flex-wrap align-items-center gap-3 col-lg-7 col-12  mb-3">
                    <div className='fs-5' style={{ color: "var(--mainColor)" }}>Filter by </div>
                    {["All", "Online", "Offline"].map((status) => (
                        <div key={status} className="form-check">
                            <input className="form-check-input" type="radio" name="status" id={status} value={status} onChange={(e) => setStatusTerm(e.target.value)} checked={statusTerm === status} />
                            <label className="form-check-label" htmlFor={status} style={{ color: "var(--mainColor)" }}>{status}</label>
                        </div>
                    ))}
                </div>
                <div className="col-lg-5 col-12">
                    <div className="search-container d-flex align-items-center gap-2 border p-1 px-2 rounded bg-white">
                        <FontAwesomeIcon icon={faSearch}  style={{ color: "var(--mainColor)", fontSize: "20px" }} />
                        <input className='w-100 border-0 p-1 outline-hidden'
                         type="search" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} style={{ outline: 'none' }}/>
                    </div>
                </div>
            </div>
            <div className="row align-items-center mb-4 gx-0 w-100" style={{ maxWidth: "1200px" }}>
                <div className='col-md-2 col-12' style={{ fontWeight: "800", color: "var(--mainColor)", marginBottom: "8px" }}>
                    Shops ({data?.results.length})
                </div>
                </div>

            <div className="row g-3 w-100" style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {filteredData?.length > 0 ? (
                    filteredData.map((shop) => (
                        <div className="col-lg-2  col-6 px-1" key={shop.id}>
                            <Card image={shop.shop_image_url? shop.shop_image_url: logo} title={shop.shop_name} description={shop.shop_description} offer={shop.has_offer} id={shop.id} status={shop.status} />
                        </div>
                    ))
                ) : (
                    <p className="text-center w-100" style={{ fontSize: "32px", fontWeight: "600", color: "var(--mainColor)" }}>No Items Found.</p>
                )}
            </div>
            

            <div className="pagination-controls mt-4 d-flex justify-content-center align-items-center gap-3" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
                <button 
                    className='btn btn-outline-primary' 
                    style={{
                        width: "120px",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "2px solid var(--mainColor)",
                        color: "var(--mainColor)",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                    }}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "var(--mainColor)",
                    minWidth: "100px",
                    textAlign: "center"
                }}>
                    Page {page}
                </span>
                <button 
                    className='btn btn-outline-primary' 
                    style={{
                        width: "120px",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "2px solid var(--mainColor)",
                        color: "var(--mainColor)",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                    }}
                    onClick={() => setPage((prev) => prev + 1)} 
                    disabled={!data?.next || data.results.length < pageSize}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
