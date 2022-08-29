from django.db import models
from taggit.managers import TaggableManager
from django.core.validators import MaxValueValidator, MinValueValidator

class Movie(models.Model):
     
    slug= models.SlugField(default='changeme')
    title = models.CharField(max_length=200)
    year = models.PositiveSmallIntegerField(default=1900,validators=[
            MaxValueValidator(2050),
            MinValueValidator(1900)
        ])
    description = models.TextField(default='Not provided')
    poster = models.ImageField(default='movie.jpg', upload_to='posters')
    screenshots = models.ImageField(blank=True)
    tags = TaggableManager()

    def __str__(self):
        return self.title

    def shorts(self):
        return self.description[:260] + '...'

       
