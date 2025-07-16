import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Errors.module.css"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";


export default function Errors({errorMessage}) {

  

  return (
    <>
        <div className={`${styles.error} d-flex align-items-center justify-content-center gap-2`}>
          <FontAwesomeIcon icon={faExclamationTriangle} /> 
          <span> {errorMessage}</span>
        </div>
    </>
  );
}
