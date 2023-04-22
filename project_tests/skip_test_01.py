import pytest
from django.contrib.auth.models import User

#when we are working with django database we use db argument at creation of fixture and pytest.mark.django_db that is probably injecting db argument
@pytest.fixture
def User_fix1(db):
    return User.objects.create_user('tst_User_1')

@pytest.fixture(scope='function')
def list_of_fruits_fxt():
    return []

@pytest.mark.django_db
def test_pswds(User_fix1):
    User_fix1.set_password('7777777')
    assert User_fix1.check_password('7777777') is True

def test_fixt_1(list_of_fruits_fxt):
    print('tst1.1', list_of_fruits_fxt)
    list_of_fruits_fxt.append('apples')
    list_of_fruits_fxt.append('pears')
    print('tst1.2', list_of_fruits_fxt)
    assert 1==1

def test_fixt_2(list_of_fruits_fxt):
    print('tst2.1', list_of_fruits_fxt)
    list_of_fruits_fxt.append('orange')
    list_of_fruits_fxt.append('limes')
    print('tst2.2', list_of_fruits_fxt)
    assert 1==1

def test_failer():
    assert 'planet'=='planet'

@pytest.mark.django_db
def test_base():
    User.objects.create_user('testname','mail@test.com','testarosa')
    count = User.objects.count()
    assert count==1
