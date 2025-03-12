
import styles from "./Footer.module.css";
import mylogo from "../../images/logoo.png";

export default function Footer() {
  return (
    <>
      <div
        className={`${styles.footer} mt-4 pt-5 pb-5 text-white text-center text-md-start footer `}
      >
        <div className="container">
          <div className={` pt-lg-3 pb-lg-5 pt-5  ${styles.row1}`}>
            
           
              <div className="info">
                <div className="copyright text-black-50">
                  Created BY <span>Waslly Team</span>
                  <div>
                    &copy;2025- <span>Waslly</span>
                  </div>
                </div>
          </div>
              <div className="logo">
                <img src={mylogo} alt="logo" width={"250px"} height={"120px"} />
            </div>
          </div>  
         
          </div>
        </div>
     
    </>
  );
}
