import React from 'react'
import styles from "./CardIdentifier.module.css"
import logo from "../../images/logo.png"

export default function CardIdentifier({image,title,describtion,status,phone,location,orders,id,order_name,order_date,order_price,delivery_fee,total_price,from_multiple_shops,coins,is_delivered,is_picked,user,delivery_crew,notes}) {
  return <>
   <div className="container">
        <div className={styles.parent}>
            <div className={styles.description}>
                <div className="col-12">

                <img src={image?image:logo} alt="" className={`card-img-top  container-fluid  ${styles.image}`} />
                </div>
                <div className={styles.detailsOfDescription}>

                <div className={styles.title}>{title}</div>
                {id && <div className={styles.title}> id : {id}</div> }
                {user && <div className={styles.title}>user : {user} </div>}
                {/* {describtion && <div className={styles.describe}>{describtion}</div>} */}
                </div>
            </div>
            <div className={styles.details}>

                <div style={{ color: status === "Online" ? "green" : "red", fontWeight: "bold" }}>
                {status}
                </div>
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
            </div>
        </div>
    </div>
  
  </>
}