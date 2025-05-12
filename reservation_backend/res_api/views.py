from django.shortcuts import render
import json
from django.http import HttpRequest, HttpResponse
from res_api.models import User
from .utils.utils_request import BAD_METHOD, request_failed, request_success, return_field
from .utils.utils_require import MAX_CHAR_LENGTH, CheckRequire, require
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
                                    "user_id":user.id,
                                    "img_id":user.image_id})
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
                                image_id=img_id,
                                phone=phonnm_,
                                email=email_)
    user_.save()
    token = generate_jwt_token(username_)
    return request_success({"token": token,
                            "user_id":user_.id})
