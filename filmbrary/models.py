from django.db import models


class Film(models.Model):
    film_name = models.CharField(max_length=200)
    film_year = models.PositiveSmallIntegerField
    description = models.TextField
    poster = models.ImageField