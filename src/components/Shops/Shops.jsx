import React, { useState } from 'react';
import logo from "../../images/logoo.png";
import Card from '../Cards/Card';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { faPlus, faDeleteLeft,faSearch } from '@fortawesome/free-solid-svg-icons';
import Errors from '../Error/Errors';
import AccessCard from '../AccessCard/AccessCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Shops() {
    const [searchTerm, setSearchTerm] = useState(""); // State for pagination
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
    const filterdData=data?.results?.filter((shop)=>
        shop.id.toString().includes(searchTerm) || shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase())|| shop.shop_phone_number.toString().includes(searchTerm)

    

    )

    return (
        <>
                <div className={` container parent`}>

                <div className="row mb-4" style={{
                  alignItems:"center",                }}>
                    <div className="col-2">
                        <AccessCard link="/AddShop" title="Add Shop" iconProp={faPlus} BGC="var(--mainColor)" />
                    </div>
                    <div className="col-2">
                        <AccessCard link="/DeleteShop" title="Delete Shop" iconProp={faDeleteLeft} BGC="var(--thirdColor)" />
                    </div>
                    <div className="col-4 search-container p-2 " style={{  
                      display:"flex",
                      alignItems:"center",
                    }}>
                      <input 
                      
                        className="p-3 ps-4" 
                        type="search" 
                        placeholder="You can search by ID, Phone Number, or Name  " 
                        style={{
                          borderRadius:"6px",
                          outline:"none",
                          border:"1px solid var(--mainColor)",
                          width:"100%",
                          
                        }}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                      />
                        <FontAwesomeIcon icon={faSearch} className="search-icon " style={{
                          marginLeft  :"6px",
                          color:"var(--mainColor)",
                          fontSize:"22px",
                        }}/>

                    
                    </div>
                      
                </div>

                  <div style={{
                    fontSize:"24px",
                    fontWeight:"800",
                    margin:"10px 0px",
                    color:"var(--mainColor)",
                  }}>Shops ({data?.results.length})</div>

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
                    {filterdData?.length > 0 ? (
                        filterdData.map((shop) => (
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
