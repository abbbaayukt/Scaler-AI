import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null); 
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
      fetchCart();
      fetchWishlist();
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API_URL}/wishlist/`);
      setWishlist(res.data);
    } catch(err) { console.error("No wishlist"); }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/me`);
      setUser(res.data);
    } catch (err) {
      console.log("Not logged in");
      logout();
    }
  }

  const fetchCart = async () => {
    try {
      const cartRes = await axios.get(`${API_URL}/cart/`);
      setCart(cartRes.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const login = async (email, password) => {
    const authRes = await axios.post(`${API_URL}/users/login`, new URLSearchParams({
      username: email,
      password: password
    }));
    const token = authRes.data.access_token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await fetchUser();
    await fetchCart();
    await fetchWishlist();
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCart({ items: [] });
    setWishlist([]);
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert("Please login to add items to your cart!");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/cart/items`, { product_id: productId, quantity });
      setCart(res.data);
      alert("Added to Cart Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart!");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete(`${API_URL}/cart/items/${itemId}`);
      setCart(res.data);
    } catch (error) { console.error(error); }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await axios.put(`${API_URL}/cart/items/${itemId}?quantity=${quantity}`);
      setCart(res.data);
    } catch (error) { console.error(error); }
  };

  const toggleWishlist = async (productId) => {
    if (!user) return alert("Please login to manage wishlist");
    try {
      const existing = wishlist.find(w => w.product_id === productId);
      if (existing) {
        await axios.delete(`${API_URL}/wishlist/${productId}`);
      } else {
        await axios.post(`${API_URL}/wishlist/`, { product_id: productId });
      }
      await fetchWishlist();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <StoreContext.Provider value={{ cart, user, wishlist, login, logout, addToCart, removeFromCart, updateQuantity, toggleWishlist, API_URL }}>
      {children}
    </StoreContext.Provider>
  );
};
