import random

def generate_pnr() -> str:
    """
    Generates a 10-digit random PNR number.
    e.g. 8472910384
    """
    return str(random.randint(1000000000, 9999999999))
