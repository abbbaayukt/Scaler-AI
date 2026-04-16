from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from routers.users import get_current_user
from utils.mailer import send_order_confirmation

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=schemas.Order)
def place_order(order_req: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    total_amount = sum(item.quantity * item.product.price for item in cart.items)
    
    # Create Order
    new_order = models.Order(
        user_id=current_user.id,
        total_amount=total_amount,
        shipping_address=order_req.shipping_address,
        customer_name=order_req.customer_name,
        customer_phone=order_req.customer_phone,
        pincode=order_req.pincode,
        status="Placed"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Move cart items to order items and empty cart
    for item in cart.items:
        order_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        db.add(order_item)
        db.delete(item) # delete from cart
        
    db.commit()
    db.refresh(new_order)
    
    # Send confirmation email (or print to terminal)
    try:
        send_order_confirmation(current_user.email, new_order.id, new_order.shipping_address)
    except Exception as e:
        print(f"Mailer error: {e}")

    
    return new_order

@router.get("/", response_model=List[schemas.Order])
def get_orders(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
