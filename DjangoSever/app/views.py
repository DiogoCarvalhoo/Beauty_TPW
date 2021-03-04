from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.core.paginator import Paginator
from django.contrib.auth import update_session_auth_hash
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from app.models import Instituto, Produto, Servico,  CategoriaServico, CategoriaProduto, MembroStaff, Trabalho
from app.forms import *
from decimal import Decimal
from rest_framework import status, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.serializers import *;
import random

# Create your views here.

def home(request):
    formRegistro = UtilizadorRegistroForm()
    formLogin = UtilizadorAutenticacaoForm()
    utilizador = request.user.username
    return render(request, 'index.html', {'errorLogin': False, 'formLogin': formLogin,
                                                          'formRegistro': formRegistro, 'errorRegistro': False,
                                                          'logado': utilizador})

def register(request):
    if request.method == 'POST':
        form = UtilizadorRegistroForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            #messages.success(request, f'Your account has been created. You are now able to login')
            return redirect('/login')
    else:
        form = UtilizadorRegistroForm()
    return render(request, 'register.html', {'form': form})


def listaInstitutos(request):
    if  request.method == "POST":
        form = InstitutoQueryForm(request.POST)
        if form.is_valid():
            nome = form.cleaned_data['nome']
            localizacao = form.cleaned_data['localizacao']
            query = {'nome': nome, 'localizacao':localizacao}
            institutos = Instituto.objects.filter(nome__icontains=nome, localizacao__icontains=localizacao)
            form = InstitutoQueryForm()
            paginator = Paginator(institutos, 8)
            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)
            numeroResultados = paginator.count
            return render(request, 'institutolist.html', {'error' : False, 'page_obj' : page_obj, 'query': query,
                                                          'form' : form,'numeroResultados': numeroResultados})
        else:
            form = InstitutoQueryForm()
            return render(request, 'institutolist.html', {"error": True, 'query' : None, 'form': form})
    else:
        form = InstitutoQueryForm()
        institutos = Instituto.objects.all()
        paginator = Paginator(institutos, 8)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        numeroResultados = paginator.count
        return render(request, 'institutolist.html', {'error': False, 'query' : None, 'form': form,
                                                      'page_obj' : page_obj,'numeroResultados': numeroResultados})


def listaServicos(request):
    if request.method == "POST":
        form = ServicoQueryForm(request.POST)
        if form.is_valid():
            nome = form.cleaned_data['nome']
            instituto = form.cleaned_data['instituto']
            categoria = form.cleaned_data['categoria']
            minprice = form.cleaned_data['minprice']
            maxprice = form.cleaned_data['maxprice']
            if (maxprice == None):
                maxprice = Decimal('inf')
            if (minprice == None):
                minprice = Decimal('-1')
            servicos = []
            if (int(instituto) == -1):
                if (int(categoria) == -1):
                    servicos = Servico.objects.filter(nome__icontains=nome, preco__lt = maxprice, preco__gt = minprice).order_by("preco")
                    categoria = ""
                else:
                    servicos = Servico.objects.filter(nome__icontains=nome, preco__lt=maxprice, preco__gt=minprice, categoria=categoria).order_by("preco")
                    categoria = CategoriaServico.objects.get(id=categoria)
                instituto = ""
            else:
                instituto = Instituto.objects.get(id=instituto)
                if (int(categoria) == -1):
                    servicos = Servico.objects.filter(nome__icontains=nome, instituto=instituto, preco__lt=maxprice, preco__gt=minprice).order_by("preco")
                    categoria = ""
                else:
                    servicos = Servico.objects.filter(nome__icontains=nome, instituto=instituto, preco__lt = maxprice, preco__gt = minprice, categoria_id=categoria).order_by("preco")
                    categoria = CategoriaServico.objects.get(id=categoria)
            if (maxprice == Decimal('inf')):
                maxprice = ""
            if (minprice == Decimal('-1')):
                minprice = ""
            query = {'nome':nome, 'instituto':instituto, 'minprice':minprice, 'maxprice':maxprice, 'categoria':categoria}
            form = ServicoQueryForm()
            paginator = Paginator(servicos, 8)
            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)
            numeroResultados = paginator.count
            return render(request, 'servicolist.html', {'error' : False, 'page_obj':page_obj, 'query': query,
                                                        'form' : form, 'numeroResultados': numeroResultados})
        else:
            form = ServicoQueryForm()
            return render(request, 'servicolist.html', {"error": True, 'query' : None, 'form': form})
    else:
        form = ServicoQueryForm()
        servicos = Servico.objects.all().order_by("preco")
        paginator = Paginator(servicos, 8)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        numeroResultados = paginator.count
        return render(request, 'servicolist.html', {'error': False, 'query' : None , 'form' : form,
                                                    'page_obj':page_obj, 'numeroResultados': numeroResultados})

