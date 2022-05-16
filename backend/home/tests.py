from django.contrib.auth import get_user_model
from django.test import TestCase, TransactionTestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase


from users.models import Professional, Client as Clnt


User = get_user_model()


class BasicTests(TestCase):

    def test_create_user_with_phone_successful(self):
        """
        Test creating a new user with an email and username matching phone number
        """
        email = 'test@gmail.com'
        password = 'testpass123'
        username = email
        user = get_user_model().objects.create_user(email=email, username=username, password=password)

        self.assertEqual(user.email, email)
        self.assertEqual(user.username, username)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """
        Test the email for a new user is normalized
        """
        email = 'test@GMAIL.com'
        password = 'testpass123'
        username = email

        user = get_user_model().objects.create_user(email=email, username=username, password=password)
        self.assertEqual(user.email, email.lower())

    def test_new_user_invalid_email(self):
        """
        Test creating user with no email raises error
        """
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(None, 'test123')

    def test_can_create_new_superuser(self):
        """
        Test creating a new superuser
        """
        username = 'testuser'
        email = 'test@gmail.com'
        password = 'test123'
        user = get_user_model().objects.create_superuser(username=username, email=email, password=password)

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_user_str(self):
        """
        Test the User string representation
        """
        email = 'test@gmail.com'
        password = 'Testpass123'
        username = email
        user = get_user_model().objects.create_user(email=email, username=username, password=password)

        self.assertEqual(str(user), user.email)


class CreateUserTest(TransactionTestCase):
    reset_sequences = True
    def setUp(self):
        self.data = {
            'email': 'test@gmail.com',
            'password': 'testpass123',
            'name': 'John Doe'
        }
        
    def test_can_create_user(self):
        """
        Test that we can create a new User object
        """
        url = reverse('users')
        data = self.data
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'test@gmail.com')
        token = Token.objects.get(user=User.objects.get())
        self.assertEqual(response.data, {'token': token.key, 'id': 1, 'user': {'email': 'test@gmail.com', 'name': 'John Doe'}})


class AuthenticateUserTest(TransactionTestCase):
    reset_sequences = True
    def setUp(self):
        self.data = {
            'email': 'test@gmail.com',
            'password': 'testpass123',
            'name': 'John Doe'
        }
        url = reverse('users')
        self.client.post(url, self.data, format='json')
        self.token = Token.objects.get(user=User.objects.get())

    def test_can_get_token(self):
        """
        Test that a User can retrieve an authentication Token
        """
        url = reverse('token')
        data = {
            'email': 'test@gmail.com',
            'password': 'testpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'token': self.token.key, 'id': 1, 'user': {'email': 'test@gmail.com', 'name': 'John Doe'}})


class GetOTPTest(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        self.data = {
            'email': 'test@gmail.com',
            'password': 'testpass123',
            'name': 'John Doe'
        }
        url = reverse('users')
        self.client.post(url, self.data, format='json')
        self.user = User.objects.get()

    def test_can_get_otp(self):
        """
        Test that an OTP is sent and saved in database
        """
        data = {
            'email': 'test@gmail.com'
        }     
        url = reverse('otp')
        response = self.client.post(url, data, format='json')
        user = User.objects.get(email=data.get('email'))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(user.otp, '')


class VerifyOTPTest(TransactionTestCase):
    """
    Test that an unauthenticated User can verify an OTP
    """
    reset_sequences = True

    def setUp(self):
        self.data = {
            'email': 'test@gmail.com',
            'password': 'testpass123',
            'name': 'John Doe'
        }
        url = reverse('users')
        self.client.post(url, self.data, format='json')
        url2 = reverse('otp')
        data = {
            'email': 'test@gmail.com'
        }     
        self.client.post(url2, data, format='json')
        self.user = User.objects.get(email=data.get('email'))
        
    def test_can_verify_otp(self):
        """
        That that an OTP can be verified
        """
        usr = User.objects.get(email='test@gmail.com')
        otp = usr.otp
        data = {
            'email': 'test@gmail.com',
            'otp': "{}".format(otp)
        }
        url = reverse('verify')
        response = self.client.post(url, data, format='json')
        token = Token.objects.get(user=User.objects.get(email='test@gmail.com'))
        self.assertEqual(self.user.otp, usr.otp)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'token': token.key, 'id': 1, 'user': {'email': 'test@gmail.com', 'name': 'John Doe'}})


