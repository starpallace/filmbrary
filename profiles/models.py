from django.db import models
from django.contrib.postgres.fields import HStoreField
from django.contrib.auth.models import User
from PIL import Image


  
class Personal(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default_profile.jpg', upload_to='profile_pics')
    individ_rates = HStoreField(blank=True, default=dict)

    def __str__(self):
        return f"{self.user.username} Profile"

    def save(self, **kwargs):
        super().save()

        img=Image.open(self.image.path)
        max = 300
        #print(img.height)
        if img.height > max or img.width > max:
            output_size = (max, max)
            img.thumbnail(output_size)
            #print(img.height)
            img.save(self.image.path)
  
