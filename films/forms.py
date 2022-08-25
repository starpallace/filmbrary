from socket import fromshare
from django import forms
from .models  import Movie

class AddMovie(forms.ModelForm):
    class Meta:
        model = Movie
        fields = [ 
            'title', 
            'year', 
            'desc',
            'poster',
            'screens',
            'taggs_plus',
            'slug'
        ]


        