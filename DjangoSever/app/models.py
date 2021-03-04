from django.db import models
from decimal import Decimal
from django.contrib.auth.models import User
from django import forms

# Create your models here.

class CategoriaProduto(models.Model):
    nome = models.CharField(max_length=30)
    foto = models.FileField(upload_to="static/images/categoriasProdutos/")
    def __str__(self):
        return self.nome

class CategoriaServico(models.Model):
    nome = models.CharField(max_length=30)
    foto = models.FileField(upload_to="static/images/categoriasServicos/")
    def __str__(self):
        return self.nome

class Instituto(models.Model):
    nome = models.CharField(max_length=40)
    slogan = models.CharField(max_length=120)
    localizacao = models.CharField(max_length=100)
    email = models.EmailField()
    website = models.URLField()
    foto = models.FileField(upload_to="static/images/institutos/")
    dono = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.nome

class Servico(models.Model):
    nome = models.CharField(max_length=40)
    descricao = models.CharField(max_length=150)
    preco = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0'))
    categoria = models.ForeignKey(CategoriaServico, on_delete=models.CASCADE)
    foto = models.FileField(upload_to="static/images/servicos/")
    dono = models.ForeignKey(User, on_delete=models.CASCADE)
    instituto = models.ManyToManyField(Instituto)
    def __str__(self):
        return self.nome

class Produto(models.Model):
    nome = models.CharField(max_length=40)
    descricao = models.CharField(max_length=150)
    preco = models.DecimalField(max_digits=6, decimal_places=2)
    categoria = models.ForeignKey(CategoriaProduto, on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    foto = models.FileField(upload_to="static/images/produtos/")
    dono = models.ForeignKey(User, on_delete=models.CASCADE)
    instituto = models.ManyToManyField(Instituto)
    def __str__(self):
        return self.nome

class Trabalho(models.Model):
    posicao = models.CharField(max_length=35)
    instituto = models.ForeignKey(Instituto, on_delete=models.CASCADE)
    def __str__(self):
        return self.instituto.nome + " - " + self.posicao

class MembroStaff(models.Model):
    nome = models.CharField(max_length=40)
    foto = models.FileField(upload_to="static/images/staff/")
    trabalhos = models.ManyToManyField(Trabalho, blank=True)
    dono = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.nome
