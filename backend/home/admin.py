from django.contrib import admin

from home.models import AdminEmail, CongradulatoryMessage


# Register your models here.
admin.site.register(CongradulatoryMessage)
admin.site.register(AdminEmail)