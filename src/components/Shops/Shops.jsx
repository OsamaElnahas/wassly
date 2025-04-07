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

    if (isLoading) return <Loader />;
    if (isError) return <Errors errorMessage={error.response ? `Error: ${error.message}` : "No Internet Connection"} />;

    const filteredData = data?.results?.filter((shop) =>
        (statusTerm === "All" || shop.status === statusTerm) &&
        (shop.id.toString().includes(searchTerm) ||
            shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shop.shop_phone_number.toString().includes(searchTerm))
    );

    return (
        <div className="container">
            <div className="row g-0 mb-4 align-items-center justify-content-between">
                <div className='col-md-4 col-12'>
                    <div className='row'>
                        <div className="col-6">
                            <AccessCard link="/AddShop" title="Add Shop" iconProp={faPlus} BGC="var(--mainColor)" />
                        </div>
                        
                    </div>
                </div>
            </div>
            
            <div className="row align-items-center justify-content-between mb-4 gx-0">
                <div className='col-md-2 col-12 text-md-start text-center' style={{ fontSize: "24px", fontWeight: "800", color: "var(--mainColor)", marginBottom: "8px" }}>
                    Shops ({data?.results.length})
                </div>
                <div className="d-flex flex-wrap align-items-center gap-3 col-md-4 col-12 justify-content-center">
                    <div style={{ color: "var(--mainColor)", fontSize: "21px" }}>Filter by Status</div>
                    {["All", "Online", "Offline"].map((status) => (
                        <div key={status} className="form-check">
                            <input className="form-check-input" type="radio" name="status" id={status} value={status} onChange={(e) => setStatusTerm(e.target.value)} checked={statusTerm === status} />
                            <label className="form-check-label" htmlFor={status} style={{ color: "var(--mainColor)" }}>{status}</label>
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

            <div className="row g-3">
                {filteredData?.length > 0 ? (
                    filteredData.map((shop) => (
                        <div className="col-lg-2 col-md-3 col-sm-4 col-6 px-1" key={shop.id}>
                            <Card image={shop.shop_image? shop.shop_image: logo} title={shop.shop_name} description={shop.shop_description} offer={shop.has_offer} id={shop.id} status={shop.status} />
                        </div>
                    ))
                ) : (
                    <p className="text-center w-100" style={{ fontSize: "32px", fontWeight: "600", color: "var(--mainColor)" }}>No Items Found.</p>
                )}
            </div>
            

            <div className="pagination-controls mt-4 d-flex justify-content-center gap-3">
                <button className='btn btn-outline-primary'style={{width:"100px"}} onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>Previous</button>
                <span>Page {page}</span>
                <button className='btn btn-outline-primary' style={{width:"100px"}} onClick={() => setPage((prev) => prev + 1)} disabled={!data?.next || data.results.length < pageSize}>Next</button>
            </div>
        </div>
    );
}
