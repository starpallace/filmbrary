from django.contrib import admin
from django.urls import path, include
from films.views import (
    home, add_movie, SweetHome,
     FilmPage, film_page, CloneHome )


# remember next two lines # remember next two lines # remember next two lines # remember next two lines
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('films', include('films.urls')),
    path('', home, name='home' ),
  #  path('', SweetHome.as_view(), name='sweet_home' ),
  #  path('<int:pk>/', FilmPage.as_view(), name='film_page_class' ),
    #path('films/<id>/', film_page, name='films-film_page' ),
    path('home', home, name='home' ),
    path('add-movie', add_movie, name='add_movie' ),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
 