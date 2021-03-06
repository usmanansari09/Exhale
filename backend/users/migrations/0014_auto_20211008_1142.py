# Generated by Django 2.2.24 on 2021-10-08 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_remove_client_program_end'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='selections',
            field=models.ManyToManyField(blank=True, related_name='clients', to='home.Choice'),
        ),
        migrations.AlterField(
            model_name='client',
            name='series',
            field=models.ManyToManyField(blank=True, related_name='clients', to='home.Series'),
        ),
    ]
