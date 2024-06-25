# employees/models.py

from django.db import models
import json

class Employee(models.Model):
    name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    projects_done = models.TextField()
    hours_assigned = models.TextField()

    def set_projects_done(self, projects):
        self.projects_done = json.dumps(projects)

    def get_projects_done(self):
        return json.loads(self.projects_done)

    def set_hours_assigned(self, hours):
        self.hours_assigned = json.dumps(hours)

    def get_hours_assigned(self):
        return json.loads(self.hours_assigned)

    def __str__(self):
        return self.name

class Login(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=100)

    def __str__(self):
        return self.username

class Project(models.Model):
    name = models.CharField(max_length=200)
    hours_assigned = models.TextField()
    employees_assigned = models.TextField()

    def __str__(self):
        return self.name