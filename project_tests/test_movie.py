from movies.models import MovieWorld

from django.contrib.staticfiles.testing import StaticLiveServerTestCase
import pytest

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from inject_data.user_library import user_list as list_of_users
from test_settings import wait, rate_primary_calc, rate_secondary_calc, user_number


# >>  psql -U postgres -d template1 -c "create extension hstore;"  
# Notice !!! PersonalFactory neeeeds this command ^^^^^^^   otherways individ_rates will be string forever... ...  


@pytest.mark.django_db
@pytest.mark.usefixtures("movie_inject", "user_inject", "chrome_sel")        
class TestA(StaticLiveServerTestCase):
    # port=8000
    def test_home(self):
        driver = self.driver

        #select first user from list to perform tests on its account
        user_selected = list_of_users[user_number]

        #test pages with and without authentification
        driver.get((f"{self.live_server_url}/"))
        wait()
        driver.find_element(By.ID,'page2').send_keys(Keys.RETURN)
        wait()
        driver.find_element(By.ID,'page3').send_keys(Keys.RETURN)
        wait()
        driver.find_element(By.ID,'page1').send_keys(Keys.RETURN)
        wait()
        driver.get((f"{self.live_server_url}/viewers/login"))
        wait()
        driver.find_element(By.NAME,'username').send_keys(user_selected['name'])
        driver.find_element(By.NAME,'password').send_keys(user_selected['password'])
        wait()
        driver.find_element(By.ID,'submit').send_keys(Keys.RETURN)
        wait()
        driver.find_element(By.ID,'page2').send_keys(Keys.RETURN)
        wait()
        driver.find_element(By.ID,'page3').send_keys(Keys.RETURN)
        wait()
        driver.find_element(By.ID,'page1').send_keys(Keys.RETURN)
        
        print('test_home completed')
        #after login we have to be redirected to home page



    def test_detailed_view(self):
        driver = self.driver

        # User to perform tests from test_settings
        user_selected = list_of_users[user_number]
        # test if all films are loaded to base, accessed from home and paginated well
        # to rate films user need to Log in
        driver.get((f"{self.live_server_url}/viewers/login")) 
        wait() # time sleep function with more clear view. set default time in test_settings.py
        driver.find_element(By.NAME,'username').send_keys(user_selected['name'])
        driver.find_element(By.NAME,'password').send_keys(user_selected['password'])
        wait()
        driver.find_element(By.ID,'submit').send_keys(Keys.RETURN) # login to account to rate films
        wait() # redirect to home
        driver.find_element(By.CLASS_NAME,'film-href').send_keys(Keys.RETURN) # we can also change for "find elements" and select from list
        wait()
        
        id_el = driver.find_element(By.ID,'film-id') # as we entered this page blindly selecting first film from query, now we have to check its id to work with
        film_id = id_el.get_attribute("value")
        film_object = MovieWorld.objects.get(pk=film_id)

        rating_el = driver.find_element(By.ID,'film-rating') 
        view_rating = float(rating_el.get_attribute("value"))
        model_rating = float(film_object.rating)

        self.assertAlmostEqual(view_rating, model_rating, 4) # We check if rating from base is same as html presented

        rate_string  = 'rating' + str(film_id) +'-2' # prepare input for id field
        rate_form = driver.find_element(By.ID,rate_string) # here we form ID of form to rate film
        wait()

        rate_1, rate_2 = 1.0 , 9.9 # we will calculate if system is adding score and updating score properly ( two different formulas as undate must clear previous score)

        rate_form.send_keys(rate_1)
        driver.find_element(By.ID,'rate-btn').send_keys(Keys.RETURN)
        rating_el = driver.find_element(By.ID,'film-rating')
        
        view_rating_updated = float(rating_el.get_attribute("value"))
        
        self.assertAlmostEqual(rate_primary_calc(view_rating, rate_1), view_rating_updated,5) # rate_primary calculates if new score dor film is updated properly
        
        old_rate =  driver.find_element(By.ID,'user-rate').get_attribute("value") # after rating current film this score is displayed on the page
        self.assertEqual(float(old_rate), float(rate_1)) # check if new added score equal to sent float value

        film_object_2 = MovieWorld.objects.get(pk=film_id)
        model_rating_refresh_v1 = float(film_object_2.rating)
        rate_form = driver.find_element(By.ID,rate_string)
        rate_form.send_keys(rate_2)
        driver.find_element(By.ID,'rate-btn').send_keys(Keys.RETURN) # send second score

        film_object_3 = MovieWorld.objects.get(pk=film_id) # refresh model as django is often o lazy to do it itself
        model_rating_refresh_v2 = float(film_object_3.rating)
        wait()

        self.assertAlmostEqual(rate_secondary_calc(model_rating_refresh_v1, rate_2,rate_1), model_rating_refresh_v2, 5) # rate-secondary_calc calculates update of a score

        driver.get((f"{self.live_server_url}/viewers/profile/")) # ensure scores are accesible via profile page
        wait()
        driver.find_element(By.ID,'show-rates').click()
        wait()
        score_list = driver.find_elements(By.CLASS_NAME,'score-list')

        assert len(score_list) == 2 # list must contain two films: just rated and one prepopulated from list

        print('test_detailed_view completed')
