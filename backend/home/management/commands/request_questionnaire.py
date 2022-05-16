from django.core.management.base import BaseCommand
from django.utils import timezone
import datetime
from users.models import Client
from django.core import mail



class Command(BaseCommand):
    help = 'Questionnaire Requests Sent'

    def handle(self, *args, **kwargs):
        try:
            today = datetime.date.today()
            # Change days to 42
            midway_date = today - datetime.timedelta(days=1)
            emails = Client.objects.filter(program_start=midway_date).values_list('user__email', flat=True)
            if len(emails) > 0:
                message1 = ('Exhale Questionnaire', 'Your next questionnaire is ready here https://exhale-30125.botics.co/?questionnaire=midway', 'sallar.rezaie@crowdbotics.com', list(emails))
                mail.send_mass_mail((message1,), fail_silently=False)
            # Change days to 84
            final_date = today - datetime.timedelta(days=2)
            final_emails = Client.objects.filter(program_start=final_date).values_list('user__email', flat=True)
            if len(final_emails) > 0:
                message1 = ('Exhale Questionnaire', 'Your next questionnaire is ready here https://exhale-30125.botics.co/?questionnaire=final', 'sallar.rezaie@crowdbotics.com', list(final_emails))
                mail.send_mass_mail((message1,), fail_silently=False)
            self.stdout.write(self.style.SUCCESS('Emails for Questionnaires have been sent'))
        except:
            self.stdout.write(self.style.WARNING('Email Query Error'))
