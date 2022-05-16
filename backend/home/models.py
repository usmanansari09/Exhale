from django.db import models
from django.utils.translation import ugettext_lazy as _
from home.validators import validate_file_extension
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from s3upload.fields import S3UploadField


class SitToStandVideo(models.Model):
    video = S3UploadField(dest='destination')

    def clean(self):
        if SitToStandVideo.objects.exists() and not self.pk:
            raise ValidationError("You can only have one Sit To Stand Video. Please remove the original before adding another.")

    def __str__(self):
        return "Sit To Stand Video"

class Question(models.Model):
    """
    A model designed to represent the initial questionnaires for the Client which 
    determines their series
    """
    question_text = models.CharField(_("Question Text"), max_length=255)
    allow_many = models.BooleanField(_("Allow Many Choices"), default=False)
    position = models.PositiveIntegerField(default=0)

    def __str__(self):
        return "Question #{} - {}".format(self.position, self.question_text)

    class Meta:
        verbose_name_plural = 'Questions'
        ordering = ['position']


class Choice(models.Model):
    """
    A model designed to represent the various multiple choice answers a client can select
    """
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    choice_text = models.CharField(_("Choice Text"), max_length=255)
    position = models.IntegerField("Selection Order")
    series = models.ForeignKey("Series", on_delete=models.CASCADE, null=True, blank=True)


    class Meta:
        unique_together = [
            ("question", "position")
        ]
        ordering = ("position",)
        verbose_name_plural = 'Choices'


    def __str__(self):
        return " Question: {} - Answer: {} ".format(self.question.question_text, self.choice_text)


class Series(models.Model):
    """
    A model designed to represent a collection of exercises and classes
    """
    title = models.CharField(_("Title of Series"), max_length=255)


    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'Series'


class Exercise(models.Model):
    """
    A model designed to represent the Exercise videos of a Series
    """
    title = models.CharField(_("Title of Exercise"), max_length=255)
    video = S3UploadField(dest='destination')
    description = models.TextField(_("Description of Exercise"))
    series = models.ForeignKey(Series, on_delete=models.CASCADE, related_name='exercises')
    clients = models.ManyToManyField("users.Client", through='users.ExerciseStatus', related_name='exercises')
    additional_resource = models.URLField(blank=True, null=True)
    week_number = models.IntegerField(validators=[
            MaxValueValidator(12),
            MinValueValidator(1)
        ])
    day_number = models.IntegerField(validators=[
            MaxValueValidator(7),
            MinValueValidator(1)
        ])


    def __str__(self):
        return "Series {}: ".format(self.series.title) + self.title

    class Meta:
        verbose_name_plural = 'Exercises'
        ordering = ['week_number', 'day_number']
        # unique_together = [
        #     ("week_number", "day_number")
        # ]

class Class(models.Model):
    """
    A model designed to represent the Class videos of a Series
    """
    title = models.CharField(_("Title of Class"), max_length=255)
    video = S3UploadField(dest='destination')
    description = models.TextField(_("Description of Class"))
    series = models.ForeignKey(Series, on_delete=models.CASCADE, related_name='classes')
    clients = models.ManyToManyField("users.Client", through='users.ClassStatus', related_name='classes')
    additional_resource = models.URLField(blank=True, null=True)
    week_number = models.IntegerField(validators=[
            MaxValueValidator(12),
            MinValueValidator(1)
        ])
    day_number = models.IntegerField(validators=[
            MaxValueValidator(7),
            MinValueValidator(1)
        ])


    def __str__(self):
        return "Series: {} - ".format(self.series.title) + self.title

    class Meta:
        verbose_name_plural = 'Classes'
        ordering = ['week_number', 'day_number']
        # unique_together = [
        #     ("week_number", "day_number")
        # ]

class CongradulatoryMessage(models.Model):
    """
    A model designed to show a random message everytime an exercise or lesson is completed
    """
    content = models.CharField(_("Textual Content of Message"), max_length=255)

    def __str__(self) -> str:
        return self.content


class AdminEmail(models.Model):
    """
    A model to hold the admin's email
    """
    email = models.EmailField()

    def __str__(self) -> str:
        return self.email
