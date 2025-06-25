import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

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
}) {
  const optimizedImage = image ? `${image}?format=webp&quality=80` : imageFallback;
  const [imgSrc, setImgSrc] = useState(optimizedImage);

  // Normalize TayarIsActive to boolean
  const isTayarActive = typeof TayarIsActive === 'string' ? TayarIsActive === 'true' : !!TayarIsActive;

  return (
    <div className="container my-4">
      <div
        className="d-flex flex-column flex-md-row bg-white border rounded-3 shadow-sm text-capitalize text-dark justify-content-center align-items-center"
        style={{ transition: 'all 0.3s ease-in-out', overflow: 'hidden' }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)')}
      >
        <div className="d-flex flex-column align-items-center justify-content-center p-3 border-end border-end-0-md border-bottom col-12 col-md-auto">
          <div>
            <img
              loading="lazy"
              src={imgSrc}
              alt="shop"
              onError={() => setImgSrc(imageFallback)}
              className="card-identifier-image rounded-circle border p-1 bg-light"
              style={{
                width: '180px',
                height: '180px',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                marginBottom: '16px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
          <div className="w-100 d-flex flex-column align-items-center gap-2">
            <div className="fs-5 fw-semibold mb-2 p-2 rounded bg-light w-100 text-center">
              <span>{title}</span>
            </div>
            {user && <div className="fs-5 fw-semibold mb-2 p-2 rounded bg-light w-100 text-center">user: {user}</div>}
            {/* {describtion && <div className="fs-6 text-muted bg-light px-4 text-center">{describtion}</div>} */}
          </div>
        </div>
        <div className="card-identifier-details d-flex flex-column align-items-center align-items-md-start justify-content-center p-3 fs-6 gap-2 col-12 col-md">
          {status && (
            <div className={`fw-bold ${status === 'Online' || status === 'مفتوح' ? 'text-success' : 'text-danger'}`}>
              {status}
            </div>
          )}
          {typeof TayarIsActive !== 'undefined' && (
            <div className={`fw-bold ${isTayarActive ? 'text-success' : 'text-danger'}`}>
              {isTayarActive ? 'Currently Working' : 'Inactive'}
            </div>
          )}
          {order_price && <div>Order Price: {order_price}</div>}
          {delivery_fee && <div>Delivery Fee: {delivery_fee}</div>}
          {total_price && <div>total Price: {total_price}</div>}
          {from_multiple_shops?.toString() && <div>from multiple shops: {from_multiple_shops.toString()}</div>}
          {coins != null && <div>coins: {coins}</div>}
          {is_picked?.toString() && <div>Picked: {is_picked.toString()}</div>}
          {is_delivered?.toString() && <div>Delivered: {is_delivered.toString()}</div>}
          {notes && <div>notes: {notes}</div>}
          {phone && <div className="fw-semibold text-primary">Phone Number: {phone}</div>}
          {location && <div className="fw-semibold text-primary">Location: {location}</div>}
          {order_date && <div>Date: {order_date}</div>}
          {orders != null && <div>Confirmed Orders: {orders}</div>}
          {type && <div>Type: {type}</div>}
          {balance != null && <div>Balance: {balance}</div>}
          {nationalIdFront && nationalIdBack && (
            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center justify-content-md-between  p-2">
              {nationalIdFront && (
                <div className="m-2 d-flex align-items-center justify-content-center">
                  <img src={nationalIdFront} alt="National ID Front" className="w-50 rounded" />
                </div>
              )}
              {nationalIdBack && (
                <div className="m-2 d-flex align-items-center justify-content-center">
                  <img src={nationalIdBack} alt="National ID Back" className="w-50 rounded" />
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
};