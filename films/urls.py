from django.contrib import admin
from django.urls import path
from films.views import (
    home, add_movie, SweetHome,
     FilmPage, film_page, CloneHome )


# remember next two lines # remember next two lines # remember next two lines # remember next two lines
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    
    path('films/<id>/', film_page, name='films-film_page' ),
    
]

