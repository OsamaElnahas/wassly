import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./AccessCard.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUserPlus, faStore } from '@fortawesome/free-solid-svg-icons';
// import iconProp from '@fortawesome/free-solid-svg-icons';

export default function AccessCard({link,title,iconProp,BGC}) {
  
  return <>
  
      <Link to={link}>
        <div className={styles.Card} style={{
           backgroundColor: BGC }}>
      <div className="text-center mb-3" >
      <div className={styles.cardBody}>
        {iconProp&&<FontAwesomeIcon icon={iconProp} />
        }  
        <div className={styles.title}>{title}</div>
      </div>
    </div>
    </div>
         </Link>
    
  </>
}
