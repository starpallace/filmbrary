
import pytest


def test_paswd(user_1):
    pwd='7777777'
    user_1.set_password(pwd)
    assert user_1.check_password(pwd) == True

def test_paswds(user_A, user_B):
    assert user_A.username == 'Johny1'
    assert user_A.check_password('Johny1') == True
    print('factory for workers')
    assert user_B.username == 'Jacky2'
    assert user_B.check_password('Jacky2') == True