def listaProdutos(request):
    if request.method == "POST":
        form = ProdutoQueryForm(request.POST)
        if form.is_valid():
            nome = form.cleaned_data['nome']
            instituto = form.cleaned_data['instituto']
            categoria = form.cleaned_data['categoria']
            minprice = form.cleaned_data['minprice']
            maxprice = form.cleaned_data['maxprice']
            if (maxprice == None):
                maxprice = Decimal('inf')
            if (minprice == None):
                minprice = Decimal('-1')
            if (int(instituto) == -1):
                if (int(categoria) == -1):
                    produtos = Produto.objects.filter(nome__icontains=nome, preco__lt=maxprice, preco__gt=minprice).order_by("preco")
                    categoria = ""
                else:
                    produtos = Produto.objects.filter(nome__icontains=nome, preco__lt=maxprice, preco__gt=minprice,
                                                      categoria=categoria).order_by("preco")
                    categoria = CategoriaProduto.objects.get(id=categoria)
                instituto = ""
            else:
                instituto = Instituto.objects.get(id=instituto)
                if (int(categoria) == -1):
                    produtos = Produto.objects.filter(nome__icontains=nome, instituto=instituto, preco__lt=maxprice,
                                                      preco__gt=minprice).order_by("preco")
                    categoria = ""
                else:
                    produtos = Produto.objects.filter(nome__icontains=nome, instituto=instituto, preco__lt=maxprice,
                                                      preco__gt=minprice, categoria_id=categoria).order_by("preco")
                    categoria = CategoriaProduto.objects.get(id=categoria)
            if (maxprice == Decimal('inf')):
                maxprice = ""
            if (minprice == Decimal('-1')):
                minprice = ""
            query = {'nome': nome, 'instituto': instituto, 'minprice': minprice, 'maxprice': maxprice,
                     'categoria': categoria}
            form = ProdutoQueryForm()
            paginator = Paginator(produtos, 8)
            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)
            numeroResultados = paginator.count
            return render(request, 'produtolist.html',
                          {'error': False, 'page_obj': page_obj, 'query': query, 'form': form, 'numeroResultados': numeroResultados})
        else:
            form = ProdutoQueryForm()
            return render(request, 'produtolist.html', {"error": True, 'query': None, 'form': form})
    else:
        form = ProdutoQueryForm()
        produtos = Produto.objects.all().order_by("preco")
        paginator = Paginator(produtos,8)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        numeroResultados = paginator.count
        return render(request, 'produtolist.html', {'error': False, 'query': None, 'form': form, 'page_obj': page_obj, 'numeroResultados': numeroResultados})


def instituto(request, id):
    instituto = Instituto.objects.get(id=id)
    servicos = Servico.objects.filter(instituto=instituto).order_by("preco")
    produtos = Produto.objects.filter(instituto=instituto).order_by("preco")
    trabalhadores = MembroStaff.objects.filter(trabalhos__instituto=instituto)
    dict_trabalhadores = {}
    for trabalhador in trabalhadores:
        trabalho = Trabalho.objects.filter(membrostaff=trabalhador, instituto=instituto)
        dict_trabalhadores[trabalhador] = trabalho
    return render(request, 'instituto.html', {'instituto':instituto, 'servicos':servicos, 'produtos': produtos,
                                              'dict_trabalhadores': dict_trabalhadores})


def servico(request, id):
    servico = Servico.objects.get(id=id)
    institutos = Instituto.objects.filter(servico=servico)
    return render(request, 'servico.html', {'servico':servico, 'institutos': institutos})

def produto(request, id):
    produto = Produto.objects.get(id=id)
    institutos = Instituto.objects.filter(produto=produto)
    return render(request, 'produto.html', {'produto':produto, 'institutos': institutos})



def inserirInstituto(request):
    if not request.user.is_authenticated:
        return redirect('/login')
    else:
        if request.method == "POST":
            form = InserirInstitutoForm(request.POST, request.FILES)
            if form.is_valid():
                nome = form.cleaned_data["nome"]
                slogan = form.cleaned_data["slogan"]
                localizacao = form.cleaned_data["localizacao"]
                email = form.cleaned_data["email"]
                website = form.cleaned_data["website"]
                foto = form.cleaned_data["foto"]
                dono = request.user
                novoInstituto = Instituto(nome=nome,slogan=slogan, localizacao=localizacao, email=email, website=website, foto=foto, dono=dono)
                novoInstituto.save()
                trabalhos = ["Gerente", "Responsável Financeiro", "Esteticista", "Cabeleireiro(a)", "Massagista"]
                for trabalho in trabalhos:
                    novoTrabalho = Trabalho(posicao=trabalho, instituto=novoInstituto)
                    novoTrabalho.save()
                return redirect('/gerirInstituto')
            else:
                return render(request, 'inserirInstituto.html', {'form': form, 'erro':True})
        else:
            form = InserirInstitutoForm()
            return render(request, 'inserirInstituto.html', {'form': form, 'erro':False})

def gerirInstituto(request):
    if not request.user.is_authenticated:
        return redirect('/login')
    else:
        if (request.user.username == "projeto"):
            institutos = Instituto.objects.all()
        else:
            institutos = Instituto.objects.filter(dono__id=request.user.id)
        paginator = Paginator(institutos, 8)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(request, 'gerirInstituto.html', {'error': False, 'page_obj': page_obj})

