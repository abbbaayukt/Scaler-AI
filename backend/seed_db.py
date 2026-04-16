import os
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
import random

def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create dummy user
    dummy_user = models.User(
        email="user@flipkart.com",
        hashed_password="$5$rounds=535000$bCKeojkcikrEudEC$sv9aOhh5Up0Fxtuswznq5FGV89fk2uq8/ZHAt3NkHID"
    )
    db.add(dummy_user)
    db.commit()
    db.refresh(dummy_user)
    
    cart = models.Cart(user_id=dummy_user.id)
    db.add(cart)
    db.commit()

    # Create categories
    cats = {
        "Mobiles": models.Category(name="Mobiles"),
        "Fashion": models.Category(name="Fashion"),
        "Electronics": models.Category(name="Electronics"),
        "Home": models.Category(name="Home"),
        "Appliances": models.Category(name="Appliances")
    }
    for c in cats.values(): db.add(c)
    db.commit()
    for c in cats.values(): db.refresh(c)

    # Reusable images for multi-image thumbnails (generic to category, using Placehold.co to prevent Unsplash rate limiting)
    secondary_images = {
        "Mobiles": [
            "https://placehold.co/500x500/f1f3f6/212121?text=Mobile+Angle+1",
            "https://placehold.co/500x500/f1f3f6/212121?text=Mobile+Angle+2"
        ],
        "Fashion": [
            "https://placehold.co/500x500/f1f3f6/212121?text=Fashion+View+1",
            "https://placehold.co/500x500/f1f3f6/212121?text=Fashion+View+2"
        ],
        "Electronics": [
            "https://placehold.co/500x500/f1f3f6/212121?text=Side+Angle",
            "https://placehold.co/500x500/f1f3f6/212121?text=Back+Angle"
        ],
        "Home": [
            "https://placehold.co/500x500/f1f3f6/212121?text=Living+Room",
            "https://placehold.co/500x500/f1f3f6/212121?text=Room+View"
        ],
        "Appliances": [
            "https://placehold.co/500x500/f1f3f6/212121?text=Appliance+Scale",
            "https://placehold.co/500x500/f1f3f6/212121?text=Appliance+Open"
        ]
    }

    # ~35 Products
    raw_products = [
        # Mobiles (8)
        {"t": "Smartphone Pro Max (256 GB)", "d": "The most advanced smartphone featuring AI.", "p": 129999.0, "i": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500", "c": "Mobiles"},
        {"t": "Galaxy S24 Ultra 5G", "d": "Epic cameras. Epic display. Built-in S-Pen.", "p": 134999.0, "i": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=500", "c": "Mobiles"},
        {"t": "Pixel 8 Pro Obsedian", "d": "Google's highest tier flagship camera phone.", "p": 105999.0, "i": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?q=80&w=500", "c": "Mobiles"},
        {"t": "Nothing Phone (2) Dark", "d": "Unique glyph interface with transparent back.", "p": 44999.0, "i": "https://images.unsplash.com/photo-1621330396167-e3d81bdcb781?q=80&w=500", "c": "Mobiles"},
        {"t": "OnePlus 12R Iron Gray", "d": "Flagship killer with massive 5500mAh battery.", "p": 39999.0, "i": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=500", "c": "Mobiles"},
        {"t": "Moto Edge 50 Fusion", "d": "Beautiful curved pOLED display, 144Hz.", "p": 22999.0, "i": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=500", "c": "Mobiles"},
        {"t": "Poco X6 Neo 5G", "d": "Affordable gaming performance with active cooling.", "p": 15999.0, "i": "https://images.unsplash.com/photo-1512054502232-10a0a035d672?q=80&w=500", "c": "Mobiles"},
        {"t": "Vivo V30e Silk Blue", "d": "Premium finish with ultra-slim profile.", "p": 27999.0, "i": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=500", "c": "Mobiles"},

        # Fashion (9)
        {"t": "Running Sneakers For Men", "d": "Lightweight mesh upper, comfortable and stylish.", "p": 1499.0, "i": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500", "c": "Fashion"},
        {"t": "Men Slim Fit Checked Casual Shirt", "d": "Crafted from pure cotton.", "p": 999.0, "i": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=500", "c": "Fashion"},
        {"t": "Women Flowy Summer Dress", "d": "Breathable floral design for summer outings.", "p": 1299.0, "i": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=500", "c": "Fashion"},
        {"t": "Classic Aviator Sunglasses", "d": "UV400 protection with polarized lenses.", "p": 799.0, "i": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500", "c": "Fashion"},
        {"t": "Premium Leather Wallet", "d": "RFID blocking minimalist genuine leather wallet.", "p": 499.0, "i": "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=500", "c": "Fashion"},
        {"t": "Unisex Winter Beanie", "d": "Warm ribbed knit acrylic beanie.", "p": 299.0, "i": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=500", "c": "Fashion"},
        {"t": "High Rise Denim Jeans", "d": "Stretchable high-rise fitted jeans.", "p": 1799.0, "i": "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500", "c": "Fashion"},
        {"t": "Digital Sports Watch", "d": "Water resistant up to 50m with stopwatch.", "p": 899.0, "i": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500", "c": "Fashion"},
        {"t": "Formal Leather Oxford Shoes", "d": "Classic design for business environments.", "p": 2499.0, "i": "https://images.unsplash.com/photo-1614252339460-e1b697fb379c?q=80&w=500", "c": "Fashion"},

        # Electronics (8)
        {"t": "Bluetooth Noise Canceling Headset", "d": "Up to 30 hours of battery life with extreme clarity and bass extension.", "p": 29990.0, "i": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500", "c": "Electronics"},
        {"t": "Premium Laptop - 8GB/256GB SSD", "d": "Strikingly thin design. Fast and capable.", "p": 99990.0, "i": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500", "c": "Electronics"},
        {"t": "Mirrorless Digital Camera 4K UHD", "d": "Compact and lightweight. 24.2 MP.", "p": 72990.0, "i": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500", "c": "Electronics"},
        {"t": "True Wireless Earbuds", "d": "Sweatproof with active noise cancellation and spatial audio.", "p": 12999.0, "i": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=500", "c": "Electronics"},
        {"t": "Mechanical Gaming Keyboard", "d": "RGB backlit with tactile blue switches.", "p": 3499.0, "i": "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=500", "c": "Electronics"},
        {"t": "Wireless Gaming Mouse", "d": "Ultra-lightweight wireless optical mouse, 20k DPI.", "p": 4999.0, "i": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=500", "c": "Electronics"},
        {"t": "Smart Home Hub Speaker", "d": "Voice controlled smart assistant speaker.", "p": 3999.0, "i": "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=500", "c": "Electronics"},
        {"t": "4K Ultra Wide Monitor 34-inch", "d": "Immersive curved display perfect for productivity.", "p": 34999.0, "i": "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=500", "c": "Electronics"},
        
        # Home (6)
        {"t": "Premium 3-Seater Sofa", "d": "Comfortable velvet finish for modern living rooms.", "p": 24990.0, "i": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500", "c": "Home"},
        {"t": "Minimalist Coffee Table", "d": "Wood and iron mixed construction.", "p": 4500.0, "i": "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=500", "c": "Home"},
        {"t": "Ergonomic Office Chair", "d": "Lumbar support and breathable mesh back.", "p": 7999.0, "i": "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=500", "c": "Home"},
        {"t": "Ceramic Dinner Set (12 Pcs)", "d": "Microwave safe elegant dining set.", "p": 1299.0, "i": "https://images.unsplash.com/photo-1623863456891-628d0db8332c?q=80&w=500", "c": "Home"},
        {"t": "Indoor Potted Monstera", "d": "Beautiful air-purifying low maintenance plant.", "p": 699.0, "i": "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=500", "c": "Home"},
        {"t": "Warm White Fairy Lights", "d": "10 meters LED string for bedroom decors.", "p": 299.0, "i": "https://images.unsplash.com/photo-1514867448554-47f2ef8a1a38?q=80&w=500", "c": "Home"},

        # Appliances (6)
        {"t": "8 kg 5 Star Front Load Washing Machine", "d": "AI technology calculates weight and softness.", "p": 34990.0, "i": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=500", "c": "Appliances"},
        {"t": "Smart Vacuum Cleaner Total Clean", "d": "Intelligently optimizes suction and run time.", "p": 54900.0, "i": "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=500", "c": "Appliances"},
        {"t": "Double Door Refrigerator 300L", "d": "Frost free with convertible freezer zones.", "p": 28990.0, "i": "https://images.unsplash.com/photo-1584288079860-236bceeb799f?q=80&w=500", "c": "Appliances"},
        {"t": "Microwave Convection Oven 28L", "d": "Features auto-cook menus for easy dining.", "p": 12999.0, "i": "https://images.unsplash.com/photo-1585659722983-3a6750ab8fc5?q=80&w=500", "c": "Appliances"},
        {"t": "Digital Air Fryer 4.5L", "d": "Oil-free frying with precisely controlled temperatures.", "p": 4999.0, "i": "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500", "c": "Appliances"},
        {"t": "Vertical Tower Fan 3-Speed", "d": "Quiet cooling with oscillating capabilities.", "p": 2499.0, "i": "https://images.unsplash.com/photo-1618296303254-2699f4d25ce4?q=80&w=500", "c": "Appliances"},
    ]

    for item in raw_products:
        cat = cats[item["c"]]
        prod = models.Product(
            title=item["t"],
            description=item["d"],
            price=item["p"],
            image_url=item["i"],
            stock=random.choice([0, 15, 50, 100, 200]),
            category_id=cat.id
        )
        db.add(prod)
        db.commit()
        
        # Assign multiple images: main + generic category ones
        images = [models.ProductImage(product_id=prod.id, url=item["i"])]
        for simg in secondary_images[item["c"]]:
            images.append(models.ProductImage(product_id=prod.id, url=simg))
        
        db.add_all(images)
        db.commit()

    # Add a product to the dummy wishlist just for testing
    first_mobile = db.query(models.Product).filter(models.Product.category_id == cats["Mobiles"].id).first()
    if first_mobile:
        db.add(models.WishlistItem(user_id=dummy_user.id, product_id=first_mobile.id))
        db.commit()

    print("Database seamlessly seeded with ~35 high-quality products via iterative generator!")
    db.close()

if __name__ == "__main__":
    seed()
