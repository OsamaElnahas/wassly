import React from 'react'
import styles from "./Tayareen.module.css"

// import photo from "../images/user.webp"
import photo from "../images/Modern-delivery-man-on-scooter-on-transparent-background-PNG.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import AccessCard from '../components/AccessCard/AccessCard'
export default function Tayareen() {
  return (
    <div className="container">

        <div className="row gx-0 mb-4">
            <div className="col-2">

            <AccessCard title={"Add Tayaar"} iconProp={faUserPlus} BGC={"var(--thirdColor)"} />
            </div>
            </div>
        <div className="row gx-0">

      <div className={`${styles.userCard} col-4`}>
        <div className="row">
            <div className="col-4">
            <FontAwesomeIcon icon={faUserCircle} /> 
            {/* <img src={photo} alt="" /> */}
            
                </div>
            <div className="col-8">
            <div className={styles.details}>
               <div className={styles.name}>
                 Name : osama kamal elsayed
                </div>
             <div className={styles.Phone}>Phone :01222406627</div>
             <div className={styles.source}>in Wassly</div>
            </div>
            </div>
        </div>
    </div>
        </div>
    </div>
  )
}
