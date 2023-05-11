import pytest
from django.contrib.auth.models import User
#from django.test import LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

import time

from user_library import user_list


class TestA(StaticLiveServerTestCase):

    def test_register_and_login(self):
        driver=webdriver.Chrome(service=Service(ChromeDriverManager().install()))

        for new_user in user_list:
            #register new account
            driver.get((f"{self.live_server_url}/viewers/register/"))
                #fill fields
            driver.find_element(By.NAME,'username').send_keys(new_user['name'])
            driver.find_element(By.NAME,'password1').send_keys(new_user['password'])
            driver.find_element(By.NAME,'password2').send_keys(new_user['password'])
            driver.find_element(By.NAME,'email').send_keys(new_user['email'])
            time.sleep(0.5)
            driver.find_element(By.ID,'submit').send_keys(Keys.RETURN)

        time.sleep(1)
        #try to login with existing account
        driver.get((f"{self.live_server_url}/viewers/login"))
        time.sleep(0.5)
        #login with first account in user_list
        user1=user_list[0]
        print(user1['name'])
        driver.find_element(By.NAME,'username').send_keys(user1['name'])
        driver.find_element(By.NAME,'password').send_keys(user1['password'])
        driver.find_element(By.ID,'submit').send_keys(Keys.RETURN)
        time.sleep(1)
        print('prepare completed')

        assert User.objects.count() == 2
        assert driver.title == 'FilmBrary'
        self.assertEqual(driver.title, 'FilmBrary')
        
        
