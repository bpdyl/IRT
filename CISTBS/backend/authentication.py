import threading
from rest_framework_simplejwt.authentication import JWTAuthentication

_thread_locals = threading.local()

def get_current_user():
    return getattr(_thread_locals, 'user', None)

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        user_auth_tuple = super().authenticate(request)
        if user_auth_tuple is not None:
            user, _ = user_auth_tuple
            _thread_locals.user = user
        else:
            _thread_locals.user = None
        return user_auth_tuple
