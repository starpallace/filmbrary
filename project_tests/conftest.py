from pytest_factoryboy import register
import factory
from factories import UserFactory, MovieFactory, PersonalFactory
import pytest

from movies.models import MovieWorld
from django.contrib.auth.models import User


from inject_data.movielib import films as film_list
from inject_data.user_library import user_list

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

from django.contrib.postgres.operations import get_hstore_oids
    
get_hstore_oids.cache_clear()

register(UserFactory)
register(MovieFactory)
register(PersonalFactory)


# Notice !!! PersonalFactory neeeeds this command ( otherway individ_rates will be string forever... ... ) >>  psql -U postgres -d template1 -c "create extension hstore;"  

@pytest.fixture()
def user_inject(user_factory):
    for new_user in user_list:
        User_UserFactory=UserFactory.create(username=new_user['name'], password=factory.PostGenerationMethodCall('set_password', new_user['password']),
                            email=new_user['email'],is_active=True, is_superuser=True)
        
        PersonalFactory.create(user=User_UserFactory, image = 'default_profile.jpg' ,  individ_rates = {'Avatar':2,'Me':4} )
    #print('user_inject fixture created ', User.objects.count(), ' entries')



@pytest.fixture()
def movie_inject(movie_factory):
    
    # set number of movies to feed to database. Current max 500 (number of films in the list)
    number_of_movies = 70

    for film in film_list[0:number_of_movies]:
        MovieFactory.create(slug=film['slug'], title=film['title'], genres=film['genres'].replace(" ","").split(','), 
                    year= film['year'], rating=float(film['rating']), director=film['director'].split(','), 
                    poster=film['poster'], tags=film['tags'], plot=film['plot'], cast = film['cast'].split(','),
                    countries = film['countries'].split(',')   )
    print('movie_inject fixture created ', MovieWorld.objects.count(), ' entries')




@pytest.fixture(scope='class')
def chrome_sel(request):
    options =webdriver.ChromeOptions()
    #options.add_argument("--headless")
    chromedriver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    request.cls.driver=chromedriver
    yield
    chromedriver.close()