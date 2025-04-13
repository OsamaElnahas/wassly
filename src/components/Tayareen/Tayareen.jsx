import React from 'react'
import styles from "./Tayareen.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faUserPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import AccessCard from '../AccessCard/AccessCard'

export default function Tayareen() {
  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <div className={styles.searchContainer}>
                <div className={styles.searchInput}>
                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                    <input type="text" placeholder="Search tayareen..." className={styles.input} />
                </div>
            </div>
            <div className={styles.addButton}>
                <AccessCard 
                    title={"Add Tayaar"} 
                    iconProp={faUserPlus} 
                    BGC={"var(--thirdColor)"} 
                />
            </div>
        </div>

        <div className={styles.cardsGrid}>
            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <div className={styles.iconContainer}>
                        <FontAwesomeIcon icon={faUserCircle} className={styles.icon} /> 
                    </div>
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
  )
}
