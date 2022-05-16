# Generated by Django 2.2.24 on 2021-10-05 19:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_user_otp_expiry'),
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sts_1', models.PositiveIntegerField(default=0, verbose_name='Sit-To-Stand Result #1')),
                ('sts_2', models.PositiveIntegerField(default=0, verbose_name='Sit-To-Stand Result #2')),
                ('sts_3', models.PositiveIntegerField(default=0, verbose_name='Sit-To-Stand Result #3')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
