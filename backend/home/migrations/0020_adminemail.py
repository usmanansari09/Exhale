# Generated by Django 2.2.24 on 2022-01-12 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0019_congradulatorymessage'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminEmail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
            ],
        ),
    ]
