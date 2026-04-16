from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from routers.users import get_current_user

router = APIRouter(prefix="/wishlist", tags=["wishlist"])

@router.get("/", response_model=List[schemas.WishlistItem])
def get_wishlist(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.WishlistItem).filter(models.WishlistItem.user_id == current_user.id).all()

@router.post("/", response_model=schemas.WishlistItem)
def add_to_wishlist(item: schemas.WishlistItemBase, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    existing = db.query(models.WishlistItem).filter(
        models.WishlistItem.user_id == current_user.id,
        models.WishlistItem.product_id == item.product_id
    ).first()
    if existing:
        return existing
        
    new_item = models.WishlistItem(user_id=current_user.id, product_id=item.product_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    item = db.query(models.WishlistItem).filter(
        models.WishlistItem.user_id == current_user.id,
        models.WishlistItem.product_id == product_id
    ).first()
    if item:
        db.delete(item)
        db.commit()
    return {"status": "ok"}
