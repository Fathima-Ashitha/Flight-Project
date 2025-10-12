from rest_framework import serializers
from .models import CustomUser
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            approval_status='PENDING'
        )
        # Set password without validation
        user.set_password(validated_data['password'])
        user.save()
        return user



# serializers.py
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Decode the refresh token to get user ID
        refresh = RefreshToken(attrs['refresh'])
        user_id = refresh.payload.get('user_id')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        if not user.is_active:
            raise serializers.ValidationError("User account is inactive.")

        return data