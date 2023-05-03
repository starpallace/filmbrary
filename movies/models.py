from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MaxValueValidator, MinValueValidator
from PIL import Image

# according to django documentations empty list in defaults of arrayfield will be mutable between all model instances
def clear_list():
    return list()


class MovieWorld(models.Model):
     
    slug= models.SlugField(max_length=500, default='changeme')
    title = models.TextField(max_length=300)
    year = models.PositiveSmallIntegerField(default=1900,validators=[  MaxValueValidator(2050), MinValueValidator(1900)  ])
    voters_number = models.PositiveIntegerField(default=20)
    rating = models.DecimalField(default='0.01', max_digits=9, decimal_places=6, validators=[ MaxValueValidator(10)])    
    poster = models.ImageField(max_length=500, default='movie.jpg', upload_to='posters')
    screenshots = models.ImageField(blank=True)
    tags = ArrayField( models.TextField(max_length=500), blank=True   )
    genres = ArrayField( models.TextField(max_length=500), blank=True, default=clear_list   )
    cast = ArrayField( models.TextField(max_length=1000), blank=True   )
    director = ArrayField( models.TextField(max_length=1000), blank=True, default=clear_list   )
    plot = models.TextField(max_length=15000, default='spoilers coming..')
    countries = ArrayField( models.TextField(max_length=300), blank=True  , default =clear_list )
    

    def __str__(self):
        return self.title

    # define previews of plot for specific pages            
    def shorts(self):
        return self.plot[:150] + '...'
    def bigger(self):
        return self.plot[:500]+'...'
    
    # here we change the size of images too keep project from being to heavy
    def save(self, **kwargs):
        super().save()

        img=Image.open(self.poster.path)
        
        if img.height > 750 or img.width > 1102:
            output_size = (750, 1102)
            img.thumbnail(output_size)
            img.save(self.poster.path)
    