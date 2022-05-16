from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.views.decorators.csrf import csrf_exempt

from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    UserCreateListView,
    UserChoicesView,
    UserUpdateRetrieveDestroyView,
    ObtainExpiringAuthTokenView,
    ProObtainExpiringAuthTokenView,
    OTPView,
    OTPVerifyView,
    QuestionListView,
    SitToStandView,
    AllSeriesView,
    ExerciseView,
    LessonView,
    ProfessionalSignUpView,
    ProfessionalClientsView,
    ProfessionalClientDetailView,
    ProfessionalClientSeriesView,
    ProfessionalClientSeriesDetailView,
    SeriesView,
    SeriesDetailView,
    ProInviteView,
    ProfessionalUpdateView,
    SecondUserChoicesView,
    ThirdUserChoicesView
)

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")

urlpatterns = [
    path("", include(router.urls)),
    path("token/", csrf_exempt(ObtainExpiringAuthTokenView.as_view()), name="token"),
    path("users/", csrf_exempt(UserCreateListView.as_view()), name="users"),
    path("users/reset/", csrf_exempt(OTPView.as_view()), name="otp"),
    path("users/reset/verify/", csrf_exempt(OTPVerifyView.as_view()), name='verify'),
    path("users/client/", csrf_exempt(UserUpdateRetrieveDestroyView.as_view()), name="client"),
    path("users/series/", csrf_exempt(SeriesView.as_view()), name='series_list_detail'),
    path("users/series/<int:pk>/", csrf_exempt(SeriesDetailView.as_view()), name='series_detail'),
    path("users/series/all/", csrf_exempt(AllSeriesView.as_view()), name='today_series'),
    path("users/lesson/<int:pk>/", csrf_exempt(LessonView.as_view()), name='lesson_completed'),
    path("users/exercise/<int:pk>/", csrf_exempt(ExerciseView.as_view()), name='exercise_completed'),
    path("questionnaire/", csrf_exempt(QuestionListView.as_view()), name='questions'),
    path("questionnaire/selections/", csrf_exempt(UserChoicesView.as_view()), name='selections'),
    path("questionnaire/selections/halfway/", csrf_exempt(SecondUserChoicesView.as_view()), name="second_selections"),
    path("questionnaire/selections/final/", csrf_exempt(ThirdUserChoicesView.as_view()), name="third_selections"),
    path("sit-to-stand/video/", csrf_exempt(SitToStandView.as_view()), name='sit_to_stand'),
    path("professionals/", csrf_exempt(ProfessionalSignUpView.as_view()), name="professional"),
    path("professionals/profile/", csrf_exempt(ProfessionalUpdateView.as_view()), name="professional_update"),
    path("professionals/token/", csrf_exempt(ProObtainExpiringAuthTokenView.as_view()), name='pro_token'),
    path("professionals/reset/", csrf_exempt(OTPView.as_view()), name="pro_otp"),
    path("professionals/reset/verify/", csrf_exempt(OTPVerifyView.as_view()), name='pro_verify'),
    path("professionals/invite/", csrf_exempt(ProInviteView.as_view()), name='pro_invite'),
    path("professionals/clients/", csrf_exempt(ProfessionalClientsView.as_view()), name='pro_clients'),
    path("professionals/clients/<int:pk>/", csrf_exempt(ProfessionalClientDetailView.as_view()), name='pro_client_details'),
    path("professionals/clients/<int:pk>/series/", csrf_exempt(ProfessionalClientSeriesView.as_view()), name='pro_client_series'),
    path("professionals/clients/<int:client_id>/series/<int:pk>/", csrf_exempt(ProfessionalClientSeriesDetailView.as_view()), name='pro_client_series_detail')
    ]
