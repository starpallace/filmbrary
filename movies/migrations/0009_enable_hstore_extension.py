# Generated by Django 4.1 on 2023-04-10 17:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0008_alter_movieworld_plot'),
    ]

    operations = [
         migrations.RunSQL('CREATE EXTENSION IF NOT EXISTS "hstore";'),
    ]