
from django import forms
from .models  import MovieWorld

class AddMovie(forms.ModelForm):
    class Meta:
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


        