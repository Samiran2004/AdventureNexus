from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import traceback
from src.core.config import settings

def setup_exception_handlers(app: FastAPI):
    
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        response_data = {
            "status": "Failed",
            "message": str(exc.detail),
            "errorStack": "".join(traceback.format_exception(type(exc), exc, exc.__traceback__)) if settings.NODE_ENV == 'development' else ""
        }
        return JSONResponse(status_code=exc.status_code, content=response_data)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        # Flatten pydantic errors
        errors = [f"{err['loc'][-1]}: {err['msg']}" for err in exc.errors()]
        response_data = {
            "status": "Failed",
            "message": "Validation Error",
            "errors": errors,
            "errorStack": "".join(traceback.format_exception(type(exc), exc, exc.__traceback__)) if settings.NODE_ENV == 'development' else ""
        }
        return JSONResponse(status_code=422, content=response_data)

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        response_data = {
            "status": "Failed",
            "message": str(exc),
            "errorStack": "".join(traceback.format_exception(type(exc), exc, exc.__traceback__)) if settings.NODE_ENV == 'development' else ""
        }
        return JSONResponse(status_code=500, content=response_data)
