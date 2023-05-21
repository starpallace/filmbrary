import factory

from django.contrib.auth.models import User
from movies.models import MovieWorld
from profiles.models import Personal
from profiles import signals



class MovieFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MovieWorld
        database='movietest'

    slug= 'big-lebowski'
    title = 'Big Lebowsky'
    year = 1998
    voters_number = 20
    rating = 8
    tags = ['Dude, Dudino']
    genres = ['Comedy, Criminal']
    cast = ['Juliana Moor, Jaff Bridges']
    director = ['Coen bros']
    plot = 'Dude and Walter fire out'
    countries =['USA']



# Notice !!! PersonalFactory neeeeds this command ( otherway individ_rates will be string forever... ... ) >>  psql -U postgres -d template1 -c "create extension hstore;"  


@factory.django.mute_signals(signals.post_save)
class PersonalFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Personal

    user = factory.SubFactory('project_tests.factories.UserFactory',personal=None)
    image = 'default_profile.jpg'
       
    
@factory.django.mute_signals(signals.post_save)
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    username = factory.Sequence(lambda n: "user_%d" % n)
    email = 'someemail@mail.com'
    is_active=True
    is_superuser=True
    password = factory.PostGenerationMethodCall('set_password', '1and2and3or4')
    #personal = factory.RelatedFactory(PersonalFactory, factory_related_name='user')
