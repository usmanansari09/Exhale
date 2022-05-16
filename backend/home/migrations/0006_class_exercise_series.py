# Generated by Django 2.2.24 on 2021-10-07 18:02

from django.db import migrations, models
import django.db.models.deletion
import home.validators


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_question_allow_many'),
    ]

    operations = [
        migrations.CreateModel(
            name='Series',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Title of Series')),
            ],
        ),
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Title of Exercise')),
                ('video', models.FileField(upload_to='series/exercise/', validators=[home.validators.validate_file_extension])),
                ('description', models.TextField(verbose_name='Description of Exercise')),
                ('series', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercises', to='home.Series')),
            ],
        ),
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Title of Class')),
                ('video', models.FileField(upload_to='series/class/', validators=[home.validators.validate_file_extension])),
                ('description', models.TextField(verbose_name='Description of Class')),
                ('series', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classes', to='home.Series')),
            ],
        ),
    ]
