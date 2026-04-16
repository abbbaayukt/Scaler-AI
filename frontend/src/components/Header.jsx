import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Heart, Package } from 'lucide-react'
import { StoreContext } from '../context/StoreContext'

const Header = () => {
  const { cart, user, logout } = useContext(StoreContext)
  const navigate = useNavigate()
  
  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.elements.q.value
    if(query) navigate(`/?search=${query}`)
    else navigate('/')
  }

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-section">
          <span>Flipkart</span>
          <span className="explore">Explore Plus</span>
        </Link>
        
        <form className="search-bar" onSubmit={handleSearch}>
          <input type="text" name="q" placeholder="Search for products, brands and more" />
          <button type="submit" className="search-btn">
            <Search size={20} />
          </button>
        </form>

        <div className="header-actions">
          {user ? (
            <div className="dropdown">
              <button className="login-btn user-btn">{user.email.split('@')[0]}</button>
              <div className="dropdown-content">
                <Link to="/orders"><Package size={16}/> Orders</Link>
                <Link to="/wishlist"><Heart size={16}/> Wishlist</Link>
                <a onClick={logout} style={{cursor:'pointer', color:'red'}}>Logout</a>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-btn" style={{textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center'}}>Login</Link>
          )}
          
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={20} style={{marginRight: '8px'}} />
            Cart
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
