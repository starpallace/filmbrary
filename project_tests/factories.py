import factory
from django.contrib.auth.models import User
from movies.models import MovieWorld
from faker import Faker
from pytest_factoryboy import register

fake = Faker()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    username = fake.name()
    password = 'Sssssss7777777'
    is_staff = 'True'


class MovieFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MovieWorld
        database = 'TEST'

    slug= 'shawshank'
    title = 'Shawshank'
    year = 1998
    voters_number = 20
    rating = 8
    poster = factory.django.ImageField(filename='posters/movie.jpg')
    screenshots = factory.django.ImageField(filename='posters/movie.jpg')
    tags = ['Dude, Dudino']
    genres = ['Comedy, Criminal']
    cast = ['Juliana Moor, Jaff Bridges']
    director = ['Coen bros']
    plot = 'Dude and Walter fire out'
    countries =['USA']
