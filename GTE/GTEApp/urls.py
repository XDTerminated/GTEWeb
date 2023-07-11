from django.contrib import admin
from django.urls import path
from GTEApp import views

urlpatterns = [
    path("", views.index, name = "GTE"),
    path("prediction/", views.prediction, name = "GTE")
]
