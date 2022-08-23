from django.shortcuts import render

def home(request):
    abc= {'site':'FilmBrary'}
    return render(request,'films/home.html', abc)