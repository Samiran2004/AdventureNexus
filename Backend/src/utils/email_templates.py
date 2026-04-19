def register_email_data(name: str, email: str) -> str:
    return f"<h1>Welcome to AdventureNexus, {name}!</h1><p>We are excited to have you.</p>"

def delete_user_email_data(name: str, email: str) -> str:
    return f"<h1>Goodbye, {name}!</h1><p>Your account has been deleted.</p>"
