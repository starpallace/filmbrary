# Generated by Django 4.1 on 2022-11-17 21:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0007_movieworld_director'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movieworld',
            name='plot',
            field=models.TextField(default='spoilers coming..', max_length=15000),
        ),
    ]