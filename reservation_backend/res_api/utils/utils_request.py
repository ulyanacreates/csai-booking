from django.http import JsonResponse
import qrcode
import base64
from io import BytesIO
from PIL import Image

def request_failed(code, info, status_code=400):
    return JsonResponse({
        "code": code,
        "info": info
    }, status=status_code)


def request_success(data={}):
    return JsonResponse({
        "code": 0,
        "info": "Succeed",
        **data
    })


def return_field(obj_dict, field_list):
    for field in field_list:
        assert field in obj_dict, f"Field `{field}` not found in object."

    return {
        k: v for k, v in obj_dict.items()
        if k in field_list
    }

def generate_qr_base64(data,max_size=150):
    qr = qrcode.make(data)
    buffer = BytesIO()
    qr.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    qr.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"

BAD_METHOD = request_failed(-3, "Bad method", 405)
