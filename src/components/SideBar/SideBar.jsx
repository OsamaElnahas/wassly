import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars,
  faHome,
  faStore,
  faCartShopping,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import styles from "./SideBar.module.css";
import mylogo from "../../images/logoo.webp";
import { useState } from 'react';

export default function SideBar({ isVisible, setVisible }) {
  const location = useLocation();
const [activeItem, setActiveItem] = useState(location.pathname);
  

  const menuItems = [
    { path: "/", icon: faHome, label: "Home" },
    { path: "/shops", icon: faStore, label: "Shops" },
    { path: "/orders", icon: faCartShopping, label: "Orders" },
    { path: "/tayareen", icon: faUsers, label: "Tayareen" }
  ];
  
  return (
    <div className={styles.parent}>
      <div className={`${styles.sideBar} ${!isVisible ? styles.nonVisible : ''}`}>
        <div className={styles.logo}>
          <FontAwesomeIcon 
            icon={faBars} 
            style={{ width: "25px", height: "40px" }}
            className={styles.burgerMenuRight}
            onClick={() => setVisible(!isVisible)}
          />
          <Link to="/" className="d-flex align-items-center justify-center">
            {/* <img src={mylogo} alt="logo" style={{ width: "70px", height: "40px" }} /> */}
            <span>Wassally Dashboard</span>
          </Link>
        </div>
        
        <div className={styles.menuItems}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setActiveItem(item.path)}
              className={`${styles.item} ${activeItem === item.path ? styles.active : ''}`}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {!isVisible && (
        <FontAwesomeIcon
          icon={faBars}
          className={styles.burgerMenu}
          onClick={() => setVisible(true)}
        />
      )}
    </div>
  );
}

SideBar.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired
};
