from app.models import *;
from rest_framework import serializers

class InstitutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instituto
        fields = ('id', 'nome', 'slogan', 'localizacao', 'email', 'website', 'foto', 'dono')

class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = ('id', 'nome', 'descricao', 'preco', 'categoria', 'foto', 'dono', 'instituto')

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ('id', 'nome', 'descricao', 'preco', 'categoria', 'quantidade', 'foto', 'dono', 'instituto')

class CategoriaProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProduto
        fields = ('id', 'nome', 'foto')

class CategoriaServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaServico
        fields = ('id', 'nome', 'foto')

class TrabalhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabalho
        fields = ('id', 'posicao', 'instituto')

class MembroStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembroStaff
        fields = ('id', 'nome', 'foto', 'trabalhos', 'dono')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')