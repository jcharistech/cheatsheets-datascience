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

#### 5. Register Models In admin.py
+ Set up the schema or models for your Database
```python
# blogpapp/admin.py
from django.contrib import admin

# Register your models here.
from .models import ArticlesModel

admin.site.register(ArticlesModel)


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


# Create a Filter and character search
class ArticlesFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='iexact')
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

or

#### Base.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="style.css">
    <title>{% block title %}My amazing site{% endblock %}</title>
</head>

<body>
    <div id="sidebar">
        {% block sidebar %}
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/blog/">Blog</a></li>
        </ul>
        {% endblock %}
    </div>

    <div id="content">
        {% block content %}{% endblock %}
    </div>
</body>
```

#### In All pages
```html
{% extends "base.html" %}

{% block title %}My amazing blog{% endblock %}

{% block content %}
{% for entry in blog_entries %}
    <h2>{{ entry.title }}</h2>
    <p>{{ entry.body }}</p>
{% endfor %}
{% endblock %}
</html>
```
#### For Static Files, Bootstrap
+ create a folder named static at the same level as manage.py
+ Add the following to settings.py
```python
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATIC_ROOT = os.path.join(BASE_DIR,'root') # this will be created and where django will look for the built static files
STATICFILES_DIRS = [
os.path.join(BASE_DIR,'static'),# required to load the static files
os.path.join(BASE_DIR,'static/bootstrap')
]


```

```bash
python manage.py collectstatic
```
In your html template add
```html
{% load static %}
<link rel="stylesheet" href="{% static 'css/bootstrap.min.css' %}">
<link rel="stylesheet" href="{% static 'css/bootstrap.css' %}">
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


#### StaticFiles
```python
# settings.py
STATIC_URL = '/static/'

# look for static files that are not tied to a particular app from the list of dir
# project root directory
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

# where collectstatic command places the built static files it collects from all static
# this will be created in project root directory
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


```
##### App Structure for Bootstrap/Staticfiles
```bash
myproject
--myproject
----**init**.py
----settings.py
----urls.py
----wsgi.py
--myapp
--static # equivalent to STATIC_URL = '/static/'
----bootstrap # equivalent to STATICFILES_DIRS=(os.path.join(BASE_DIR, 'static/bootstrap'),)
-------css
-------js
--manage.py
```


##### In HTML
```html
{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Blog</title>
    <link rel="stylesheet" type="text/css" href="{% static 'bootstrap/css/bootstrap.css' %}">

</head>
```

### Using Dropdown Choices in Filter
```python
FILTER_CHOICES = (
    ('new', 'New'),
    ('accepted', 'Accepted'),
    ('assigned', 'Assigned'),
    ('reopened', 'Reopened'),
    ('closed', 'Closed'),
    ('', 'Any'),
)

# And your TicketFilter would be:

class TicketFilter(django_filters.FilterSet):

   status = django_filters.ChoiceFilter(choices=FILTER_CHOICES)

   class Meta:
      model = Ticket
      fields = ['assigned_to']
```

### Using Django-Debug-Toolbar
pip install django-debug-toolbar

+ Add to INSTALLED_APPS
```python
# settings.py
 INSTALLED_APPS = [
    # ...
    "debug_toolbar",
    # ...
]
```

+ Add to MIDDLEWARE & INTERNAL IP

```python
# settings.py
MIDDLEWARE = [
    # ...
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    # ...
]

INTERNAL_IPS = [
    # ...
    "127.0.0.1",
    # ...
]

```

+ Add to urls.py of main project
```python
# blogproject/urls.py
from django.urls import include, path

urlpatterns = [
    # ...
    path('__debug__/', include('debug_toolbar.urls')),
]

```

### Testing Django 

#### Structure for Project
+ every app has a tests.py file where you can place your tests
```
├── blogapp
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── __init__.py
│   ├── migrations
│   ├── models.py
│   ├── templates
│   ├── tests    ### you create this and run 'python3 manage.py test blogapp.tests'
│       ├── __init__.py
│       └── test_home_page.py
│   ├── tests.py ### Defaults tests.py for each app
│   ├── urls.py
│   └── views.py
├── blogproject
│   ├── asgi.py
│   ├── __init__.py
│   ├── __pycache__
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── db.sqlite3
├── __init__.py
└── manage.py

```


#### Unittest Django
```python
from django.test import TestCase


class TestPage(TestCase):
    def test_home_page_works(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'index.html')
        self.assertContains(response, 'Megablog')


```
##### Test Requests
```python
from django.test import TestCase
from django.test.client import RequestFactory
class RequestTests(TestCase):

    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()
        # Add records to test DB
        populate_test_db()

    def test_home_view_without_client(self):
        request = self.factory.get('/')
        response = home(request)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Some text that should be in the HOME view")

```
##### Testing Models
```python
# Testing Models
import json
import time
from django.contrib.auth.models import User
from my_application.models import Category, Thing

def populate_test_db():
    """
    Adds records to an empty test database
    """
    cat = Category.objects.create(cat_name='Widgets')
    cat_inactive = Category.objects.create(cat_name='Inactive Category',
                                            cat_active=False)
    thing1 = Thing.objects.create(category=cat,
                                thing_desc="Test Thing",
                                thing_model="XYZ1234",
                                thing_brand="Brand X")

    User.objects.create_user(
        username='admin',
        email='admin@test.com',
        password='secret666')


def login_client_user(self):
    self.client.login(username='admin', password='secret666')
    return self

def logout_client_user(self):
    self.client.logout()
    return self

def is_json(myjson):
    """
    tests if a string is valid JSON
    """
    try:
        json_object = json.loads(myjson)
    except ValueError, e:
        return False
    return True
```

#### Adding Pagination
```python
# views.py
from django.core.paginator import Paginator


def index(request):
    bible_passages = BibleModel.objects.all()
    myFilter = BibleModelFilter(request.GET, queryset=bible_passages)
    bible_passages = myFilter.qs
    paginator = Paginator(bible_passages, 25)  # Show 25 contacts per page.
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    context = {"name":"Jesse","bible_passages":bible_passages,"myFilter":myFilter,'page_obj': page_obj}
    return render(request, "index.html", context)

```
#### Add to HTML
```html
 {% for passage in page_obj %}
  <tbody>
    <tr>
      <th scope="row"> {{ passage.book }}</th>

      <td>{{ passage.chapter }}</td>
      <td>{{ passage.verse }}</td>
        <td><a href="{% url 'read' passage.id %}"> view </a></td>
    </tr>
  </tbody>
        {% empty %}
        <p>No Results Found</p>
        {% endfor %}

<div class="pagination">
    <span class="step-links">
        {% if page_obj.has_previous %}
            <a href="?page=1">&laquo; first</a>
            <a href="?page={{ page_obj.previous_page_number }}">previous</a>
        {% endif %}

        <span class="current">
            Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}.
        </span>

        {% if page_obj.has_next %}
            <a href="?page={{ page_obj.next_page_number }}">next</a>
            <a href="?page={{ page_obj.paginator.num_pages }}">last &raquo;</a>
        {% endif %}
    </span>
