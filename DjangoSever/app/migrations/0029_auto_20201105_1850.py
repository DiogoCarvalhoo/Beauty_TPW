# Generated by Django 3.1 on 2020-11-05 18:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0028_auto_20201104_1931'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membrostaff',
            name='foto',
            field=models.FileField(upload_to=''),
        ),
        migrations.AlterField(
            model_name='membrostaff',
            name='trabalhos',
            field=models.ManyToManyField(blank=True, to='app.Trabalho'),
        ),
    ]
