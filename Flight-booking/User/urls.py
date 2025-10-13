from django.urls import path
from .views import RegisterView, PendingUsersView, approve_user, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/users/pending/', PendingUsersView.as_view(), name='pending_users'),
    path('admin/users/<int:pk>/approve/', approve_user, name='approve_user'),
]     