from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET
from django.middleware.csrf import get_token
import json

# Create your views here.
def sanity_check(request):
    if request.method == 'GET':
        return JsonResponse({'data': 'GET OK'})
    elif request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body_data = json.loads(body_unicode)
        return JsonResponse({'data': body_data['message']})
        pass
    else:
        return JsonResponse({'error': 'Method must be GET or POST'})

@require_GET
def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})