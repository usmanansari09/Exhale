# Generated by Django 2.2.24 on 2021-10-06 17:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_auto_20211006_1224'),
        ('home', '0003_question_position'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Choices',
            new_name='Choice',
        ),
    ]
