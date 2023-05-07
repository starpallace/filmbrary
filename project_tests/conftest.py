from pytest_factoryboy import register
from factories import UserFactory, MovieFactory
from movies.models import MovieWorld
import pytest
from movielib import films as film_list


register(UserFactory)
register(MovieFactory)

@pytest.fixture()
def movie_inject(movie_factory):
    
    for film in film_list[0:20]:
        MovieFactory.create(slug=film['slug'], title=film['title'], genres=film['genres'].replace(" ","").split(','), 
                    year= film['year'], rating=float(film['rating']), director=film['director'].split(','), 
                    poster=film['poster'], tags=film['tags'],
                    plot=film['plot'], cast = film['cast'].split(','),
                    countries = film['countries'].split(',')
        )
    print('movie_inject fixture created ', MovieWorld.objects.count(), ' entries')
