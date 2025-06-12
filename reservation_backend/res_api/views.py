from django.shortcuts import render
import json
from django.http import HttpRequest, HttpResponse
from res_api.models import User, ChatMessage,ChatSession,ReservationInfo, Restaurant, Menu
from .utils.utils_request import BAD_METHOD, request_failed, request_success, return_field,generate_qr_base64
from .utils.utils_require import MAX_CHAR_LENGTH, CheckRequire, require
from .utils.utils_time import get_timestamp
from .utils.utils_jwt import generate_jwt_token, check_jwt_token
from django.contrib.auth.hashers import make_password, check_password
import re
from zhipuai import ZhipuAI
from datetime import date
import os
from dotenv import load_dotenv
# Create your views here.

load_dotenv(".env")
api_key = os.getenv("API_KEY")
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
                            "user_id":user_.id, 
                            "user_type": user_.user_type})

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
        rests = Restaurant.objects.all()
        data = ""
        for rest in rests:
            print(rest.menu)
            menu = rest.menu
            tables = rest.tables
            data += "Name: {},Address: {},Description: {},Working hours: {},Contact Number: {},Menu: {},Tables: {}\n".format(rest.name,rest.address,rest.description,rest.working_hours,rest.contact_number,menu,tables)
        print(data)
        ms = ChatMessage.objects.create(session=session,
                                   role="system",
                                   content=f"""
                                            You are a friendly and knowledgeable restaurant reservation AI agent. Your primary job is to help users:

                                            - View restaurant options from the database.
                                            - Ask relevant follow-up questions only **after the user expresses interest in making a reservation**.
                                            - Confirm reservations only when all necessary details are available.
                                            - Provide a confirmation message with a correctly formatted JSON object at the end, with **no extra explanation**.

                                            Here is the restaurant database: {data}  
                                            Today’s date is: {date.today()}  

                                            Rules you MUST follow strictly:

                                            1. DO NOT initiate a reservation unless the user clearly expresses interest.
                                            2. When a user wants to make a reservation, always collect these four pieces of information:
                                            - **Restaurant name**
                                            - **User phone number**
                                            - **Number of people**
                                            - **Reservation date and time (both are required, not just the date)**  
                                                If user says only “Jan 21”, ask: “What time on Jan 21 would you like the reservation?”
                                            3. Always check if the requested reservation time is within the restaurant’s working hours from the database.
                                            4. When confirming the reservation, respond naturally (e.g., “Great! Your reservation is confirmed.”), then **at the very end**, include a valid JSON object like this:
                                            ```json
                                            {{"restaurant_name": "", "phone": "", "number_of_ppl":, "reservation_time": "YYYY-MM-DD HH:MM"}}\
                                            **NO NEED TO INCLUDE** words "Here is the confirmation in JSON format before json file" and so on""")
                                                    
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
        reservation = ReservationInfo.objects.create(customer=user_,phone=res_info["phone"],
                                                     number_of_ppl=res_info["number_of_ppl"],reservation_time=res_info["reservation_time"],
                                                     restuarant_name=res_info["restaurant_name"])
        reservation.save()
        print("Saved in database")
    txt = re.sub(r'Here is the confirmation in JSON format:\s*```json\s*```', '', txt).strip()

    ms2 = ChatMessage.objects.create(session=session,
                                     role = "assistant",
                                     content = txt )
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

def chat_info(req: HttpRequest,user_id:any):
    if req.method != "GET":
        return BAD_METHOD
    jwt_token = req.headers.get("Authorization")
    jwt_payload = check_jwt_token(jwt_token)
    if not jwt_payload :
        return request_failed(2,"Invalid or expired JWT",401)
    
    user_ = User.objects.get(id=user_id)
    session = ChatSession.objects.get(user=user_)
    session.messages.create()
    messages = session.messages.order_by("timestamp")
    response = []
    for msg in messages:
        dct = {}
        if msg.role == "" or msg.role == "system":
            continue
        dct["from"] =  "bot" if msg.role == "assistant" else "user"
        dct["text"] = msg.content
        response.append(dct)
    return request_success({"messages":response})
    
def restaurant_info(req: HttpRequest):
    if req.method != "GET":
        return BAD_METHOD
    jwt_token = req.headers.get("Authorization")
    jwt_payload = check_jwt_token(jwt_token)
    if not jwt_payload :
        return request_failed(2,"Invalid or expired JWT",401)
    rest = Restaurant.objects.all()
    data = []
    for rs in rest:
        d = {}
        d["name"] = rs.name
        d["descp"] = rs.description
        d["image_url"] = rs.image_url
        d["address"] = rs.address
        data.append(d)
    return request_success({"rests":data})  


def restaurant_reservations(req: HttpRequest, restaurant_name: str):
    if req.method != "GET":
        return BAD_METHOD
    jwt_token = req.headers.get("Authorization")
    jwt_payload = check_jwt_token(jwt_token)
    if not jwt_payload :
        return request_failed(2,"Invalid or expired JWT",401)
    
    import urllib.parse
    restaurant_name = urllib.parse.unquote(restaurant_name)
    
    reservations = ReservationInfo.objects.filter(restuarant_name=restaurant_name)
    response = []

    for reservation in reservations:
        dct = {}
        dct["rest"] = reservation.restuarant_name
        dct["res_time"] = reservation.reservation_time
        dct["num"] = reservation.number_of_ppl
        dct["phone"] = reservation.phone
        dct["customer_name"] = reservation.customer.name  # Get customer name
        dct["customer_id"] = reservation.customer.id
        
        qr_content = f"Restaurant: {dct['rest']}\nTime: {dct['res_time']}\nPeople: {dct['num']}\nPhone: {dct['phone']}\nCustomer: {dct['customer_name']}"
        qr_image = generate_qr_base64(qr_content)
        dct["img"] = qr_image
        response.append(dct)
    
    return request_success({"data": response, "restaurant_name": restaurant_name, "total_reservations": len(response)})


