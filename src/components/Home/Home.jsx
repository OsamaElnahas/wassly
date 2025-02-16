import React from 'react'
import styles from "./Home.module.css"
import { Link } from 'react-router-dom'
import AccessCard from '../AccessCard/AccessCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faStore ,faPlus} from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  return <>
  <div className= {`container ${styles.parent}` }  >
<div className={`row` }  >
<div className="col-3 ">

 
<AccessCard  link="/AddShop" title={"Add Shop"} iconProp={faPlus}  BGC={"var(--mainColor)"}/>

</div>
<div className="col-3">
<AccessCard  link="#" title={"Add Tayaar"} iconProp={faUserPlus}  BGC={"var(--thirdColor)"}/>



</div>

  

</div>
  </div>
  </>
  
}
