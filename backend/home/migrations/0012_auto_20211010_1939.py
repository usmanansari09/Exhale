# Generated by Django 2.2.24 on 2021-10-10 19:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0011_choice_series'),
    ]

    operations = [
        migrations.AlterField(
            model_name='class',
            name='clients',
            field=models.ManyToManyField(related_name='classes', through='users.ClassStatus', to='users.Client'),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='clients',
            field=models.ManyToManyField(related_name='exercises', through='users.ExerciseStatus', to='users.Client'),
        ),
    ]