def editarInstituto(request, id):
    if (not request.user.is_authenticated) or (not (request.user == Instituto.objects.get(id=id).dono or request.user.username == "projeto") ):   #"projeto" é o user admin
        return redirect('/')
    else:
        if request.method == "POST":
            form = EditarInstitutoForm(request.POST, request.FILES)
            if form.is_valid():
                nome = form.cleaned_data["nome"]
                slogan = form.cleaned_data["slogan"]
                localizacao = form.cleaned_data["localizacao"]
                email = form.cleaned_data["email"]
                website = form.cleaned_data["website"]
                foto = form.cleaned_data["foto"]
                dono = request.user
                instituto = Instituto.objects.get(id=id)
                instituto.nome = nome
                instituto.slogan = slogan
                instituto.localizacao = localizacao
                instituto.email = email
                instituto.website = website
                if foto != None:
                    instituto.foto = foto
                instituto.save()
                return redirect('/gerirInstituto')
            else:
                instituto = Instituto.objects.get(id=id)
                servicos = Servico.objects.filter(instituto=instituto)
                produtos = Produto.objects.filter(instituto=instituto)
                trabalhadores = MembroStaff.objects.filter(trabalhos__instituto=instituto)
                form = EditarInstitutoForm(initial={'nome': instituto.nome, 'slogan': instituto.slogan,
                                                    'localizacao': instituto.localizacao, 'email': instituto.email,
                                                    'website': instituto.website, 'foto': instituto.foto})
                dict_trabalhadores = {}
                for trabalhador in trabalhadores:
                    trabalho = Trabalho.objects.filter(membrostaff=trabalhador, instituto=instituto)
                    dict_trabalhadores[trabalhador] = trabalho
                return render(request, 'editarInstituto.html',{'instituto': instituto, 'servicos': servicos, 'produtos': produtos,'dict_trabalhadores': dict_trabalhadores, 'form': form, 'erro': True})

        else:
            instituto = Instituto.objects.get(id=id)
            servicos = Servico.objects.filter(instituto=instituto)
            produtos = Produto.objects.filter(instituto=instituto)
            trabalhadores = MembroStaff.objects.filter(trabalhos__instituto=instituto)
            form = EditarInstitutoForm(initial={'nome': instituto.nome, 'slogan': instituto.slogan,
                                                 'localizacao': instituto.localizacao, 'email': instituto.email,
                                                 'website': instituto.website, 'foto': instituto.foto})
            dict_trabalhadores = {}
            for trabalhador in trabalhadores:
                trabalho = Trabalho.objects.filter(membrostaff=trabalhador, instituto=instituto)
                dict_trabalhadores[trabalhador] = trabalho
            return render(request, 'editarInstituto.html', {'instituto': instituto, 'servicos': servicos, 'produtos': produtos, 'dict_trabalhadores': dict_trabalhadores, 'form': form, 'erro':False})

def deleteInstituto(request, id):
    if (not request.user.is_authenticated) or (not (request.user == Instituto.objects.get(id=id).dono or request.user.username == "projeto")):  # "projeto" é o user admin
        return redirect('/')
    else:
        Instituto.objects.get(id=id).delete()
        return redirect('/gerirInstituto/')

def inserirServico(request):
    if not request.user.is_authenticated:
        return redirect('/login')
    else:
        if request.method == "POST":
            form = InserirServicoForm(request.POST, request.FILES, user=request.user)
            if form.is_valid():
                nome = form.cleaned_data["nome"]
                descricao = form.cleaned_data["descricao"]
                preco = form.cleaned_data["preco"]
                categoria = CategoriaServico.objects.get(id=form.cleaned_data["categoria"])
                foto = form.cleaned_data["foto"]
                dono = request.user
                institutos = form.cleaned_data["instituto"]
                novoServico = Servico(nome=nome, descricao=descricao, preco=preco, categoria=categoria, foto=foto, dono=dono)
                novoServico.save()
                for instituto_id in institutos:
                    novo = Instituto.objects.get(id=instituto_id)
                    novoServico.instituto.add(novo)
                return redirect('/gerirServico')
            else:
                return render(request, 'inserirServico.html', {'form': form, 'erro': True})
        else:
            form = InserirServicoForm(user=request.user)
            return render(request, 'inserirServico.html', {'form': form, 'erro':False})

def gerirServico(request):
    if not request.user.is_authenticated:
        return redirect('/login')
    else:
        if (request.user.username == "projeto"):
            servicos = Servico.objects.all()
        else:
            servicos = Servico.objects.filter(dono__id=request.user.id)
        paginator = Paginator(servicos, 8)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(request, 'gerirServico.html', {'error': False, 'page_obj': page_obj})


def editarServico(request, id):
    if (not request.user.is_authenticated) or (not (request.user == Servico.objects.get(id=id).dono or request.user.username == "projeto")):  # "projeto" é o user admin
        return redirect('/')
    else:
        if request.method == "POST":
            form = EditarServicoForm(request.POST, request.FILES, user=request.user)
            if form.is_valid():
                nome = form.cleaned_data["nome"]
                descricao = form.cleaned_data["descricao"]
                preco = form.cleaned_data["preco"]
                categoria = CategoriaServico.objects.get(id=form.cleaned_data["categoria"])
                instituto = form.cleaned_data["instituto"]
                foto = form.cleaned_data["foto"]
                dono = request.user
                servico = Servico.objects.get(id=id)
                servico.nome = nome
                servico.descricao = descricao
                servico.preco = preco
                servico.categoria = categoria
                if foto != None:
                    servico.foto = foto
                servico.save()
                servico.instituto.clear()
                for instituto_id in instituto:
                    novo = Instituto.objects.get(id=instituto_id)
                    servico.instituto.add(novo)
                return redirect('/gerirServico/')
            else:
                servico = Servico.objects.get(id=id)
                pre_choices = []
                for instituto in servico.instituto.all():
                    pre_choices.append(str(instituto.id))
                form = EditarServicoForm(user=request.user,
                                         initial={'nome': servico.nome, 'descricao': servico.descricao,
                                                  'preco': servico.preco, 'categoria': servico.categoria_id,
                                                  'instituto': pre_choices,
                                                  'foto': servico.foto})
                return render(request, 'editarServico.html', {'servico': servico, 'form': form, 'erro':True})
        else:
            servico = Servico.objects.get(id=id)
            pre_choices = []
            for instituto in servico.instituto.all():
                pre_choices.append(str(instituto.id))
            form = EditarServicoForm(user=request.user, initial={'nome': servico.nome, 'descricao': servico.descricao,
                                                 'preco': servico.preco, 'categoria': servico.categoria_id, 'instituto' : pre_choices,
                                                  'foto': servico.foto})
            return render(request, 'editarServico.html', {'servico': servico, 'form': form, 'erro':False})



