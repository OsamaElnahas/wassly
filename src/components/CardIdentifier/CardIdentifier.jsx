import React, { useState } from 'react'
import styles from "./CardIdentifier.module.css"
// import logo from "../../images/logo.png"

export default function CardIdentifier({image,title,describtion,status,phone,location,orders,imageFallback,id,order_name,order_date,order_price,delivery_fee,total_price,from_multiple_shops,coins,is_delivered,is_picked,user,delivery_crew,notes, nationalIdFront, nationalIdBack, balance, type,isActive}) {
    const optimizedImage = `${image}?format=webp&quality=80`;
      const [imgSrc, setImgSrc] = useState(optimizedImage);

  return <>
   <div className="container">
        <div className={styles.parent}>
            <div className={styles.description}>
                <div className="">

                <img 
                    loading="lazy"
                    src={image}
                    alt="shop"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imageFallback;  
                    }}


            className={`card-img-top  container-fluid  ${styles.image}`} />
                </div>
                <div className={styles.detailsOfDescription}>

                <div className={styles.title}><span>{title} </span></div>
                {/* {id && <div className={styles.title}> id : {id}</div> } */}
                {user && <div className={styles.title}>user : {user} </div>}
                </div>
                {/* {describtion && <div className={styles.describe}>{describtion}</div>} */}
            </div>
            <div className={styles.details}>

                <div style={{ color: status === "Online" || status===  "مفتوح" ? "green" : "red", fontWeight: "bold" }}>
                {status}
                </div>
                {isActive && <div style={{ color: "green", fontWeight: "bold" }}>
                    {isActive ? "Currently Working" : "Inactive"}
                </div>}
                {!isActive && <div style={{ color: "red", fontWeight: "bold" }}>
                    {isActive ? "Currently Working" : "Inactive"}
                </div>}

                {order_price && <div >Order Price : {order_price}</div>}
                {delivery_fee && <div >Delivery Fee : {delivery_fee}</div>}
                {total_price && <div >total Price : {total_price}</div>}

                {from_multiple_shops?.toString() && <div >from multiple shops : {from_multiple_shops?.toString()}</div>}
                {coins !=null && <div >coins : {coins}</div>}
                {is_picked?.toString() && <div >Picked : {is_picked?.toString()}</div>}
                {/* { is_picked && <div >delivery crew : {delivery_crew}</div>}  */}
                {is_delivered?.toString() && <div >Deliverd : {is_delivered?.toString()}</div>}
                {notes && <div >notes : {notes}</div>}
                {phone &&<div className={styles.phoneNumber}>
                    Phone Number : {phone}
                </div>}
                {}
                {location && <div className={styles.location}>Location : {location}</div>
                }
                {order_date && <div >Date : {order_date}</div>
                }
                {orders !=null && <div>Confirmed Orders : {orders}</div>
                }
                {type && <div>Type : {type}</div>
                }
                {balance !=null && <div>Balance : {balance}</div>
                }
               {nationalIdFront && nationalIdBack && (
  <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between p-2">
    {nationalIdFront && (
      <div className="m-2">
        <img src={nationalIdFront} alt="National ID Front" className="w-50 rounded" />
      </div>
    )}
    {nationalIdBack && (
      <div className="m-2">
        <img src={nationalIdBack} alt="National ID Back" className="w-50 rounded" />
      </div>
    )}
  </div>
)}
            </div>
        </div>
    </div>
  
  </>
}