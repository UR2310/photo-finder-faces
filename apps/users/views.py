
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import CustomUserCreationForm, CustomAuthenticationForm, UserProfileForm


def user_login(request):
    """
    Handle user login.
    """
    if request.user.is_authenticated:
        return redirect('core:index')
    
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome back, {username}!")
                return redirect('core:index')
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = CustomAuthenticationForm()
    
    return render(request, 'users/login.html', {'form': form})


def user_logout(request):
    """
    Handle user logout.
    """
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('core:index')


def user_register(request):
    """
    Handle user registration.
    """
    if request.user.is_authenticated:
        return redirect('core:index')
    
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f"Account created for {username}! You can now log in.")
            return redirect('users:login')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'users/register.html', {'form': form})


@login_required
def profile(request):
    """
    Display user profile.
    """
    return render(request, 'users/profile.html')


@login_required
def edit_profile(request):
    """
    Allow user to edit their profile.
    """
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=request.user.profile, user=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Your profile has been updated!")
            return redirect('users:profile')
    else:
        form = UserProfileForm(instance=request.user.profile, user=request.user)
    
    return render(request, 'users/edit_profile.html', {'form': form})
