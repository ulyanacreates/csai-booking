# Generated by Django 4.2.4 on 2025-06-05 14:41

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.TextField()),
                ('description', models.TextField()),
                ('working_hours', models.CharField(max_length=255)),
                ('contact_number', models.CharField(max_length=50)),
                ('image_url', models.URLField(blank=True, null=True)),
                ('menu', models.TextField()),
                ('tables', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('phone', models.CharField(default='', max_length=255)),
                ('user_type', models.CharField(default='', max_length=255)),
            ],
            options={
                'indexes': [models.Index(fields=['name'], name='res_api_use_name_bfc623_idx')],
            },
        ),
        migrations.CreateModel(
            name='ReservationInfo',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('phone', models.CharField(default='', max_length=255)),
                ('number_of_ppl', models.CharField(max_length=255)),
                ('restuarant_name', models.TextField()),
                ('reservation_time', models.DateTimeField(default=datetime.datetime(1970, 1, 1, 0, 0, tzinfo=datetime.timezone.utc))),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='res_user', to='res_api.user')),
            ],
        ),
        migrations.CreateModel(
            name='ChatSession',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='res_api.user')),
            ],
        ),
        migrations.CreateModel(
            name='ChatMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('user', 'User'), ('assistant', 'Assistant'), ('system', 'System')], max_length=10)),
                ('content', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='res_api.chatsession')),
            ],
        ),
    ]
