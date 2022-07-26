### Django Snippets
A collection of snippets for working with Django Framework
Simple step by step workflow 


#### Setting Up Django and Basic Commands

```bash
pip3 install django django-rest-framework django-summernote django-filters
```

##### Basic Commands used Step By Step
```bash
django-admin startproject myproject 
cd myproject
python3 manage.py startapp myapp
python3 manage.py runserver
python3 manage.py makemigrations
python3 manage.py migrate
```

##### Configuring the Admin Section
+ This gives you the CRUD options to your models as the Admin (like Flask-Admin)
```bash
python3 manage.py createsuperuser
# enter passwords
```

##### Project Structure and Description
+ Where to find what
```bash
├── blogproject
│   ├── blogapp
│   │   ├── admin.py # Register Models Here:
│   │   ├── apps.py
│   │   ├── filters.py # Filters for Search Form: CharFilter
│   │   ├── forms.py # Forms for HTML: forms.ModelForm/forms.Form
│   │   ├── __init__.py
│   │   ├── migrations
│   │   ├── models.py # Models for DB here
│   │   ├── __pycache__
│   │   ├── templates # folder with html that will be rendered
│   │   ├── tests.py
│   │   ├── urls.py # URLS or Routing: path('index/',view.index,name='index')
│   │   └── views.py # Most work for views and templates
│   ├── blogproject
│   │   ├── asgi.py
│   │   ├── __init__.py
│   │   ├── __pycache__
│   │   ├── settings.py # INSTALLED APPS,MEDIA
│   │   ├── urls.py # URLS :path('',include('blogapp.urls'))
│   │   └── wsgi.py
│   ├── db.sqlite3
│   └── manage.py # CLI 
└── README.md
```

#### 1. Steps For Beginning a Project
+ Projects are the parent folder and they contain apps
+ Apps are where all your logic and views are done
```bash
django-admin startproject myproject 
cd myproject
python3 manage.py startapp myapp
python3 manage.py runserver
```

#### 2. Add the apps to the settings.py
```python
# settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blogapp',
    'django_summernote',
    'django_filters'
]
# Installed 3rd party apps
import os
#INSTALLED_APPS += ('django_summernote', )
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')
X_FRAME_OPTIONS = "SAMEORIGIN"

```

#### 3. Add the path to the new app to the urls.py in project
```python
# blogproject/urls.py
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include("blogapp.urls")),# omit the blogapp/ to direct it straight to http://127.0.0.1:8000/
    path('summernote/', include('django_summernote.urls')), # for wysiwyg editor
]

# For Summernotes
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

```

#### 4. Create A `urls.py` in the APP FOLDER eg blogapp
+ This is where your routes or url patterns goes
```python
# blogapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
 path("index/",views.index,name="index"),
 path("",views.index,name="index"), # routes to http://127.0.0.1:8000/
 path("create/",views.create_blog,name="create"),
 path("read/<str:pk>",views.read_blog,name="read"),  
 path("update/<str:pk>",views.update_blog,name="update"), 
 path("delete/<str:pk>",views.delete_blog,name="delete"), 

 # Login and Signup Routes
 path("signup/",views.signupview,name="signup"),
 path("login/",views.loginview,name="login"),
 path("logout/",views.logoutview,name="logout")

]

```

#### 5. Models For DB
+ Set up the schema or models for your Database
```python
# blogapp/models.py
from django.db import models

# Create your models here.
class ArticlesModel(models.Model):
    title = models.CharField(max_length=5000)
    author = models.CharField(max_length=500)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

```

#### 6. Views For CRUD Apps
+ Same concept and code  for every CRUD app
```python
# blogapp/views.py
from django.shortcuts import render,redirect
from .forms import ArticlesForm
from .models import ArticlesModel
from .filters import ArticlesFilter

# Create your views here.

def index(request):
    articlesList = ArticlesModel.objects.all()
     context = {"name":"Jesse","articles":articlesList}
     return render(request,"index.html",context)

def index_with_search(request):
    articlesList = ArticlesModel.objects.all()# changed to all instead of .filter(active=True)
    myFilter = ArticlesFilter(request.GET,queryset=articlesList)
    articlesList = myFilter.qs
    context = {"articles":articlesList,"myFilter":myFilter}
    return render(request,"index.html",context)


def create_blog(request):
    form = ArticlesForm()
    if request.method == 'POST':
        form = ArticlesForm(request.POST)
        if form.is_valid():
            form.save()
        return redirect('index')

    context = {"name":"Jesse","form":form}
    return render(request,"create_blog.html",context)


def read_blog(request,pk):
    article = ArticlesModel.objects.get(id=pk)
    context = {"article":article}
    return render(request,"read_blog.html",context)

def update_blog(request,pk):
    article = ArticlesModel.objects.get(id=pk)
    form = ArticlesForm(instance=article)
    if request.method == 'POST':
        form = ArticlesForm(request.POST,request.FILES,instance=article)
        if form.is_valid():
            form.save()
        return redirect('index')
    context = {"name":"Jesse","form":form}
    return render(request,"update_blog.html",context)

def delete_blog(request,pk):
    article = ArticlesModel.objects.get(id=pk)
    if request.method == 'POST':
        article.delete()
        return redirect('/')
    context = {"name":"Jesse","article":article}
    return render(request,"delete.html",context)


```


