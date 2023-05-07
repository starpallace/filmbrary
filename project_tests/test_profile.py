import pytest
from django.contrib.auth.models import User
#from django.test import LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

@pytest.mark.django_db
class TestA(StaticLiveServerTestCase):

    def testhome(self):
        fixtures = ["movie_inject"]
        driver=webdriver.Chrome(service=Service(ChromeDriverManager().install()))

        driver.get((f"{self.live_server_url}/"))
        print(self.live_server_url)

        print(driver.title)

