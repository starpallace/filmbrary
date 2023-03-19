from django.shortcuts import render
from ..models import MovieWorld
from django.core.paginator import Paginator
import re
from django.db.models import Q
from ..cache import tags, genres, countries



def home(request):
    
    movies = MovieWorld.objects.all()
    base_line= 'http://localhost:8000/?'
    
    
    if request.method == 'GET':
        
        
        # this block detects if there is last pagination query and cut it
        if request.GET.get('country'):
            query= request.META['QUERY_STRING']
            if request.GET.get('page'):
                query = re.sub(r'(page=).\d*\&', '', query)
                query = re.sub(r'(page=).\d*', '', query)
            query = '&' + query
        else:
            query= ''

        # this dictionary is used for passing seted values to filters
        set_dict = dict()

        # country filter block
        
        country = request.GET.get('country')
        if country:
            if country != 'All':
                movies = movies.filter(countries__contains=[country])
        else:
            country = 'All'
        set_dict['country'] = country        
        
        plot = request.GET.get('plot')
        
        string_search = request.GET.get('string_search')
        if string_search:
            if plot:
                movies = movies.filter(Q(plot__icontains=string_search)|Q(title__icontains=string_search))
            else:
                movies = movies.filter(title__icontains=string_search)
        else:
            string_search = ''
        set_dict['string_search'] = string_search

        #genre filter blocks i- include   e- exclude
        igenre1 = request.GET.get('igenre1')
        if igenre1:
            if igenre1 != 'All':
                movies = movies.filter(genres__contains=[igenre1])

        igenre2 = request.GET.get('igenre2')
        if igenre2:
            if igenre2 != 'All':
                movies = movies.filter(genres__contains=[igenre2])

        egenre1 = request.GET.get('egenre1')
        if egenre1:
            if egenre1 != 'None':
                movies = movies.exclude(genres__contains=[egenre1])

        egenre2 = request.GET.get('egenre2')
        if egenre2:
            if egenre2 != 'None':
                movies = movies.exclude(genres__contains=[egenre2])

        #tag filter blocks
        itag1  = request.GET.get('itag1')
        if itag1:
            if itag1 != 'All':
                movies = movies.filter(tags__contains=[itag1])

        itag2  = request.GET.get('itag2')    
        if itag2 :
            if itag2 != 'None':
                movies = movies.filter(tags__contains=[itag2])
        
        etag1  = request.GET.get('etag1')
        if etag1 :
            if etag1 != 'None':
                movies = movies.exclude(tags__contains=[etag1])

        etag2  = request.GET.get('etag2')
        if etag2 :
            if etag2 != 'None':
                movies = movies.exclude(tags__contains=[etag2])
        
        
        # years filtering
        years = request.GET.get('years')
        if years:
            years=years.split(',')
            year_from = int(years[0])
            year_to = int(years[1])
            movies = movies.filter(year__lte=year_to).filter(year__gte=year_from)
        else:
            year_from =1900
            year_to = 2025
        set_dict['year_from'] = year_from
        set_dict['year_to'] = year_to
        

        # rating filtering
        ratings = request.GET.get('rating')
        if ratings:
            ratings=ratings.split(',')
            rate_from = float(ratings[0])
            rate_to = float(ratings[1])
            movies = movies.filter(rating__lte=rate_to).filter(rating__gte=rate_from)
        else:
            rate_from = 0
            rate_to = 10
        set_dict['rate_from'] = rate_from
        set_dict['rate_to'] = rate_to
    
        #sorting
        sorting=request.GET.get('sort')
        if sorting:
            movies = movies.order_by(sorting)
    else:
        query = ''    

    on_page = request.GET.get('onPage')
    if not on_page:
        on_page=24
    set_dict['onPage'] = on_page
    paginator = Paginator(movies, on_page)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    
    context = {
            
            'movies': movies,
            'all_tags': tags,
            'countries': countries,
            'page_obj': page_obj,
            'paginator': paginator,
            'query': query,
            'base_line' : base_line,
            'genres' : genres,
            'set_dict': set_dict,
            'sidebar':1,
            
            }


    return render(request, 'movies/home.html', context)
