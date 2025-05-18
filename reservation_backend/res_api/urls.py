from django.urls import path, include
import res_api.views as views

urlpatterns = [
    path('auth/login', views.login),
    path('auth/signup', views.register),
    path('api/verify', views.verify_loggedin)
]