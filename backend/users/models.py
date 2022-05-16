from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _

from home.models import Choice, Series, Exercise, Class

from datetime import timedelta, date
import string, random 


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    email = models.EmailField(_("Email of User"), unique=True)
    otp = models.IntegerField(_("One Time Password"), blank=True, null=True)
    otp_expiry = models.DateTimeField(_("OTP Expiry"), blank=True, null=True)
    attempts = models.IntegerField(_("# of OTP Attempts"), default=0)
    remember_me = models.BooleanField(null=True, blank=True)


    class Meta:
        ordering = ['-id']


    def __str__(self):
        return self.email


    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})


class Professional(models.Model):
    """
    A Professional model with a one-to-one User relationship to hold non-authentication
    related attributes and methods
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=255)
    business_id = models.CharField(max_length=255, blank=True, null=True)
    referral_code = models.CharField(max_length=6, null=True, blank=True, unique=True)

    class Meta:
        verbose_name_plural  =  "Professionals" 
        ordering = ['-id']

    def save(self, *args, **kwargs):
        if not self.referral_code:
            # Generate ID once, then check the db. If exists, keep trying.
            self.referral_code = id_generator()
            while Professional.objects.filter(referral_code=self.referral_code).exists():
                self.referral_code = id_generator()
        super(Professional, self).save(*args, **kwargs)

    def __str__(self):
        return self.business_name


@receiver(post_delete, sender=Professional)
def post_delete_user(sender, instance, *args, **kwargs):
    if instance.user:
        instance.user.delete()


class Client(models.Model):
    """
    A Client model with a one-to-one User relationship to hold non-authentication
    related attributes and methods
    """
    GENDER_TYPES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Non-Binary', 'Non-Binary'),
        ('Do not wish to answer', 'Do not wish to answer')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    program_start = models.DateField(_("Program Start Date"), auto_now_add=True)
    sts_1 = models.PositiveIntegerField(_("Sit-To-Stand Result #1"), default=0)
    sts_1_date = models.DateField(_("Sit-To-Stand #1 Date"), auto_now_add=True)
    sts_2 = models.PositiveIntegerField(_("Sit-To-Stand Result #2"),default=0)
    sts_2_date = models.DateField(_("Sit-To-Stand #2 Date"), blank=True, null=True)
    sts_3 = models.PositiveIntegerField(_("Sit-To-Stand Result #3"),default=0)
    sts_3_date = models.DateField(_("Sit-To-Stand #3 Date"), blank=True, null=True)
    dob = models.DateField(_("Date of Birth"), blank=True, null=True)
    gender = models.CharField(choices=GENDER_TYPES, max_length=24, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    choices = models.ManyToManyField(Choice, blank=True, related_name='clients')
    halfway_checkpoint_choices = models.ManyToManyField(Choice, blank=True, related_name='second_questionnaire')
    final_checkpoint_choices = models.ManyToManyField(Choice, blank=True, related_name='third_questionnaire')
    photo = models.ImageField(upload_to='client/images/', blank=True, null=True)
    series = models.ManyToManyField(Series, blank=True, related_name='clients')
    professional = models.ForeignKey(Professional, on_delete=models.SET_NULL, null=True, related_name='clients', blank=True)


    class Meta:
        verbose_name_plural  =  "Clients"        
        ordering = ['-id']

    def save(self, *args, **kwargs):
        today = date.today()
        if self._state.adding:
            self.sts_2_date = today + timedelta(days=42)
            self.sts_3_date = today + timedelta(days=84)
        if self.dob:
            self.age = today.year - self.dob.year - ((today.month, today.day) < (self.dob.month, self.dob.day))
        super(Client, self).save(*args, **kwargs)

    @property
    def min_range_heart_rate(self):
        if self.age:
            return round((220 - self.age) * 0.4)
        else:
            return None

    @property
    def max_range_heart_rate(self):
        if self.age:
            return round((220 - self.age) * 0.6)

    @property
    def max_heart_rate(self):
        if self.age:
            return 220 - self.age


    def __str__(self):
        return self.user.name


@receiver(post_delete, sender=Client)
def post_delete_user(sender, instance, *args, **kwargs):
    if instance.user:
        instance.user.delete()


DIFFICULTY_CHOICES = (
    ('This was easy', 'This was easy'),
    ('This was okay', 'This was okay'),
    ('This was tough', 'This was tough')
)


class ExerciseStatus(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='exercise_status', verbose_name='client')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='exercise_status', verbose_name='exercise')
    is_completed = models.BooleanField(default=False)
    date = models.DateField(blank=True, null=True)
    difficulty = models.CharField(choices=DIFFICULTY_CHOICES, max_length=64, blank=True, null=True)


    class Meta:
        verbose_name = "Client Exercise"
        verbose_name_plural  =  "Client Exercises" 
        ordering = ['date']

    def __str__(self):
        return "Series: {} - ".format(self.exercise.series.title) + self.exercise.title


class ClassStatus(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='lesson_status', verbose_name='client')
    lesson = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='lesson_status', verbose_name='class')
    is_completed = models.BooleanField(default=False)
    date = models.DateField(blank=True, null=True)
    difficulty = models.CharField(choices=DIFFICULTY_CHOICES, max_length=64, blank=True, null=True)

    class Meta:
        verbose_name = "Client Class"
        verbose_name_plural  =  "Client Classes" 
        ordering = ['date']

    def __str__(self):
        return self.lesson.series.title + ' ' + self.lesson.title



