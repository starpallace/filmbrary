import pytest
from django.contrib.auth.models import User
from movies.models import MovieWorld
from factories import MovieFactory
from pytest_factoryboy import register



@pytest.mark.parametrize('username,password', [
    ('Jafrey Lebowski','ssssss777777'),
    ('WalterSobchak','MyFriendsFromNam')])
@pytest.mark.django_db
def test_A(user_factory, username, password):
    print(user_factory.username)
    userA = user_factory(username=username, password=password)
    print(userA.username)
    userB = user_factory.build()
    print(userB.username)
    userC = user_factory.create(username='paol')
    assert User.objects.first().username == userA.username
    print(User.objects.count())



@pytest.mark.django_db
def test_E(movie_inject):
    print('Test E:', MovieWorld.objects.count())
    for flm in MovieWorld.objects.all():
        for genre in flm.genres:
            print(genre, end=' , ')
        flm.title += ' and so'
        print(flm.title)
        print(' ')
        assert flm.voters_number == 20