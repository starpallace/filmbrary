import time
from movies.models import base_voters

# modify user user_number to perform test on his account. Could be 'for' loop for all Users, but result probably, will be consistant
user_number = 1

# set number of movies to feed to database. Current max 500 (number of films in the list)
number_of_movies = 70

# time of default page wait between actions
pause = 0.1

# reimplementing sleep with dafault value to cleanup the code
def wait(interval=pause):
    time.sleep(interval)

# basic rate of every film is IMDB score. Stock number is 20 voters, that mean that if you vote in clean
# database number of voters will be 21 and average bases on that
def rate_primary_calc(base_rate, score): # counts first score of user to current film
    return float((base_rate * base_voters + score) / (base_voters + 1))

def rate_secondary_calc(base_rate, new_score, old_score):# counts update of user score to current film
    return  float(((float(base_rate) * float(base_voters+1))- float(old_score)+float(new_score))/(base_voters+1))