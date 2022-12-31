from django.shortcuts import render
from rest_framework.decorators import api_view
from django.shortcuts import HttpResponse
from rest_framework import status
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from django.db.models import Q
from app.models import Transaction
from authentication.models import Friends
import json
from datetime import date

# Create your views here.


def serialize_transaction(transaction):
    serialized = model_to_dict(transaction)
    serialized["date"] = str(transaction.date)
    serialized["amount"] = float(transaction.amount)
    serialized["description"] = str(transaction.description)
    serialized["sender"] = str(transaction.sender)
    serialized["reciever"] = str(transaction.reciever)
    return serialized


def serialize_transaction2(transaction):
    serialized = model_to_dict(transaction)
    return serialized["amount"]


def serialize_user(user):
    serialized = model_to_dict(user)
    serialized["username"] = str(user.username)
    serialized["name"] = str(user.first_name+" "+user.last_name)
    del serialized["password"]
    del serialized["date_joined"]
    del serialized["groups"]
    del serialized["user_permissions"]
    del serialized["last_login"]
    del serialized["is_superuser"]
    del serialized["is_staff"]
    del serialized["is_active"]
    return serialized


def serialize_friend(friend):
    serialized = model_to_dict(friend)
    return serialized


@api_view(['GET', 'POST'])
def transactions(request):
    if request.user.is_anonymous:
        return HttpResponse(json.dumps({"message": "Not authorised"}), status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        transactions_data_sent = Transaction.objects.filter(
            sender=request.user.username)
        transactions_data_sent = [serialize_transaction(
            transaction) for transaction in transactions_data_sent]
        transactions_data_received = Transaction.objects.filter(
            reciever=request.user.username)
        transactions_data_received = [serialize_transaction(
            transaction) for transaction in transactions_data_received]

        return HttpResponse(json.dumps({"sent": transactions_data_sent, "recieved": transactions_data_received}), status=status.HTTP_200_OK)

    if request.method == "POST":
        body_unicode = request.body.decode('utf-8')
        today = date.today()
        body = json.loads(body_unicode)
        transaction = Transaction()
        transaction.amount = body['amount']
        transaction.description = body['description']
        transaction.sender = request.user.username
        transaction.reciever = body['reciever']
        transaction.date = today.strftime("%Y-%m-%d")
        transaction.save()

        return HttpResponse(json.dumps({"message": "Money Sent"}), status=status.HTTP_201_CREATED)


@api_view(['PUT', 'DELETE'])
def transaction(request, transaction_id):
    if request.user.is_anonymous:
        return HttpResponse(json.dumps({"message": "Not authorised"}), status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'DELETE':
        Transaction.objects.filter(id=transaction_id).delete()

        return HttpResponse(json.dumps({"message": "Deleted Transaction"}), status=status.HTTP_200_OK)

    if request.method == 'PUT':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        obj = Transaction.objects.get(id=transaction_id)
        obj.amount = int(body["amount"])
        obj.description = body["description"]
        obj.save()

        return HttpResponse(json.dumps({"message": "Updated Transaction!!"}), status=status.HTTP_200_OK)


@api_view(['GET'])
def get_all_users(request):
    if request.user.is_anonymous:
        return HttpResponse(json.dumps({"message": "Not authorised"}), status=status.HTTP_401_UNAUTHORIZED)
    if request.method == "GET":
        allUsers = User.objects.exclude(id=request.user.id)
        allUsers = [serialize_user(
            user) for user in allUsers]
        return HttpResponse(json.dumps({"allUsers": allUsers}), status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def addfriend(request, user_id):
    if request.user.is_anonymous:
        return HttpResponse(json.dumps({"message": "Not authorised"}), status=status.HTTP_401_UNAUTHORIZED)
    if request.method == "POST":
        already_friend = Friends.objects.get(
            Q(friend1=user_id, friend2=request.user.id) |Q(friend2=user_id, friend1=request.user.id))
        
        if already_friend :
             return HttpResponse(json.dumps({"message": "Already Friends"}), status=status.HTTP_409_CONFLICT)
        friends = Friends()
        friends.friend1 = request.user.id
        friends.friend2 = user_id
        friends.save()

        return HttpResponse(json.dumps({"message": "Added Friends"}), status=status.HTTP_201_CREATED)

    if request.method == "GET":
        friends = Friends.objects.filter(Q(friend1=request.user.id) |Q(friend2=request.user.id))
        friends = [serialize_friend(friend) for friend in friends]

        friends = [friend["friend2"] if friend["friend1"] ==
                   request.user.id else friend["friend1"] for friend in friends]
        res = []
        for friend in friends:
            temp = User.objects.filter(id=friend)
            temp = [serialize_user(user) for user in temp]
            print(temp)
            transactions1 = Transaction.objects.filter(
                sender=request.user.username, reciever=temp[0]["username"])
            print(transactions1)
            transactions1 = [serialize_transaction2(
                transaction) for transaction in transactions1]
            transactions2 = Transaction.objects.filter(
                reciever=request.user.username, sender=temp[0]["username"])
            transactions2 = [serialize_transaction2(
                transaction) for transaction in transactions2]

            print(transactions1, transactions2)
            sum1 = 0
            sum2 = 0
            for i in range(0, len(transactions1)):
                sum1 = sum1 + transactions1[i]
            for i in range(0, len(transactions2)):
                sum2 = sum2 + transactions2[i]

            print(sum1, sum2)
            temp[0]["money"] = int(sum1) - int(sum2)
            res.append(temp[0])

        return HttpResponse(json.dumps({"friends": res}), status=status.HTTP_200_OK)
