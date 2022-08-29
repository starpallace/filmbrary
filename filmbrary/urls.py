from django.contrib import admin
from django.urls import path
from films.views import home, add_movie, SweetHome


# remember next two lines # remember next two lines # remember next two lines # remember next two lines
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', SweetHome.as_view(), name='sweet_home' ),
    path('home', home, name='home' ),
    path('add-movie', add_movie, name='add_movie' ),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
 