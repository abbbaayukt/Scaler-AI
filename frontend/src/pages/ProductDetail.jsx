import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../context/StoreContext'

const ProductDetail = () => {
  const { id } = useParams()
  const { API_URL, addToCart, user } = useContext(StoreContext)
  const [product, setProduct] = useState(null)
  const [similar, setSimilar] = useState([])
  const [activeImg, setActiveImg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/${id}`)
        setProduct(res.data)
        setActiveImg(res.data.image_url) // Default image

        const simRes = await axios.get(`${API_URL}/products/${id}/similar`)
        setSimilar(simRes.data)
      } catch (error) {
        console.error("Failed to fetch product details", error)
      }
    }
    fetchData()
  }, [id, API_URL])

  if (!product) return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
      <div style={{padding: '0 24px'}}>
        <button onClick={() => window.history.back()} style={{background:'none', border:'none', color:'#2874f0', cursor:'pointer', fontWeight:500, fontSize:'14px', padding:'10px 0'}}>
          ← Back to previous page
        </button>
      </div>
      <div className="product-detail-container responsive-flex">
        <div className="product-left">
          
          <div className="multi-img-container">
            <div className="img-thumbnails">
              <div 
                className={`thumb-box ${activeImg === product.image_url ? 'active' : ''}`}
                onMouseEnter={() => setActiveImg(product.image_url)}
              >
                <img src={product.image_url} alt="main" />
              </div>
              {product.images && product.images.map((imgObj) => (
                <div 
                  key={imgObj.id} 
                  className={`thumb-box ${activeImg === imgObj.url ? 'active' : ''}`}
                  onMouseEnter={() => setActiveImg(imgObj.url)}
                >
                  <img src={imgObj.url} alt="alt" />
                </div>
              ))}
            </div>
            
            <div className="main-img-display">
              <img src={activeImg} alt={product.title} className="product-large-image" />
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-add-cart" 
              onClick={() => addToCart(product.id, 1)}
              style={{ opacity: product.stock === 0 ? 0.5 : 1}}
              disabled={product.stock === 0}
            >
              <svg width="16" height="16" viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg"><path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.137.175.23.32.23h8.418l-.493 1.958H3.768l.002.003c-.017 0-.033-.003-.05-.003-1.06 0-1.92.86-1.92 1.92s.86 1.92 1.92 1.92c.99 0 1.805-.75 1.91-1.712l5.55.076c.12.922.91 1.636 1.867 1.636 1.04 0 1.885-.844 1.885-1.885 0-.866-.584-1.593-1.38-1.814l2.423-8.832c.12-.433-.206-.86-.655-.86" fill="#fff"></path></svg>
              ADD TO CART
            </button>
            <button 
              className="btn-buy-now"
              onClick={async () => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                await addToCart(product.id, 1);
                navigate('/checkout');
              }}
              style={{ opacity: product.stock === 0 ? 0.5 : 1}}
              disabled={product.stock === 0}
            >
              <svg width="14" height="18" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M11.666 4.904h-1.662V3.46c0-1.638-1.36-2.97-3.004-2.97-1.64 0-2.996 1.332-2.996 2.97v1.444H2.33C1.6 4.904 1 5.513 1 6.25v6.26c0 .736.6 1.345 1.33 1.345h9.336c.732 0 1.334-.609 1.334-1.345V6.25c0-.737-.602-1.346-1.334-1.346zM6.634 10.42c-.513 0-.93-.423-.93-.941 0-.517.417-.94.93-.94.512 0 .93.423.93.94 0 .518-.418.94-.93.94zm1.967-5.516H4.428V3.46c0-.986.817-1.787 1.821-1.787s1.82.801 1.82 1.787v1.444z" fill="#fff"></path></svg>
              BUY NOW
            </button>
          </div>
        </div>
        
        <div className="product-right">
          <div className="detail-title">{product.title}</div>
          <div className="product-review-badge">
            4.5 ★ <span className="review-count">1,245 Ratings & 183 Reviews</span>
          </div>
          <div className="detail-price">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          
          <div className="stock-status" style={{fontSize:'16px', fontWeight:500, color: product.stock > 0 ? '#388e3c' : '#ff6161', marginBottom:'16px'}}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Currently Out of Stock"}
          </div>

          <div className="offers">
            <p><strong>Available offers</strong></p>
            <p className="offer-tag">Tag: Special PriceGet extra 10% off (price inclusive of cashback/coupon)</p>
            <p className="offer-tag">Bank Offer: 5% Cashback on Flipkart Axis Bank Card</p>
          </div>
          
          <div className="product-description" style={{marginTop:'30px'}}>
            <h3>Product Description</h3>
            <p style={{marginTop:'10px', color:'#212121', lineHeight:'1.6'}}>{product.description}</p>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div style={{background:'white', padding:'24px', boxShadow:'0 1px 2px 0 rgba(0,0,0,.1)'}}>
          <h2>Similar Products</h2>
          <div className="product-grid" style={{marginTop:'16px', padding:0}}>
            {similar.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} className="product-card fk-shadow">
                <div className="card-img-container">
                  <img src={p.image_url} alt={p.title} className="product-image hover-zoom" />
                </div>
                <div className="product-title" title={p.title}>{p.title}</div>
                <div className="product-price">₹{p.price.toLocaleString('en-IN')}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
