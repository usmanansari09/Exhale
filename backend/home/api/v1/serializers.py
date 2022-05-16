from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import transaction
from django.db.models import Count, Sum, F
from django.db.models.query_utils import Q
from django.http import HttpRequest
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_auth.serializers import PasswordResetSerializer
from home.models import Choice, CongradulatoryMessage, Question, Series, SitToStandVideo, Class
from dateutil.relativedelta import relativedelta
from home.otp import generateOTP

from users.models import Client, ClassStatus, ExerciseStatus, Exercise, Professional

from datetime import timedelta, datetime, date
from pytz import utc


User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {
                    'input_type': 'password'
                }
            },
            'email': {
                'required': True,
                'allow_blank': False,
            }
        }

    def _get_request(self):
        request = self.context.get('request')
        if request and not isinstance(request, HttpRequest) and hasattr(request, '_request'):
            request = request._request
        return request

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def create(self, validated_data):
        user = User(
            email=validated_data.get('email'),
            name=validated_data.get('name'),
            username=generate_unique_username([
                validated_data.get('name'),
                validated_data.get('email'),
                'user'
            ])
        )
        user.set_password(validated_data.get('password'))
        user.save()
        request = self._get_request()
        setup_user_email(request, user, [])
        return user

    def save(self, request=None):
        """rest_auth passes request so we must override to accept it"""
        return super().save()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']


class PasswordSerializer(PasswordResetSerializer):
    """Custom serializer for rest_auth to solve reset password error"""
    password_reset_form_class = ResetPasswordForm


