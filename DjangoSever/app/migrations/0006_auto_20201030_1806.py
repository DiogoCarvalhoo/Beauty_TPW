# Generated by Django 3.1 on 2020-10-30 18:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20201030_1705'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instituto',
            name='dono',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.donoinstituto'),
        ),
    ]