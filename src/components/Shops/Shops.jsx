import React, { useState } from "react";
import market from "../../images/3998266.webp";
import Card from "../Cards/Card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Loader/Loader";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import Errors from "../Error/Errors";
import AccessCard from "../AccessCard/AccessCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { selectBaseUrl } from "../../features/api/apiSlice";

export default function Shops() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(""); // Track input for typing
  const [statusTerm, setStatusTerm] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 18;
  const baseUrl = useSelector(selectBaseUrl);

  async function getShops() {
    try {
      const params = {
        page,
        page_size: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      const res = await axios.get(`${baseUrl}api/shops/`, {
        headers: { Authorization: "Token " + localStorage.getItem("token") },
        params,
      });
      console.log("Fetched shops:", res?.data);
      return res?.data || [];
    } catch (error) {
      console.error("Error fetching shops:", error);
      throw error;
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["shops", page, searchTerm, statusTerm, pageSize],
    queryFn: getShops,
    keepPreviousData: true,
    staleTime: 1000, // Prevent rapid refetches
  });

  if (isLoading) return <Loader />;

  if (isError) {
    if (!error.response)
      return <Errors errorMessage="No Internet Connection" />;
    const status = error.response.status;
    if (status === 401 || status === 403)
      return <Errors errorMessage="Unauthorized Access" />;
    if (status === 404) return <Errors errorMessage="Not Found" />;
    if (status >= 500)
      return <Errors errorMessage="Server Error, Please Try Again;" />;
    return <Errors errorMessage={`Error: ${error.message}`} />;
  }
  const filteredData =
    data?.data.filter(
      (shop) =>
        statusTerm === "All" ||
        shop.status.toLowerCase() === statusTerm.toLowerCase()
    ) || [];

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue);
      setPage(1);
    }
  };

  return (
    <div className="px-3 px-sm-2 d-flex flex-column align-items-center justify-content-center gap-1 w-100">
      <div
        className="row g-0  align-items-center w-100 "
        style={{ maxWidth: "1400px", margin: "0 auto" }}
      >
        <div className="col-md-6 col-lg-3 col-sm-6 col-12 mb-4 ">
          <AccessCard
            link="/shops/AddShop"
            title="Add Shop"
            iconProp={faPlus}
            BGC="var(--mainColor)"
          />
        </div>
      </div>

      <div
        className="row align-items-center  gx-0 w-100 justify-content-between"
        style={{ maxWidth: "1400px" }}
      >
        <div className="d-flex flex-wrap align-items-center gap-3 col-lg-7 col-12 mb-3">
          {/* <div className="fs-5" style={{ color: 'var(--mainColor)' }}>Filter by</div> */}
          <select
            className="border-1 rounded-2 px-2 py-1 w-50"
            name="status"
            id="status"
            value={statusTerm}
            onChange={(e) => {
              setStatusTerm(e.target.value);
              setPage(1);
            }}
          >
            <option value="All" className="shadow-lg">
              All
            </option>
            <option value="Online" className="shadow-lg text-success fw-bold">
              {" "}
              Online
            </option>
            <option value="Offline" className="shadow-lg text-danger fw-bold">
              Offline
            </option>
          </select>
        </div>

        <div className="col-lg-5 col-12">
          <div className="search-container d-flex align-items-center gap-2 border p-1 px-2 rounded bg-white position-relative">
            <FontAwesomeIcon
              icon={faSearch}
              style={{ color: "var(--mainColor)", fontSize: "18px" }}
            />
            <input
              className="w-100 border-0 p-1"
              type="input"
              placeholder="Search by shop name or Shop Phone (press Enter)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ outline: "none", paddingRight: "40px" }}
            />
            {inputValue && (
              <button
                className="btn btn-sm p-0 position-absolute end-0 me-2 d-flex fs-3 text-primary  "
                onClick={() => {
                  setInputValue("");
                  setSearchTerm("");
                  setPage(1);
                }}
                style={{ color: "var(--mainColor)", fontSize: "16px" }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="row align-items-center gx-0 w-100"
        style={{ maxWidth: "1400px" }}
      >
        <div
          className="my-4"
          style={{ fontWeight: "800", color: "var(--mainColor)" }}
        >
          Shops ({data?.count || 0})
        </div>
      </div>

      <div
        className="row g-2 w-100"
        style={{ maxWidth: "1400px", margin: "0 auto" }}
      >
        {filteredData?.length > 0 ? (
          filteredData.map((shop) => (
            <div
              className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1 "
              key={shop.id}
            >
              <Card
                image={shop.shop_image_url ? shop.shop_image_url : market}
                title={shop.shop_name}
                description={shop.shop_description}
                offer={shop.has_offer}
                id={shop.id}
                status={shop.status}
              />
            </div>
          ))
        ) : (
          <p
            className="text-center w-100"
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "var(--mainColor)",
            }}
          >
            {searchTerm
              ? `No shops found for "${searchTerm}"`
              : "No shops found."}
          </p>
        )}
      </div>

      {data?.data?.length > 0 && (
        <div
          className="pagination-controls mt-4 d-flex justify-content-center align-items-center gap-3"
          style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}
        >
          <button
            className="btn btn-outline-primary"
            style={{
              width: "120px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid var(--mainColor)",
              color: "var(--mainColor)",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "var(--mainColor)",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            Page {page}
          </span>
          <button
            className="btn btn-outline-primary"
            style={{
              width: "120px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid var(--mainColor)",
              color: "var(--mainColor)",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data?.next || data?.length < pageSize}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