class UserSignupSerializer(serializers.ModelSerializer):
    """
    Custom serializer for creating an unverified User 
    """
    GENDER_TYPES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Non-Binary', 'Non-Binary'),
        ('Do not wish to answer', 'Do not wish to answer')
    )
    referral_code = serializers.CharField(max_length=255, required=False)
    dob = serializers.DateField(required=False)
    gender = serializers.ChoiceField(choices=GENDER_TYPES, required=False)

    class Meta:
        model = get_user_model()
        fields = ('email', 'name', 'password', 'referral_code', 'gender', 'dob')
        extra_kwargs = {'password': {'write_only': True, 'required': True, 'min_length': 5},
                        'name': {'required': True},
                        'email': {'required': True}
                        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        dob = validated_data.pop('dob', '')
        gender = validated_data.pop('gender', '')
        try:
            referral_code = validated_data.pop('referral_code')
        except Exception as e:
            referral_code = ''
        validated_data['username'] = validated_data.get('email')
        try:
            with transaction.atomic():
                user = super().create(validated_data)
                user.set_password(password)
                user.save()
                if not gender:
                    gender = 'Do not wish to answer'
                if not dob:
                    today = date.today()
                    dob = today - relativedelta(years=50)
                if referral_code:
                    professional = Professional.objects.get(referral_code=referral_code)
                    Client.objects.create(user=user, professional=professional, gender=gender, dob=dob)
                else:
                    Client.objects.create(user=user, gender=gender, dob=dob)
        except ObjectDoesNotExist:
            raise serializers.ValidationError({"message": 'Referral code does not match a Professional'})
        return user

class ProfessionalSerializer(serializers.ModelSerializer):
    """
    Custom serializer for creating a Professional User
    """
    class Meta:
        model = Professional
        fields = ('business_name', 'business_id', 'referral_code')


class ProfessionalUpdateSerializer(serializers.ModelSerializer):
    """
    Custom serializer for creating a Professional User
    """
    class Meta:
        model = Professional
        fields = ('business_name', 'business_id')


class ProUserSignupSerializer(serializers.ModelSerializer):
    """
    Custom serializer for creating an unverified User 
    """
    # business_name = serializers.CharField(max_length=255, required=True)
    # business_id = serializers.CharField(max_length=255, required=True)
    professional = ProfessionalSerializer(required=True)

    class Meta:
        model = get_user_model()
        fields = ('email', 'name', 'password', 'professional')
        extra_kwargs = {'password': {'write_only': True, 'required': True, 'min_length': 5},
                        'name': {'required': True},
                        'email': {'required': True}
                        }


    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['username'] = validated_data.get('email')
        professional_data = validated_data.pop('professional')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        Professional.objects.create(
            user=user,
            business_name=professional_data['business_name'],
            business_id=professional_data['business_id']
            )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for returning Users
    """

    class Meta:
        model = get_user_model()
        fields = ('name', 'email')
        extra_kwargs = {'name': {'read_only': False},
                        'email': {'read_only': True}
                        }



class UserClassSerializer(serializers.ModelSerializer):
    """
    Serializer for returning Users
    """

    class Meta:
        model = Class
        fields = ('title', 'video', 'description', 'additional_resource', 'day_number', 'week_number')


class UserExerciseSerializer(serializers.ModelSerializer):
    """
    Serializer for returning Users
    """

    class Meta:
        model = Exercise
        fields = ('title', 'video', 'description', 'additional_resource', 'day_number', 'week_number')



class FilteredListSerializer(serializers.ListSerializer):

    def to_representation(self, data):
        data = data.filter(date=date.today())
        return super(FilteredListSerializer, self).to_representation(data)


class UserClassStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for returning Users
    """
    lesson = UserClassSerializer()
    series = serializers.SerializerMethodField()

    class Meta:
        list_serializer_class = FilteredListSerializer
        model = ClassStatus
        fields = ('id', 'series', 'lesson', 'date', 'is_completed')
        extra_kwargs = {'id': {'read_only': True},
                        'lesson': {'read_only': True},
                        'date': {'read_only': True},
                        }


    def get_series(self, obj):
        return obj.lesson.series.title



class UserExerciseStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for returning Users
    """
    exercise = UserExerciseSerializer()

    class Meta:
        list_serializer_class = FilteredListSerializer
        model = ExerciseStatus
        fields = ('exercise', 'date', 'is_completed')
        extra_kwargs = {'exercise': {'read_only': True},
                        'date': {'read_only': True},
                        }


class ClientProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for returning Clients and their User data
    """
    user = UserProfileSerializer()
    questionnaire_completed = serializers.SerializerMethodField()
    next_sts_date = serializers.SerializerMethodField()
    next_sts = serializers.SerializerMethodField()
    program_start = serializers.SerializerMethodField()
    program_end = serializers.SerializerMethodField()
    todays_lesson = UserClassStatusSerializer(many=True, source='lesson_status')
    todays_exercise = UserExerciseStatusSerializer(many=True, source='exercise_status')

    class Meta:
        model = Client
        fields = ('id', 'user', 'questionnaire_completed', 'next_sts', 'next_sts_date', 'program_start', 'program_end', 'todays_lesson', 
        'todays_exercise', 'sts_1', 'sts_1_date', 'sts_2', 'sts_2_date', 'sts_3', 'sts_3_date', 'photo', 'dob', 'gender', 'state', 'age',
        'max_heart_rate', 'min_range_heart_rate', 'max_range_heart_rate')
        extra_kwargs = {'age': {'read_only': True},
                        'max_heart_rate': {'read_only': True},
                        'min_range_heart_rate': {'read_only': True},
                        'max_range_heart_rate': {'read_only': True}
                        }


    def get_questionnaire_completed(self, obj):
        if obj.choices.exists():
            return True
        return False

    def get_next_sts(self, obj):
        if obj.sts_1 == 0:
            return "sts_1"
        elif obj.sts_2 == 0:
            return "sts_2"
        elif obj.sts_3 == 0:
            return "sts_3"
        else:
            return None


    def update(self, instance, validated_data):
        if 'user' in validated_data:
            nested_serializer = self.fields['user']
            nested_instance = instance.user
            nested_data = validated_data.pop('user')
            nested_serializer.update(nested_instance, nested_data)
        return super(ClientProfileSerializer, self).update(instance, validated_data)

    def get_next_sts_date(self, obj):
        today = date.today()
        if obj.sts_1 == 0:
            return obj.sts_1_date
        elif obj.sts_2 == 0:
            return obj.sts_2_date
        elif obj.sts_3 == 0:
            return obj.sts_3_date
        else:
            return "Completed"

    def get_program_start(self, obj):
        return obj.program_start

    def get_program_end(self, obj):
        last_exercise = ExerciseStatus.objects.filter(client=obj).order_by('-date').first()
        last_class = ClassStatus.objects.filter(client=obj).order_by('-date').first()

        if last_exercise is None and last_class is None:
            return None
        elif last_exercise and last_class is None:
            return last_exercise.date
        elif last_class and last_exercise is None:
            return last_class.date
        elif last_class and last_exercise:
            if last_exercise.date < last_class.date:
                return last_class.date
            else:
                return last_exercise.date
        else:
            return None



class ChoiceSerializer(serializers.ModelSerializer):
    """
    Serializer for returning the available choices for a particular question
    """

    class Meta:
        model = Choice
        fields = ('id', 'choice_text')


class QuestionListingSerializer(serializers.ModelSerializer):
    """
    Serializer for returning a list of all Questions and their choices
    """
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Question
        fields = ('id', 'position', 'allow_many', 'question_text', 'choices')


class BareChoiceSerializer(serializers.ModelSerializer):
    """
    Serializer for returning the available choices for a particular question
    """

    class Meta:
        model = Choice
        fields = ('id',)
        extra_kwargs = {'id': {'read_only': False}}


class SeriesSerializer(serializers.ModelSerializer):
    """
    Serializer for returning the available choices for a particular question
    """

    class Meta:
        model = Series
        fields = ('id', 'title')


class AllLessonSerializer(serializers.ModelSerializer):
    """
    Serializer for returning the available choices for a particular question
    """

    class Meta:
        model = Class
        fields = ('title', 'video', 'description', 'additional_resource', 'day_number', 'week_number')


class AllExerciseSerializer(serializers.ModelSerializer):
    """
    Serializer for returning the available choices for a particular question
    """

    class Meta:
        model = Exercise
        fields = ('title', 'video', 'description', 'additional_resource', 'day_number', 'week_number')


class LessonStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for returning the available choices for a particular question
    """
    lesson = AllLessonSerializer(serializers.ModelSerializer)
    series = serializers.SerializerMethodField()

    class Meta:
        model = ClassStatus
        fields = ('id', 'date', 'is_completed', 'series', 'lesson', 'difficulty')
        extra_kwargs = {'id': {'read_only': True},
                        'lesson': {'read_only': True},
                        'date': {'read_only': True},
                        'series': {'read_only': True}
        }

    def get_series(self, obj):
        return {"id": obj.lesson.series.pk, "title": obj.lesson.series.title}


class ExerciseStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for returning the available choices for a particular question
    """
    exercise = AllExerciseSerializer(serializers.ModelSerializer)
    series = serializers.SerializerMethodField()


    class Meta:
        model = ExerciseStatus
        fields = ('id', 'date', 'is_completed', 'series', 'exercise', 'difficulty')
        extra_kwargs = {'id': {'read_only': True},
                        'exercise': {'read_only': True},
                        'date': {'read_only': True},
                        'series': {'read_only': True}
        }

    def get_series(self, obj):
        return {"id": obj.exercise.series.pk, "title": obj.exercise.series.title}


class LessonListSerializer(serializers.ModelSerializer):
    """
    Serializer for returning the available choices for a particular question
    """
    lesson = AllLessonSerializer(serializers.ModelSerializer)

    class Meta:
        model = ClassStatus
        fields = ('id', 'date', 'is_completed', 'lesson')
        extra_kwargs = {'id': {'read_only': True},
                        'lesson': {'read_only': True},
                        'date': {'read_only': True}
        }

    def get_series(self, obj):
        return {"id": obj.lesson.series.pk, "title": obj.lesson.series.title}


class ExerciseListSerializer(serializers.ModelSerializer):
    """
    Serializer for returning the available choices for a particular question
    """
    exercise = AllExerciseSerializer(serializers.ModelSerializer)

    class Meta:
        model = ExerciseStatus
        fields = ('id', 'date', 'is_completed', 'exercise')
        extra_kwargs = {'id': {'read_only': True},
                        'exercise': {'read_only': True},
                        'date': {'read_only': True}
        }

    def get_series(self, obj):
        return {"id": obj.exercise.series.pk, "title": obj.exercise.series.title}


class SeriesListSerializer(serializers.Serializer):
    """
    Serilizer for getting the details of a Series
    """
    series = serializers.SerializerMethodField()

    class Meta:
        model = Series
        fields = ('id', 'title')


    def get_series(self, obj):
        user = self.context.get('request').user
        client = Client.objects.filter(user=user)
        lessons = ClassStatus.objects.filter(Q(lesson__series=obj.pk) & Q(client__in=client))
        exercises = ExerciseStatus.objects.filter(Q(exercise__series=obj.pk) & Q(client__in=client))
        serializer = LessonListSerializer(lessons, many=True)
        ex_serializer = ExerciseListSerializer(exercises, many=True)
        return {"id": obj.pk, "title": obj.title, "lessons": serializer.data, "exercises": ex_serializer.data}


class ProfessionalSeriesListSerializer(serializers.Serializer):
    """
    Serilizer for getting the details of a Series of a professionals client
    """
    series = serializers.SerializerMethodField()

    class Meta:
        model = Series
        fields = ('id', 'title')


    def get_series(self, obj):
        request_object = self.context['request']
        client_id = self.context['client_id']
        client = Client.objects.filter(pk=client_id)
        lessons = ClassStatus.objects.filter(Q(lesson__series=obj.pk) & Q(client__in=client))
        exercises = ExerciseStatus.objects.filter(Q(exercise__series=obj.pk) & Q(client__in=client))
        serializer = LessonListSerializer(lessons, many=True)
        ex_serializer = ExerciseListSerializer(exercises, many=True)
        return {"id": obj.pk, "title": obj.title, "lessons": serializer.data, "exercises": ex_serializer.data}



class AllSeriesSerializer(serializers.ModelSerializer):
    """
    Serializer for either the lesson or exercise for today
    """
    details = serializers.SerializerMethodField()
    lesson_status = LessonStatusSerializer(many=True)
    exercise_status = ExerciseStatusSerializer(many=True)


    class Meta:
        model = Client
        fields = ('details', 'lesson_status', 'exercise_status')


    def get_details(self, obj):
        client = Client.objects.filter(user=obj.user)
        counts = (
            Series.objects.filter(clients__in=client)
            .annotate(classes_count=Count("classes"), exercises_count=Count("exercises"))
            .aggregate(
                final_count=Sum(F("classes_count") + F("exercises_count")),
                class_count=Sum(F("classes_count")),
                exercise_count=Sum(F("exercises_count"))
                )
            )
        total_videos = counts.get('final_count')
        total_classes = counts.get('class_count')
        total_exercises = counts.get('exercise_count')
        client = client[0]
        counts = ClassStatus.objects.filter(Q(client=client) & Q(is_completed=True)).count()
        completed_classes = counts
        if not completed_classes:
            completed_classes = 0
        counts = ExerciseStatus.objects.filter(Q(client=client) & Q(is_completed=True)).count()
        completed_exercises = counts
        if not completed_exercises:
            completed_exercises = 0
        try:
            completed_total = completed_classes + completed_exercises
            remaining_classes = total_classes - completed_classes
            remaining_exercises = total_exercises - completed_exercises
            remaining_total = remaining_classes + remaining_exercises
        except Exception as e:
            raise serializers.ValidationError({"message": 'Client has not completed the questionnaire yet'})

        return {
            "Total": total_videos,
            "Total Completed": completed_total,
            "Total Remaining": remaining_total,
            "Total Classes": total_classes,
            "Total Exercises": total_exercises,
            "Completed Classes": completed_classes,
            "Completed Exercises": completed_exercises,
            "Remaining Classes": remaining_classes,
            "Remaining Exercises": remaining_exercises,
            }


class UserChoiceSerializer(serializers.ModelSerializer):
    """
    Serializer for answering a set of questions with a choice
    """
    choices = BareChoiceSerializer(many=True)

    class Meta:
        model = Client
        fields = ('choices',)

    def create_choices(self, choices):
        choice_ids = []
        series_ids = []

        question_ids = set()
        if not choices:
            raise serializers.ValidationError({'message': 'Missing client questionnaire selections'})
        for choice in choices:
            try:
                choice_instance = Choice.objects.select_related('question').select_related('series').get(pk=choice.get('id'))
                if choice_instance.pk in choice_ids:
                    raise serializers.ValidationError({'message': "Duplicate choice IDs detected - Invalid Input"})
                # If we need multiple series per choice, this needs to change to for series_pk in choice_instance.series.all().pk
                try:
                    if not choice_instance.series.pk in series_ids:
                        series_ids.append(choice_instance.series.pk)
                except Exception as e:
                    pass
                choice_ids.append(choice_instance.pk)
                if not choice_instance.question.allow_many:
                    if choice_instance.question.pk in question_ids:
                        raise serializers.ValidationError({'message': "Question ID {} only accepts one choice".format(choice_instance.question.pk)})
                    else:
                        question_ids.add(choice_instance.question.pk)
            except ObjectDoesNotExist as e:
                raise serializers.ValidationError({'message': e})

        return choice_ids, series_ids

    def create_classes(self, instance, series_ids):
        instance.classes.clear()
        instance.exercises.clear()
        for series_id in series_ids:
            try:
                series_instance = Series.objects.prefetch_related('classes').prefetch_related('exercises').get(pk=series_id)
                if series_instance.classes.exists():
                    instance.classes.add(*series_instance.classes.all().order_by('week_number', 'day_number'))
                if series_instance.exercises.exists():
                    instance.exercises.add(*series_instance.exercises.all().order_by('week_number', 'day_number'))
                
            except ObjectDoesNotExist as e:
                raise serializers.ValidationError({'message': e})
        return instance


    def schedule_classes(self, instance):
        class_status = list(ClassStatus.objects.filter(client=instance))
        start_date = instance.program_start
        exercise_status = list(ExerciseStatus.objects.filter(client=instance))
        for klass in class_status:
            day_number = klass.lesson.day_number
            week_number = klass.lesson.week_number
            date_number = ((week_number - 1) * 7) + (day_number - 1)
            date = start_date + timedelta(date_number)
            klass.date = date
            klass.save()
        for exercise in exercise_status:
            day_number = exercise.exercise.day_number
            week_number = exercise.exercise.week_number
            date_number = ((week_number - 1) * 7) + (day_number - 1)
            date = start_date + timedelta(date_number)
            exercise.date=date
            exercise.save()
        return instance


    def update(self, instance, validated_data):
        choices = validated_data.pop('choices', [])
        choice_ids, series_ids = self.create_choices(choices)
        instance.choices.set(choice_ids)
        instance.series.set(series_ids)
        instance = self.create_classes(instance=instance, series_ids=series_ids)
        instance = self.schedule_classes(instance)
        instance.save()
        return instance        


class SecondUserChoiceSerializer(serializers.ModelSerializer):
    """
    Serializer for answering a set of questions with a choice
    """
    halfway_checkpoint_choices = BareChoiceSerializer(many=True)

    class Meta:
        model = Client
        fields = ('halfway_checkpoint_choices',)

    def create_choices(self, choices):
        choice_ids = []
        series_ids = []

        question_ids = set()
        if not choices:
            raise serializers.ValidationError({'message': 'Missing client questionnaire selections'})
        for choice in choices:
            try:
                choice_instance = Choice.objects.select_related('question').select_related('series').get(pk=choice.get('id'))
                if choice_instance.pk in choice_ids:
                    raise serializers.ValidationError({'message': "Duplicate choice IDs detected - Invalid Input"})
                # If we need multiple series per choice, this needs to change to for series_pk in choice_instance.series.all().pk
                try:
                    if not choice_instance.series.pk in series_ids:
                        series_ids.append(choice_instance.series.pk)
                except Exception as e:
                    pass
                choice_ids.append(choice_instance.pk)
                if not choice_instance.question.allow_many:
                    if choice_instance.question.pk in question_ids:
                        raise serializers.ValidationError({'message': "Question ID {} only accepts one choice".format(choice_instance.question.pk)})
                    else:
                        question_ids.add(choice_instance.question.pk)
            except ObjectDoesNotExist as e:
                raise serializers.ValidationError({'message': e})

        return choice_ids, series_ids


    def update(self, instance, validated_data):
        choices = validated_data.pop('halfway_checkpoint_choices', [])
        choice_ids, series_ids = self.create_choices(choices)
        instance.halfway_checkpoint_choices.set(choice_ids)
        return instance


class ThirdUserChoiceSerializer(serializers.ModelSerializer):
    """
    Serializer for answering a set of questions with a choice
    """
    final_checkpoint_choices = BareChoiceSerializer(many=True)

    class Meta:
        model = Client
        fields = ('final_checkpoint_choices',)

    def create_choices(self, choices):
        choice_ids = []
        series_ids = []

        question_ids = set()
        if not choices:
            raise serializers.ValidationError({'message': 'Missing client questionnaire selections'})
        for choice in choices:
            try:
                choice_instance = Choice.objects.select_related('question').select_related('series').get(pk=choice.get('id'))
                if choice_instance.pk in choice_ids:
                    raise serializers.ValidationError({'message': "Duplicate choice IDs detected - Invalid Input"})
                # If we need multiple series per choice, this needs to change to for series_pk in choice_instance.series.all().pk
                try:
                    if not choice_instance.series.pk in series_ids:
                        series_ids.append(choice_instance.series.pk)
                except Exception as e:
                    pass
                choice_ids.append(choice_instance.pk)
                if not choice_instance.question.allow_many:
                    if choice_instance.question.pk in question_ids:
                        raise serializers.ValidationError({'message': "Question ID {} only accepts one choice".format(choice_instance.question.pk)})
                    else:
                        question_ids.add(choice_instance.question.pk)
            except ObjectDoesNotExist as e:
                raise serializers.ValidationError({'message': e})

        return choice_ids, series_ids


    def update(self, instance, validated_data):
        choices = validated_data.pop('final_checkpoint_choices', [])
        choice_ids, series_ids = self.create_choices(choices)
        instance.final_checkpoint_choices.set(choice_ids)
        return instance


class CustomAuthTokenSerializer(serializers.Serializer):
    """
    Serializer for returning an authenticated User and Token
    """
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)
    remember_me = serializers.NullBooleanField(default=None)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        remember_me = attrs.get('remember_me', None)
        if remember_me is None:
            raise serializers.ValidationError({"remember_me": 'This field is required.'})

        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )

        if not user:
            msg = _('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authentication')

        attrs['user'] = user
        return attrs


