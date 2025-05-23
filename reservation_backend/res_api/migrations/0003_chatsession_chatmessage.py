# Generated by Django 4.2.4 on 2025-05-20 18:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('res_api', '0002_remove_user_email_alter_reservationinfo_name'),
    ]

    operations = [
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
