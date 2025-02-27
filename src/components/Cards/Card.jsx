import React from 'react'
import styles from "./Card.module.css"
import { Link } from 'react-router-dom'

export default function Card({title,image,description,offer,id,status}) {
  return  <>

    <Link to={`/shopsDetails/${id}`} className={` ${styles.card}`}>
  <img src={image} className="card-img-top" alt="..."/>
  <div className={styles.cardBody}>
    <h5 className={styles.title}>{title}</h5>
    <p className={styles.description}>{description}</p>
    {/* {offer&&<p className={styles.offer}>{offer}</p>} */}
    </div>
     </Link>
     </>
  
}