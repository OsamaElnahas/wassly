import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from "./Card.module.css";
import { Link, NavLink } from 'react-router-dom';
import logo from '../../images/3998266.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStore,
  faInfoCircle,
  faTag
} from '@fortawesome/free-solid-svg-icons';

export default function Card({ title, image, description, offer, id, status }) {
  const optimizedImage = `${image}?format=webp&quality=80`;
  const [imgSrc, setImgSrc] = useState(optimizedImage || logo);

  const isOpen = status === "Online" || status === "مفتوح";

  return <>
    <NavLink to={`/shops/shopsDetails/${id}`} className={`${styles.card}`}>
      <div className={styles.imageDiv}>
        <img
          src={imgSrc}
          onError={() => setImgSrc(logo)} 
          loading="lazy"
          className=""
          alt="..."
        />
        {status && (
          <div className={styles.status} style={{ color: isOpen ? "green" : "red" }}>
            {status}
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.title}>
          <FontAwesomeIcon icon={faStore} className={styles.titleIcon} />
          <span>{title}</span>
        </div>
        <div className={styles.description}>
          <FontAwesomeIcon icon={faInfoCircle} className={styles.descIcon} />
          <span>{description}</span>
        </div>
        {offer && (
          <p className={styles.offer}>
            <FontAwesomeIcon icon={faTag} className={styles.offerIcon} />
            <span>{offer}</span>
          </p>
        )}
      </div>
    </NavLink>
  </>
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  description: PropTypes.string,
  offer: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  status: PropTypes.oneOf(['Online', 'Offline', 'مفتوح', 'مغلق']).isRequired
};
