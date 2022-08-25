from django.shortcuts import render, get_object_or_404
from .models import Movie
from .forms import AddMovie
from django.template.defaultfilters import slugify
from taggit.models import Tag

def home(request):
    abc= {'site':'FilmBrary'}
    #fq = Film.objects.order_by('name')
    common_tags = Movie.taggs_plus.most_common()[0:4]
    form = AddMovie(request.POST)



    return render(request,'films/home.html', abc)