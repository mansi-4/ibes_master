from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from base.models import Users
from django.contrib.auth.hashers import make_password, check_password
import jwt, datetime
from django.core.mail import send_mail
from django.conf import settings
# Create your views here.
@api_view(['GET'])
def getUsers(request):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        if(user.is_superuser):
            users = Users.objects.all()
            new_users=[]
            for u in users: 
                st={"user_id":u.id,"name":u.name,"email":u.email,"password":u.password,"isAdmin":u.is_superuser}
                new_users.append(st)
            return Response(new_users)  
        else:
            return Response("You are not an admin")
    else:
        return Response("Authorization Token not provided")

@api_view(['GET'])
def getUserById(request,pk):
    try:
        user = Users.objects.get(id=pk)
        st={"user_id":user.id,"name":user.name,"email":user.email,"isAdmin":user.is_superuser,"isActive":user.status}
        return Response(st)

    except:
        return Response("User not found")

@api_view(['GET'])
def userProfile(request):
    print("hi")
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token: 
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        st={"user_id":user.id,"name":user.name,"email":user.email,"isAdmin":user.is_superuser}
        return Response(st)
    else:
        return Response("Authorization Token not provided")

@api_view(["PUT"])
def updateUserProfile(request):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.get(id=payload["id"])
        try:
            data = request.data
            print(data)
            user.name=data["name"]
            user.email=data["email"]

            if data["password"] != "":
                user.password=make_password(data["password"])
            
            user.save()
            st={"_id":user.id,"name":user.name,"email":user.email,"token":token,"isAdmin":user.is_superuser}
            return Response(st)
        except:
            return Response("Profile updation failed")
    else:
        return Response("Authorization Token not provided")
    
@api_view(["PUT"])
def updateUserPassword(request):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        print(token)
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Link has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Link")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.get(id=payload["id"])
        try:
            data = request.data
            
            if data["password"] != "":
                user.password=make_password(data["password"])
            
            user.save()
            return Response("Password updated Succesfully")
          
        except:
            return Response("Password updation failed")
    else:
        return Response("Authorization Token not provided")

@api_view(['POST'])
def loginUser(request):
    data=request.data
    email=data["email"]
    password=data["password"]
    
    user = Users.objects.filter(email=email).first()

    if user is None:
        raise AuthenticationFailed('User not found!')
    
    if user.status == 1:
        raise AuthenticationFailed('Account is not Activated')
    
    if not check_password(password, user.password):
        raise AuthenticationFailed('Incorrect password!')

    access_token = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=2),
            'iat': datetime.datetime.utcnow()
        }
    access_token = jwt.encode(access_token, 'secret', algorithm='HS256')  
    refresh_token = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=7),
            'iat': datetime.datetime.utcnow()
        }
    refresh_token = jwt.encode(refresh_token, 'secret', algorithm='HS256')
    response = Response()
    # response.set_cookie(key='jwt', value=token, httponly=True)
    response.data = {
        '_id':user.id,
        'email':user.email,
        'name':user.name,
        'isAdmin':user.is_superuser,
        'access_token': access_token,
        'refresh_token': refresh_token
    }
    return response

@api_view(['POST'])
def refreshAccessToken(request):
    if 'Authorization' in request.headers:
        refresh_token = request.headers['Authorization']
        print(refresh_token)
        if not refresh_token: 
            raise AuthenticationFailed('Unauthenticated!')
        try:
            refresh_payload = jwt.decode(refresh_token, 'secret', algorithms=['HS256'])
            user_id = refresh_payload["id"]
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Refresh token has expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed('Invalid refresh token')
        except:
            raise AuthenticationFailed('Invalid refresh token')

        # Generate a new access token with a new expiration time
        access_token = {
            'id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
            'iat': datetime.datetime.utcnow()
        }
        access_token = jwt.encode(access_token, 'secret', algorithm='HS256')

        return Response({'access_token': access_token})
    else:
        return Response({'message': 'Authorization token not provided'})


@api_view(['POST'])
def registerUser(request):
    data=request.data
    user = Users.objects.filter(email=data["email"]).first()

    if user is None:
        user=Users.objects.create(
            name=data["name"],
            email=data["email"],
            password=make_password(data["password"]),
            status=1
        )
        payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }

        token = jwt.encode(payload, 'secret', algorithm='HS256')  
        
        try:
            send_mail(
                subject='User Activation Link',
                message=f'''
                    Hi, {user.name}  \n
                    your OfflineToOnline account is almost ready.\n 
                    To activate your account please Click the following link.\n
                    <a href="http://localhost:3000/user_activation/{token}">activate</a> \n 
                    Please note that this activation link is valid only upto 1 hour. \n
                    After you activate your account, you will be able to login.\n 
                    Thanks & Regards, 
                    OfflineToOnline Team.

                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False
            )
            return Response("Email Verification Sent")
        except:
            return Response("Failed to send Email")
    else:
        return Response("Email ID Already Exists")

@api_view(["POST"])
def verifyUser(request):
    if request.method == "POST":
        data=request.data
        email=data["email"]
        user = Users.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')
        
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')
        try:
            send_mail(
                subject='Password Reset Link',
                message=f'''
                    Hi, \n 
                    You recently requested to reset the password for your OfflineToOnline account.\n 
                    Click the link below to proceed.\n
                    http://localhost:3000/reset_password/{token} \n 
                    Please note that this activation link is valid only upto 10 minutes. \n
                    If you did not request a password reset, please ignore this email or reply to let us know.\n 
                    Thanks & Regards, 
                    OfflineToOnline Team.
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False
            )
            return Response("Email verification sent")
        except:
            return Response("Failed to send Email")

