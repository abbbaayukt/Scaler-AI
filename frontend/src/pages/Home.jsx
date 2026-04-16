import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../context/StoreContext'
import { Heart } from 'lucide-react'

const Home = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  
  const { API_URL, toggleWishlist, wishlist } = useContext(StoreContext)

  useEffect(() => {
    // We could fetch categories dynamically, but we'll mock the icons structure
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/`)
        setProducts(res.data)
      } catch (error) {
        console.error("Failed to fetch products", error)
      }
    }
    fetchProducts()
  }, [API_URL])

  const handleWishlist = (e, id) => {
    e.preventDefault()
    toggleWishlist(id)
  }

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCat ? p.category.name === selectedCat : true;
    const matchesSearch = searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesCat && matchesSearch;
  })

  return (
    <div>
      <div className="categories-strip">
        <div className="category-item" onClick={() => setSelectedCat(null)}>
          <img src="https://rukminim2.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100" alt="All" width="64" />
          <span style={{ fontWeight: selectedCat===null ? 'bold' : 'normal', color: selectedCat===null ? '#2874f0' : 'inherit' }}>All Offers</span>
        </div>
        <div className="category-item" onClick={() => setSelectedCat(selectedCat === 'Mobiles' ? null : 'Mobiles')}>
          <img src="https://rukminim2.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100" alt="Mobiles" width="64" />
          <span style={{ fontWeight: selectedCat==='Mobiles' ? 'bold' : 'normal', color: selectedCat==='Mobiles' ? '#2874f0' : 'inherit' }}>Mobiles</span>
        </div>
        <div className="category-item" onClick={() => setSelectedCat(selectedCat === 'Fashion' ? null : 'Fashion')}>
          <img src="https://rukminim2.flixcart.com/flap/128/128/image/c12afc017e6f24cb.png?q=100" alt="Fashion" width="64" />
          <span style={{ fontWeight: selectedCat==='Fashion' ? 'bold' : 'normal', color: selectedCat==='Fashion' ? '#2874f0' : 'inherit' }}>Fashion</span>
        </div>
        <div className="category-item" onClick={() => setSelectedCat(selectedCat === 'Electronics' ? null : 'Electronics')}>
          <img src="https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100" alt="Electronics" width="64" />
          <span style={{ fontWeight: selectedCat==='Electronics' ? 'bold' : 'normal', color: selectedCat==='Electronics' ? '#2874f0' : 'inherit' }}>Electronics</span>
        </div>
        <div className="category-item" onClick={() => setSelectedCat(selectedCat === 'Home' ? null : 'Home')}>
          <img src="https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100" alt="Home" width="64" />
          <span style={{ fontWeight: selectedCat==='Home' ? 'bold' : 'normal', color: selectedCat==='Home' ? '#2874f0' : 'inherit' }}>Home</span>
        </div>
        <div className="category-item" onClick={() => setSelectedCat(selectedCat === 'Appliances' ? null : 'Appliances')}>
          <img src="https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100" alt="Appliances" width="64" />
          <span style={{ fontWeight: selectedCat==='Appliances' ? 'bold' : 'normal', color: selectedCat==='Appliances' ? '#2874f0' : 'inherit' }}>Appliances</span>
        </div>
      </div>

      <div className="carousel-banner">
        <img src="https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/352e6f0f8034fab5.jpg?q=20" alt="Sale Banner" />
      </div>

      <div className="section-title">
        <h2>{selectedCat ? `Best of ${selectedCat}` : 'Top Offers on Gadgets & Fashion'}</h2>
        <button className="view-all-btn" onClick={() => { setSelectedCat(null); setSearchParams({}); }} style={{background:'var(--fk-blue)', color:'white', border:'none', padding:'8px 16px', borderRadius:'2px', cursor:'pointer', fontWeight:500}}>VIEW ALL</button>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card fk-shadow" style={{position:'relative'}}>
            <button className="wishlist-overlay-btn" onClick={(e) => handleWishlist(e, product.id)}>
              <Heart size={20} color={wishlist?.some(w => w.product_id === product.id) ? "red" : "#c2c2c2"} fill={wishlist?.some(w => w.product_id === product.id) ? "red" : "none"} />
            </button>
            <div className="card-img-container">
              <img src={product.image_url} alt={product.title} className="product-image hover-zoom" />
            </div>
            <div className="product-title" title={product.title}>{product.title}</div>
            <div className="product-review-badge">
              4.5 ★ <span className="review-count">(1,245)</span>
            </div>
            <div className="product-price">
              ₹{product.price.toLocaleString('en-IN')} 
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" height="18" style={{marginLeft: '8px'}} alt="assured" />
            </div>
            <div className="free-delivery">Free Delivery</div>
            {product.stock === 0 && <div style={{color:'red', fontWeight:500, fontSize:'12px', marginTop:'4px'}}>Out of Stock</div>}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
