from django.test import TestCase

class URLTests(TestCase):
    def test_homepage(self):
        responce = self.client.get('/')
        self.assertEqual(responce.status_code,200)