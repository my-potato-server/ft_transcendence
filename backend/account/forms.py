from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import User


class UserCreationForm(forms.ModelForm):
	class Meta:
		model = User
		fields = (
			'id',
			'login',
		)

	def save(self, commit=True):
		user = super().save(commit=False)
		if commit:
			user.save()
		return user


class UserChangeForm(forms.ModelForm):
	class Meta:
		model = User
		fields = ('id', 'login',)
		widgets = {
			'id': forms.TextInput(attrs={'name': 'id_field', 'class': 'form-control input-group'}),
			'login': forms.TextInput(attrs={'name': 'login_field', 'class': 'form-control input-group'}),
		}
		labels = {
			'id': '아이디',
			'login': '로그인아이디',
		}


class AdminCreationForm(forms.ModelForm):
	login = forms
	password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
	password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

	class Meta:
		model = User
		fields = ('id', 'login',)

	def clean_password2(self):
		password1 = self.cleaned_data.get("password1")
		password2 = self.cleaned_data.get("password2")
		if password1 and password2 and password1 != password2:
			raise forms.ValidationError("비밀번호가 일치하지 않습니다.")
		return password2

	def save(self, commit=True):
		user = super().save(commit=False)
		user.set_password(self.cleaned_data["password1"])
		if commit:
			user.save()
		return user


class AdminChangeForm(forms.ModelForm):
	password = ReadOnlyPasswordHashField()

	class Meta:
		model = User
		fields = (
			'id',
			'login',
			'password',
			'is_active',
			'is_superuser',
		)

	def clean_password(self):
		return self.initial["password"]
