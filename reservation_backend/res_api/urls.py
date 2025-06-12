from django.urls import path, include
import res_api.views as views

urlpatterns = [
    path('auth/login', views.login),
    path('auth/signup', views.register),
    path('api/verify', views.verify_loggedin),
    path('api/chat/voice',views.voice_message),
    path('api/chat/',views.text_message),
    path('api/reservation/<int:user_id>',views.reservation_info),
    path('api/restaurants',views.restaurant_info),
    path('api/messages/<int:user_id>',views.chat_info),
    path('api/restaurant/reservations/<str:restaurant_name>',views.restaurant_reservations),
    path('api/restaurants',views.restaurant_info),
    path('api/menu', views.menu_list_create),  # GET: list menus, POST: create menu item
    path('api/menu/<int:menu_id>', views.menu_detail),  # GET, PUT, DELETE specific menu item
    path('api/menu/<int:menu_id>/toggle', views.toggle_menu_item_availability),  # PATCH: toggle sold out status
]