#### 7. Forms For Collection of Data
```python
# blogapp/forms.py
from django.forms import ModelForm
from .models import ArticlesModel

class ArticlesForm(ModelForm):
    class Meta:
        model = ArticlesModel
        fields = '__all__'
        

```


#### 8. Forms For Collection of Data with WYSIWYG Summernote
```python
# blogapp/forms.py
from django.forms import ModelForm
from django import forms
from .models import ArticlesModel

from django_summernote.fields import SummernoteTextFormField, SummernoteTextField
from django_summernote.widgets import SummernoteWidget


class ArticlesForm(ModelForm):
    message = forms.CharField(widget=SummernoteWidget()) # fixes the issue for the index.html

    class Meta:
        model = ArticlesModel
        fields = '__all__'
        

```


#### 9. Filters For Search Form
```python
# blogapp/filters.py
import django_filters
from django_filters import CharFilter
from .models import ArticlesModel


# Create a Filter and show which fields to filter
class ArticlesFilter(django_filters.FilterSet):
    class Meta:
        model = ArticlesModel
        fields = ["title","author"]

```


#### 10. For HTML TEMPLATES
Using Forms in HTML For collecting data

```html
{% extends 'layout.html' %}
{% block content %}
        <div>
            <h2>This is how to use values from context {{ name }}</h2>
        </div>

        <div class="container">
            <form method="POST" action="" enctype="multipart/form-data">
                {% csrf_token %}  <!-- Prevent CSRF Hacks important for every where you will use forms -->
                {{ form.as_p | safe }}
                <!-- {{ form.message | safe }} -->
                <button class="btn btn-info" type="reset">Clear</button>
                <button class="btn btn-success" type="submit">Submit</button>
            </form>
        </div>
{% endblock content %}

```

#### 11. For Looping Through Data From DB
```html
{% for article in articles %}
	{{ article.title }}
	<a href="{% url 'read' article.id %}"> {{ article.title }} </a>       
{% endfor %}
```


#### 12. For Filters
```html
<form method="GET" action="">
       {{ myFilter.form }}
   <button class="btn btn-outline-success" type="submit">Search</button>
 </form>

```

##### For Layouts page that you extend to all pages
```html
{% include 'navbar.html' %}
    {% block content %}

    <!-- everything goes here -->

{% endblock content %}
    
```


### 1. For Authentication and Login Apps

```python
# blogapp/views.py
from django.shortcuts import render,redirect

from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.contrib.auth import authenticate,login,logout 
from django.contrib.auth.decorators import login_required

# Add Forms and Models
from .models import PostsForm
from .forms import PostsForm

# Create your views here.

# Read and Create
@login_required(login_url='login')
def index(request):
    myform = PostsForm()
    pmManager = Posts.objects.all()
    if request.method == 'POST':
        myform = PostsForm(request.POST)
        if myform.is_valid():
            myform.save()
    context = {"name":"Jesse","myform":myform,"posts":pmManager}

    return render(request,"index.html",context)

# Signup or Register
def signupview(request):
    form = UserCreationForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect("/login")
    context = {"form":form}
    return render(request,"accounts/signup.html",context)

# Login
def loginview(request):
    if request.method == 'POST':
        form = AuthenticationForm(request,data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request,user)
            return redirect("/")
    else:
        form = AuthenticationForm(request)

    context = {"form":form}
    return render(request,"accounts/login.html",context)


def logoutview(request):
    logout(request)
    return redirect("/login/")
```

#### 2. Login Form Templates with Hide and Show Password Field
+ For the password the default id is `id_password` hence use that for the hide and show toggle

```html
<div>
        <form action="" method="POST">
            {% csrf_token %}
            {{ form.username }}
            <input type="password" id="id_password" name="password" value='{{form.password.value}}'/>  
            <!-- show only the value of the field dont forget the name="password" to avoid not grapping the new changed -->
            <input type="checkbox" onclick="myFunction()">Show Password
            <button type="reset">Clear</button>
            <button type="submit">Submit</button>
        </form>
    </div>

    <script>
        function myFunction() {
          var x = document.getElementById("id_password");
          if (x.type === "password") {
            x.type = "text";
          } else {
            x.type = "password";
          }
        }
        </script>
```

#### 3. SignUp or Registration Form Templates (signup.html)
```html
<div>
      {% if request.user.is_authenticated %}
        <form action="" method="POST">
            {% csrf_token %}
            {{ form.as_p }}
            
            <!-- <input type="password" id="id_password" name="password" value='{{form.password.value}}'/>   -->
            
            <!-- show only the value of the field dont forget the name="password" to avoid not grapping the new changed -->
            <!-- <input type="checkbox" onclick="myFunction()">Show Password -->
            <button type="reset">Clear</button>
            <button type="submit">Submit</button>
        </form>
        {% else %}
        <div>
          <p>Already Have an Account, <a href="{% url 'loginview' %}">Login here</a></li></p>
        </div>
        {% endif %}
    </div>

    <script>
        function myFunction() {
          var x = document.getElementById("id_password");
          if (x.type === "password") {
            x.type = "text";
          } else {
            x.type = "password";
          }
        }
        </script>
```


#### By 
* Jesse E.Agbe(JCharis)
* Jesus Saves @JCharisTech
* 2022