# Generated by Django 2.2.24 on 2021-10-28 19:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0017_series_position'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='series',
            options={'ordering': ['position'], 'verbose_name_plural': 'Series'},
        ),
    ]