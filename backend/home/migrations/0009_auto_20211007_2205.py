# Generated by Django 2.2.24 on 2021-10-07 22:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0008_auto_20211007_2055'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='series',
            name='number_of_classes',
        ),
        migrations.RemoveField(
            model_name='series',
            name='number_of_exercises',
        ),
    ]
