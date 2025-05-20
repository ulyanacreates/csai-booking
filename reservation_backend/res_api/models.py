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
        }
    
    def __str__(self) -> str:
        return self.name
    
class ReservationInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.ForeignKey(User,on_delete=models.CASCADE, related_name='res_user')
    phone = models.CharField(max_length=MAX_CHAR_LENGTH,default="")
    reservation_time = models.DateTimeField(default=datetime.datetime(1970, 1, 1, tzinfo=timezone.utc))

class ChatSession(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Session {self.id} for {self.user}"
    
class ChatMessage(models.Model):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('assistant', 'Assistant'),
    )

    session = models.ForeignKey(ChatSession, related_name='messages', on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.timestamp}] {self.role}: {self.content[:50]}"
