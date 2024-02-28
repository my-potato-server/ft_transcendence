# Generated by Django 5.0.1 on 2024-02-28 19:21

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_tournament'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='users',
            field=models.ManyToManyField(related_name='tournaments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='MatchHistory',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('level', models.PositiveIntegerField(default=0)),
                ('winner_score', models.PositiveIntegerField(default=0)),
                ('loser_score', models.PositiveIntegerField(default=0)),
                ('is_walkover', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('lose_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='lose_match_histories', to=settings.AUTH_USER_MODEL)),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='matche_histories', to='game.tournament')),
                ('win_user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='win_match_histories', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='Match',
        ),
    ]
