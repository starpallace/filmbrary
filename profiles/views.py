from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ViewerRegister
from movies.models import MovieWorld
from movies.cache import genres
from .forms import RateUpdateForm, PersonalImageForm, EmailForm
from django.contrib.auth.decorators import login_required


def register(request):
    if request.method == 'POST':
        form = ViewerRegister(request.POST)
        
        if form.is_valid():
            username = form.cleaned_data.get('username')
            messages.success(request, f"account created for {username}")
            form.save()
            return redirect('home')
        else:
            messages.error(request, r'bad entry')
    else:
        form = ViewerRegister()
    return render(request, 'profiles/register.html', {'form': form})


def rate_page(request):
    
    mq = MovieWorld.objects.order_by('title')
    
    form = RateUpdateForm(request.POST, request.FILES, instance=request.user.personal)

    if form.is_valid():
        newrate = form.save(commit=False)
        newrate.save()
        
    else:
        print('not valid')
    
    context = {
        'site':'FilmBrary',
        'movies':mq,
        'form': form,

    }
    
    return render(request,'profiles/rate.html', context)

@login_required
def profile(request):
    iform = PersonalImageForm(request.POST, request.FILES, instance=request.user.personal)
    eform = EmailForm(request.POST, instance=request.user)
    if request.method == 'POST':
        
        if iform.is_valid():
            messages.success(request, f'Your image has been updated')
            iform.save()
        if eform.is_valid():
            messages.success(request, f'Your data has been updated')
            eform.save()
        

        return redirect('profiles-profile')
    else:
        return render (request, 'profiles/profile.html',{'iform': iform, 'eform':eform})

@login_required
def personal_calc(request):
    context = { 'genres': genres }
    return render (request, 'profiles/personal_calc.html', context)