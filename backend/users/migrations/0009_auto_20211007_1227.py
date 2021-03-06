# Generated by Django 2.2.24 on 2021-10-07 12:27

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_auto_20211006_1224'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='sts_1_date',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Sit-To-Stand #1 Date'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='client',
            name='sts_2_date',
            field=models.DateField(blank=True, null=True, verbose_name='Sit-To-Stand #1 Date'),
        ),
        migrations.AddField(
            model_name='client',
            name='sts_3_date',
            field=models.DateField(blank=True, null=True, verbose_name='Sit-To-Stand #1 Date'),
        ),
    ]
