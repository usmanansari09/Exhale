# Generated by Django 2.2.24 on 2022-01-12 12:11

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0021_auto_20220112_1027'),
    ]

    operations = [
        migrations.AlterField(
            model_name='class',
            name='day_number',
            field=models.IntegerField(validators=[django.core.validators.MaxValueValidator(7), django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='class',
            name='week_number',
            field=models.IntegerField(validators=[django.core.validators.MaxValueValidator(12), django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='day_number',
            field=models.IntegerField(validators=[django.core.validators.MaxValueValidator(7), django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='week_number',
            field=models.IntegerField(validators=[django.core.validators.MaxValueValidator(12), django.core.validators.MinValueValidator(1)]),
        ),
    ]
