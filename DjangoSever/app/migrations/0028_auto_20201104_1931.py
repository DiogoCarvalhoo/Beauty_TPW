# Generated by Django 3.1 on 2020-11-04 19:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0027_auto_20201104_1930'),
    ]

    operations = [
        migrations.AlterField(
            model_name='produto',
            name='foto',
            field=models.FileField(blank=True, null=True, upload_to='static/images/produtos'),
        ),
        migrations.AlterField(
            model_name='servico',
            name='foto',
            field=models.FileField(blank=True, null=True, upload_to='static/images/servicos'),
        ),
    ]