class UpdateRetrieveUserTest(APITestCase):
    """
    Test that an authenticated User can Retrieve and Update a User
    """

    def setUp(self):
        self.data = {
            'email': 'test@gmail.com',
            'password': 'testpass123',
            'name': 'John Doe'
        }
        url = reverse('users')
        self.client.post(url, self.data, format='json')
        self.user = User.objects.get(email='test@gmail.com')
        self.client.force_authenticate(user=self.user)
        
    def test_can_update_user(self):
        """
        Test that the endpoint can update a User
        """
        data = {
            'sts_1': 25
        }
        url = reverse('client')

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        clnt = Clnt.objects.get(user=self.user)
        self.assertEqual(25, clnt.sts_1)

    def test_can_retrieve_user(self):
        """
        Test that the endpoint can retrieve a User
        """
        url = reverse('client')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_can_list_questionnaire(self):
        """
        Test that an authenticated User can view the questionnaire
        """
        url = reverse('questions')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_can_list_all_exercises_and_classes(self):
        """
        Test that an authenticated User can retrieve their exercises and classes
        """
        url = reverse('series_list_detail')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CreateProfessionalTest(TransactionTestCase):
    reset_sequences = True
    def setUp(self):
        self.data = {
            'email': 'test@gmail.com',
            'password': 'testpass123',
            'name': 'John Doe',
            'professional.business_name': 'Microsoft',
            'professional.business_id': 'MSFT2021'
        }
        
    def test_can_create_professional(self):
        """
        Test that we can create a new User object
        """
        url = reverse('professional')
        data = self.data
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Professional.objects.count(), 1)
        self.assertEqual(Professional.objects.get().business_name, 'Microsoft')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ReturnProfessionalTokenTest(TransactionTestCase):
    reset_sequences = True
    def setUp(self):
        self.data = {
            'email': 'test@gmail.com',
            'password': 'testpass123',
            'name': 'John Doe',
            'professional.business_name': 'Microsoft',
            'professional.business_id': 'MSFT2021'
        }
        url = reverse('professional')
        data = self.data
        response = self.client.post(url, data, format='json')
        user = User.objects.get(email='test@gmail.com')
        self.token = Token.objects.get(user=user)


    def test_can_return_token(self):
        """
        Test that we can return a Token for a Professional User
        """
        url = reverse('pro_token')
        data = {
            'email': 'test@gmail.com',
            'password': 'testpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(self.token, '')


class ProfessionalResetPasswordTest(TransactionTestCase):
    reset_sequences = True
    def setUp(self):
        self.data = {
            'email': 'test@gmail.com',
            'password': 'testpass123',
            'name': 'John Doe',
            'professional.business_name': 'Microsoft',
            'professional.business_id': 'MSFT2021'
        }
        url = reverse('professional')
        data = self.data
        response = self.client.post(url, data, format='json')

    def test_can_get_otp(self):
        """
        Test that a Professional User can get an OTP
        """
        data = {
            'email': 'test@gmail.com'
        }     
        url = reverse('pro_otp')
        response = self.client.post(url, data, format='json')
        user = User.objects.get(email=data.get('email'))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(user.otp, '')


class VerifyProfessionalOTPTest(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        self.data = {
            'email': 'test@gmail.com',
            'password': 'testpass123',
            'name': 'John Doe',
            'professional.business_name': 'Microsoft',
            'professional.business_id': 'MSFT2021'
        }
        url = reverse('professional')
        self.client.post(url, self.data, format='json')
        url2 = reverse('pro_otp')
        data = {
            'email': 'test@gmail.com'
        }     
        self.client.post(url2, data, format='json')
        self.user = User.objects.get(email=data.get('email'))
        
    def test_can_verify_otp(self):
        """
        Test that a Professional User can verify an OTP
        """
        usr = User.objects.get(email='test@gmail.com')
        otp = usr.otp
        data = {
            'email': 'test@gmail.com',
            'otp': "{}".format(otp)
        }
        url = reverse('pro_verify')
        response = self.client.post(url, data, format='json')
        token = Token.objects.get(user=User.objects.get(email='test@gmail.com'))
        self.assertEqual(self.user.otp, usr.otp)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