def deleteServico(request, id):
    if (not request.user.is_authenticated) or (not (request.user == Servico.objects.get(id=id).dono or request.user.username == "projeto")):  # "projeto" é o user admin
        return redirect('/')
    else:
        Servico.objects.get(id=id).delete()
        return redirect( '/gerirServico/')


def inserirProduto(request):
    if not request.user.is_authenticated:
        return redirect('/login')
    else:
        if request.method == "POST":
            form = InserirProdutoForm(request.POST, request.FILES, user=request.user)
            if form.is_valid():
                nome = form.cleaned_data["nome"]
                descricao = form.cleaned_data["descricao"]
                preco = form.cleaned_data["preco"]
                categoria = CategoriaProduto.objects.get(id=form.cleaned_data["categoria"])
                quantidade = form.cleaned_data["quantidade"]
                foto = form.cleaned_data["foto"]
                dono = request.user
                institutos = form.cleaned_data["instituto"]
                novoProduto = Produto(nome=nome, descricao=descricao, preco=preco, categoria=categoria, quantidade=quantidade, foto=foto, dono=dono)
                novoProduto.save()
                for instituto_id in institutos:
                    novo = Instituto.objects.get(id=instituto_id)
                    novoProduto.instituto.add(novo)
                return redirect('/gerirProduto')
            else:
                return render(request, 'inserirProduto.html', {'form': form, 'erro':True})
        else:
            form = InserirProdutoForm(user=request.user)
            return render(request, 'inserirProduto.html', {'form': form, 'erro':False})

def gerirProduto(request):
    if not request.user.is_authenticated:
        return redirect('/login')
    else:
        if (request.user.username == "projeto"):
            produtos = Produto.objects.all()
        else:
            produtos = Produto.objects.filter(dono__id=request.user.id)
        paginator = Paginator(produtos, 8)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(request, 'gerirProduto.html', {'error': False, 'page_obj': page_obj})

def editarProduto(request, id):
    if (not request.user.is_authenticated) or (not (request.user == Produto.objects.get(id=id).dono or request.user.username == "projeto")):  # "projeto" é o user admin
        return redirect('/')
    else:
        if request.method == "POST":
            form = EditarProdutoForm(request.POST, request.FILES, user=request.user)
            if form.is_valid():
                nome = form.cleaned_data["nome"]
                descricao = form.cleaned_data["descricao"]
                preco = form.cleaned_data["preco"]
                quantidade = form.cleaned_data["quantidade"]
                categoria = CategoriaProduto.objects.get(id=form.cleaned_data["categoria"])
                instituto = form.cleaned_data["instituto"]
                foto = form.cleaned_data["foto"]
                dono = request.user
                produto = Produto.objects.get(id=id)
                produto.nome = nome
                produto.descricao = descricao
                produto.preco = preco
                produto.quantidade = quantidade
                produto.categoria = categoria
                if foto != None:
                    produto.foto = foto
                produto.save()
                produto.instituto.clear()
                for instituto_id in instituto:
                    novo = Instituto.objects.get(id=instituto_id)
                    produto.instituto.add(novo)
                return redirect('/gerirProduto/')
            else:
                produto = Produto.objects.get(id=id)
                pre_choices = []
                for instituto in produto.instituto.all():
                    pre_choices.append(str(instituto.id))
                form = EditarProdutoForm(user=request.user,
                                         initial={'nome': produto.nome, 'descricao': produto.descricao,
                                                  'preco': produto.preco, 'quantidade': produto.quantidade,
                                                  'categoria': produto.categoria_id, 'instituto': pre_choices,
                                                  'foto': produto.foto})
                return render(request, 'editarProduto.html', {'produto': produto, 'form': form, 'erro':True})
        else:
            produto = Produto.objects.get(id=id)
            pre_choices = []
            for instituto in produto.instituto.all():
                pre_choices.append(str(instituto.id))
            form = EditarProdutoForm(user=request.user, initial={'nome': produto.nome, 'descricao': produto.descricao,
                                                 'preco': produto.preco, 'quantidade': produto.quantidade, 'categoria': produto.categoria_id, 'instituto' : pre_choices,
                                                  'foto': produto.foto})
            return render(request, 'editarProduto.html', {'produto': produto, 'form': form, 'erro':False})



def deleteProduto(request, id):
    if (not request.user.is_authenticated) or (not (request.user == Produto.objects.get(id=id).dono or request.user.username == "projeto")):  # "projeto" é o user admin
        return redirect('/')
    else:
        Produto.objects.get(id=id).delete()
        return redirect('/gerirProduto/')



