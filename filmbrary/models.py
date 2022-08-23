from django.db import models


class Film(models.Model):
     
    slug= models.SlugField
    name = models.CharField(max_length=200)
    year = models.PositiveSmallIntegerField
    desc = models.TextField
    poster = models.ImageField(default='movie.jpg', upload_to='posters')
    screens = models.ImageField(blank=True)
    taggs_plus = TaggableManager()
    taggs_minus = TaggableManager()

    def __str__(self):
        return self.name

    def shorts(self):
        return self.desc[:160] + '...'


        