class OTPSerializer(serializers.Serializer):
    """
    Serializer for working with OTPs
    """
    email = serializers.EmailField()
    otp = serializers.IntegerField()

    def validate(self, attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')

        try:
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            raise serializers.ValidationError({"message": 'A user with this email was not found.'})

        if otp == user.otp:
            if user.otp_expiry > timezone.now():
                user.attempts = 0
                user.save()
            else:
                otp = generateOTP(user=user, email=user.email)
                raise serializers.ValidationError({"message": 'Your OTP has expired. A new OTP has been sent to your email.'})
        else:
            user.attempts += 1
            if user.attempts >= 3:
                otp = generateOTP(user=user, email=user.email)
                raise serializers.ValidationError({"message": 'Too many attempts. A new OTP has been sent to your email.'})
            user.save()
            raise serializers.ValidationError({"message": 'The OTP you have entered is invalid. Please try again.'})

        attrs['user'] = user
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    """
    Serializer for a forgotten password
    """
    model = get_user_model()
    new_password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False, required=True)
    confirm_password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False, required=True)

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        if new_password == confirm_password:
            return attrs
        else:
            
            raise serializers.ValidationError({'message': 'Passwords do not match'})


class SitToStandSerializer(serializers.ModelSerializer):
    """
    Serializer for returning the Sit To Stand Video
    """
    
    class Meta:
        model = SitToStandVideo
        fields = ('video',)


