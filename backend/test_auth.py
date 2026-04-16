import os
import sys
sys.path.append(os.getcwd())

from utils.auth import verify_password, get_password_hash
from database import SessionLocal
import models
import logging

logging.basicConfig(level=logging.INFO)

def test():
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.email == "user@flipkart.com").first()
    if user:
        logging.info("User found")
        pw = "password"
        logging.info(f"DB hash: {user.hashed_password}")
        try:
            match = verify_password(pw, user.hashed_password)
            logging.info(f"Match: {match}")
            
            # What does it generate for "password"?
            new_hash = get_password_hash("password")
            logging.info(f"New Hash from get_password_hash: {new_hash}")
        except Exception as e:
            logging.error(f"Error matching: {e}")
    else:
        logging.info("User NOT found")

if __name__ == "__main__":
    test()
