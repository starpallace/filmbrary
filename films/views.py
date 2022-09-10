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


def home(request):
    #tag = get_object_or_404(Tag, slug=slug)
    films = Movie.objects.all().filter(year=1998).order_by('-id')
    all_tags = Tag.objects.all()
    context = {
            
            'films': films,
            'all_tags': all_tags,
        }
    return render(request, 'films/home_clone.html', context)

def filter(request):
    #tag = get_object_or_404(Tag, slug=slug)
    films = Movie.objects.all().filter(year=1996).order_by('id')
    all_tags = Tag.objects.all()
    context = {
            
            'films': films,
            'all_tags': all_tags,
        }
    return render(request, 'films/home_clone.html', context)