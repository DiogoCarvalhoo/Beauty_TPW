# Generated by Django 3.1 on 2020-11-02 23:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0017_auto_20201102_2306'),
    ]

    operations = [
        migrations.AlterField(
            model_name='produto',
            name='dono',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.donoinstituto'),
        ),
        migrations.AlterField(
            model_name='servico',
            name='dono',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.donoinstituto'),
        ),
    ]