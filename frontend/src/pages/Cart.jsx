import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(StoreContext)
  const navigate = useNavigate()

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', background: 'white', marginTop: '20px' }}>
        <h2>Your cart is empty!</h2>
        <p style={{ margin: '20px 0' }}>Explore our wide selection and find something you like</p>
        <button 
          onClick={() => navigate('/')}
          style={{ background: '#2874f0', color: 'white', border: 'none', padding: '12px 24px', cursor: 'pointer', fontSize: '16px' }}>
          Shop Now
        </button>
      </div>
    )
  }

  const totalAmount = cart.items.reduce((acc, item) => acc + (item.quantity * item.product.price), 0)
  const totalItemsCount = cart.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      <div style={{padding: '0', marginBottom: '16px'}}>
        <button onClick={() => window.history.back()} style={{background:'none', border:'none', color:'#2874f0', cursor:'pointer', fontWeight:500, fontSize:'14px', padding:'10px 0'}}>
          ← Back to previous page
        </button>
      </div>
      <div className="cart-container">
      <div className="cart-main">
        <div className="cart-header">
          Flipkart ({totalItemsCount})
        </div>
        {cart.items.map(item => (
          <div key={item.id} className="cart-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={item.product.image_url} alt={item.product.title} className="cart-item-img" />
              <div className="qty-controls" style={{ marginTop: '20px' }}>
                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <div className="qty-val">{item.quantity}</div>
                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
            <div className="cart-item-details">
              <div className="cart-item-title">{item.product.title}</div>
              <div className="cart-item-price">₹{item.product.price.toLocaleString('en-IN')}</div>
              <div className="cart-item-actions">
                <button className="btn-remove">SAVE FOR LATER</button>
                <button className="btn-remove" onClick={() => removeFromCart(item.id)}>REMOVE</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-sidebar">
        <div className="sidebar-header">PRICE DETAILS</div>
        <div className="sidebar-content">
          <div className="price-row">
            <span>Price ({totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''})</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="price-row">
            <span>Delivery Charges</span>
            <span style={{ color: 'green' }}>Free</span>
          </div>
          <div className="total-row">
            <span>Total Amount</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <button className="place-order-btn" onClick={() => navigate('/checkout')}>
            PLACE ORDER
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Cart