class BareUserSerialzier(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('name', 'email')


class BareClientSerializer(serializers.ModelSerializer):
    user = BareUserSerialzier()
    
    class Meta:
        model = Client
        fields = ('id', 'user')


class BareProClientSerializer(serializers.ModelSerializer):
    """
    Custom Serializer used to return a list of clients belonging to a Professional
    """
    clients = BareClientSerializer(many=True)


    class Meta:
        model = Professional
        fields = ('clients',)


class CurrentClassSeriesSerializer(serializers.Serializer):
    series_name = serializers.CharField(max_length=255)
    day_number = serializers.CharField(max_length=4)
    video = serializers.URLField()


class BareProClientDetailSerializer(serializers.ModelSerializer):
    """
    Custom Serializer used to return a list of clients belonging to a Professional
    """
    next_sts_date = serializers.SerializerMethodField()
    last_sts = serializers.SerializerMethodField()
    program_start = serializers.SerializerMethodField()
    program_end = serializers.SerializerMethodField()
    series = SeriesSerializer(many=True)
    user = BareUserSerialzier()
    current_class_series = serializers.SerializerMethodField()
    current_exercise_series = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = ('id', 'user', 'photo', 'last_sts', 'next_sts_date', 'program_start', 
                  'program_end', 'series', 'current_class_series', 'current_exercise_series')


    def get_current_class_series(self, obj):
        today = date.today()
        # cls = ClassStatus.objects.select_related('lesson', 'lesson__series').filter(Q(client=obj) & Q(date=today))
        # if len(cls) == 0:
        #     cls = ClassStatus.objects.select_related('lesson', 'lesson__series').filter(Q(client=obj) & Q(date=yesterday))
        cls = ClassStatus.objects.select_related('lesson', 'lesson__series').filter(Q(client=obj) & Q(date__lte=today)).order_by('-date')
        if len(cls) == 0:
            return None
        cls = cls[0]
        class_series_name = cls.lesson.series.title
        class_series_num_days = (cls.date - obj.program_start).days
        class_series_video = cls.lesson.video.url
        class_serializer = CurrentClassSeriesSerializer(data={
            'series_name': class_series_name,
            'day_number': class_series_num_days,
            'video': class_series_video
            })
        class_serializer.is_valid()
        return class_serializer.data

    def get_current_exercise_series(self, obj):
        today = date.today()
        exercise_status = ExerciseStatus.objects.select_related('exercise', 'exercise__series').filter(Q(client=obj)).order_by('-date')
        if len(exercise_status) == 0:
            return None
        exercise_status = exercise_status[0]
        exercise_series_name = exercise_status.exercise.series.title
        exercise_series_num_days = (exercise_status.date - obj.program_start).days
        exercise_series_video = exercise_status.exercise.video.url
        exercise_serializer = CurrentClassSeriesSerializer(data={
            'series_name': exercise_series_name,
            'day_number': exercise_series_num_days,
            'video': exercise_series_video
            })
        exercise_serializer.is_valid()
        return exercise_serializer.data

    def get_next_sts_date(self, obj):
        today = date.today()
        if today >= obj.sts_1_date:
            if obj.sts_1 != 0:
                if today >= obj.sts_2_date:
                    if obj.sts_2 != 0:
                        if today >= obj.sts_3_date:
                            if obj.sts_3 != 0:
                                return "Complete"
                            return obj.sts_3_date
                        else:
                            return obj.sts_3_date
                    else:
                        return obj.sts_2_date
                return obj.sts_2_date
            else:
                return obj.sts_1_date
        return obj.sts_1_date


    def get_last_sts(self, obj):
        if obj.sts_1 != 0:
            if obj.sts_2 != 0:
                if obj.sts_3 != 0:
                    return {"date": obj.sts_3_date, "result": obj.sts_3}
                return {"date": obj.sts_2_date, "result": obj.sts_2}
            return {"date": obj.sts_1_date, "result": obj.sts_1}
        raise serializers.ValidationError({'message': 'Client registration incomplete, await Sit To Stand results'})

    def get_program_start(self, obj):
        return obj.program_start

    def get_program_end(self, obj):
        last_exercise = ExerciseStatus.objects.filter(client=obj).order_by('-date').first()
        last_class = ClassStatus.objects.filter(client=obj).order_by('-date').first()

        if last_exercise is None and last_class is None:
            return None
        elif last_exercise and last_class is None:
            return last_exercise.date
        elif last_class and last_exercise is None:
            return last_class.date
        elif last_class and last_exercise:
            if last_exercise.date < last_class.date:
                return last_class.date
            else:
                return last_exercise.date
        else:
            return None


class CongradulatoryMessageSerializer(serializers.ModelSerializer):
    """
    A serializer to output a random congradulatory message on lesson/exercise completion
    """
    class Meta:
        model = CongradulatoryMessage
        fields = ('content',)
