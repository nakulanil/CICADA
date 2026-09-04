from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        user = authenticate(
            username=attrs["username"],
            password=attrs["password"],
        )

        if user is None:
            raise serializers.ValidationError("Invalid username or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    organization = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "organization",
            "role",
            "is_active",
        ]
        read_only_fields = fields

    def get_organization(self, obj):
        if not obj.organization:
            return None
        return {
            "id": str(obj.organization.id),
            "name": obj.organization.name,
            "type": obj.organization.organization_type,
        }

    def get_role(self, obj):
        if not obj.role:
            return None
        return {
            "id": str(obj.role.id),
            "name": obj.role.name,
            "description": obj.role.description,
        }
