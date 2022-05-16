
from rest_framework import status, filters, serializers
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView, RetrieveAPIView, RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ViewSet

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.mail import EmailMessage
from django.core.validators import validate_email
from django.shortcuts import get_object_or_404
from django.utils import timezone


from home.api.v1.serializers import (
    CongradulatoryMessageSerializer,
    OTPSerializer,
    ProfessionalUpdateSerializer,
    QuestionListingSerializer,
    SecondUserChoiceSerializer,
    SignupSerializer,
    ThirdUserChoiceSerializer,
    UserSerializer,
    UserSignupSerializer,
    UserProfileSerializer,
    CustomAuthTokenSerializer,
    ForgotPasswordSerializer,
    ClientProfileSerializer,
    UserChoiceSerializer,
    SitToStandSerializer,
    AllSeriesSerializer,
    ExerciseStatusSerializer,
    LessonStatusSerializer,
    ProUserSignupSerializer,
    BareProClientSerializer,
    BareProClientDetailSerializer,
    SeriesListSerializer,
    ProfessionalSeriesListSerializer,
    BareClientSerializer
)
from home.models import AdminEmail, CongradulatoryMessage, Question, SitToStandVideo, Series
from home.otp import generateOTP
from home.referral import sendReferral
from home.permissions import IsPostOrIsAuthenticated, IsGetOrPostOrIsAuthenticated, IsProfessional

from datetime import datetime, timedelta
from pytz import utc

from users.models import Client, ExerciseStatus, ClassStatus, Professional
from users.authentication import ExpiringTokenAuthentication


User = get_user_model()
EXPIRE_HOURS = getattr(settings, 'REST_FRAMEWORK_TOKEN_EXPIRE_HOURS', 24)

class SignupViewSet(ModelViewSet):
    serializer_class = SignupSerializer
    http_method_names = ["post"]


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = AuthTokenSerializer

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({"token": token.key, "user": user_serializer.data})


