from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Personal

class ViewerRegister( UserCreationForm):
    email = forms.EmailField()

    class Meta:
         model = User
         fields = ['username',  'password1', 'password2','email']

class RateUpdateForm(forms.ModelForm):
    class Meta:
        model = Personal
        fields = ['individ_rates']


class PersonalImageForm(forms.ModelForm):
    class Meta:
        model = Personal
        fields = ['image']

class EmailForm(forms.ModelForm):
    
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'email']