def inserirStaff(request):
    if not request.user.is_authenticated:
        return redirect('/login')
    else:
        if request.method == "POST":
            form = InserirStaffForm(request.POST, request.FILES, user=request.user)
            if form.is_valid():
                nome = form.cleaned_data["nome"]
                foto = form.cleaned_data["foto"]
                dono = request.user
                trabalhos = form.cleaned_data["trabalhos"]
                novoStaff = MembroStaff(nome=nome, foto=foto, dono=dono)
                novoStaff.save()
                for trabalho_id in trabalhos:
                    novo = Trabalho.objects.get(id=trabalho_id)
                    novoStaff.trabalhos.add(novo)
                return redirect('/gerirStaff')
            else:
                return render(request, 'inserirStaff.html', {'form': form, 'erro':True})
        else:
            form = InserirStaffForm(user=request.user)
            return render(request, 'inserirStaff.html', {'form': form, 'erro':False})


def editarStaff(request, id):
    if (not request.user.is_authenticated) or (not (request.user == MembroStaff.objects.get(id=id).dono or request.user.username == "projeto")):  # "projeto" é o user admin
        return redirect('/')
    else:
        if request.method == "POST":
            form = EditarStaffForm(request.POST, request.FILES, user=request.user)
            if form.is_valid():
                nome = form.cleaned_data["nome"]
                trabalhos = form.cleaned_data["trabalhos"]
                foto = form.cleaned_data["foto"]
                dono = request.user
                trabalhador = MembroStaff.objects.get(id=id)
                trabalhador.nome = nome
                if foto != None:
                    trabalhador.foto = foto
                trabalhador.save()
                trabalhador.trabalhos.clear()
                for trabalho_id in trabalhos:
                    novo = Trabalho.objects.get(id=trabalho_id)
                    trabalhador.trabalhos.add(novo)
                return redirect('/gerirStaff/')
            else:
                trabalhador = MembroStaff.objects.get(id=id)
                pre_choices = []
                print(trabalhador.trabalhos.all())
                for trabalho in trabalhador.trabalhos.all():
                    pre_choices.append(str(trabalho.id))
                form = EditarStaffForm(user=request.user, initial={'nome': trabalhador.nome, 'trabalhos': pre_choices,
                                                                   'foto': trabalhador.foto})
                return render(request, 'editarStaff.html', {'trabalhador': trabalhador, 'form': form, 'erro':True})
        else:
            trabalhador = MembroStaff.objects.get(id=id)
            pre_choices = []
            print(trabalhador.trabalhos.all())
            for trabalho in trabalhador.trabalhos.all():
                pre_choices.append(str(trabalho.id))
            form = EditarStaffForm(user=request.user, initial={'nome': trabalhador.nome, 'trabalhos' : pre_choices,
                                                  'foto': trabalhador.foto})
            return render(request, 'editarStaff.html', {'trabalhador': trabalhador, 'form': form, 'erro':False})



def gerirStaff(request):
    if not request.user.is_authenticated:
        return redirect('/login')
    else:
        if (request.user.username == "projeto"):
            trabalhadores = MembroStaff.objects.all()
        else:
            trabalhadores = MembroStaff.objects.filter(dono__id=request.user.id)
        paginator = Paginator(trabalhadores, 8)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(request, 'gerirStaff.html', {'error': False, 'page_obj': page_obj})

def deleteStaff(request, id):
    if (not request.user.is_authenticated) or (not (request.user == MembroStaff.objects.get(id=id).dono or request.user.username == "projeto")):  # "projeto" é o user admin
        return redirect('/')
    else:
        MembroStaff.objects.get(id=id).delete()
        return redirect('/gerirStaff/')


def areaReservada(request):
    if (not request.user.username == "projeto"):  # "projeto" é o user admin
        return redirect('/')
    else:
        categoriasProdutos = CategoriaProduto.objects.all()
        categoriasServicos = CategoriaServico.objects.all()
        formProdutos = InserirCategoriaProdutoForm()
        formServicos = InserirCategoriaServicoForm()
        return render(request, 'areaReservada.html', {'error': False, 'categoriasProdutos': categoriasProdutos, 'categoriasServicos': categoriasServicos, 'formProdutos':formProdutos, 'formServicos': formServicos})

def inserirCategoriaServico(request):
    if not(request.user.username == "projeto"):  # "projeto" é o user admin
        return redirect('/')
    else:
        form = InserirCategoriaServicoForm(request.POST, request.FILES)
        if form.is_valid():
            nome = form.cleaned_data["nome"]
            foto = form.cleaned_data["foto"]
            novaCategoria = CategoriaServico(nome=nome, foto=foto)
            novaCategoria.save()
        return redirect('/areaReservada/')

def inserirCategoriaProduto(request):
    if not  (request.user.username == "projeto"):  # "projeto" é o user admin
        return redirect('/')
    else:
        form = InserirCategoriaProdutoForm(request.POST, request.FILES)
        if form.is_valid():
            nome = form.cleaned_data["nome"]
            foto = form.cleaned_data["foto"]
            novaCategoria = CategoriaProduto(nome=nome, foto=foto)
            novaCategoria.save()
        return redirect('/areaReservada/')

