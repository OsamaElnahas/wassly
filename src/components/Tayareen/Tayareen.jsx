import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import AccessCard from '../AccessCard/AccessCard'
import { Link } from 'react-router-dom'

export default function Tayareen() {
  return (
    <div className="container py-4" style={{ maxWidth: "1400px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
        <div className="row g-0 w-100" style={{ maxWidth: "1200px" }}>
          <div className='col-md-6 col-lg-3 col-sm-6 col-12'>
            <AccessCard link="/AddShop" title="Add Shop" iconProp={faUserPlus} />
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-sm-12 col-md-6 col-lg-4 ">
          <Link className="d-block bg-white rounded p-3 shadow-sm border position-relative overflow-hiddend " style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "60px", height: "60px", backgroundColor: "var(--mainColor)" }}>
                <FontAwesomeIcon icon={faUserCircle} className="text-white fs-3 w-100" />
              </div>
              <div className="flex-grow-1 overflow-hidden d-flex flex-column gap-2">
                <div className="fw-bold text-truncate text-dark">osama kamal elsayed</div>
                <div className="text-muted small">01222406627</div>
                <div className="text-primary small fw-semibold">in Wassly</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
