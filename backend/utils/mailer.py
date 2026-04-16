import os

def send_order_confirmation(email: str, order_id: int, address: str):
    api_key = os.getenv("MAIL_API_KEY")
    if api_key:
        print(f"Sending real email using key {api_key}")
        # Insert actual sending logic here (e.g. SMTP or Resend API)
    else:
        print("\n" + "="*50)
        print("MAIL_API_KEY not found. Logging email to terminal:")
        print(f"To: {email}")
        print(f"Subject: Order Confirmation - Order #{order_id}")
        print(f"Body: Thank you for shopping with us! Your order #{order_id} has been placed successfully and will be shipped to {address}.")
        print("="*50 + "\n")
