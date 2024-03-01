from typing import Dict
from ninja import NinjaAPI, Router
from django.db import IntegrityError
from django.core.exceptions import ValidationError

from .models import Subscription
from .requests import SubscribeRequest


main_api = Router(tags=["main"])


@main_api.post("/subscribe", response={200: Dict[str, str], 400: Dict[str, str]})
def subscribe(request, body: SubscribeRequest):
	try:
		Subscription.objects.create(email=body.email)
	except IntegrityError:
		print("IntegrityError")
		return 400, {"message": "Email already exists"}
	except ValidationError:
		print("ValidationError")
		return 400, {"message": "Invalid email address"}
	print("Subscribed successfully")
	return 200, {"message": "Subscribed successfully"}
