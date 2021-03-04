# Generated by Django 3.1 on 2020-11-03 19:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_auto_20201102_2307'),
    ]

    operations = [
        migrations.CreateModel(
            name='Trabalho',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('posicao', models.CharField(max_length=20)),
                ('instituto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.instituto')),
            ],
        ),
        migrations.CreateModel(
            name='MembroStaff',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=40)),
                ('foto', models.CharField(max_length=100)),
                ('trabalhos', models.ManyToManyField(to='app.Trabalho')),
            ],
        ),
    ]