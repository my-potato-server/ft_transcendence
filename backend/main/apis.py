from ninja import NinjaAPI
from django.db import IntegrityError
from django.core.exceptions import ValidationError

from .models import Subscription


main_api = NinjaAPI()


@main_api.post("/subscribe")
def subscribe(request, email: str):
	try:
		Subscription.objects.create(email=email)
	except IntegrityError:
		return 400, {"message": "Email already exists"}
	except ValidationError:
		return 400, {"message": "Invalid email address"}
	return 200, {"message": "Subscribed successfully"}
