FROM python:3.12

ENV PYTHONUNBUFFERED 1

WORKDIR /app
ADD requirements.txt /app/
RUN pip install -r requirements.txt
COPY . /app/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]