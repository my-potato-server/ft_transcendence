from django.db import models


class Subscription(models.Model):
	id = models.BigAutoField(primary_key=True)
	email = models.EmailField()
