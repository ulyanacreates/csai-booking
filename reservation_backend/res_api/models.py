from .utils import utils_time
from django.db import models
from .utils.utils_request import return_field
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
import datetime
from .utils.utils_require import MAX_CHAR_LENGTH

# Create your models here.

class User(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=MAX_CHAR_LENGTH, unique=True)
    password = models.CharField(max_length=MAX_CHAR_LENGTH)
    phone = models.CharField(max_length=MAX_CHAR_LENGTH,default="")
    user_type = models.CharField(max_length=MAX_CHAR_LENGTH,default="")
    class Meta:
        indexes = [models.Index(fields=["name"])]
    def serialize(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "createdAt": self.created_time,
        }
    
    def __str__(self) -> str:
        return self.name
    
class ReservationInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.ForeignKey(User,on_delete=models.CASCADE, related_name='res_user')
    phone = models.CharField(max_length=MAX_CHAR_LENGTH,default="")
    reservation_time = models.DateTimeField(default=datetime.datetime(1970, 1, 1, tzinfo=timezone.utc))


