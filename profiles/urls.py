from django.urls import path
from profiles.views import register , rate_page, profile, personal_calc
from django.contrib.auth import views as auth_view

from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    
    path('register/', register, name='profiles-register' ),
    path('profile/', profile, name='profiles-profile' ),
    path('login/', auth_view.LoginView.as_view(template_name='profiles/login.html'), name='profiles-login' ),
    path('logout/', auth_view.LogoutView.as_view(template_name='profiles/logout.html'), name='profiles-logout'),
    path('rate/', rate_page, name='profiles-rate'),
    path('calculator/',personal_calc, name='personal calc')
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
 