import pytest
from django.contrib.auth.models import User
from movies.models import MovieWorld
from profiles.models import Personal
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from inject_data.user_library import user_list



# Notice !!! PersonalFactory neeeeds this command ( otherway individ_rates will be string forever... ... ) >>  psql -U postgres -d template1 -c "create extension hstore;"  


@pytest.mark.django_db
@pytest.mark.usefixtures("movie_inject", "user_inject", "chrome_sel")        
class TestB(StaticLiveServerTestCase):
    # port=8000
    def test_register_and_login(self):
        
        print('personals:',Personal.objects.count())
       
        jack=Personal.objects.first()
        print(1,jack)
        print(2)
        print(type(jack.individ_rates))
        for i in jack.individ_rates:
            print('|',i,'|')
        print(3,jack.image)
        print(4,jack.user.username)
        # next line we need for using driver name from fixture
        driver = self.driver
        
        #select first user from list to perform tests on its account
        user1 = user_list[0]
        driver.get((f"{self.live_server_url}/viewers/login"))
        driver.implicitly_wait(1)
        #login with first account in user_list
        driver.find_element(By.NAME,'username').send_keys(user1['name'])
        driver.find_element(By.NAME,'password').send_keys(user1['password'])
        time.sleep(0.8)
        driver.find_element(By.ID,'submit').send_keys(Keys.RETURN)

        time.sleep(0.5)
        #after login we have to be redirected to home page
        driver.implicitly_wait(1)
        # test if all films are loaded to base, accessed from home and paginated well
        driver.find_element(By.ID,'page2').send_keys(Keys.RETURN)
        time.sleep(1)
        #driver.find_element(By.ID,'page3').send_keys(Keys.RETURN)
        #time.sleep(1)
        driver.find_element(By.ID,'page1').send_keys(Keys.RETURN)
        time.sleep(0.4)
        driver.find_element(By.CLASS_NAME,'film-href').send_keys(Keys.RETURN)
        time.sleep(1)
        
        rating_el = driver.find_element(By.ID,'film-rating')
        base_rating = float(rating_el.get_attribute("value"))

        id_el = driver.find_element(By.ID,'film-id')
        film_id = id_el.get_attribute("value")

        print('base: ', base_rating     , 'film id: ', film_id          )
        time.sleep(0)
        rate_string  = 'rating' + str(film_id) +'-2'
        print(rate_string)
        slider = driver.find_element(By.ID,rate_string)
        time.sleep(4)
        print("slider: " , slider        )
        slider.send_keys(10)
        driver.find_element(By.ID,'rate-btn-2').send_keys(Keys.RETURN)
        time.sleep(1)
        driver.get((f"{self.live_server_url}/viewers/profile/"))
        time.sleep(8.8)



@pytest.mark.parametrize('username,password', [
    ('Jafrey Lebowski','ssssss777777'),
    ('WalterSobchak','MyFriendsFromNam')])
@pytest.mark.django_db
def test_A(user_factory, username, password):
    #print(user_factory.username)
    #userA = user_factory(username=username, password=password)
    #print(userA.username)
    #userB = user_factory.build()
    #print(userB.username)
    #userC = user_factory.create(username='paol')
    #assert User.objects.first().username == userA.username
    #print(User.objects.count())
    pass


@pytest.mark.django_db
def test_E(movie_inject):
    print('Test E:', MovieWorld.objects.count())
    for flm in MovieWorld.objects.all():
        for genre in flm.genres:
            #print(genre, end=' , ')
            pass
        flm.title += ' and so'
        #print(flm.title)
        #print(' ')
        assert flm.voters_number == 20
