from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from routers.users import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])

@router.get("/", response_model=schemas.Cart)
def get_cart(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()
    if not cart:
        cart = models.Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

@router.post("/items", response_model=schemas.Cart)
def add_item_to_cart(item: schemas.CartItemCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()
    
    # Verify product
    product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Check if item exists in cart
    cart_item = db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id, models.CartItem.product_id == item.product_id).first()
    
    if cart_item:
        cart_item.quantity += item.quantity
    else:
        cart_item = models.CartItem(cart_id=cart.id, product_id=item.product_id, quantity=item.quantity)
        db.add(cart_item)
        
    db.commit()
    db.refresh(cart)
    return cart

@router.delete("/items/{item_id}", response_model=schemas.Cart)
def remove_item(item_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()
    cart_item = db.query(models.CartItem).filter(models.CartItem.id == item_id, models.CartItem.cart_id == cart.id).first()
    
    if cart_item:
        db.delete(cart_item)
        db.commit()
        db.refresh(cart)
        
    return cart

@router.put("/items/{item_id}", response_model=schemas.Cart)
def update_item_quantity(item_id: int, quantity: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()
    cart_item = db.query(models.CartItem).filter(models.CartItem.id == item_id, models.CartItem.cart_id == cart.id).first()
    
    if cart_item:
        if quantity <= 0:
            db.delete(cart_item)
        else:
            cart_item.quantity = quantity
        db.commit()
        db.refresh(cart)
        
    return cart
