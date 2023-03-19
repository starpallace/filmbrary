from files.st1out import films
import urllib.request
from django.template.defaultfilters import slugify



# this module imports c from created dictionary and stores in folder


for i in films:
    link = (i['url'])
    file_name = 'files/images/' + slugify(i['title']) + '.jpg'
    try:
        con = urllib.request.urlretrieve(link, file_name) 
    
    except:
        print(i['title'], 'wrong url or api usage')
    #print(file_name)