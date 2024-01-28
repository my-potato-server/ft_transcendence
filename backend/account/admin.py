from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User
from .forms import AdminChangeForm, AdminCreationForm


class UserAdmin(BaseUserAdmin):
    form = AdminChangeForm
    add_form = AdminCreationForm

    list_display = ['id', 'login', 'is_superuser', 'is_active', ]
    list_filter = ['is_superuser', ]
    fieldsets = [
        (None, {'fields': ('id', 'login',)}),
        ('Permissions', {'fields': ('is_superuser', 'is_active',)}),
    ]
    add_fieldsets = [
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('id', 'login', 'password1', 'password2',)
            },
        ),
    ]

    search_fields = ['login', ]
    ordering = ['login', ]
    filter_horizontal = []


admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
