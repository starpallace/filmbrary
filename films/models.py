from django.db import models
from taggit.managers import TaggableManager
from django.core.validators import MaxValueValidator, MinValueValidator
from PIL import Image

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
    def save(self, **kwargs):
        super().save()

        img=Image.open(self.poster.path)
        
        if img.height > 480 or img.width > 350:
            output_size = (480, 350)
            img.thumbnail(output_size)
            img.save(self.poster.path)

       
