from django.shortcuts import render, get_object_or_404
from .models import Movie
from .forms import AddMovie
from django.template.defaultfilters import slugify
from taggit.models import Tag

def home(request):
    
    mq = Movie.objects.order_by('title')
    common_tags = Movie.taggs_plus.most_common()[:4]
    form = AddMovie(request.POST)
    if form.is_valid():
        newfilm = form.save(commit=False)
        newfilm.slug = slugify(newfilm.title)
        newfilm.save()
        # Without this next line the tags won't be saved
        form.save_m2m()
    
    context = {
        'site':'FilmBrary',
        'movies':mq,
        'form': form,
        'common_tags': common_tags,
    }
    
    return render(request,'films/home.html', context)