</div>
```


#### Adding Datatables.js
```html
<head>
    <link rel="stylesheet" href="style.css">
    <title>{% block title %}MLDB Project{% endblock %}</title>

<link rel="stylesheet" href="{% static 'css/bootstrap.css' %}">
  <link href="{% static 'css/style.css' %}">
    <link href="{% static 'css/dataTables.bootstrap.min.css' %}">
  <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.13.2/css/jquery.dataTables.css">
</head>

<body>

<table class="table table-bordered" id="examples">
        {% for i in list_of_items %}
</table>

<script src="{% static 'js/jquery.min.js' %}"></script>
<script src="{% static 'js/tether.min.js' %}"></script>
<script src="{% static 'js/bootstrap.min.js' %}"></script>
<script src="{% static 'js/jquery.dataTables.min.js' %}"></script>
<script src="{% static 'js/dataTables.bootstrap.min.js' %}"></script>
<!--For Datatables-->
    <script>
    $(document).ready(function(){
        $("#example").DataTable({
        // Configuration
        paging:true, // Pagination
        pageLength: 20, // Data per page
        autoWidth: false, // Control column width
        searching: false, // Search globally in table
        bSort:true,// Filter A to Z
        bInfo: true, // bottom info

        })});

    </script>
</body>
```

### Deploying Django Project with Nginx(server,static files) & Gunicorn(wsgi)
#### Add IP or Domain Name to ALLOWED HOST in settings.py


#### Map the hosts (/etc/hosts)
```hosts
127.0.0.1   localhost
my_ip_address myproject.com
127.0.0.1   myproject.com

```

mkdir conf
nano conf/gunicorn_config.py
Paste the following inside gunicorn_config.py
```python
command='/home/myproject/venv/bin/gunicorn'
pythonpath='/home/myproject'
bind = '127.0.0.1:8000'
workers = 3
```
#### Start Gunicorn to Start Django
```bash
gunicorn -c conf/gunicorn_config.py myproject.wsgi
```

#### Setting Up Nginx
1. Create a config for your site
```
nano /etc/nginx/sites-available/myproject.conf
```
2. Paste this in the conf file
```
server {
    listen 80;
    server_name my_ip_address;

    location /static/ {
        root /home/path/to/myproject/static/;
    }
    location / {
        proxy_pass http://ip_or_sitename:8000:
    }
}


```

3. Move to sites-enable and create a sym link to there
```bash
cd /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/myproject 
```
or 
```bash
sudo ln -s /etc/nginx/sites-available/myproject.conf  /etc/nginx/sites-enabled/
```
4. Restart nginx
```bash
sudo systemctl restart nginx
systemctl status nginx.service
```



#### By 
* Jesse E.Agbe(JCharis)
* Jesus Saves @JCharisTech
* 2022