
from django.urls import path
from . import views

app_name = 'photos'

urlpatterns = [
    path('', views.photo_list, name='photo_list'),
    path('connect/', views.connect_google_photos, name='connect_google_photos'),
    path('callback/', views.google_auth_callback, name='google_auth_callback'),
    path('faces/', views.face_list, name='face_list'),
    path('faces/<int:face_id>/', views.face_detail, name='face_detail'),
    path('process-photos/', views.process_photos, name='process_photos'),
]
