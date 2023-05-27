import pytest

#from django.test import LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.contrib.auth.models import User

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
#from selenium.webdriver.chrome.options import 

from test_settings import wait
from inject_data.user_library import user_list


@pytest.mark.usefixtures("chrome_sel")
class TestPersonal(StaticLiveServerTestCase):

    def test_register_and_login(self):
       
        # next line we need for using driver name from fixture
        driver = self.driver
        for new_user in user_list:
            #register new account
            driver.get((f"{self.live_server_url}/viewers/register/"))
                #fill fields
            driver.find_element(By.NAME,'username').send_keys(new_user['name'])
            driver.find_element(By.NAME,'password1').send_keys(new_user['password'])
            driver.find_element(By.NAME,'password2').send_keys(new_user['password'])
            driver.find_element(By.NAME,'email').send_keys(new_user['email'])
            wait()
            driver.find_element(By.ID,'submit').send_keys(Keys.RETURN)

        wait()
        #try to login with existing account

        for user in user_list:
            driver.get((f"{self.live_server_url}/viewers/login"))
            wait()
            driver.find_element(By.NAME,'username').send_keys(user['name'])
            driver.find_element(By.NAME,'password').send_keys(user['password'])
            driver.find_element(By.ID,'submit').send_keys(Keys.RETURN)
            wait()
            driver.get((f"{self.live_server_url}/viewers/profile/")) # ensure scores are accesible via profile page
            wait()
            driver.find_element(By.ID,'show-rates').click()
            wait(4)
            score_list = driver.find_elements(By.CLASS_NAME,'score-list')
            assert len(score_list) == 0 # prepopulated from list

        assert User.objects.count() == 2




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
