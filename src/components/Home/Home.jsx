import React from 'react'
import styles from "./Home.module.css"
import { Link } from 'react-router-dom'
import AccessCard from '../AccessCard/AccessCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faStore, faCartShopping, faUsers, faArrowRight } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  return (
    <div className="container">
      <div className="row justify-content-center  animate__animated animate__fadeIn animate__delay-1s animate__zoomIn">
        <div className="col-12 text-center mb-5">
          <div className={styles.titleContainer}>
            <div className={styles.titleWrapper}>
              <span className={styles.welcomeText}>Welcome to</span>
              <h1 className={styles.mainTitle}>
                <span className="">Wassally</span> Dashboard
              </h1>
            </div>
            <div className={styles.titleUnderline}></div>
            <p className={styles.subTitle}>
              <span className={styles.subTitleIcon}>✨</span>
              Manage your business operations efficiently
              <span className={styles.subTitleIcon}>✨</span>
            </p>
          </div>
        </div>
        
        <div className="col-md-4 col-sm-6 mb-4">
          <Link to="/shops" className="text-decoration-none">
            <div className={`${styles.card} h-100`}>
              <div className="d-flex align-items-center justify-content-between p-4 ">
                <div>
                  <h3 className="mb-2" style={{ color: "var(--mainColor)" }}>Shops</h3>
                  <p className="mb-0" style={{ color: "#666" }}>Manage your shops and their details</p>
                </div>
                <div className={styles.iconContainer}>
                  <FontAwesomeIcon icon={faStore} className={styles.icon} />
                </div>
              </div>
              <div className={styles.arrowContainer}>
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrow} />
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4 col-sm-6 mb-4">
          <Link to="/orders" className="text-decoration-none">
            <div className={`${styles.card} h-100`}>
              <div className="d-flex align-items-center justify-content-between p-4">
                <div>
                  <h3 className="mb-2" style={{ color: "var(--mainColor)" }}>Orders</h3>
                  <p className="mb-0" style={{ color: "#666" }}>Track and manage customer orders</p>
                </div>
                <div className={styles.iconContainer}>
                  <FontAwesomeIcon icon={faCartShopping} className={styles.icon} />
                </div>
              </div>
              <div className={styles.arrowContainer}>
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrow} />
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4 col-sm-6 mb-4">
          <Link to="/tayareen" className="text-decoration-none">
            <div className={`${styles.card} h-100`}>
              <div className="d-flex align-items-center justify-content-between p-4">
                <div>
                  <h3 className="mb-2" style={{ color: "var(--mainColor)" }}>Tayareen</h3>
                  <p className="mb-0" style={{ color: "#666" }}>Manage your delivery personnel</p>
                </div>
                <div className={styles.iconContainer}>
                  <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                </div>
              </div>
              <div className={styles.arrowContainer}>
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrow} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
