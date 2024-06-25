from django.http import JsonResponse
from .models import Employee, Login, Project
from .serializers import EmployeeSerializer, LoginSerializer, ProjectSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST

@api_view(['GET', 'POST'])
def employee_list(request, format=None):
    if request.method == 'GET':
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return JsonResponse({"Employees": serializer.data}, safe=False)
    
    if request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def employee_detail(request, id, format=None):
    try:
        employee = Employee.objects.get(pk=id)
    except Employee.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def login_list(request, format=None):
    if request.method == 'GET':
        logins = Login.objects.all()
        serializer = LoginSerializer(logins, many=True)
        return JsonResponse({"logins": serializer.data}, safe=False)
    
    elif request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def login_detail(request, id, format=None):
    try:
        login = Login.objects.get(pk=id)
    except Login.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = LoginSerializer(login)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = LoginSerializer(login, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        login.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def project_list(request, format=None):
    if request.method == 'GET':
        project = Project.objects.all()
        serializer = ProjectSerializer(project, many=True)
        return JsonResponse({"project": serializer.data}, safe=False)
    
    elif request.method == 'POST':
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def project_detail(request, id, format=None):
    try:
        project = Project.objects.get(pk=id)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@require_POST
def add_project(request):
    data = request.POST  # Assuming data comes from a form or JSON payload
    new_project = Project.objects.create(
        name=data['name'],
        hours_assigned=data['hours_assigned'],
        employees_assigned=data['employees_assigned']
    )
    
    # Split employee names from data['employees_assigned']
    employee_names = data['employees_assigned'].split(',')
    
    # Update employees' projects_done and hours_assigned
    for name in employee_names:
        employee = get_object_or_404(Employee, name=name.strip())
        if employee.projects_done:
            employee.projects_done += f',{new_project.name}'
            employee.hours_assigned += f',{new_project.hours_assigned}'
        else:
            employee.projects_done = new_project.name
            employee.hours_assigned = new_project.hours_assigned
        employee.save()

    return JsonResponse({
        'id': new_project.id,
        'name': new_project.name,
        'hours_assigned': new_project.hours_assigned,
        'employees_assigned': new_project.employees_assigned
    })