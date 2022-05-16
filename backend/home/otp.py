from django.utils.crypto import get_random_string
from django.core.mail import EmailMessage

from datetime import timedelta
from django.utils import timezone


def generateOTP(email=None, user=None):
      if email and user:
            otp = get_random_string(length=4, allowed_chars='1234567890')
            user.otp = otp
            user.otp_expiry = timezone.now() + timedelta(minutes=10)
            user.attempts = 0
            user.save()
            email = EmailMessage('OTP Verification', 'Your OTP is {}'.format(otp), from_email='sallar.rezaie@crowdbotics.com', to=[email])
            email.send()
      return otp
