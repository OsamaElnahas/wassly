import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faHome,
  faStore,
  faCartShopping,
  faUsers,
  faChain,
} from '@fortawesome/free-solid-svg-icons';
import styles from './SideBar.module.css';

export default function SideBar({ isVisible, setVisible }) {
  const menuItems = [
    { path: '/', icon: faHome, label: 'Home' },
    { path: '/shops', icon: faStore, label: 'Shops' },
    { path: '/orders', icon: faCartShopping, label: 'Orders' },
    { path: '/tayareen', icon: faUsers, label: 'Tayareen' },
    { path: '/transactions', icon: faChain, label: 'Transactions' },
  ];

  return (
    <div className={styles.parent}>
      <div className={`${styles.sideBar} ${!isVisible ? styles.nonVisible : ''}`}>
        <div className={styles.logo}>
          <FontAwesomeIcon
            icon={faBars}
            style={{ width: '25px', height: '40px' }}
            className={styles.burgerMenuRight}
            onClick={() => setVisible(!isVisible)}
          />
          <NavLink to="/" className="d-flex align-items-center justify-center">
            <span>Wassally Dashboard</span>
          </NavLink>
        </div>

        <div className={styles.menuItems}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </NavLink>
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
  setVisible: PropTypes.func.isRequired,
};