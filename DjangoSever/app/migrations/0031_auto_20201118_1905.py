# Generated by Django 3.1 on 2020-11-18 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0030_auto_20201105_1851'),
    ]

    operations = [
        migrations.AlterField(
            model_name='categoriaproduto',
            name='foto',
            field=models.FileField(upload_to='static/images/categoriasProdutos/'),
        ),
        migrations.AlterField(
            model_name='categoriaservico',
            name='foto',
            field=models.FileField(upload_to='static/images/categoriasServicos/'),
        ),
        migrations.AlterField(
            model_name='instituto',
            name='foto',
            field=models.FileField(upload_to='static/images/institutos/'),
        ),
        migrations.AlterField(
            model_name='membrostaff',
            name='foto',
            field=models.FileField(upload_to='static/images/staff/'),
        ),
        migrations.AlterField(
            model_name='produto',
            name='foto',
            field=models.FileField(upload_to='static/images/produtos/'),
        ),
        migrations.AlterField(
            model_name='servico',
            name='foto',
            field=models.FileField(upload_to='static/images/servicos/'),
        ),
    ]