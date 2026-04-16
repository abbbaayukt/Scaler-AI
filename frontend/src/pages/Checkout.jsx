import React, { useContext, useState, useEffect } from 'react'
import { StoreContext } from '../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, User, Users } from 'lucide-react'

const Checkout = () => {
  const { cart, API_URL, user } = useContext(StoreContext)
  const navigate = useNavigate()
  
  const [step, setStep] = useState(2)
  const [deliverTo, setDeliverTo] = useState(null) // null = not chosen, 'self' or 'other'
  const [delivery, setDelivery] = useState({ name: '', phone: '', address: '', pincode: '' })
  const [placedId, setPlacedId] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Pre-fill name from user email prefix when "myself" is selected
  const chooseSelf = () => {
    setDeliverTo('self')
    const nameFromEmail = user?.email?.split('@')[0] || ''
    setDelivery({ name: nameFromEmail, phone: '', address: user?.address || '', pincode: user?.pincode || '' })
  }

  const chooseOther = () => {
    setDeliverTo('other')
    setDelivery({ name: '', phone: '', address: '', pincode: '' })
  }

  const totalAmount = cart?.items?.reduce((acc, item) => acc + (item.quantity * item.product.price), 0) || 0

  const handlePlaceOrder = async () => {
    try {
      const res = await axios.post(`${API_URL}/orders/`, {
        customer_name: delivery.name,
        customer_phone: delivery.phone,
        shipping_address: delivery.address,
        pincode: delivery.pincode
      })
      setPlacedId(res.data.id)
    } catch (error) {
      console.error(error)
      alert("Failed to place order")
    }
  }

  if (placedId) {
    return (
      <div style={{textAlign:'center', padding:'60px', background:'white', margin:'20px', borderRadius:'4px', boxShadow:'0 1px 2px rgba(0,0,0,.1)'}}>
        <CheckCircle2 size={72} color="#388e3c" style={{marginBottom:'20px'}}/>
        <h2 style={{color: '#388e3c', fontSize:'24px'}}>Order Placed Successfully!</h2>
        <p style={{marginTop:'12px', color:'#878787'}}>Your Order ID is: <strong style={{color:'#212121'}}>#{placedId}</strong></p>
        <p style={{marginTop:'8px', color:'#878787'}}>Delivering to: <strong style={{color:'#212121'}}>{delivery.name}</strong> — {delivery.address} - {delivery.pincode}</p>
        <button className="btn-add-cart" style={{width:'auto', margin:'30px auto', padding:'12px 36px', display:'block'}} onClick={() => navigate('/orders')}>
          View My Orders
        </button>
        <button onClick={() => navigate('/')} style={{background:'none', border:'none', color:'#2874f0', cursor:'pointer', fontWeight:500}}>
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      <div style={{padding: '0', marginBottom: '16px'}}>
        <button onClick={() => window.history.back()} style={{background:'none', border:'none', color:'#2874f0', cursor:'pointer', fontWeight:500, fontSize:'14px', padding:'10px 0'}}>
          ← Back to previous page
        </button>
      </div>
      <div className="cart-container responsive-stack">
        <div className="cart-main checkout-steps">
          
          {/* Step 1: Login confirmed */}
          <div className="checkout-step">
            <div className="step-header">
              <span className="step-number" style={{background:'#2874f0', color:'white'}}>✓</span>
              <div className="step-title">
                LOGIN 
                <span style={{fontSize:'13px', fontWeight:'normal', marginLeft:'16px', color:'#388e3c'}}>
                  <CheckCircle2 size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/>
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Delivery */}
          <div className="checkout-step">
            <div className="step-header" 
              style={{background: step === 2 ? '#2874f0' : 'white', color: step === 2 ? 'white' : 'inherit', cursor:'pointer'}} 
              onClick={() => step > 2 && setStep(2)}
            >
              <span className="step-number">2</span>
              <div className="step-title">
                DELIVERY ADDRESS 
                {step > 2 && <CheckCircle2 size={16} color="#388e3c" style={{marginLeft:'8px', verticalAlign:'middle'}}/>}
              </div>
            </div>

            {step === 2 && (
              <div className="step-body">
                
                {/* Deliver to: who? */}
                {deliverTo === null && (
                  <div style={{marginBottom:'24px'}}>
                    <p style={{fontSize:'15px', fontWeight:'500', marginBottom:'16px', color:'#212121'}}>
                      Where would you like to deliver this order?
                    </p>
                    <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
                      
                      {/* Myself card */}
                      <div 
                        className="deliver-option-card" 
                        onClick={chooseSelf}
                      >
                        <User size={28} color="#2874f0" style={{marginBottom:'8px'}}/>
                        <p style={{fontWeight:500, fontSize:'15px'}}>Deliver to Myself</p>
                        <p style={{fontSize:'12px', color:'#878787', marginTop:'4px'}}>
                          Use your account details
                        </p>
                        <p style={{fontSize:'13px', color:'#2874f0', marginTop:'8px', fontWeight:500}}>
                          {user?.email?.split('@')[0]}
                        </p>
                      </div>

                      {/* Someone else card */}
                      <div 
                        className="deliver-option-card"
                        onClick={chooseOther}
                      >
                        <Users size={28} color="#ff9f00" style={{marginBottom:'8px'}}/>
                        <p style={{fontWeight:500, fontSize:'15px'}}>Send as a Gift</p>
                        <p style={{fontSize:'12px', color:'#878787', marginTop:'4px'}}>
                          Deliver to a friend or family
                        </p>
                        <p style={{fontSize:'13px', color:'#ff9f00', marginTop:'8px', fontWeight:500}}>
                          Enter new address
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {/* Delivery Form */}
                {deliverTo !== null && (
                  <div>
                    <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px'}}>
                      <div style={{display:'flex', gap:'8px'}}>
                        <button 
                          onClick={chooseSelf} 
                          style={{padding:'6px 16px', border:'1px solid', borderColor: deliverTo==='self' ? '#2874f0' : '#e0e0e0', background: deliverTo==='self' ? '#e8f0fe' : 'white', color: deliverTo==='self' ? '#2874f0' : '#212121', borderRadius:'20px', cursor:'pointer', fontWeight:500, fontSize:'13px', display:'flex', alignItems:'center', gap:'6px'}}
                        >
                          <User size={14}/> Myself
                        </button>
                        <button 
                          onClick={chooseOther}
                          style={{padding:'6px 16px', border:'1px solid', borderColor: deliverTo==='other' ? '#ff9f00' : '#e0e0e0', background: deliverTo==='other' ? '#fff8e7' : 'white', color: deliverTo==='other' ? '#ff9f00' : '#212121', borderRadius:'20px', cursor:'pointer', fontWeight:500, fontSize:'13px', display:'flex', alignItems:'center', gap:'6px'}}
                        >
                          <Users size={14}/> Someone Else
                        </button>
                      </div>
                    </div>

                    {deliverTo === 'self' && (
                      <div style={{background:'#e8f0fe', border:'1px solid #c5d5f9', borderRadius:'4px', padding:'12px 16px', marginBottom:'16px', fontSize:'13px', color:'#2874f0'}}>
                        ℹ️ Delivering to your account: <strong>{user?.email}</strong>. Please fill your address below.
                      </div>
                    )}
                    {deliverTo === 'other' && (
                      <div style={{background:'#fff8e7', border:'1px solid #ffe0a0', borderRadius:'4px', padding:'12px 16px', marginBottom:'16px', fontSize:'13px', color:'#856400'}}>
                        🎁 You're sending this as a gift! Enter the recipient's details below.
                      </div>
                    )}

                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px'}}>
                      <div>
                        <label className="auth-label">Full Name *</label>
                        <input type="text" placeholder={deliverTo === 'other' ? "Recipient's name" : "Your name"} value={delivery.name} onChange={e => setDelivery({...delivery, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="auth-label">10-digit Mobile Number *</label>
                        <input type="tel" placeholder="Mobile number" value={delivery.phone} onChange={e => setDelivery({...delivery, phone: e.target.value})} />
                      </div>
                      <div>
                        <label className="auth-label">Pincode *</label>
                        <input type="text" placeholder="6-digit pincode" value={delivery.pincode} onChange={e => setDelivery({...delivery, pincode: e.target.value})} />
                      </div>
                      <div>
                        <label className="auth-label">Locality / Town</label>
                        <input type="text" placeholder="Locality or town" value={delivery.locality || ''} onChange={e => setDelivery({...delivery, locality: e.target.value})} />
                      </div>
                    </div>
                    <label className="auth-label">Address (House No, Building, Street, Area) *</label>
                    <textarea 
                      placeholder="Full delivery address" 
                      value={delivery.address} 
                      onChange={e => setDelivery({...delivery, address: e.target.value})}
                      style={{width:'100%', padding:'12px', marginBottom:'16px', border:'1px solid #e0e0e0', borderRadius:'4px', outline:'none', resize:'vertical', minHeight:'80px', fontFamily:'inherit'}}
                    />

                    <button 
                      className="place-order-btn" 
                      style={{width:'220px'}} 
                      onClick={() => {
                        if(delivery.name && delivery.phone && delivery.address && delivery.pincode) setStep(3)
                        else alert("Please fill all required fields (*)")
                      }}
                    >
                      DELIVER HERE
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Summary */}
          <div className="checkout-step">
            <div className="step-header" style={{background: step === 3 ? '#2874f0' : 'white', color: step === 3 ? 'white' : 'inherit'}}>
              <span className="step-number">3</span>
              <div className="step-title">ORDER SUMMARY</div>
            </div>
            {step === 3 && (
              <div className="step-body">
                <div style={{background:'#f0f7ff', padding:'12px 16px', borderRadius:'4px', marginBottom:'16px', fontSize:'13px', color:'#2874f0', border:'1px solid #c5d5f9'}}>
                  📦 Delivering to: <strong>{delivery.name}</strong> — {delivery.address}, {delivery.pincode}
                  {deliverTo === 'other' && <span style={{marginLeft:'8px', background:'#ff9f00', color:'white', padding:'1px 6px', borderRadius:'10px', fontSize:'11px'}}>GIFT</span>}
                  <button onClick={() => setStep(2)} style={{marginLeft:'12px', background:'none', border:'none', color:'#2874f0', cursor:'pointer', fontWeight:500, textDecoration:'underline', fontSize:'12px'}}>Change</button>
                </div>

                {cart?.items?.map(item => (
                  <div key={item.id} className="cart-item" style={{borderLeft:'none', borderRight:'none', borderTop:'none'}}>
                    <img src={item.product.image_url} width="60" alt="" style={{objectFit:'contain'}}/>
                    <div style={{marginLeft:'20px', flex:1}}>
                      <p style={{fontWeight:500}}>{item.product.title}</p>
                      <p style={{fontSize:'12px', color:'#878787', marginTop:'4px'}}>Qty: {item.quantity}</p>
                      <p style={{fontWeight:500, marginTop:'4px', color:'#212121'}}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}

                <div style={{padding:'16px', borderTop:'1px solid #f0f0f0', marginTop:'8px'}}>
                  <button className="place-order-btn" onClick={handlePlaceOrder}>
                    PLACE ORDER · ₹{totalAmount.toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Sidebar */}
        <div className="cart-sidebar">
          <div className="sidebar-header">PRICE DETAILS</div>
          <div className="sidebar-content">
            <div className="price-row">
              <span>Price ({cart?.items?.reduce((a,c) => a+c.quantity, 0)} items)</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="price-row">
              <span>Delivery Charges</span>
              <span style={{ color: '#388e3c' }}>FREE</span>
            </div>
            <div className="total-row">
              <span>Amount Payable</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            {deliverTo === 'other' && (
              <div style={{marginTop:'16px', padding:'10px', background:'#fff8e7', borderRadius:'4px', fontSize:'12px', color:'#856400'}}>
                🎁 This is a gift delivery
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
  )
}

export default Checkout
