# Generated by Django 2.2.24 on 2021-10-10 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0010_auto_20211010_1831'),
        ('users', '0017_remove_client_selections'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='choices',
            field=models.ManyToManyField(blank=True, related_name='clients', to='home.Choice'),
        ),
    ]
