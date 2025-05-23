from django.shortcuts import render
import json
from django.http import HttpRequest, HttpResponse
from res_api.models import User, ChatMessage,ChatSession,ReservationInfo
from .utils.utils_request import BAD_METHOD, request_failed, request_success, return_field,generate_qr_base64
from .utils.utils_require import MAX_CHAR_LENGTH, CheckRequire, require
from .utils.utils_time import get_timestamp
from .utils.utils_jwt import generate_jwt_token, check_jwt_token
from django.contrib.auth.hashers import make_password, check_password
import re
from zhipuai import ZhipuAI
# Create your views here.

api_key = "76ed5713b6c24a678ba16e6c4f751645.uhWJabToEluWbLJt"
client = ZhipuAI(api_key=api_key)

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
                                    "user_name": username,
                                    "user_type": user.user_type
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
                            "user_name": username_,
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

    user_id = require(body,"user_id","string",err_msg="Missing or error type of [userName]")
    message = require(body,"message","string",err_msg="Missing or error type of [message]") 
    user_ = User.objects.get(id=user_id)
    try:
        session = ChatSession.objects.get(user=user_)
    except:
        session = ChatSession.objects.create(user=user_)
        session.save()
    messages = session.messages.order_by("timestamp")
    if not messages.exists():
        ms = ChatMessage.objects.create(session=session,
                                   role="system",
                                   content="You are a friendly and knowledgeable reservation system AI agent. Your job is to help users find restaurants, check table availability, and make reservations smoothly.\
                                            Here are some restaurants you know about:\
                                            The Olive Gardenia is a cozy Mediterranean bistro open from 11 AM to 10 PM. They offer fresh pastas, grilled seafood, and a wide range of wines. Currently, they have 4 tables for 2 people, 3 tables for 4 people, and 1 table for groups available. Popular dishes include Grilled Octopus, Lamb Kofta, Seafood Risotto, and Baklava. The restaurant is located at 12 Olive St., Riverside District. Contact number: +1-555-123-4567.\" \
                                            Sakura Sushi Bar is an authentic Japanese sushi spot open from noon to 11 PM. They have 6 tables for 2 people, 2 tables for 4 people, and no group tables free right now. Highlights include Dragon Roll, Salmon Nigiri, Miso Soup, and Tempura. Located at 48 Sakura Ave., Downtown. Contact: +1-555-987-6543.\" \
                                            Bella Pasta serves classic Italian dishes with homemade pasta and sauces. Open 10:30 AM to 9:30 PM, they have 3 tables for 2 people, 4 tables for 4, and 2 group tables free. Try their Spaghetti Carbonara, Lasagna, Tiramisu, and Bruschetta. Located at 22 Via Roma, Old Town. Phone: +1-555-321-7890.\
                                            Spice Route is a vibrant Indian restaurant open 11 AM to 10:30 PM. They offer rich curries, tandoori dishes, and vegetarian options, with 5 tables for 2 people, 3 tables for 4, and 1 group table available. Popular dishes include Butter Chicken, Paneer Tikka, Naan Bread, and Samosa. Located at 7 Spice Rd., Market Square. Contact: +1-555-456-1234.\
                                            Green Garden Vegan specializes in fresh, organic vegan food. Open 9 AM to 8 PM, they have 4 tables for 2 people and 2 tables for 4 available now. Recommended dishes are Quinoa Salad, Tofu Stir-fry, Vegan Burger, and Smoothie Bowl. Found at 15 Greenway Blvd., West End. Phone: +1-555-654-3210. \
                                            NOTE: When a reservation is confirmed, respond with a clear confirmation message to the user and include a valid JSON object with the reservation details (restaurant_name: name of restaurant,phone:user_phone_number (you should ask this info if not provided), number_of_ppl (you should ask this info if not provided): number_of_people, reservation_time:reservation_time) for system processing, do not include any information (Here's the reservation detail in JSON format:) about JSON file in user response, just put that json code block in the end of response. Place the JSON in a code block if needed.")
        ms.save()
    messages_asst = []
    if len(message) > 0:
        ms2 = ChatMessage.objects.create(session=session,
                                role="user",
                                content=message)
        ms2.save()
    session = ChatSession.objects.get(user=user_)
    session.messages.create()
    messages = session.messages.order_by("timestamp")
    for msg in messages:
        dct = {}
        if msg.role == "":
            continue
        dct["role"] = msg.role
        dct["content"] = msg.content
        messages_asst.append(dct)
    # print(messages_asst)
    response = client.chat.completions.create(
                    model="glm-4-flash",  
                    messages=messages_asst)
    match_  = re.search(r"\{.*\}", response.choices[0].message.content, re.DOTALL)
    txt = response.choices[0].message.content
    if match_:
        res_info = json.loads(match_.group(0))
        txt = txt.replace(match_.group(0), '').strip()
        print(res_info)
        reservation = ReservationInfo.objects.create(customer=user_,phone=res_info["user_phone_number"],
                                                     number_of_ppl=res_info["number_of_people"],reservation_time=res_info["reservation_time"],
                                                     restuarant_name=res_info["restaurant_name"])
        reservation.save()
        print("Saved in database")
    ms2 = ChatMessage.objects.create(session=session,
                                     role = "assistant",
                                     content = response.choices[0].message.content )
    ms2.save()
    return request_success({"reply":txt})

def reservation_info(req: HttpRequest,user_id:any):
    if req.method != "GET":
        return BAD_METHOD
    jwt_token = req.headers.get("Authorization")
    jwt_payload = check_jwt_token(jwt_token)
    if not jwt_payload :
        return request_failed(2,"Invalid or expired JWT",401)
    print(jwt_payload)
    user_ = User.objects.get(id=user_id)
    objects = ReservationInfo.objects.filter(customer=user_)
    response = []
    for obj in objects:
        dct = {}

        dct["rest"] = obj.restuarant_name
        dct["res_time"] = obj.reservation_time
        dct["num"] = obj.number_of_ppl
        dct["phone"] = obj.phone
        qr_content = f"Restaurant: {dct['rest']}\nTime: {dct['res_time']}\nPeople: {dct['num']}\nPhone: {dct['phone']}"
        qr_image = generate_qr_base64(qr_content)
        dct["img"] = qr_image
        response.append(dct)
    return request_success({"data":response})       





    


    

