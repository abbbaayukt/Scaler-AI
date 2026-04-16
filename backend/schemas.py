from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class CategoryBase(BaseModel):
    name: str

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class ProductImage(BaseModel):
    id: int
    url: str
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    image_url: str
    stock: int
    category_id: int

class Product(ProductBase):
    id: int
    category: Category
    images: List[ProductImage] = []
    class Config:
        from_attributes = True

class WishlistItemBase(BaseModel):
    product_id: int

class WishlistItem(WishlistItemBase):
    id: int
    product: Product
    class Config:
        from_attributes = True

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    product: Product
    class Config:
        from_attributes = True

class CartBase(BaseModel):
    user_id: int

class Cart(CartBase):
    id: int
    items: List[CartItem] = []
    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItem(OrderItemBase):
    id: int
    product: Product
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    shipping_address: str
    pincode: str

class OrderBase(OrderCreate):
    user_id: int
    total_amount: float
    status: str

class Order(OrderBase):
    id: int
    items: List[OrderItem] = []
    class Config:
        from_attributes = True
