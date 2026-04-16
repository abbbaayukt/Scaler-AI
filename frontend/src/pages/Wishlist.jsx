import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { StoreContext } from '../context/StoreContext'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'

const Wishlist = () => {
  const { API_URL, user } = useContext(StoreContext)
  const [wishlist, setWishlist] = useState([])
  const navigate = useNavigate()

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API_URL}/wishlist/`)
      setWishlist(res.data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return;
    }
    fetchWishlist()
  }, [API_URL, user, navigate])

  const remove = async (id) => {
    await axios.delete(`${API_URL}/wishlist/${id}`)
    fetchWishlist()
  }

  return (
    <div className="wishlist-container">
      <div style={{padding: '0', marginBottom: '16px'}}>
        <button onClick={() => window.history.back()} style={{background:'none', border:'none', color:'#2874f0', cursor:'pointer', fontWeight:500, fontSize:'14px', padding:'10px 0'}}>
          ← Back to previous page
        </button>
      </div>
      <h2 style={{background:"white", padding:"16px", marginBottom:"16px"}}>My Wishlist ({wishlist.length})</h2>
      <div className="wishlist-grid">
        {wishlist.map(w => (
          <div key={w.id} className="wishlist-card">
            <Link to={`/product/${w.product.id}`}>
              <img src={w.product.image_url} alt="w" />
              <p className="w-title">{w.product.title}</p>
              <p className="w-price">₹{w.product.price.toLocaleString('en-IN')}</p>
            </Link>
            <button className="delete-wish" onClick={() => remove(w.product.id)}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