def deleteCategoriaServico(request, id):
    if not(request.user.username == "projeto"):  # "projeto" é o user admin
        return redirect('/')
    else:
        CategoriaServico.objects.get(id=id).delete()
        return redirect('/areaReservada/')


def deleteCategoriaProduto(request, id):
    if not(request.user.username == "projeto"):  # "projeto" é o user admin
        return redirect('/')
    else:
        CategoriaProduto.objects.get(id=id).delete()
        return redirect('/areaReservada/')

def account(request):
    if (not request.user.is_authenticated):
        return redirect('/')
    else:
        form2 = FormChangeEmail(initial={'email': request.user.email})
        if request.method == 'POST':
            form = FormChangePassword(request.user, request.POST)
            if form.is_valid():
                user = form.save()
                update_session_auth_hash(request, user)  # Important!
                return redirect('/')
            else:
                return render(request, 'conta.html', {'form': form, 'error': True, 'emailform': form2})
        else:
            form = FormChangePassword(request.user)
            return render(request, 'conta.html', {'form': form, 'error': False, 'emailform': form2})


def updateemail(request):
    if request.method == 'POST':
        form = FormChangeEmail(request.POST)
        if form.is_valid():
            if request.user.is_authenticated:
                    user = request.user
                    user.email = form.cleaned_data['email']
                    user.save()
                    return HttpResponseRedirect("/account")
    return HttpResponseRedirect("/account")






#Web Services
class getCategoriaProdutoByIdView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            categoria = CategoriaProduto.objects.get(id=id)
        except CategoriaProduto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CategoriaProdutoSerializer(categoria)
        return Response(serializer.data)

class getCategoriaServicoByIdView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            categoria = CategoriaServico.objects.get(id=id)
        except CategoriaServico.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CategoriaServicoSerializer(categoria)
        return Response(serializer.data)


class getInstitutoByIdView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            instituto = Instituto.objects.get(id=id)
        except Instituto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = InstitutoSerializer(instituto)
        return Response(serializer.data)


class getServicoByIdView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            servico = Servico.objects.get(id=id)
        except Servico.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ServicoSerializer(servico  )
        return Response(serializer.data)


class getProdutoByIdView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            produto = Produto.objects.get(id=id)
        except Produto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProdutoSerializer(produto)
        return Response(serializer.data)


class getStaffByIdView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            staff = MembroStaff.objects.get(id=id)
        except MembroStaff.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = MembroStaffSerializer(staff)
        return Response(serializer.data)


class getStaffByDonoView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            if (id == 1):
                staff = MembroStaff.objects.all()
            else:
                dono = User.objects.get(id=id)
                staff = MembroStaff.objects.filter(dono=dono)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = MembroStaffSerializer(staff, many=True)
        return Response(serializer.data)


class getStaffByInstitutoView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            instituto = Instituto.objects.get(id=id)
            staff = MembroStaff.objects.filter(trabalhos__instituto=instituto)
        except Instituto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = MembroStaffSerializer(staff, many=True)
        return Response(serializer.data)


