# Generated by Django 2.2.24 on 2021-10-17 17:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0016_auto_20211016_1231'),
    ]

    operations = [
        migrations.AddField(
            model_name='series',
            name='position',
            field=models.IntegerField(blank=True, null=True, verbose_name='Presentation Order'),
        ),
    ]
