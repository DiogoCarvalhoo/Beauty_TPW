# Generated by Django 3.1 on 2020-11-04 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_auto_20201104_1505'),
    ]

    operations = [
        migrations.AlterField(
            model_name='servico',
            name='foto',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]