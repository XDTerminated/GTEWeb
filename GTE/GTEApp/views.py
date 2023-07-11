from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import tensorflowjs as tfjs

# model = tfjs.models.load_model("GTE/static/model/model.json")
model = tfjs.converters.load_keras_model("/Users/sgupta/GTEWeb/GTE/static/model/model.json")
@csrf_exempt
def prediction(request):
     print("reeached prediction")
     if request.method == 'POST':
          print("hello, world!")
          # Retrieve data from the request
          data = request.POST.get('data')
          # print(data)
          print("hello, world!")
          print(data)
          return render(request, 'index.html')
          # return render(request, 'index.html', {'result': result})
     else:
          return render(request, 'index.html')

# Create your views here.
def index(request):
     # return HttpResponse("this is homepage")
     return render(request, "index.html")

