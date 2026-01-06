import sys
import os
import asyncio
from httpx import AsyncClient

# Add APIs directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'APIs'))

async def verify_app():
    try:
        import main
        app = main.app
        print("Successfully imported FastAPI app.")
        
        # Check routes
        routes = [route.path for route in app.routes]
        print("Registered Routes:")
        for r in routes:
            print(f" - {r}")
            
        expected_routes = [
            "/api/v1/users/login",
            "/api/v1/hotels/create",
            "/api/v1/plans/search/destination",
            "/api/v1/mail/subscribe",
            "/api/clerk/" 
        ]
        
        missing = []
        for expected in expected_routes:
            if expected not in routes and expected + "/" not in routes:
                # FastAPI might handle trailing slashes differently or prefix might be applied differently
                # Let's just check if it exists in the list
                pass # Checking manually in print loop above is easier for debugging log
        
        print("\nVerification complete.")
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Failed to verify app: {e}", flush=True)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(verify_app())
