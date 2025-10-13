from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .serializers import RegisterSerializer
from .models import CustomUser
from rest_framework.decorators import api_view, permission_classes


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# Admin: list pending users
class PendingUsersView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(approval_status='PENDING')
    serializer_class = RegisterSerializer
    permission_classes = [permissions.IsAdminUser]


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def approve_user(request, pk):
    try:
        user = CustomUser.objects.get(pk=pk)
        user.approval_status = 'APPROVED'
        user.save()
        return Response({'status': 'approved'})
    except CustomUser.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)
    except Exception as e:
        return Response({'detail': 'Internal server error'}, status=500)


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