class getTrabalhosByDonoView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            if (id == 1):
                trabalhos = Trabalho.objects.filter()
            else:
                trabalhos = Trabalho.objects.filter(instituto__dono_id=id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = TrabalhoSerializer(trabalhos, many=True)
        return Response(serializer.data)


class getTrabalhoByStaffandInstituteView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id_instituto = int(request.GET['instituto'])
        id_staff = int(request.GET['staff'])
        try:
            instituto = Instituto.objects.get(id=id_instituto)
            try:
                staff = MembroStaff.objects.get(id=id_staff)
            except MembroStaff.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            trabalho = Trabalho.objects.filter(membrostaff=staff, instituto=instituto)
        except Instituto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = TrabalhoSerializer(trabalho, many=True)
        return Response(serializer.data)


class getUserByUsernameView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        username = request.GET['username']
        try:
            user = User.objects.get(username = username)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class vendedoresservicoView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            servico = Servico.objects.get(id=id)
            institutos = Instituto.objects.filter(servico=servico)
        except Servico.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = InstitutoSerializer(institutos, many=True)
        return Response(serializer.data)


class vendedoresprodutoView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        id = int(request.GET['id'])
        try:
            produto = Produto.objects.get(id=id)
            institutos = Instituto.objects.filter(produto=produto)
        except Produto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = InstitutoSerializer(institutos, many=True)
        return Response(serializer.data)



class listaCategoriasProdutosView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        categorias = CategoriaProduto.objects.all()
        serializer = CategoriaProdutoSerializer(categorias, many=True)
        return Response(serializer.data)

class listaCategoriasServicosView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        categorias = CategoriaServico.objects.all()
        serializer = CategoriaServicoSerializer(categorias, many=True)
        return Response(serializer.data)


class listaInstitutosFiltradaView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        nome = request.GET['nome']
        localizacao = request.GET['localizacao']
        try:
            institutos = Instituto.objects.filter(nome__icontains=nome, localizacao__icontains=localizacao)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = InstitutoSerializer(institutos, many=True)
        return Response(serializer.data)


class listaServicosFiltradaView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        nome = request.GET['nome']
        instituto = request.GET['instituto']
        categoria = request.GET['categoria']
        minprice = request.GET['minprice']
        maxprice = request.GET['maxprice']
        try:
            if (maxprice == ''):
                maxprice = Decimal('inf')
            if (minprice == ''):
                minprice = Decimal('-1')
            if (int(instituto) == -1):
                if (int(categoria) == -1):
                    servicos = Servico.objects.filter(nome__icontains=nome, preco__lt=maxprice,
                                                      preco__gt=minprice).order_by("preco")
                else:
                    servicos = Servico.objects.filter(nome__icontains=nome, preco__lt=maxprice, preco__gt=minprice,
                                                      categoria=categoria).order_by("preco")
            else:
                instituto = Instituto.objects.get(id=instituto)
                if (int(categoria) == -1):
                    servicos = Servico.objects.filter(nome__icontains=nome, instituto=instituto, preco__lt=maxprice,
                                                      preco__gt=minprice).order_by("preco")
                else:
                    servicos = Servico.objects.filter(nome__icontains=nome, instituto=instituto, preco__lt=maxprice,
                                                      preco__gt=minprice, categoria_id=categoria).order_by("preco")
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        page = self.paginate_queryset(servicos)
        if page is not None:
            serializer = ServicoSerializer(page, many=True)
            result = self.get_paginated_response(serializer.data)
            data = result.data  # pagination data
        else:
            serializer = ServicoSerializer(servicos, many=True)
            data = serializer.data

        #serializer = ServicoSerializer(page, many=True)
        return Response(data)


class listaProdutosFiltradaView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        nome = request.GET['nome']
        instituto = request.GET['instituto']
        categoria = request.GET['categoria']
        minprice = request.GET['minprice']
        maxprice = request.GET['maxprice']
        try:
            if (maxprice == ''):
                maxprice = Decimal('inf')
            if (minprice == ''):
                minprice = Decimal('-1')
            if (instituto == ''):
                instituto = -1
            if (categoria == ''):
                categoria = -1
            if (int(instituto) == -1):
                if (int(categoria) == -1):
                    produtos = Produto.objects.filter(nome__icontains=nome, preco__lt=maxprice,
                                                      preco__gt=minprice).order_by("preco")
                else:
                    produtos = Produto.objects.filter(nome__icontains=nome, preco__lt=maxprice, preco__gt=minprice,
                                                      categoria=categoria).order_by("preco")
            else:
                instituto = Instituto.objects.get(id=instituto)
                if (int(categoria) == -1):
                    produtos = Produto.objects.filter(nome__icontains=nome, instituto=instituto, preco__lt=maxprice,
                                                      preco__gt=minprice).order_by("preco")
                else:
                    produtos = Produto.objects.filter(nome__icontains=nome, instituto=instituto, preco__lt=maxprice,
                                                      preco__gt=minprice, categoria_id=categoria).order_by("preco")
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        page = self.paginate_queryset(produtos)
        if page is not None:
            serializer = ProdutoSerializer(page, many=True)
            result = self.get_paginated_response(serializer.data)
            data = result.data  # pagination data
        else:
            serializer = Produto(produtos, many=True)
            data = serializer.data

        #serializer = ProdutoSerializer(produtos, many=True)
        return Response(data)



class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        try:
            username = serializer.initial_data.get("username")
            email = serializer.initial_data.get("email")
            password = serializer.initial_data.get("password")
            novoUser = User.objects.create_user(username, email, password)
            novoUser.save()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.initial_data, status=status.HTTP_201_CREATED)


class createCategoriaServicoView(APIView):
    def post(self, request):
        try:
            print('here')
            nome = request.data["nome"]
            print(nome)
            foto = request.data["foto"]
            print(foto)
            novaCategoria = CategoriaServico.objects.create(nome=nome, foto=foto)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)



class createCategoriaProdutoView(APIView):
    def post(self, request):
        try:
            nome = request.data["nome"]
            foto = request.data["foto"]
            novaCategoria = CategoriaProduto.objects.create(nome=nome, foto=foto)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)


class createInstitutoView(APIView):

    def post(self, request):
        try:
            nome = request.data["nome"]
            slogan = request.data["slogan"]
            localizacao = request.data["localizacao"]
            email = request.data["email"]
            website = request.data["website"]
            foto = request.data["foto"]
            dono_id = request.data["dono"]
            dono = User.objects.get(id=dono_id)
            novoInstituto = Instituto.objects.create(nome=nome,slogan=slogan,localizacao=localizacao, email=email, website=website, foto=foto, dono=dono)
            print(novoInstituto)
            trabalhos = ["Gerente", "Responsável Financeiro", "Esteticista", "Cabeleireiro(a)", "Massagista"]
            for trabalho in trabalhos:
                novoTrabalho = Trabalho(posicao=trabalho, instituto=novoInstituto)
                novoTrabalho.save()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

class createServicoView(APIView):

    def post(self, request):
        try:
            nome = request.data['nome']
            descricao = request.data["descricao"]
            preco = request.data["preco"]
            categoria_id = request.data["categoria"]
            categoria = CategoriaServico.objects.get(id=categoria_id)
            foto = request.data['foto']
            institutos = request.data['institutos']
            dono_id = request.data['dono']
            dono = User.objects.get(id=dono_id)
            novoServico = Servico.objects.create(nome=nome, descricao=descricao, preco=preco,categoria=categoria, foto=foto, dono=dono)
            institutos = institutos.split('-')
            for element in institutos:
                novo = Instituto.objects.get(id=element)
                novoServico.instituto.add(novo)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

