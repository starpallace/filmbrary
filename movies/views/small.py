from django.shortcuts import render, redirect, reverse
from ..models import MovieWorld
from ..forms import AddMovie
from django.template.defaultfilters import slugify
from django.contrib.auth.decorators import login_required
from django.views.generic.edit import UpdateView, DeleteView
from movies.views.home_view import home

# Here are all small views of current projects, excluding home_view or detail_view

@login_required(redirect_field_name='profiles-login')
def add_movie(request):
    
    movie_query = MovieWorld.objects.order_by('title')
    
    form = AddMovie(request.POST, request.FILES)

    if form.is_valid():
        newfilm = form.save(commit=False)
        slugname = newfilm.title + str(newfilm.year)
        newfilm.slug = slugify(slugname)
        newfilm.tags = [ tag.lower() for tag in newfilm.tags ]
        newfilm.cast = [ tag.title() for tag in newfilm.cast ]
        newfilm.save()
        # Without this next cur_film the tags won't be saved
        form.save_m2m()
    else:
        pass
    
    context = {
        'site':'FilmBrary',
        'movies':movie_query,
        'form': form,

    }
    
    return render(request,'movies/add_movie.html', context)


class MoviesUpdateView(UpdateView):
    
    
    model = MovieWorld
    fields = [ 
            'title', 
            'year', 
            'poster',
            'screenshots',
            'tags', 
            'cast',
            'rating',
            'countries',
            'plot',
            'genres',
            'director',
            ]
    template_name_suffix = '_update_form'
    def get_success_url(self):
        return reverse('film_page', kwargs={'slug': self.object.slug})


    
class MoviesDeleteView(DeleteView):
        
    model = MovieWorld
    
    template_name_suffix = '_delete_form'
    success_url = '/'
 
@login_required(redirect_field_name='profiles-login')
def parsed_add(request):
    from ..movielib import films as film

    for cur_film in film:
        form = MovieWorld(slug=cur_film['slug'], title=cur_film['title'], genres=cur_film['genres'].replace(" ","").split(','), 
                    year= cur_film['year'], rating=float(cur_film['rating']), director=cur_film['director'].split(','), 
                    poster=cur_film['poster'], tags=cur_film['tags'],
                    plot=cur_film['plot'], cast = cur_film['cast'].split(','),
                    countries = cur_film['countries'].split(','))
        if len(MovieWorld.objects.filter(title=cur_film['title']))>0:
            print('film exists', end=',')
        
        else:
            form.save()
        
    return redirect(home)


def top_100(request):
    movie_query = MovieWorld.objects.exclude(genres__overlap=['Animation','Reality-TV']).order_by('-rating')[0:100]
    context = { 'movies': movie_query, 'sidebar': 0, }
    return render(request, 'movies/top100.html', context)


def about(request):
    return render(request, 'movies/about.html' )


def category_buider(request):

    movie_query = MovieWorld.objects.all()
    
    countries_set , tags_set, genres_set=set(),set(), set()
        
    for movie in movie_query:
        for country in movie.countries:
            countries_set.add(country)
        for tag in movie.tags:
            tags_set.add(tag)    
        for genre in movie.genres:
            genres_set.add(genre)

    all_tags = list(tags_set)
    all_tags.sort()
    countries = list(countries_set)
    countries.sort()
    genres = list(genres_set)
    genres.sort()

    with open('movies/cache.py', 'wt', encoding="utf-8") as doc:
        pref = 'tags = ['
        doc.write(pref)
        for i in all_tags:
            line="'"+ i + "',"
            doc.write(line)
        ending = ']\n'
        doc.write(ending)

        pref = 'countries = ['
        doc.write(pref)
        for i in countries:
            line="'"+ i + "',"
            doc.write(line)
        ending = ']\n'
        doc.write(ending)

        pref = 'genres = ['
        doc.write(pref)
        for i in genres:
            line="'"+ i + "',"
            doc.write(line)
        ending = ']\n'
        doc.write(ending)

    return redirect(home)

