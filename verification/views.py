from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.http import JsonResponse
from django.conf import settings
from django.utils.timezone import now, timedelta
import random
import json


# Temporary storage for simplicity
verification_codes = {}  # Format: {email: {"code": str, "expires_at": datetime}}

# Helper function to generate verification code
def generate_verification_code():
    return str(random.randint(100000, 999999))

# View to render email verification form
def email_verification(request):
    return render(request, 'verification/email_verification.html')

def mask_email(email):
    """
    Masks the email, leaving the first letter and domain intact.
    Example: "example@domain.com" -> "e******e@domain.com"
    """
    try:
        local_part, domain = email.split('@')
        if len(local_part) <= 2:
            masked_local = local_part[0] + "*" * (len(local_part) - 1)
        else:
            masked_local = local_part[0] + "*" * (len(local_part) - 2) + local_part[-1]
        return f"{masked_local}@{domain}"
    except Exception as e:
        print(f"Error masking email: {e}")
        return email  # In case of failure, return the original email

def send_verification_code(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')

            if not email:
                return JsonResponse({'success': False, 'message': 'Email is required'}, status=400)

            # Generate and store the code with expiration
            verification_code = generate_verification_code()
            verification_codes[email] = {
                "code": verification_code,
                "expires_at": now() + timedelta(minutes=1)  # Expires in 10 minutes
            }
            # Send the code via email
            send_mail(
                'Your Verification Code',
                f'Your verification code is: {verification_code}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            # Mask the email to show on the frontend
            masked_email = mask_email(email)

            return JsonResponse({
                'success': True,
                'message': f'Your verification code is: {verification_code}',
                'masked_email': masked_email
            })

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)

import json
from django.http import JsonResponse

from datetime import datetime
import json
from django.http import JsonResponse

# Example verification codes dictionary
verification_codes = {
    "user@example.com": {
        "code": "972899",  # Example code
        "expires_at": datetime(2024, 12, 7, 17, 30)  # Expiration time (e.g., December 7, 2024, at 5:30 PM)
    }
}

# Function to return current datetime
def now():
    return datetime.now()

def verify_code(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            code = data.get('code')

            print(f"Received email: {email}, code: {code}")  # Add logging

            if not email or not code:
                return JsonResponse({'success': False, 'message': 'Email and code are required'}, status=400)

            # Retrieve the stored code
            stored_data = verification_codes.get(email)
            if not stored_data:
                return JsonResponse({'success': False, 'message': 'No code found for this email'}, status=404)

            # Check if the code is expired
            if now() > stored_data["expires_at"]:
                return JsonResponse({'success': False, 'message': 'Verification code has expired'}, status=400)

            # Verify the code
            if stored_data["code"] == code:
                return JsonResponse({'success': True, 'message': 'Verification successful'})

            return JsonResponse({'success': False, 'message': 'Incorrect code'}, status=400)

        except Exception as e:
            print(f"Error processing verification: {e}")  # Log any exceptions
            return JsonResponse({'success': False, 'message': 'An error occurred during verification'}, status=500)

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)


# Resend the verification code
def resend_code(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')

        if not email:
            return JsonResponse({'success': False, 'message': 'Email is required'}, status=400)

        # Generate a new code and update the dictionary
        verification_code = generate_verification_code()
        verification_codes[email] = {
            "code": verification_code,
            "expires_at": now() + timedelta(minutes=1)
        }

        # Send the code via email
        send_mail(
            'Your Verification Code',
            f'Your new verification code is: {verification_code}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return JsonResponse({'success': True,'message': f'Your verification code is: {verification_code}'})

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)

# Success page
def success(request):
    return render(request, 'verification/success.html')

# Test email function
from django.core.mail import send_mail
from django.http import HttpResponse

def send_test_email(request):
    try:
        send_mail(
            'Test Subject',
            'This is a test message.',
            'myproject349@gmail.com',  #Add sender email here 
            ['recipient@example.com'],  # Recipient email
            fail_silently=False,
        )
        return HttpResponse("Email sent successfully!")
    except Exception as e:
        return HttpResponse(f"Error sending email: {str(e)}")

