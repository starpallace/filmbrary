import re
from bs4 import BeautifulSoup as bs
import json



#this file parses html file from IMDB detailed results

with open ('files/250.html', 'rb') as data:
    soup = bs(data, 'html.parser')

    found =soup.find_all(['img','a','strong','span', 'h3','p'])
    
    films_base = []

    s = 0
    
    for i in found:
        
        if 'd' not in locals():
            d = dict()
        # if 6 fields are populated code ads dictionary to list and create empty one
        if s==6:
            films_base.append(d)
            d = dict()
            s=0

        # cast + director
        if i.name=='p':
            if i.has_attr('class'):
                if i['class']==[]:
                    dir_recorder='off'
                    star_recorder='off'
                    dirs_recorder=2
                    d['cast']=''
                    d['director']=''
                    for k in i.stripped_strings:
                        if dir_recorder=='on':
                            d['director']=k
                            dir_recorder = 'off'
                        elif dirs_recorder < 2 :
                            d['director']+=k
                            dirs_recorder+=1
                        elif star_recorder=='on':
                            d['cast']+=str(k)    

                        if k == 'Director:':
                            dir_recorder='on'
                        elif k == 'Directors:':
                            dirs_recorder=-1
                        elif k == 'Stars:':
                            star_recorder ='on'    
                    s+=1
        #genre done
        if i.name=='span':
                    if i.has_attr('class'):
                        genre='genre'
                        if genre in i['class']:
                            d['genres'] = i.string.lstrip().rstrip() 
                            s+=1
        # title done
        if i.name == 'h3':
            # 'i'- iter 'a' - tag   'string' is a string
            if i.a:
                d['title'] = i.a.string
                s+=1
        # year done
        if i.name=='span':
            if i.has_attr('class'):
                year_class='lister-item-year'
                if year_class in i['class']:
                    #print(d['title'],i.string)
                    if i.string:
                        digits_only=[o for o in i.string if o.isdigit()]
                        d['year'] = ''.join(digits_only)
                    else:
                        d['year'] = 2050
                    s+=1     
        # rating done
        if i.name=='strong':
            if (i.string[0].isdigit()) & (i.string[1]=='.'):
                d['rating']=i.string
                s+=1
        # image done            
        if i.name=='img':
            if i.has_attr('loadlate'):
                line =i['loadlate']
                reline=re.sub('(._V).*','._V1_.jpg', line)
                d['url'] = reline
                s+=1

with open('files/st1out.py', 'wt', encoding="utf-8") as w:
    strin = 'films = ['
    for i in films_base:
        op = json.dumps(i,ensure_ascii=False)
        strin +=op
        strin +=','
    strin +=']'
    w.write(strin)

    print('done')