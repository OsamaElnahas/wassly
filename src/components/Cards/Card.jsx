import React, { useState } from 'react'
import styles from "./Card.module.css"
import { Link } from 'react-router-dom'
import logo from '../../images/3998266.webp'
export default function Card({ title, image, description, offer, id, status }) {
  const optimizedImage = `${image}?format=webp&quality=80`;
  const [imgSrc, setImgSrc] = useState(optimizedImage || logo);

  return <>
    <Link to={`/shopsDetails/${id}`} className={` ${styles.card}`}>
      <div className={styles.imageDiv}>
        <img
          src={imgSrc}
          onError={() => setImgSrc(logo)} 
          loading="lazy"
          className=""
          alt="..."
        />
        {status && (
          <div style={{ color: status === "Online" ? "green" : "red", fontWeight: "bold" }}>
            {status}
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
        {/* {offer&&<p className={styles.offer}>{offer}</p>} */}
      </div>
    </Link>
  </>
}
