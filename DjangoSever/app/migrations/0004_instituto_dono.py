# Generated by Django 3.1 on 2020-10-30 16:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20201030_1650'),
    ]

    operations = [
        migrations.AddField(
            model_name='instituto',
            name='dono',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.donoinstituto'),
        ),
    ]