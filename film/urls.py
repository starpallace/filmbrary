from django.contrib import admin
from django.urls import path, include
from movies.views.small import ( top_100, about, add_movie, parsed_add,  category_buider, MoviesUpdateView, MoviesDeleteView)
from movies.views.home_view import home
from movies.views.detail_view import film_page
# remember next two lines # remember next two lines # remember next two lines 
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    #include block
    path('viewers/', include('profiles.urls')),
    # page block
    path('', home, name='home' ),
    path('top100', top_100, name='top 100' ),
    path('about/', about, name='about'),
    path('add-movie/', add_movie, name='add_movie' ),
    path('change-movie/<slug>/', MoviesUpdateView.as_view() , name='change_movie' ),
    path('delete-movie/<slug>/', MoviesDeleteView.as_view() , name='delete_movie' ),
    path('parser/', parsed_add, name='parser' ),
    path('make_cache', category_buider, name='make_cache'),
    path('admin/', admin.site.urls),
    path('<slug>/', film_page, name='film_page' ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
 