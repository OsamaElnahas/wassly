import React, { useEffect } from 'react'
import styles from "./SideBar.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars ,faHome,faStore,faCartShopping} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'




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
    <div className={`${styles.parent}`}>
    
    <FontAwesomeIcon onClick={toggleSidebar} icon={faBars}  className={styles.burgerMenu} />
    <div className={` ${isVisable?styles.sideBar:styles.nonVisible}  `} >
    <FontAwesomeIcon onClick={toggleSidebar} icon={faBars}  className={styles.burgerMenuRight} />
        <Link to={"/"} onClick={()=>handleClick("/")} className= {`${styles.item} ${isClicked=="/" &&styles.active} ps-lg-3 ps-sm-2 `}><FontAwesomeIcon icon={faHome}/> <div>Home</div></Link>
        <Link to={"/Shops"} onClick={()=>handleClick("/Shops")} className={`${styles.item} ${isClicked=="/Shops" &&styles.active} ps-lg-3 ps-sm-2 `}><FontAwesomeIcon icon={faStore}/> <div>Shops</div></Link>
        <Link to={"/orders"}onClick={()=>handleClick("/orders")} className={`${styles.item} ${isClicked=="/orders" &&styles.active} ps-lg-3 ps-sm-2 `}><FontAwesomeIcon icon={faCartShopping}/> <div>Orders</div></Link>
        

    </div>

    </div>
  

  </>
}
