FROM python:3.12

ENV PYTHONUNBUFFERED 1

WORKDIR /app
ADD requirements.txt /app/
RUN pip install -r requirements.txt
COPY . /app/

#RUN python manage.py collectstatic --noinput

CMD ["sh", "start.sh"]