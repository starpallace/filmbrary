from django.db import models
from django.contrib.postgres.fields import HStoreField
from django.contrib.auth.models import User
from PIL import Image



  
class Personal(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default_profile.jpg', upload_to='profile_pics')
    individ_rates = HStoreField(blank=True, default=dict) # currently stored dictionary key is film title. For practical use of this project (which is not planned) need to be changed to title+year or id . It works now for this base , but in future  can provide confusing result as film titles sometimes can be the same with years. If it will be changed lots of code will become much more complicated, expecially in template language

    def __str__(self):
        return f"{self.user.username} Profile"

    def save(self, **kwargs):
        super().save()
        # cut image to optimaze base
        img=Image.open(self.image.path)
        max = 300
        if img.height > max or img.width > max:
            output_size = (max, max)
            img.thumbnail(output_size)
            img.save(self.image.path)
  
