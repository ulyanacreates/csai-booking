from django.shortcuts import render
import json
from django.http import HttpRequest, HttpResponse
from res_api.models import User, ChatMessage,ChatSession
from .utils.utils_request import BAD_METHOD, request_failed, request_success, return_field
from .utils.utils_require import MAX_CHAR_LENGTH, CheckRequire, require,client
from .utils.utils_time import get_timestamp
from .utils.utils_jwt import generate_jwt_token, check_jwt_token
from django.contrib.auth.hashers import make_password, check_password
import re
# Create your views here.



@CheckRequire
def login(req: HttpRequest):
    if req.method != "POST":
        return BAD_METHOD

    body = json.loads(req.body.decode("utf-8"))
    username = require(body, "userName", "string", err_msg="Missing or error type of [userName]")
    password = require(body, "password", "string", err_msg="Missing or error type of [password]")
 
    try:
        user = User.objects.get(name=username)
        if check_password(password , user.password) :
            token = generate_jwt_token(username)
            return request_success({"token":token,
                                    "user_id": user.id,
                                    "user_name": username
                                    })
        else :
            return request_failed(2,"Wrong password",401)
    except:
        return request_failed(1,"Wrong username",401)

def password_check(password_):
    return (re.search(r"[A-Z]",password_) and re.search(r"[a-z]",password_) or\
        re.search(r"[A-Z]",password_) and re.search(r"\d",password_) or\
        re.search(r"[A-Z]",password_) and re.search(r"[!@#$%^&*]",password_) or\
        re.search(r"[a-z]",password_) and re.search(r"\d",password_) or\
        re.search(r"[a-z]",password_) and re.search(r"[!@#$%^&*]",password_) or\
        re.search(r"\d",password_) and re.search(r"[!@#$%^&*]",password_))

def register(req: HttpRequest):
    if req.method != "POST":
        return BAD_METHOD
    body = json.loads(req.body.decode("utf-8"))
    username_ = require(body, "userName", "string", err_msg="Missing or error type of [userName]")
    password_ = require(body, "password", "string", err_msg="Missing or error type of [password]")
    # email_ = require(body,"email", "string", err_msg="Missing or error type of [email]")
    phonnm_ = require(body,"phoneNumber", "string", err_msg="Missing or error type of [phoneNumber]")
    user_type = require(body,"user_type", "string", err_msg="Missing or error type of [user_type]")
    
    # img_id = require(body,"img_id", "string", err_msg="Missing or error type of [img_id]")
    
    if (len(username_) == 0 or len(username_) > 20):
        return request_failed(-2,"Bad length of [username]")
    
    if (len(password_) < 6 or len(password_) > 20):
        return request_failed(-2, "Bad length of [password]")
    
    if not password_check(password_):
        return request_failed(-2,"Bad formation of [password]")
    
    filter_user = User.objects.filter(name=username_)
    if (filter_user.exists()):
        return request_failed(2,"Existing username",401)
    user_ = User.objects.create(name=username_,
                                password=make_password(password_),
                                user_type=user_type,
                                phone=phonnm_)
    user_.save()
    token = generate_jwt_token(username_)
    return request_success({"token": token,
                            "user_id":user_.id})

def verify_loggedin(req: HttpRequest):
    if req.method != "POST":
        return BAD_METHOD
    jwt_token = req.headers.get("Authorization")
    jwt_payload = check_jwt_token(jwt_token)
    body = json.loads(req.body.decode("utf-8"))
    if not jwt_payload :
        return request_failed(2,"Invalid or expired JWT",401)
    
    user_id= require(body,"user_id","string",err_msg="Missing or error type of [userName]")
    user = User.objects.get(id=user_id)
    if user.name != jwt_payload["username"] or user.login_status == False :
        return request_failed(3,"Permission denied",403)
    
    return request_success()
    

def voice_message(req: HttpRequest):
    # if req.method != "POST":
    #     return BAD_METHOD
    # # print(req)
    # audio_file = req.FILES['audio']
    # return request_success()
    pass
def text_message(req:HttpRequest):
    if req.method != "POST":
        return BAD_METHOD
    jwt_token = req.headers.get("Authorization")
    jwt_payload = check_jwt_token(jwt_token)
    body = json.loads(req.body.decode("utf-8"))
    if not jwt_payload :
        return request_failed(2,"Invalid or expired JWT",401)
    body = json.load(req.body.decode("utf-8"))
    user_id= require(body,"user_id","string",err_msg="Missing or error type of [userName]")
    user_ = User.objects.get(id=user_id)
    session = ChatSession.objects.get(user=user_)
    messages = session.messages.order_by("timestamp")
    messages_asst = []
    for msg in messages:
        dct = {}
        dct["role"] = msg.role
        dct["content"] = msg.content
        messages_asst.append(dct)


    

