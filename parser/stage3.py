from files.st1out import films
from django.template.defaultfilters import slugify
import requests
from bs4 import BeautifulSoup as sp
import json

# function for creation of empty list
def clear_list():
    return []

# this module help us to parse wikipedia plot and write it to file as list of dictionaries
# we create empty list and will populate it one by one
films_base=[]
text_string=''

# here we open parsed from imdb list of dics for every film. Parsing imdb and wiki at the same time feels to be more unstable
for i in films:
    
    # first step is to create list of slugs where wiki usually stores films. Explicit names goes first, because some films have
    # similar name, or are based on books  
    brows = { 'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36'}
    
    wiki_slugs_var = [ slugify(i['title']).replace('-', '_') , i['title'].replace('-', '_').replace(' ', '_').replace(':', '_').replace('.', '_') ]
    slugs = []

    for wiki_slug in wiki_slugs_var:
        wiki_slug_var_1 = 'https://en.wikipedia.org/wiki/' + wiki_slug
        wiki_slug_var_2 =wiki_slug_var_1 + '_(film)'
        wiki_slug_var_3 = wiki_slug_var_1 + '_(' + i['year'] + '_film)'
        slugs.extend((wiki_slug_var_3, wiki_slug_var_2, wiki_slug_var_1))
    
    
    file_name = 'plots/' + slugify(i['title']) + '.txt'
    found = 0
    
    countries= set()
    text_string =''

    for slug in slugs:
        # we have 3 slugs for every film sorted by priority . If we hit any , we consider its it
        
        if found == 1:
            break
        try:
        
            
            con = requests.get(slug , brows)
            
            text = con.text
            soup = sp(text, 'html.parser', multi_valued_attributes=None)
            
            
            # this block search country info
            cntry=soup.find(string=['Countries', 'country', 'countries', 'Country'])
            
            if cntry:
                
                country_val = cntry.find_next('td')  
                if country_val:
                        for line in country_val.stripped_strings:
                            
                            str_line = str(line).replace('[','').replace('nb 1','')
                            str_line.replace(']','')
                            
                            if len(str_line) >= 3:
                                countries.add(str_line)
                                
                    # we have list of countries         
            
            # this block search plot info
            plot_h = soup.find(id='Plot')
            next_p = plot_h.find_next("p")

            search_on = 1
            for part in next_p.strings:
                
                text_string += part.replace('[edit]',' ')

            for sib in next_p.next_siblings:
                    if search_on == 0:
                        break
                    
                    next_h2 = ["Cast" , "Casting", "Voice cast", "Voice casting", "Production" , 
                                "Adaptations", "Cast[edit]", "Casting[edit]", "Voice cast[edit]", 
                                "Voice casting", "Cast and characters", "Characters",
                                "Production","Filming"]
                    
                    for p in sib.strings:
                        if p in next_h2 :
                        
                            search_on=0
                            found =1
                            break
                        else:
                            text_string += str(p).replace('[edit]',' ')
            
          
        except:
            #print(slug, "didn't shout")
            '''with open('log.txt', 'at', encoding="utf-8") as file:
                            text = slug +"didn't shout\n"
                            file.write(text)'''
    if text_string == '':
        text_string = 'coming soon'
    if not countries :
        countries = ['MilkyWay']
    d = dict()
    d['title'] = i['title']
    d['plot'] = str(text_string)
    d['countries'] = ','.join(list(countries))
    d['year'] = int(i['year'])
    d['slug'] = str(slugify(d['title'])) + str(d['year'])
    d['rating'] = float(i['rating'])
    d['poster']= 'posters/' + slugify(i['title']) + '.jpg'
    d['cast'] = i['cast']
    #print(d['title'])
    d['director'] = i['director']
    d['genres'] = i['genres']
    d['tags'] = []
    films_base.append(d)
    

with open('files/movielib.py', 'wt', encoding="utf-8") as w:
    pref = 'films = ['
    w.write(pref)
    for i in films_base:
        op = json.dumps(i,ensure_ascii=False)
        w.write(op)
        w.write(',')

    ending = ']'
    w.write(ending)

print('done')

                                
