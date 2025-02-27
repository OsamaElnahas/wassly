import React, { useState } from 'react';
import logo from "../../images/3998266.png"
import Card from '../Cards/Card';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { faPlus, faDeleteLeft,faSearch } from '@fortawesome/free-solid-svg-icons';
import Errors from '../Error/Errors';
import AccessCard from '../AccessCard/AccessCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Shops() {
    const [searchTerm, setSearchTerm] = useState(""); // State for search
    const [statusTerm, setStatusTerm] = useState("All"); // State for filterStatus

    const [page, setPage] = useState(1); // State for pagination
    const pageSize = 12; // Number of items per page

    async function getShops() {
        try {
            const res = await axios.get("https://wassally.onrender.com/api/shops/", {
                headers: {
                    Authorization: "Token " + localStorage.getItem("token"),
                },
                params: { page, page_size: pageSize }, // Add pagination parameters
            });

            console.log(res.data, "from API");
            return res.data?.data ||[];
        } catch (error) {
            console.error("Error fetching data", error);
            throw error;
        }
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["shop", page],
        queryFn: getShops,
        keepPreviousData: true, 
    });

    if (isLoading) return <Loader />;

    if (isError) {
        if (!error.response) return <Errors errorMessage="No Internet Connection" />;
        const status = error.response.status;
        if (status === 401 || status === 403) return <Errors errorMessage="Unauthorized Access" />;
        if (status === 404) return <Errors errorMessage="Not Found" />;
        if (status >= 500) return <Errors errorMessage="Server Error, Please Try Again;" />;
        return <Errors errorMessage={`Error: ${error.message}`} />;
    }
    const filteredData = data?.results?.filter((shop) =>
      (statusTerm === "All" || shop.status === statusTerm) &&
      (shop.id.toString().includes(searchTerm) ||
          shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.shop_phone_number.toString().includes(searchTerm))
  );
  
  

    return (
        <>
                <div className={`container`}>

                <div className="row g-0 mb-4 align-items-center justify-content-between">
                  
                  <div className='col-4'>
                  <div className='row'>

                    <div className="col-6">
                        <AccessCard link="/AddShop" title="Add Shop" iconProp={faPlus} BGC="var(--mainColor)" />
                    </div>
                    <div className="col-6">
                        <AccessCard link="/DeleteShop" title="Delete Shop" iconProp={faDeleteLeft} BGC="var(--thirdColor)" />
                    </div>
                    </div>
                  </div>
                
                        
                </div>
                <div className="row align-items-center justify-content-between mb-4 gx-0">
                <div className='col-2' style={{
                            fontSize:"24px",
                            fontWeight:"800",
                            color:"var(--mainColor)",
                            marginBottom:"8px"
                          }}>Shops ({data?.results.length})</div>

                    <div className="d-flex align-items-center gap-3 col-4">
                        <div style={{ color: "var(--mainColor)", fontSize: "21px" }}>Filter by Status</div>
                        {["All", "Online", "Offline"].map((status) => (
                            <div key={status} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="status"
                                    id={status}
                                    value={status}
                                    onChange={(e) => setStatusTerm(e.target.value)}
                                    checked={statusTerm === status}
                                />
                                <label className="form-check-label" htmlFor={status} style={{ color: "var(--mainColor)" }}>
                                    {status}
                                </label>
                            </div>
                        ))}
                    </div>

                <div className="col-4 search-container" style={{  
                              display:"flex",
                              alignItems:"center",
                              border:"1px solid var(--mainColor)",
                              borderRadius:"6px",

                            }}>
                      <input 
                      
                        className="p-2" 
                        type="search" 
                        placeholder={`You can search by ID, Phone Number, or Name`}
                        style={{
                          borderRadius:"6px",
                          outline:"none",
                          width:"100%",
                          border:"none",
                          
                        }}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        
                        />
                        <FontAwesomeIcon icon={faSearch} className="search-icon " style={{
                          marginRight  :"6px",
                          color:"var(--mainColor)",
                          fontSize:"22px",
                        }}/>                      
                        </div>
                </div>
                       

                          
                            



                  <div className="row g-0">

                    {/* {data?.results?.length > 0 ? (
                      data.results.map((shop) => (
                        <div className="col-2 px-1 py-2" key={shop.id}>
                            <Card
                                image={shop.shop_image || logo}
                                title={shop.shop_name}
                                description={shop.shop_description}
                                offer={shop.has_offer}
                                key={shop.id}
                                id={shop.id}
                                />
                            </div>
                        ))
                        
                      ) : (
                        <p style={{ textAlign: "center", fontSize: "32px", fontWeight: "600", color: "var(--mainColor)" }}>
                            No Items Found.
                        </p>
                    )} */}
                    {filteredData?.length > 0 ? (
                        filteredData.map((shop) => (
                            <div className="col-2 px-1 py-2" key={shop.id}>
                                <Card
                                    image={shop.shop_image || logo}
                                    title={shop.shop_name}
                                    description={shop.shop_description}
                                    offer={shop.has_offer}
                                    key={shop.id}
                                    id={shop.id}
                                    status={shop.status}
                                />
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: "center", fontSize: "32px", fontWeight: "600", color: "var(--mainColor)" }}>
                            No Items Found.
                        </p>
                    )}
                    </div>

    

                {/* Pagination Controls */}
                <div className="pagination-controls mt-4 " style={
                  {
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    gap:"16px",
                    color:"var(--mainColor)",
                    fontSize:"18px",
                    padding:"5px"

                    
                  }
                }>
                    <button className='btn' onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} style={   {
                   
                    color:"var(--mainColor) !important",
                    fontSize:"20px",
                    border:"1px solid var(--thirdColor)",
                    width:"100px"
                    

                    
                  }}>
                        Previous
                    </button>
                    <span> Page {page} </span>
                    <button className='btn' onClick={() => setPage((prev) => prev + 1)} disabled={!data?.next|| data.results.length < pageSize} style={{
                      
                      color:"var(--mainColor) !important",
                      fontSize:"20px",
                      border:"1px solid var(--thirdColor)",
                      width:"100px",
                    

                    }}>
                        Next
                    </button>
                </div>
                      </div>
        </>
    );
}
