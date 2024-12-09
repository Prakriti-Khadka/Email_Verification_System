from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

# This is to redirect the root URL to the email_verification page
urlpatterns = [
    path('admin/', admin.site.urls),
    path('verification/', include('verification.urls')),
    path('', lambda request: redirect('verification/email-verification')),  # Redirect root URL to the verification page
]








