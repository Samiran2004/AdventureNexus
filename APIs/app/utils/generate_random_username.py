import random
import string

def generate_random_username(fullname: str) -> str:
    # Logic: First name + random 4 digits
    name_part = fullname.split(" ")[0].lower()
    random_digits = ''.join(random.choices(string.digits, k=4))
    return f"{name_part}{random_digits}"
