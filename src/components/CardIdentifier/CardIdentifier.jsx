import { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function CardIdentifier({
  image,
  title,
  //   describtion,
  status,
  phone,
  location,
  orders,
  imageFallback,
  //   id,
  //   order_name,
  order_date,
  order_price,
  delivery_fee,
  total_price,
  from_multiple_shops,
  coins,
  is_delivered,
  is_picked,
  user,
  delivery_crew,
  notes,
  nationalIdFront,
  nationalIdBack,
  balance,
  type,
  TayarIsActive,
  numberOfActiveOrders,
  TayarName,
  OrderType,
  ShopOrderdName,
  TayarPhone,
  ReciverPhone,
  OrderCode,
  created_at,
  price,
  wassally_price,
  TayarId,
  ShopOrderdId,
  delivered_at,
}) {
  const optimizedImage = image
    ? `${image}?format=webp&quality=80`
    : imageFallback;
  const [imgSrc, setImgSrc] = useState(optimizedImage);

  // Normalize TayarIsActive to boolean
  const isTayarActive =
    typeof TayarIsActive === "string"
      ? TayarIsActive === "true"
      : !!TayarIsActive;
  const getStatusClass = (status) => {
    switch (status) {
      case "قيد الانتظار":
        return "text-warning bg-warning bg-opacity-10";
      case "قيد التنفيذ":
        return "text-primary bg-primary bg-opacity-10";
      case "قيد العمل":
        return "text-info bg-info bg-opacity-10";
      case "تم التوصيل":
      case "DELIVERED":
        return "text-success bg-success bg-opacity-10";
      case "ملغي":
      case "مغلق":
      case "Offline":
        return "text-danger bg-danger bg-opacity-10";
      case "مفتوح":
      case "Online":
        return "text-success bg-success bg-opacity-10";
      default:
        return "text-muted bg-light";
    }
  };

  return (
    <div className="container my-3" style={{ maxWidth: "1400px" }}>
      <div
        className="d-flex flex-column flex-md-row bg-white border rounded-3 shadow-md text-capitalize text-dark justify-content-start align-md-items-center align-items-start gap-md-3 gap-1 w-100"
        style={{ transition: "all 0.3s ease-in-out", overflow: "hidden" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)")
        }
      >
        <div className="d-flex flex-column align-md-items-center gap-3 justify-content-center p-3 col-12 col-md-auto ">
          <div>
            <img
              loading="lazy"
              src={imgSrc}
              alt="shop"
              onError={() => setImgSrc(imageFallback)}
              className="card-identifier-image rounded-circle border p-1 shadow-sm bg-light"
              style={{
                width: "130px",
                height: "130px",
                objectFit: "cover",
                transition: "transform 0.3s ease",
                marginBottom: "16px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>
          <div className="w-100 d-flex flex-column align-items-start gap-2">
            <div className="fs-md-5  fw-semibold mb-2 p-2 rounded bg-light w-100 text-lg-center white-space-nowrap">
              <span>{title} </span>
            </div>
            {user && (
              <div className="fs-5 fw-semibold mb-2 p-2 rounded bg-light w-100 text-center">
                user: {user}
              </div>
            )}
            {ReciverPhone && (
              <div className="fs-5 fw-semibold mb-2 p-2 rounded bg-light w-100 text-center">
                {ReciverPhone}
              </div>
            )}
            {/* {describtion && <div className="fs-6 text-muted bg-light px-4 text-center">{describtion}</div>} */}
          </div>
        </div>
        <div
          className="card-identifier-details d-flex flex-column align-items-start align-self-md-start justify-content-start   p-3 fs-6 gap-3 "
          style={{
            height: "100%",
          }}
        >
          {status && (
            <div className={`fw-bold rounded p-2 ${getStatusClass(status)}`}>
              {status}
            </div>
          )}
          {typeof TayarIsActive !== "undefined" && (
            <div
              className={`fw-bold ${
                isTayarActive ? "text-success" : "text-danger"
              }`}
            >
              {isTayarActive ? "Currently Working" : "Inactive"}
            </div>
          )}
          {OrderCode && (
            <div className="mb-1">
              <span className="fw-bold">Order Code: </span>
              <span className="text-dark">{OrderCode}</span>
            </div>
          )}
          {created_at && (
            <div className="mb-1">
              <span className="fw-bold">Created at : </span>
              <span className="text-dark">{created_at}</span>
            </div>
          )}
          {delivered_at && (
            <div className="mb-1">
              <span className="fw-bold">Delivered at: </span>
              <span className="text-dark">{delivered_at}</span>
            </div>
          )}
          {is_picked != null && (
            <div className="mb-1">
              <span className="fw-bold">Picked: </span>
              <span className="text-dark">{is_picked.toString()}</span>
            </div>
          )}

          {/* Order Type and Shop Ordered Name together */}
          {(OrderType || ShopOrderdName) && (
            <div className="card p-3 mb-2 bg-light border border-primary-subtle shadow-sm">
              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 gap-lg-5">
                {OrderType && (
                  <div>
                    <span className="fw-bold text-dark">Order Type: </span>
                    <span className="text-primary">{OrderType}</span>
                  </div>
                )}
                {ShopOrderdName && (
                  <div>
                    <span className="fw-bold text-dark">Shop Ordered: </span>
                    <Link
                      to={`/shops/shopsDetails/${ShopOrderdId}`}
                      className="text-primary text-decoration-underline fw-semibold"
                    >
                      {ShopOrderdName}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tayar Name and Phone together */}
          {(TayarName || TayarPhone) && (
            <div className="card p-3 mb-2 bg-light border border-primary-subtle shadow-sm">
              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 gap-lg-5">
                {TayarName && (
                  <div>
                    <span className="fw-bold">Tayar : </span>{" "}
                    <Link
                      to={`/tayareen/tayaarDetails/${TayarId}`}
                      className="text-primary text-decoration-underline fw-semibold"
                    >
                      {TayarName}
                    </Link>
                  </div>
                )}
                {TayarPhone && (
                  <div>
                    <span className="fw-bold">Tayar Phone: </span>
                    <span className="text-dark">{TayarPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prices together */}
          {(order_price ||
            delivery_fee ||
            total_price ||
            price ||
            wassally_price) && (
            <div className="card p-3 mb-2 bg-light border border-success-subtle shadow-sm">
              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 gap-lg-5 flex-wrap">
                {/* {order_price && <div><span className="fw-bold">Order Price: </span><span className="text-success">{order_price} EGP</span></div>} */}
                {price != undefined && (
                  <div>
                    <span className="fw-bold">Price: </span>
                    <span className="text-success">{price} EGP</span>
                  </div>
                )}
                {delivery_fee && (
                  <div>
                    <span className="fw-bold">Delivery Fee: </span>
                    <span className="text-success">{delivery_fee} EGP</span>
                  </div>
                )}
                {wassally_price && (
                  <div>
                    <span className="fw-bold">Wassally Service: </span>
                    <span className="text-success">{wassally_price} EGP</span>
                  </div>
                )}
                {total_price && (
                  <div>
                    <span className="fw-bold">Total Price: </span>
                    <span className="text-success">{total_price} EGP</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {from_multiple_shops != null && (
            <div className="mb-1">
              <span className="fw-bold">From Multiple Shops: </span>
              <span className="text-dark">
                {from_multiple_shops.toString()}
              </span>
            </div>
          )}
          {coins != null && (
            <div className="mb-1">
              <span className="fw-bold">Coins: </span>
              <span className="text-dark">{coins}</span>
            </div>
          )}
          {notes && (
            <div className="mb-1">
              <span className="fw-bold">Notes: </span>
              <span className="text-dark">{notes}</span>
            </div>
          )}
          {phone && (
            <div className="mb-1">
              <span className="fw-bold text-primary">Phone Number: </span>
              <span className="text-dark">{phone}</span>
            </div>
          )}
          {order_date && (
            <div className="mb-1">
              <span className="fw-bold">Date: </span>
              <span className="text-dark">{order_date}</span>
            </div>
          )}
          {orders != null && (
            <div className="mb-1">
              <span className="fw-bold">Confirmed Orders: </span>
              <span className="text-dark">{orders}</span>
            </div>
          )}
          {location && (
            <div className="mb-1">
              <span className="fw-bold text-muted">Location: </span>
              <span className="text-dark">{location}</span>
            </div>
          )}

          {type && (
            <div className="mb-1">
              <span className="fw-bold">Type: </span>
              <span className="text-dark">{type}</span>
            </div>
          )}
          {balance != null && (
            <div className="mb-1">
              <span className="fw-bold">Balance: </span>
              <span className="text-success">{balance} EGP</span>
            </div>
          )}
          {numberOfActiveOrders != null && (
            <div className="mb-1">
              <span className="fw-bold">Active Orders: </span>
              <span className="text-dark">{numberOfActiveOrders}</span>
            </div>
          )}
          {nationalIdFront && nationalIdBack && (
            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center justify-content-md-between gap-5  p-2 bg-light w-100">
              {nationalIdFront && (
                <div
                  className="m-2 d-flex  align-items-center justify-content-start w-100"
                  style={{ width: "100%" }}
                >
                  <img
                    src={nationalIdFront}
                    alt="National ID Front"
                    className=" rounded"
                    style={{
                      width: "100%",
                      minHeight: "250px",
                      maxHeight: "250px",
                    }}
                  />
                </div>
              )}
              {nationalIdBack && (
                <div
                  className="m-2 d-flex  align-items-center justify-content-start w-100"
                  style={{ width: "100%" }}
                >
                  <img
                    src={nationalIdBack}
                    alt="National ID Back"
                    className="  rounded"
                    style={{
                      width: "100%",
                      minHeight: "250px",
                      maxHeight: "250px",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

CardIdentifier.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  describtion: PropTypes.string,
  status: PropTypes.string,
  phone: PropTypes.string,
  location: PropTypes.string,
  orders: PropTypes.number,
  imageFallback: PropTypes.string,
  //   id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  order_name: PropTypes.string,
  order_date: PropTypes.string,
  order_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  delivery_fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  total_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  from_multiple_shops: PropTypes.bool,
  coins: PropTypes.number,
  is_delivered: PropTypes.bool,
  is_picked: PropTypes.bool,
  user: PropTypes.string,
  delivery_crew: PropTypes.string,
  notes: PropTypes.string,
  nationalIdFront: PropTypes.string,
  nationalIdBack: PropTypes.string,
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  TayarIsActive: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  TayarName: PropTypes.string,
  TayarPhone: PropTypes.string,
  ReciverPhone: PropTypes.string,
  OrderCode: PropTypes.string,
  created_at: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wassally_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  OrderType: PropTypes.string,
  ShopOrderdName: PropTypes.string,
  numberOfActiveOrders: PropTypes.number,
};
