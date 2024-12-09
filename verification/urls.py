from django.urls import path
from . import views

urlpatterns = [
    # path('email-verification/', views.email_verification, name='email_verification'),
    path('email-verification/', views.email_verification, name='email_verification'),
    path('send-verification-code/', views.send_verification_code, name='send_verification_code'),
    path('verify-code/', views.verify_code, name='verify_code'),
    path('resend-code/', views.resend_code, name='resend_code'),
    path('success/', views.success, name='success'),
    path('send-test-email/', views.send_test_email, name='send_test_email'), 
]


