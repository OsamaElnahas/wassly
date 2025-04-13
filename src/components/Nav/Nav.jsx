import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOut } from '@fortawesome/free-solid-svg-icons';
import styles from "./Nav.module.css";

export default function Nav({ isVisible }) {
  const navigate = useNavigate()
  
  function logOut() {
    localStorage.clear()
    navigate("/login")
  }
  
  return (
    <nav className={`${styles.nav} ${!isVisible ? styles.fullWidth : ''}`}>
      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <FontAwesomeIcon icon={faUser} />
          <span>{localStorage.getItem("username")}</span>
        </div>
        <button className={styles.logoutBtn} onClick={logOut}>
          <FontAwesomeIcon icon={faSignOut} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )
}

Nav.propTypes = {
  isVisible: PropTypes.bool.isRequired
};
