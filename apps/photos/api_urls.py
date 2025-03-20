
from django.urls import path
from . import api_views

app_name = 'photos_api'

urlpatterns = [
    path('photos/', api_views.PhotoListAPIView.as_view(), name='photo_list'),
    path('photos/<int:pk>/', api_views.PhotoDetailAPIView.as_view(), name='photo_detail'),
    path('faces/', api_views.FaceListAPIView.as_view(), name='face_list'),
    path('faces/<int:pk>/', api_views.FaceDetailAPIView.as_view(), name='face_detail'),
    path('photos/filter/', api_views.FilteredPhotoListAPIView.as_view(), name='filtered_photos'),
    path('process-photos/', api_views.ProcessPhotosAPIView.as_view(), name='process_photos'),
]