class createProdutoView(APIView):

    def post(self, request):
        try:
            nome = request.data['nome']
            descricao = request.data["descricao"]
            preco = request.data["preco"]
            quantidade = request.data["quantidade"]
            categoria_id = request.data["categoria"]
            categoria = CategoriaProduto.objects.get(id=categoria_id)
            foto = request.data['foto']
            institutos = request.data['institutos']
            dono_id = request.data['dono']
            dono = User.objects.get(id=dono_id)
            novoProduto = Produto.objects.create(nome=nome,quantidade = quantidade, descricao=descricao, preco=preco,categoria=categoria, foto=foto, dono=dono)
            institutos = institutos.split('-')
            for element in institutos:
                novo = Instituto.objects.get(id=element)
                novoProduto.instituto.add(novo)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

class createStaffView(APIView):

    def post(self, request):
        try:
            nome = request.data['nome']
            foto = request.data['foto']
            dono = request.data['dono']
            trabalhos = request.data['trabalhos']
            user = User.objects.get(id=dono)
            novoMembro = MembroStaff.objects.create(nome=nome, foto=foto, dono=user)
            trabalhos = trabalhos.split('-')
            for element in trabalhos:
                novo = Trabalho.objects.get(id=element)
                novoMembro.trabalhos.add(novo)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_UserEmail(request):
    id = request.data['id']
    try:
       user = User.objects.get(id = id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(data=request.data)
    try:
        email = serializer.initial_data.get("email")
        user.email = email
        user.save()
        return Response(data=serializer.initial_data)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_UserPassword(request):
    try:
        id = request.data['userid']
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    try:
        passwordatual = request.data['passwordatual']
        if (user.check_password(passwordatual) == True):
            passwordnova = request.data['passwordnova']
            user.set_password(passwordnova)
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_304_NOT_MODIFIED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)




class updateInstitutoView(APIView):

    def put(self, request):
        try:
            id = request.data['id']
            instituto = Instituto.objects.get(id = id)
        except Instituto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            nome = request.data["nome"]
            slogan = request.data["slogan"]
            localizacao = request.data["localizacao"]
            email = request.data["email"]
            website = request.data["website"]
            foto = request.data["foto"]
            instituto.nome = nome
            instituto.slogan = slogan
            instituto.localizacao = localizacao
            instituto.email = email
            instituto.website = website

            if foto != "":
                instituto.foto = foto
            instituto.save()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)



class updateProdutoView(APIView):

    def put(self, request):
        try:
            id = request.data['id']
            produto = Produto.objects.get(id = id)
        except Produto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            nome = request.data['nome']
            descricao = request.data['descricao']
            preco = request.data['preco']
            quantidade = request.data['quantidade']
            categoria_id = request.data['categoria']
            categoria = CategoriaProduto.objects.get(id=categoria_id)
            institutos = request.data['institutos']
            foto = request.data['foto']
            produto.nome = nome
            produto.descricao = descricao
            produto.preco = preco
            produto.quantidade = quantidade
            produto.categoria = categoria
            if foto != "":
                produto.foto = foto
            produto.instituto.clear()
            institutos = institutos.split('-')
            for element in institutos:
                novo = Instituto.objects.get(id=element)
                produto.instituto.add(novo)
            produto.save()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)



class updateServicoView(APIView):

    def put(self, request):
        try:
            id = request.data['id']
            servico = Servico.objects.get(id = id)
        except Servico.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            nome = request.data['nome']
            descricao = request.data['descricao']
            preco = request.data['preco']
            categoria_id = request.data['categoria']
            categoria = CategoriaServico.objects.get(id=categoria_id)
            institutos = request.data['institutos']
            foto = request.data['foto']
            servico.nome = nome
            servico.descricao = descricao
            servico.preco = preco
            servico.categoria = categoria
            if foto != "":
                servico.foto = foto
            servico.instituto.clear()
            institutos = institutos.split('-')
            for element in institutos:
                novo = Instituto.objects.get(id=element)
                servico.instituto.add(novo)
            servico.save()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)


class updateStaffView(APIView):

    def put(self, request):
        try:
            id = request.data['id']
            staff = MembroStaff.objects.get(id = id)
        except MembroStaff.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            nome = request.data['nome']
            foto = request.data['foto']
            trabalhos = request.data['trabalhos']
            staff.nome = nome
            if foto != "":
                staff.foto = foto
            staff.trabalhos.clear()
            trabalhos = trabalhos.split('-')
            for element in trabalhos:
                novo = Trabalho.objects.get(id=element)
                staff.trabalhos.add(novo)
            staff.save()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def drop_CategoriaServico(request, id):
    try:
        categoria = CategoriaServico.objects.get(id = id)
    except CategoriaServico.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    categoria.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def drop_CategoriaProduto(request, id):
    try:
        categoria = CategoriaProduto.objects.get(id = id)
    except CategoriaProduto.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    categoria.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def drop_instituto(request, id):
    try:
        instituto = Instituto.objects.get(id = id)
    except Instituto.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    instituto.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def drop_servico(request, id):
    try:
        servico = Servico.objects.get(id = id)
    except Servico.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    servico.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def drop_produto(request, id):
    try:
        produto = Produto.objects.get(id = id)
    except Produto.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    produto.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def drop_staff(request, id):
    try:
        membro = MembroStaff.objects.get(id = id)
    except MembroStaff.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    membro.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)





