import pytest
from django.contrib.auth.models import User

names_list = ['Johny1','Jacky2','Robbie3']

@pytest.fixture
def user_1(db):
    user = User.objects.create_user('test_user')
    return user

@pytest.fixture
def new_user_factory(db):
    def create_user(
            username: str,
            password: str=None,
            first_name: str='firstname',
            last_name: str='lastname',
            email: str='em@ail.com',
            is_staff: str=False,
            is_superuser: str=False,
            is_active: str= True
    ):
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email,
            is_staff=is_staff,
            is_superuser=is_superuser,
            is_active=is_active
        )
        return user
    return create_user

@pytest.fixture
def user_A(db,new_user_factory):
    return new_user_factory(names_list[0],names_list[0])

@pytest.fixture
def user_B(db,new_user_factory):
    return new_user_factory(names_list[1],names_list[1])