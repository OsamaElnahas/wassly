import React from 'react'
import mylogo from "../../images/logoo.png";
import styles from "./Nav.module.css";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faSignOut} from '@fortawesome/free-solid-svg-icons';



export default function Nav() {
  const navigate=useNavigate()
  function logOut(){
    localStorage.clear()
    navigate("/login")
  }
  return <>
    <nav className={`${styles.nav} navbar navbar-expand-lg w-100`}>
    
  <div className="container-fluid">
    <Link className="navbar-brand" to="/">
                        <img  src={mylogo} alt="logo" width={"150px"} height={"60px"}/>
        
    </Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="#">Tayareen</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/shops">Shops</Link>
        </li>
    
        <li className="nav-item">
          <Link className="nav-link" to="/orders">Orders</Link>
        </li>
        <li>

          <Link className="nav-link" to="#">Statistcs</Link>
        </li>
        <li>

          <Link className="nav-link" to="#">Warnings</Link>
        </li>
    
        {/* <li className="nav-item">
          <Link className="nav-link disabled" aria-disabled="true">Disabled</Link>
        </li> */}
      </ul>
      {/* <form className="d-flex ms-auto" role="search">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className={`${styles.searchBtn} btn `} type="submit">Search</button>
      </form> */}
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className='nav-item'>
         <Link className="nav-link" to="#"><FontAwesomeIcon className='me-1' icon={faUser}/>{localStorage.getItem("username")} </Link>
        </li>
        <li className='nav-item'>
         <button className="btn" onClick={logOut}> <FontAwesomeIcon className='me-1' icon={faSignOut}/>Logout</button>
        </li>
      </ul>
    </div>
  </div>
</nav>
  </>
    

}
