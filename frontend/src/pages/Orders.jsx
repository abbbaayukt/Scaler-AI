import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { StoreContext } from '../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Orders = () => {
  const { API_URL, user } = useContext(StoreContext)
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/`)
        setOrders(res.data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchOrders()
  }, [API_URL, user, navigate])

  return (
    <div className="orders-container">
      <div style={{padding: '0', marginBottom: '16px'}}>
        <button onClick={() => window.history.back()} style={{background:'none', border:'none', color:'#2874f0', cursor:'pointer', fontWeight:500, fontSize:'14px', padding:'10px 0'}}>
          ← Back to previous page
        </button>
      </div>
      <h2 style={{background:"white", padding:"16px", marginBottom:"16px"}}>My Orders</h2>
      {orders.length === 0 ? (
        <div style={{background:"white", padding:"32px", textAlign:"center"}}>No orders found.</div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Order #{order.id}</span>
              <span>Total: ₹{order.total_amount.toLocaleString('en-IN')}</span>
              <span style={{color: "green", fontWeight: 500}}>{order.status}</span>
            </div>
            <div className="order-items">
              {order.items.map(item => (
                <div key={item.id} className="order-item-row">
                  <img src={item.product.image_url} alt="product" width="60" />
                  <div className="order-item-info">
                    <p className="order-item-title">{item.product.title}</p>
                    <p style={{color:"#878787", fontSize:"14px"}}>Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-delivery">
              <p><strong>Delivery To:</strong> {order.customer_name}, {order.shipping_address} - {order.pincode}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Orders
