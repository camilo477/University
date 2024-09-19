from django.urls import path, include
from . import views
from .views import get_all_course_registrations

urlpatterns = [
    path('create/', views.create_course_registration, name='create_course_registration'),
    path('registrations/', get_all_course_registrations, name='get_all_course_registrations'),
]