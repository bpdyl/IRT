from os import environ
from django.core.exceptions import ImproperlyConfigured
from rest_framework.views import exception_handler


def get_env_var(key):
    try:
        return environ[key]
    except KeyError:
        raise ImproperlyConfigured(f"Missing {key} environment variable.")
    
def api_exception_handler(exc, context=None):
    response = exception_handler(exc, context=context)
    if response and isinstance(response.data, dict):
        response.data = {'message': response.data.get('detail', 'API Error')}
    else:
        response.data = {'message': 'API Error'}
    return response