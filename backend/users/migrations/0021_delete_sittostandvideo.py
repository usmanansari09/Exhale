# Generated by Django 2.2.24 on 2021-10-10 20:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0020_remove_sittostandvideo_count'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SitToStandVideo',
        ),
    ]