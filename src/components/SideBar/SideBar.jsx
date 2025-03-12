import React, { useEffect } from 'react'
import styles from "./SideBar.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars ,faHome,faStore,faCartShopping,faUserPlus,faCircleUser, faUser, faUserGroup, faUsers} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import mylogo from "../../images/logoo.webp"
import { faUserNinja } from '@fortawesome/free-solid-svg-icons/faUserNinja';
import { faUserTie } from '@fortawesome/free-solid-svg-icons/faUserTie';




export default function SideBar({isVisable ,setVisable}) {
  const location = useLocation();
  const [isClicked,setClicked]=useState(location.pathname)
  useEffect(() => {
    setClicked(location.pathname); 
  }, [location.pathname]);
  
  function toggleSidebar(){
    setVisable(!isVisable);

  }
  function handleClick(Link){
    setClicked(Link)

  }
  return <> 
     <FontAwesomeIcon onClick={toggleSidebar} icon={faBars}  className={styles.burgerMenu} />
    <div className={`${styles.parent}`}>
    
    <div className={` ${isVisable?styles.sideBar:styles.nonVisible}  `} >
      
    <div className={`${styles.logo}`}>
         <FontAwesomeIcon onClick={toggleSidebar} icon={faBars}  className={styles.burgerMenuRight} />

         <Link className={`navbar-brand d-flex align-items-center`} to="/">
                                <img  src={mylogo} alt="logo" width={"70px"} height={"30px"}/>
                
            <div  style={{
              fontWeight:"bolder ",
              fontSize:"22px",
              paddingTop:"8px",
              color:"whitesmoke",
            }}>Dashboard</div>
            </Link>
         </div>
        <Link to={"/"} onClick={()=>handleClick("/")} className= {`${styles.item} ${isClicked=="/" &&styles.active} ps-lg-3 ps-sm-2 `}><FontAwesomeIcon icon={faHome}/> <div>Home</div></Link>
        <Link to={"/Shops"} onClick={()=>handleClick("/Shops")} className={`${styles.item} ${isClicked=="/Shops" &&styles.active} ps-lg-3 ps-sm-2 `}><FontAwesomeIcon icon={faStore}/> <div>Shops</div></Link>
        <Link to={"/orders"}onClick={()=>handleClick("/orders")} className={`${styles.item} ${isClicked=="/orders" &&styles.active} ps-lg-3 ps-sm-2 `}><FontAwesomeIcon icon={faCartShopping}/> <div>Orders</div></Link>
        <Link to={"/tayareen"}onClick={()=>handleClick("/tayareen")} className={`${styles.item} ${isClicked=="/tayareen" &&styles.active} ps-lg-3 ps-sm-2 `}><FontAwesomeIcon icon={faUsers}/> <div>Tayareen</div></Link>
        

    </div>

    </div>
  

  </>
}
