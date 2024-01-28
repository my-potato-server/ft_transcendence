import requests
from django.conf import settings


class FtAuth:
	ft_oauth_url = "https://api.intra.42.fr/oauth/token"
	ft_api_url = "https://api.intra.42.fr/v2/"
	access_token = None
	refresh_token = None

	def __init__(self, code, redirect_uri):
		self.ft_uid_key = settings.FT_UID_KEY
		self.ft_secret_key = settings.FT_SECRET_KEY
		self.code = code
		self.redirect_uri = redirect_uri

	def get_access_token(self) -> bool:
		oauth_data = {
			'grant_type': 'authorization_code',
			'client_id': self.ft_uid_key,
			'client_secret': self.ft_secret_key,
			'code': self.code,
			'redirect_uri': self.redirect_uri,
		}
		try:
			ft_api_result = requests.post(self.ft_oauth_url, data=oauth_data).json()
			self.access_token = ft_api_result['access_token']
			self.refresh_token = ft_api_result['refresh_token']
			return True
		except KeyError:
			return False

	def get_login(self):
		if not self.access_token:
			if not self.get_access_token():
				raise Exception("get_access_token error")
		params = {'access_token': self.access_token}
		return requests.get(f"{self.ft_api_url}me", params=params).json()['login']