def menu_list_create(req: HttpRequest):
    """Handle GET (list menus) and POST (create menu item) requests"""
    jwt_token = req.headers.get("Authorization")
    jwt_payload = check_jwt_token(jwt_token)
    if not jwt_payload:
        return request_failed(2, "Invalid or expired JWT", 401)
    
    # Get the user from the JWT payload
    try:
        user = User.objects.get(name=jwt_payload["username"])
    except User.DoesNotExist:
        return request_failed(3, "User not found", 404)
    
    if req.method == "GET":
        # List all menu items for this user/restaurant
        menu_items = Menu.objects.filter(owner=user, is_active=True)
        data = []
        for item in menu_items:
            data.append(item.serialize())
        return request_success({"menu": data})
    
    elif req.method == "POST":
        # Create a new menu item
        try:
            body = json.loads(req.body.decode("utf-8"))
            name = require(body, "name", "string", err_msg="Missing or error type of [name]")
            description = body.get("description", "")
            price = body.get("price", "0.00")
            category = body.get("category", "Uncategorized")
            is_sold_out = body.get("isSoldOut", False)
            
            # Validate price
            try:
                price_decimal = float(price)
                if price_decimal < 0:
                    return request_failed(-1, "Price cannot be negative")
            except (ValueError, TypeError):
                return request_failed(-1, "Invalid price format")
            
            # Get restaurant name from user or use a default
            restaurant_name = user.name if user.name else "Default Restaurant"

            # Create the menu item
            menu_item = Menu.objects.create(
                owner=user,
                restaurant_name=restaurant_name,
                name=name,
                description=description,
                price=price_decimal,
                category=category,
                is_sold_out=is_sold_out
            )
            
            return request_success({
                "message": "Menu item created successfully",
                "id": menu_item.id,
                "item": menu_item.serialize()
            })
            
        except Exception as e:
            return request_failed(-1, f"Error creating menu item: {str(e)}")
    else:
        return BAD_METHOD
    

def menu_detail(req: HttpRequest, menu_id: int):
    """Handle GET, PUT/PATCH (update), and DELETE requests for specific menu items"""
    jwt_token = req.headers.get("Authorization")
    jwt_payload = check_jwt_token(jwt_token)
    if not jwt_payload:
        return request_failed(2, "Invalid or expired JWT", 401)
    
    # Get the user from the JWT payload
    try:
        user = User.objects.get(name=jwt_payload["username"])
    except User.DoesNotExist:
        return request_failed(3, "User not found", 404)
    
    # Get the menu item
    try:
        menu_item = Menu.objects.get(id=menu_id, owner=user, is_active=True)
    except Menu.DoesNotExist:
        return request_failed(4, "Menu item not found", 404)
    
    if req.method == "GET":
        # Get specific menu item
        return request_success({"item": menu_item.serialize()})
    elif req.method == "PUT" or req.method == "PATCH":
        # Update menu item
        try:
            body = json.loads(req.body.decode("utf-8"))
            
            # Update fields if provided
            if "name" in body:
                menu_item.name = body["name"]
            if "description" in body:
                menu_item.description = body["description"]
            if "price" in body:
                try:
                    price_decimal = float(body["price"])
                    if price_decimal < 0:
                        return request_failed(-1, "Price cannot be negative")
                    menu_item.price = price_decimal
                except (ValueError, TypeError):
                    return request_failed(-1, "Invalid price format")
            if "category" in body:
                menu_item.category = body["category"]
            if "isSoldOut" in body:
                menu_item.is_sold_out = body["isSoldOut"]
            
            menu_item.save()
            return request_success({
                "message": "Menu item updated successfully",
                "item": menu_item.serialize()
            })
            
        except Exception as e:
            return request_failed(-1, f"Error updating menu item: {str(e)}")
    
    elif req.method == "DELETE":
        # Soft delete menu item
        menu_item.is_active = False
        menu_item.save()
        
        return request_success({"message": "Menu item deleted successfully"})
    
    else:
        return BAD_METHOD
    

def toggle_menu_item_availability(req: HttpRequest, menu_id: int):
    """Toggle the sold out status of a menu item"""
    if req.method != "PATCH":
        return BAD_METHOD
        
    jwt_token = req.headers.get("Authorization")
    jwt_payload = check_jwt_token(jwt_token)
    if not jwt_payload:
        return request_failed(2, "Invalid or expired JWT", 401)
    
    # Get the user from the JWT payload
    try:
        user = User.objects.get(name=jwt_payload["username"])
    except User.DoesNotExist:
        return request_failed(3, "User not found", 404)
    
    # Get the menu item
    try:
        menu_item = Menu.objects.get(id=menu_id, owner=user, is_active=True)
    except Menu.DoesNotExist:
        return request_failed(4, "Menu item not found", 404)
    
    menu_item.is_sold_out = not menu_item.is_sold_out
    menu_item.save()
    
    return request_success({
        "message": f"Menu item {'marked as sold out' if menu_item.is_sold_out else 'marked as available'}",
        "item": menu_item.serialize()
    })