# Generated by Django 2.2.24 on 2021-10-10 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0015_classstatus_exercisestatus'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='selections',
            field=models.ManyToManyField(blank=True, db_column='choices_id', related_name='clients', to='home.Choice'),
        ),
    ]