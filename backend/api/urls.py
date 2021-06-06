from django.urls import path
from . import views

urlpatterns = [
    path('sanity-check/', views.sanity_check, name='sanity-check'),
    path('csrf/', views.csrf, name='csrf'),
]