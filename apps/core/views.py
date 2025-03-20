
from django.shortcuts import render


def index(request):
    """
    Landing page view.
    """
    return render(request, 'core/index.html')


def about(request):
    """
    About page view.
    """
    return render(request, 'core/about.html')
