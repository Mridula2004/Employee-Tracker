# employees/admin.py

from django.contrib import admin
from .models import Employee, Login, Project

admin.site.register(Employee)
admin.site.register(Login)
admin.site.register(Project)