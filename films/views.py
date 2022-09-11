from audioop import ratecv
from django.shortcuts import render, get_object_or_404
from .models import Movie
from .forms import AddMovie
from django.template.defaultfilters import slugify
from taggit.models import Tag
from django.views.generic import (
    ListView, DetailView )

class SweetHome(ListView):
    model = Movie
    template_name = 'films/sweet_home.html'
    context_object_name = 'films'
    ordering = ['-id']


class CloneHome (ListView):
    model = Movie
    template_name = 'films/home_clone.html'
    context_object_name = 'films'
    ordering = ['-id']

class FilmPage (DetailView):
    model = Movie
    context_object_name = 'film'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['tt'] = 25
        return context

def film_page(request,slug):
    film = Movie.objects.get(slug=slug)
    all_tags = Tag.objects.all()
    context = {
        'film':film,
        'all_tags': all_tags,
         }
    return render (request, 'films/movie_detail.html', context)


def add_movie(request):
    
    mq = Movie.objects.order_by('title')
    common_tags = Movie.tags.most_common()[:4]
    form = AddMovie(request.POST, request.FILES)

    if form.is_valid():
        newfilm = form.save(commit=False)
        slugname = newfilm.title + str(newfilm.year)
        newfilm.slug = slugify(slugname)
        newfilm.save()
        # Without this next line the tags won't be saved
        form.save_m2m()
    else:
        print('not valid')
    
    context = {
        'site':'FilmBrary',
        'movies':mq,
        'form': form,
        'common_tags': common_tags,
    }
    
    return render(request,'films/add_movie.html', context)

film='film'

def home(request):
    #tag = get_object_or_404(Tag, slug=slug)
    

    films = Movie.objects.all().order_by('-id')
    all_tags = Tag.objects.all()

    # country filter block
    countries =set()
    for c in Movie.objects.all():
        countries.add(c.country)
    country = request.GET.get('country')
    if country:
        if country != 'All':
            films = films.filter(country=country)
    
    
    #tag filter block
    itag1  = request.GET.get('itag1')
    if itag1:
        if itag1 != 'All':
            films = films.filter(tags__name__in=[itag1])

    itag2  = request.GET.get('itag2')    
    if itag2 :
        if itag2 != 'None':
            films = films.filter(tags__name__in=[itag2])
    
    itag3  = request.GET.get('itag3')
    if itag3 :
        if itag3 != 'None':
            films = films.filter(tags__name__in=[itag3])

    etag1  = request.GET.get('etag1')
    if etag1 :
        if etag1 != 'None':
            films = films.exclude(tags__name__in=[etag1])

    etag2  = request.GET.get('etag2')
    if etag2 :
        if etag2 != 'None':
            films = films.exclude(tags__name__in=[etag2])
    
    
    # years filtering
    years = request.GET.get('years')
    if years:
        print("y:", years, '.')
        years=years.split(',')
        year_from = int(years[0])
        year_to = int(years[1])
        films = films.filter(year__lte=year_to).filter(year__gte=year_from)
    

    

    # rating filtering
    ratings = request.GET.get('rating')
    if ratings:
        ratings=ratings.split(',')
        rate_from = float(ratings[0])
        rate_to = float(ratings[1])
        films = films.filter(rating__lte=rate_to).filter(rating__gte=rate_from)
 
    
    







    #print(f'{country},{itag1},{itag2},{itag3},{etag1},{etag2},years from {year_from} to {year_to}')

    context = {
            
            'films': films,
            'all_tags': all_tags,
            'countries': countries,
            
        }
    return render(request, 'films/home_clone.html', context)