# Generated by Django 2.2.24 on 2021-10-11 21:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0023_classstatus_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='Professional',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('business_name', models.CharField(max_length=255)),
                ('business_id', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.AlterModelOptions(
            name='classstatus',
            options={'ordering': ['date']},
        ),
        migrations.AlterModelOptions(
            name='client',
            options={'ordering': ['-id']},
        ),
        migrations.AlterModelOptions(
            name='exercisestatus',
            options={'ordering': ['date']},
        ),
        migrations.AlterModelOptions(
            name='user',
            options={'ordering': ['-id']},
        ),
        migrations.AddField(
            model_name='client',
            name='professional',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='clients', to='users.Professional'),
        ),
    ]
