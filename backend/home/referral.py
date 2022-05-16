from django.utils.crypto import get_random_string
from django.core.mail import EmailMessage

from datetime import timedelta
from django.utils import timezone


def sendReferral(email=None, professional=None):
    if email and professional:
        link = "https://exhale-30125.botics.co/dashboard/signup?referral_code={}".format(professional.referral_code)
        email = EmailMessage("You've been invited to join Exhale!", 'Your access link from {} is {}'.format(professional.business_name, link), from_email='sallar.rezaie@crowdbotics.com', to=[email])

        email.send()

