import styles from "./Errors.module.css"


export default function Errors({errorMessage}) {

  

  return (
    <>
        <div className={styles.error}>
          ⚠️ {errorMessage}
        </div>
    </>
  );
}
