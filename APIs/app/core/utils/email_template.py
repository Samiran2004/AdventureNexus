def subscribe_daily_mail_email_data(user_mail):
    return {
        "to": user_mail,
        "subject": "Welcome to AdventureNexus Daily Tips!",
        "html": "<h1>Welcome!</h1><p>You have successfully subscribed to daily travel tips.</p>"
    }

def send_daily_tip_email_data(user_mail, tip_data):
    # Tip data is an object
    return {
        "to": user_mail,
        "subject": "Your Daily Travel Tip",
        "html": f"<h1>Daily Tip</h1><p>{tip_data.get('tip', 'Explore the world!')}</p>"
    }

def register_email_data(first_name, email):
    return {
        "to": email,
        "subject": "Welcome to AdventureNexus!",
        "html": f"<h1>Hello {first_name}!</h1><p>Welcome to our community.</p>"
    }

def delete_user_email_data(first_name, email):
    return {
        "to": email,
        "subject": "Goodbye from AdventureNexus",
        "html": f"<h1>Goodbye {first_name}</h1><p>We are sorry to see you go.</p>"
    }
