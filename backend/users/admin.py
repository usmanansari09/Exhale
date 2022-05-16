from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from home.models import Choice, Class, Exercise, Question, Series, SitToStandVideo
from django.contrib.auth.models import Group 
import datetime


from users.forms import UserChangeForm, UserCreationForm
from users.models import Client, ClassStatus, ExerciseStatus, Professional

User = get_user_model()

admin.site.unregister(Group)



@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (("User", {"fields": ("name", "otp", "remember_me")}),) + auth_admin.UserAdmin.fieldsets
    list_display = ["username", "name", "is_superuser"]
    search_fields = ["name"]



class ExerciseStatusStackedInline(admin.StackedInline):
    model = ExerciseStatus

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

class ClassStatusStackedInline(admin.StackedInline):
    model = ClassStatus

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False




@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):

    def full_name(self, obj):
        return obj.user.name

    def email(self, obj):
        return obj.user.email

    fieldsets = (
            ("Client", 
                {"fields": (
                    "user",
                    "professional",
                    "photo",
                    "program_start",
                    "sts_1",
                    "sts_1_date",
                    "sts_2",
                    "sts_2_date",
                    "sts_3",
                    "sts_3_date",
                    "choices",
                    "halfway_checkpoint_choices",
                    "final_checkpoint_choices",
                    "series"
                    )
                }
            ),
        ) 
    list_display = ('full_name', 'email', 'program_start')
    search_fields = ["user"]
    readonly_fields = ['sts_1_date', 'sts_2_date', 'sts_3_date', 'program_start', 'user', 'choices', 'halfway_checkpoint_choices', 'final_checkpoint_choices']
    inlines = [ClassStatusStackedInline, ExerciseStatusStackedInline]

    def save_model(self, request, obj, form, change):
        field = 'series'
        original_series = obj.series.all()
        super().save_model(request, obj, form, change)
        new_series = []
        removed_series = []
        net_status = []
        if change and field in form.changed_data and form.cleaned_data.get(field):
            series_set = form.cleaned_data.get(field)
            for series in original_series:
                if series in series_set:
                    pass
                else:
                    removed_series.append(series)
                    class_status = ClassStatus.objects.filter(client=obj, lesson__series=series).delete()
                    exercise_status = ExerciseStatus.objects.filter(client=obj, exercise__series=series).delete()

            for series in series_set:
                if series in original_series:
                    pass
                else:
                    new_series.append(series)
                    today = datetime.date.today()
                    if series.classes.exists():
                        obj.classes.add(*series.classes.all())
                        class_status = ClassStatus.objects.filter(client=obj, lesson__series=series)
                        for klass in class_status:
                            day_number = klass.lesson.day_number
                            week_number = klass.lesson.week_number
                            date_number = ((week_number - 1) * 7) + (day_number - 1)
                            date = today + datetime.timedelta(date_number)
                            klass.date = date
                            klass.save()
                    if series.exercises.exists():
                        obj.exercises.add(*series.exercises.all())
                        exercise_status = ExerciseStatus.objects.filter(client=obj, exercise__series=series)
                        for exercise in exercise_status:
                            day_number = exercise.exercise.day_number
                            week_number = exercise.exercise.week_number
                            date_number = ((week_number - 1) * 7) + (day_number - 1)
                            date = today + datetime.timedelta(date_number)
                            exercise.date=date
                            exercise.save()


class ClientInline(admin.StackedInline):
    model = Client
    fields = ('user',)


@admin.register(Professional)
class ProfessionalAdmin(admin.ModelAdmin):
    fields = ('business_name', 'business_id', 'referral_code', 'user')
    list_display = ('business_name', 'business_id', 'referral_code')
    search_fields = ["business_name", "business_id", "referral_code"]
    readonly_fields = ['user']


class ChoiceInline(admin.StackedInline):
    model = Choice

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    fields = ('question_text', 'position', 'allow_many')
    inlines = [ChoiceInline]

    def get_ordering(self, request):
        return ['position']


class ClassStackedInline(admin.StackedInline):
    model = Class


class ExerciseStackedInline(admin.StackedInline):
    model = Exercise


@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):

    def exercise_count(self, obj):
        return obj.exercises.all().count()
    
    def classes_count(self, obj):
        return obj.classes.all().count()

    fields = ('title',)
    search_fields = ["title"]
    inlines = [ClassStackedInline, ExerciseStackedInline]
    list_display = ['title', 'exercise_count', 'classes_count']


@admin.register(SitToStandVideo)
class SitToStandVideoAdmin(admin.ModelAdmin):
    fields = ('video',)
