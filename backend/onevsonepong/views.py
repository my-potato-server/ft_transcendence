# onevsonepong/views.py

from django.shortcuts import render
from .models import Game
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.http import HttpResponse
import json

def game_view(request):
	return render(request, 'index.html', {})

def websocket_view(request):
	return HttpResponse('index')

def index(request):
	return render(request, 'index.html', {})