class UserCreateListView(ListCreateAPIView):
    """
    Create a User with an associated Client object as their profile
    """
    queryset = User.objects.all().exclude(is_superuser=True).exclude(is_staff=True)
    authentication_classes = [ExpiringTokenAuthentication]
    serializer_class = UserSignupSerializer
    permission_classes = (IsPostOrIsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        user = serializer.instance
        token = Token.objects.create(user=user)
        token.created = datetime.utcnow().replace(tzinfo=utc)
        token.save()
        client = Client.objects.get(user=user)
        next_sts = "sts_1"
        if client.sts_1 == 0:
            next_sts = "sts_1"
        elif client.sts_2 == 0:
            next_sts = "sts_2"
        elif client.sts_3 == 0:
            next_sts = "sts_3"
        else:
            next_sts = None
        questionnaire_completed = ""
        if client.choices.exists():
            questionnaire_completed = True
        else:
            questionnaire_completed = False
        if client.professional:
            return Response({'token': token.key, 'id': client.pk, 'user': serializer.data, 'questionnaire_completed': questionnaire_completed, 'professional': client.professional.business_name, 'next_sts': next_sts, 'message': 'Client account created successfully'}, status=status.HTTP_200_OK)
        return Response({'token': token.key,'id': client.pk, 'user': serializer.data, 'questionnaire_completed': questionnaire_completed, 'next_sts': next_sts, 'message': 'Client account created successfully'}, status=status.HTTP_200_OK)


    def list(self, *args, **kwargs):
        serializer_class = BareClientSerializer
        serializer = serializer_class(Client.objects.all(), many=True)
        return Response(serializer.data)


class ProfessionalSignUpView(CreateAPIView):
    """
    Create a User with an associated Professional object as their profile
    """
    queryset = User.objects.all().exclude(is_superuser=True).exclude(is_staff=True)
    authentication_classes = [ExpiringTokenAuthentication]
    serializer_class = ProUserSignupSerializer
    permission_classes = (AllowAny,)


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        user = serializer.instance
        token = Token.objects.create(user=user)
        token.created = datetime.utcnow().replace(tzinfo=utc)
        token.save()
        professional = Professional.objects.get(user=user)
        return Response({'message': 'Professional account created successfully', 'token': token.key, 'id': professional.pk, 'user': serializer.data}, status=status.HTTP_200_OK)


class UserUpdateRetrieveDestroyView(RetrieveUpdateDestroyAPIView):
    """
    Return or update a Client Profile including their sit-to-stand scores
    """
    authentication_classes = [ExpiringTokenAuthentication]
    serializer_class = ClientProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            user = self.request.user
            client = Client.objects.get(user=user)

        except ObjectDoesNotExist:
            raise NotFound('User is not a Client')

        return client

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({'message': 'Account retrieved successfully', 'details': serializer.data}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        user = obj.user
        self.perform_destroy(obj)
        user.delete()
        return Response({'message': 'Account deleted successfully'}, status=status.HTTP_200_OK)


    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}


        return Response({'message': 'Account updated successfully', 'details': serializer.data}, status=status.HTTP_200_OK)

class ObtainExpiringAuthTokenView(ObtainAuthToken):
    """
    Return an authorization token
    """
    authentication_classes = [ExpiringTokenAuthentication]
    serializer_class = CustomAuthTokenSerializer

    def post(self, request, **kwargs):
        serializer = CustomAuthTokenSerializer(data=request.data)

        if serializer.is_valid():
            token, created = Token.objects.get_or_create(user=serializer.validated_data['user'])
            user = serializer.validated_data['user']
            user = User.objects.get(pk=user.pk)
            remember_me = serializer.validated_data['remember_me']
            user.remember_me = remember_me
            user.save()
            if not created and token.created < timezone.now() - timedelta(hours=EXPIRE_HOURS):
                token.delete()
                user = serializer.validated_data['user']
                token = Token.objects.create(user=user)
                token.created = datetime.utcnow().replace(tzinfo=utc)
                token.save()
            try:
                client = user.client
            except Client.DoesNotExist:
                user_serializer = ProUserSignupSerializer(user)
                professional = Professional.objects.get(user=user)
                return Response({'message': 'Professional authenticated successfully', 'type': 'professional', 'token': token.key, 'id': professional.pk, 'user': user_serializer.data}, status=status.HTTP_200_OK)
            else:
                next_sts = "sts_1"
                if user.client.sts_1 == 0:
                    next_sts = "sts_1"
                elif user.client.sts_2 == 0:
                    next_sts = "sts_2"
                elif user.client.sts_3 == 0:
                    next_sts = "sts_3"
                else:
                    next_sts = None
                questionnaire_completed = ""
                if user.client.choices.exists():
                    questionnaire_completed = True
                else:
                    questionnaire_completed = False                
                user_serializer = UserSignupSerializer(user)
                if user.client.professional:
                    return Response({'message': 'Client authenticated successfully', 'type': 'client', 'token': token.key, 'id': user.client.pk, 'user': user_serializer.data, 'questionnaire_completed': questionnaire_completed, 'next_sts': next_sts,'professional': user.client.professional.business_name}, status=status.HTTP_200_OK)
                return Response({'message': 'Client authenticated successfully', 'type': 'client', 'token': token.key, 'id': user.client.pk, 'user': user_serializer.data, 'questionnaire_completed': questionnaire_completed, 'next_sts': next_sts}, status=status.HTTP_200_OK)
        return Response({'message': 'Authentication failed, please try again', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProObtainExpiringAuthTokenView(ObtainAuthToken):
    """
    Return an authorization token that expires after 24 hours
    """
    authentication_classes = [ExpiringTokenAuthentication]

    def post(self, request, **kwargs):
        serializer = CustomAuthTokenSerializer(data=request.data)

        if serializer.is_valid():
            token, created = Token.objects.get_or_create(user=serializer.validated_data['user'])
            user = serializer.validated_data['user']
            if not created and token.created < timezone.now() - timedelta(hours=EXPIRE_HOURS):
                token.delete()
                token = Token.objects.create(user=user)
                token.created = datetime.utcnow().replace(tzinfo=utc)
                token.save()
            user = User.objects.get(pk=user.pk)
            remember_me = serializer.validated_data['remember_me']
            user.remember_me = remember_me
            user.save()
            user_serializer = ProUserSignupSerializer(user)
            professional = Professional.objects.get(user=user)
            return Response({'message': 'Professional authenticated successfully', 'token': token.key, 'id': professional.pk, 'user': user_serializer.data}, status=status.HTTP_200_OK)
        return Response({'message': 'Authentication failed, please try again', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class OTPView(APIView):
    """
    An endpoint that sends/refreshes an OTP to the provided email
    """
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsGetOrPostOrIsAuthenticated]

    def post(self, request):
        try:
            email = request.data.get('email')
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({"message": "Invalid Email Address"}, status=status.HTTP_400_BAD_REQUEST)

        otp = generateOTP(email, user)
        return Response({'message': "The OTP has been sent to {}".format(email)}, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = self.request.user
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"message": "Password Reset Successfully"}, status=status.HTTP_200_OK)
        return Response({"message": "Password validation error", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class OTPVerifyView(APIView):
    """
    An endpoint for verifying an OTP reset
    """
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPSerializer(data=request.data)

        if serializer.is_valid():
            token, created = Token.objects.get_or_create(user=serializer.validated_data['user'])
            if not created and token.created < timezone.now() - timedelta(hours=EXPIRE_HOURS):
                token.delete()
                token = Token.objects.create(user=serializer.validated_data['user'])
                token.created = datetime.utcnow().replace(tzinfo=utc)
                token.save()
            user = serializer.validated_data['user']
            try:
                user = User.objects.select_related('client', 'client__professional').get(pk=user.pk)
                user_serializer = UserSignupSerializer(user)
                client = user.client
                next_sts = "sts_1"
                if client.sts_1 == 0:
                    next_sts = "sts_1"
                elif client.sts_2 == 0:
                    next_sts = "sts_2"
                elif client.sts_3 == 0:
                    next_sts = "sts_3"
                else:
                    next_sts = None
                questionnaire_completed = ""
                if client.choices.exists():
                    questionnaire_completed = True
                else:
                    questionnaire_completed = False
                if user.client.professional:
                    return Response({"message": "OTP Verification Successful", 'token': token.key, 'id': user.client.pk, 'user': user_serializer.data, 'questionnaire_completed': questionnaire_completed, 'next_sts': next_sts, 'professional': user.client.professional.business_name}, status=status.HTTP_200_OK)
                return Response({"message": "OTP Verification Successful", 'token': token.key, 'id': user.client.pk, 'user': user_serializer.data, 'questionnaire_completed': questionnaire_completed, 'next_sts': next_sts}, status=status.HTTP_200_OK)
            except Client.DoesNotExist:
                user_serializer = ProUserSignupSerializer(user)
                professional = Professional.objects.get(user=user)
                return Response({"message": "OTP Verification Successful", 'token': token.key, 'id': professional.pk, 'user': user_serializer.data}, status=status.HTTP_200_OK)            
        return Response({"message": "OTP verification failed. Please try again.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class QuestionListView(ListAPIView):
    """
    An endpoint that returns the list of questions from the questionnaire
    """
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Question.objects.all()
    serializer_class = QuestionListingSerializer
    permission_classes = (IsAuthenticated,)


class UserChoicesView(RetrieveUpdateAPIView):
    """
    An endpoint that returns the list of choices the authenticated Client has selected
    """
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Client.objects.all()
    serializer_class = UserChoiceSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            user = self.request.user
            client = Client.objects.get(user=user)

        except ObjectDoesNotExist:
            raise serializers.ValidationError({'message': 'User is not a Client. Only clients can make selections.'})

        return client


class SecondUserChoicesView(RetrieveUpdateAPIView):
    """
    An endpoint that returns the list of choices the authenticated Client has selected
    """
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Client.objects.all()
    serializer_class = SecondUserChoiceSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            user = self.request.user
            client = Client.objects.get(user=user)

        except ObjectDoesNotExist:
            raise serializers.ValidationError({'message': 'User is not a Client. Only clients can make selections.'})

        return client


class ThirdUserChoicesView(RetrieveUpdateAPIView):
    """
    An endpoint that returns the list of choices the authenticated Client has selected
    """
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Client.objects.all()
    serializer_class = ThirdUserChoiceSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            user = self.request.user
            client = Client.objects.get(user=user)

        except ObjectDoesNotExist:
            raise serializers.ValidationError({'message': 'User is not a Client. Only clients can make selections.'})

        return client


class AllSeriesView(RetrieveUpdateAPIView):
    """
    An endpoint that returns all classes and exercises of the authenticated Client
    """
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Client.objects.all()
    serializer_class = AllSeriesSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            user = self.request.user
            client = Client.objects.get(user=user)

        except ObjectDoesNotExist:
            raise serializers.ValidationError({'message': 'User is not a Client. Only clients can have a program.'})

        return client


class ExerciseView(RetrieveUpdateAPIView):
    """
    An endpoint to mark an exercise as completed
    """
    queryset = ExerciseStatus.objects.all()
    serializer_class = ExerciseStatusSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]

    def get_object(self):
        exercise = super().get_object()
        user = self.request.user
        client = Client.objects.get(user=user)
        if exercise.client == client:
            return exercise
        else:
            raise serializers.ValidationError({'message': 'Exercise ID does not match the Client'})

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        completed = serializer.validated_data.get('is_completed', False)
        difficulty = serializer.validated_data.get('difficulty', False)
        if completed or difficulty:
            message = CongradulatoryMessage.objects.order_by('?').first()
            message_serializer = CongradulatoryMessageSerializer(message)
            message_data = message_serializer.data
        else:
            message_data = None
        if difficulty and (difficulty == 'This was easy' or difficulty == 'This was tough'):
            admin_email = AdminEmail.objects.all().first()
            if admin_email:
                admin_email = admin_email.email
            if not admin_email:
                admin_email = 'sallar.rezaie@crowdbotics.com'
            email = EmailMessage('TBD', 'Hello, {} has marked {} as {}'.format(request.user.name, instance.exercise.title, difficulty), from_email='sallar.rezaie@crowdbotics.com', to=[admin_email])
            email.send()
        return Response({'message': message_data, 'lesson': serializer.data})


class LessonView(RetrieveUpdateAPIView):
    """
    An endpoint to mark a lesson as completed
    """
    queryset = ClassStatus.objects.all()
    serializer_class = LessonStatusSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]


    def get_object(self):
        lesson = super().get_object()
        user = self.request.user
        client = Client.objects.get(user=user)
        if lesson.client == client:
            return lesson
        else:
            raise serializers.ValidationError({'message': 'Lesson ID does not match the Client'})

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        completed = serializer.validated_data.get('is_completed', False)
        difficulty = serializer.validated_data.get('difficulty', False)
        if completed or difficulty:
            message = CongradulatoryMessage.objects.order_by('?').first()
            message_serializer = CongradulatoryMessageSerializer(message)
            message_data = message_serializer.data
        else:
            message_data = None
        if difficulty and (difficulty == 'This was easy' or difficulty == 'This was tough'):
            admin_email = AdminEmail.objects.all().first()
            if admin_email:
                admin_email = admin_email.email
            if not admin_email:
                admin_email = 'sallar.rezaie@crowdbotics.com'
            email = EmailMessage('TBD', 'Hello, {} has marked {} as {}'.format(request.user.name, instance.lesson.title, difficulty), from_email='sallar.rezaie@crowdbotics.com', to=[admin_email])
            email.send()
        return Response({'message': message_data, 'lesson': serializer.data})


class SeriesView(ListAPIView):
    """
    An endpoint to return the specific Series and it's associated Classes and Exercises
    """
    serializer_class = SeriesListSerializer
    model = Series
    queryset = Series.objects.all()
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]


    def get_queryset(self):
        user = self.request.user
        client = Client.objects.filter(user=user)
        series = Series.objects.filter(clients__in=client)
        return series


class SeriesDetailView(RetrieveAPIView):
    """
    An endpoint to return the specific Series and it's associated Classes and Exercises in a different layout
    """    
    queryset = Series.objects.all()
    serializer_class = SeriesListSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]

    def get_object(self):
        series = super().get_object()
        user = self.request.user
        client = Client.objects.get(user=user)
        if client in series.clients.all():
            return series
        else:
            raise serializers.ValidationError({'message': 'Series ID does not match the Client'})


class SitToStandView(APIView):
    """
    An endpoint to return the Sit To Stand Video
    """
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        """
        Returns the URL of the latest Sit To Stand Video
        """
        sts_video = SitToStandVideo.objects.all().first()
        serializer = SitToStandSerializer(sts_video)
        return Response({'message': 'Sit to Stand Video retrieved successfully', 'sts_video': serializer.data}, status=status.HTTP_200_OK)


class ProfessionalClientsView(RetrieveAPIView):
    """
    An endpoint to return list of Clients of an authenticated Professional
    """    
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Professional.objects.all()
    serializer_class = BareProClientSerializer
    permission_classes = (IsAuthenticated, IsProfessional)

    def get_object(self):
        try:
            user = self.request.user
            professional = Professional.objects.get(user=user)

        except ObjectDoesNotExist:
            raise serializers.ValidationError({'message': 'User must be a Professional'})

        return professional


class ProfessionalClientDetailView(RetrieveAPIView):
    """
    An endpoint to return the specific Client details of an authenticated Professional
    """
    authentication_classes = [ExpiringTokenAuthentication]    
    queryset = Client.objects.all()
    serializer_class = BareProClientDetailSerializer
    permission_classes = (IsAuthenticated, IsProfessional)

    def get_object(self):
        client = super().get_object()
        user = self.request.user
        professional = Professional.objects.get(user=user)
        if client in professional.clients.all():
            return client
        else:
            raise serializers.ValidationError({'message': 'Client ID does not match the Professional'})


class ProfessionalUpdateView(UpdateAPIView):
    """
    An endpoint to update the details of an authenticated Professional
    """
    authentication_classes = [ExpiringTokenAuthentication]    
    queryset = Professional.objects.all()
    serializer_class = ProfessionalUpdateSerializer
    permission_classes = (IsAuthenticated, IsProfessional)

    def get_object(self):
        try:
            user = self.request.user
            professional = Professional.objects.get(user=user)

        except ObjectDoesNotExist:
            raise serializers.ValidationError({'message': 'User is not a Professional'})

        return professional

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        return Response({'message': 'Account Updated Successfully', 'details': serializer.data}, status=status.HTTP_200_OK)


class ProfessionalClientSeriesView(RetrieveAPIView):
    """
    An endpoint to return the specific Client series details of an authenticated Professional
    """
    authentication_classes = [ExpiringTokenAuthentication]    
    queryset = Client.objects.all()
    serializer_class = AllSeriesSerializer
    permission_classes = (IsAuthenticated, IsProfessional)

    def get_object(self):
        try:
            client = super().get_object()
            user = self.request.user
            professional = Professional.objects.get(user=user)
            if client in professional.clients.all():
                return client
            else:
                raise serializers.ValidationError({'message': 'Client ID does not match the Professional'})

        except ObjectDoesNotExist:
            raise serializers.ValidationError({'message': 'User must be a Professional'})


class ProfessionalClientSeriesDetailView(RetrieveAPIView):
    """
    An endpoint to return the specific Client details of a specific Series of an authenticated Professional
    """    
    queryset = Series.objects.all()
    serializer_class = ProfessionalSeriesListSerializer
    permission_classes = (IsAuthenticated, IsProfessional)
    authentication_classes  = [ExpiringTokenAuthentication]

    def get_object(self):
        try:
            series = super().get_object()
            user = self.request.user
            professional = Professional.objects.get(user=user)
            client = Client.objects.get(pk=self.kwargs['client_id'])
            if client not in professional.clients.all():
                raise serializers.ValidationError({'message': 'Client ID does not match the Professional'})
            if client in series.clients.all():
                return series
            else:
                raise serializers.ValidationError({'message': 'Series ID does not match the Client'})
        except ObjectDoesNotExist:
            raise serializers.ValidationError({'message': 'User is not a Professional'})


    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(
            {
                "client_id": self.kwargs['client_id']
            }
        )
        return context


class ProInviteView(APIView):
    """
    An endpoint that sends an Invite to the provided email from an authenticated Professional
    """
    permission_classes = [IsAuthenticated, IsProfessional]
    authentication_classes  = [ExpiringTokenAuthentication]

    def post(self, request):
        email = request.data.get('email')
        try:
            validate_email(email)
        except ValidationError as e:
            return Response({"message": "Invalid Email Address"}, status=status.HTTP_400_BAD_REQUEST)
        user = self.request.user
        try:
            professional = Professional.objects.get(user=user)
        except Professional.DoesNotExist:
            return Response({"message": "Invalid Professional Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        if email:
            sendReferral(email=email, professional=professional)
        return Response(status=status.HTTP_201_CREATED)