@api_view(["PUT"])
def activateUser(request):
    data=request.data

    token=data["token"]
    if not token:
        raise AuthenticationFailed('Account Activation Failed!')
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Link has Expired!')
    except jwt.InvalidSignatureError:
        raise AuthenticationFailed("Invalid Link")
    except:
        raise AuthenticationFailed("Something went wrong")
    user = Users.objects.get(id=payload["id"])
    try:
        user.status=0
        user.save()
        return Response("Account Activated Successfully")
    except:
        return Response("Account Activation Failed")
    
    
@api_view(["PUT"])
def reActivateUser(request):
    data=request.data
    user = Users.objects.filter(id=data["user_id"]).first()
    payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
                'iat': datetime.datetime.utcnow()
            }

    token = jwt.encode(payload, 'secret', algorithm='HS256')  
    try:
        subject='User Activation Link'
        message=''
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]
        html_message = f"""
                <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Welcome to our website!</title>
                        <style>
                        body {{
                            font-family: sans-serif;
                            padding: 30px;
                            text-align: center;
                        }}
                        .container {{
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f8f8f8;
                        }}
                        h1 {{
                            font-size: 36px;
                            margin-bottom: 20px;
                        }}
                        p {{
                            font-size: 18px;
                            margin-bottom: 10px;
                        }}
                        a {{
                            color: #007bff;
                            text-decoration: none;
                        }}
                        a:hover {{
                            text-decoration: underline;
                        }}
                        </style>
                    </head>
                    <body>
                    <div class="container">
                        <h1>Welcome back to our website!</h1>
                        <p>Dear {user.name},</p>
                        <p>We noticed that you had registered with OfflineToOnline but did not activate your account. To reactivate your account, please click on the link below:</p>
                        <p><a href="https://ibes.offlinetoonline.in/#/user_activation/{token}">Reactivate your account</a></p>
                        <p>Please note that this link is only valid for 15 minutes from the time you received this email. If you do not reactivate your account within this time, you will need to send a new reactivation request.</p>
                        <p>As a registered user, you'll have access to exclusive features and benefits that will make your shopping experience with us even better. Some of the perks of being a registered user include:</p>
                        <ul>
                        <li>Fast and easy checkout</li>
                        <li>Order tracking and history</li>
                        <li>Special promotions and discounts</li>
                        <li>Saved payment methods and addresses for faster shopping</li>
                        </ul>
                        <p>We're always adding new features and improvements to make your shopping experience with us the best it can be, so stay tuned for even more benefits in the future.</p>
                        <p>If you have any questions about your account or our website, please don't hesitate to contact our customer support team. They're available 24/7 to help you with anything you need.</p>
                        <p>Thank you for considering to reactivate your account with us. We're excited to have you back as a customer and we look forward to serving you soon!</p>
                        <p>Sincerely,<br>The OfflineToOnline Team</p>
                    </div>
                    </body>
                    </html>
                    """
            
        send_mail(subject, message, from_email, recipient_list, html_message=html_message)
        
        
        return Response("Email Verification Sent")
    except:
        return Response("Failed to send Email")

@api_view(['PUT'])
def updateUser(request,pk):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.get(id=payload["id"])
        if(user.is_superuser):
            try:
                user=Users.objects.get(id=pk)

                data = request.data
                
                user.name=data["name"]
                user.email=data["email"]
                # user.password=make_password(data["password"])
                user.is_superuser=data["isAdmin"]
         
                user.save()

                return Response("User updated successfully")
            except:
                return Response("User updation failed")
        else:
            return Response("You are not an Admin")

    else:
        return Response("Authorization Token not provided")

@api_view(['DELETE'])
def deleteUser(request,pk):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        if(user.is_superuser):
            try:
                user = Users.objects.get(id=pk)
                user.delete()
                return Response("User Deleted Successfully")
            except:
                return Response("User Deletion Failed")

        else:
            return Response("You are not an admin")
    else:
        return Response("Authorization Token not provided")
    
