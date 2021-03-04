"""Projeto URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name=''),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(template_name='index.html'), name='logout'),
    path('register/', views.register, name='register'),
    path('listaInstitutos/', views.listaInstitutos, name='listaInstitutos'),
    path('instituto/<int:id>/', views.instituto, name='instituto'),
    path('listaServicos/', views.listaServicos, name='listaServicos'),
    path('servico/<int:id>/', views.servico, name='servico'),
    path('listaProdutos/', views.listaProdutos, name='listaProdutos'),
    path('produto/<int:id>/', views.produto, name='produto'),
    path('inserirInstituto/', views.inserirInstituto, name='inserirInstituto'),
    path('gerirInstituto/', views.gerirInstituto, name='gerirInstituto'),
    path('editarInstituto/<int:id>/', views.editarInstituto, name='editarInstituto'),
    path('deleteInstituto/<int:id>/', views.deleteInstituto, name='deleteInstituto'),
    path('inserirProduto/', views.inserirProduto, name='inserirProduto'),
    path('gerirProduto/', views.gerirProduto, name='gerirProduto'),
    path('editarProduto/<int:id>/', views.editarProduto, name='editarProduto'),
    path('deleteProduto/<int:id>/', views.deleteProduto, name='deleteProduto'),
    path('inserirServico/', views.inserirServico, name='inserirServico'),
    path('gerirServico/', views.gerirServico, name='gerirServico'),
    path('editarServico/<int:id>/', views.editarServico, name='editarServico'),
    path('deleteServico/<int:id>/', views.deleteServico, name='deleteServico'),
    path('inserirStaff/', views.inserirStaff, name='inserirStaff'),
    path('gerirStaff/', views.gerirStaff, name='gerirStaff'),
    path('editarStaff/<int:id>/', views.editarStaff, name='editarStaff'),
    path('deleteStaff/<int:id>/', views.deleteStaff, name='deleteStaff'),
    path('areaReservada/', views.areaReservada, name='areaReservada'),
    path('inserirCategoriaServico/', views.inserirCategoriaServico, name='inserirCategoriaServico'),
    path('inserirCategoriaProduto/', views.inserirCategoriaProduto, name='inserirCategoriaProduto'),
    path('deleteCategoriaServico/<int:id>/', views.deleteCategoriaServico, name='deleteCategoriaServico'),
    path('deleteCategoriaProduto/<int:id>/', views.deleteCategoriaProduto, name='deleteCategoriaProduto'),
    path('account/', views.account, name="account"),
    path('updateemail/', views.updateemail, name="updateemail"),


    path('rest/token', TokenObtainPairView.as_view()),
    path('rest/tokenrefresh', TokenRefreshView.as_view()),
    path('rest/register', views.RegisterView.as_view()),
    path('rest/updateUserEmail', views.update_UserEmail, name='update_useremail'),
    path('rest/updateUserPassword', views.update_UserPassword, name='update_userpassword'),
    path('rest/instituto', views.getInstitutoByIdView.as_view(), name='get_institutobyid'),
    path('rest/servico', views.getServicoByIdView.as_view(), name='get_servicobyid'),
    path('rest/produto', views.getProdutoByIdView.as_view(), name='get_produtobyid'),
    path('rest/staffbyid', views.getStaffByIdView.as_view(), name='get_staffbyid'),
    path('rest/staffbydono', views.getStaffByDonoView.as_view(), name='get_staffbydono'),
    path('rest/staffbyinstituto', views.getStaffByInstitutoView.as_view(), name='get_staffbyinstituto'),
    path('rest/trabalhobydono', views.getTrabalhosByDonoView.as_view(), name='get_trabalhosbydono'),
    path('rest/trabalho', views.getTrabalhoByStaffandInstituteView.as_view(), name='get_trabalhobystaffandinstitute'),
    path('rest/user', views.getUserByUsernameView.as_view(), name='get_userbyusername'),
    path('rest/categoriaproduto', views.getCategoriaProdutoByIdView.as_view(), name='get_categoriaprodutobyid'),
    path('rest/categoriaservico', views.getCategoriaServicoByIdView.as_view(), name='get_categoriaservicobyid'),
    path('rest/listaInstitutos', views.listaInstitutosFiltradaView.as_view(), name='get_listaInstitutosFiltrada'),
    path('rest/listaServicos', views.listaServicosFiltradaView.as_view(), name='get_listaServicosFiltrada'),
    path('rest/listaProdutos', views.listaProdutosFiltradaView.as_view(), name='get_listaProdutosFiltrada'),
    path('rest/listacategoriasProdutos', views.listaCategoriasProdutosView.as_view(), name='get_listacategoriasProdutos'),
    path('rest/listacategoriasServicos', views.listaCategoriasServicosView.as_view(), name='get_listacategoriasServicos'),
    path('rest/vendedoresservico', views.vendedoresservicoView.as_view(), name='get_vendedoresservico'),
    path('rest/vendedoresproduto', views.vendedoresprodutoView.as_view(), name='get_vendedoresproduto'),
    path('rest/createCategoriaServico', views.createCategoriaServicoView.as_view(), name='create_categoriaservico'),
    path('rest/createCategoriaProduto', views.createCategoriaProdutoView.as_view(), name='create_categoriaproduto'),
    path('rest/createInstituto', views.createInstitutoView.as_view(), name='create_instituto'),
    path('rest/createServico', views.createServicoView.as_view(), name='create_servico'),
    path('rest/createProduto', views.createProdutoView.as_view(), name='create_produto'),
    path('rest/createStaff', views.createStaffView.as_view(), name='create_staff'),
    path('rest/updateInstituto', views.updateInstitutoView.as_view(), name='update_instituto'),
    path('rest/updateProduto', views.updateProdutoView.as_view(), name='update_produto'),
    path('rest/updateServico', views.updateServicoView.as_view(), name='update_servico'),
    path('rest/updateStaff', views.updateStaffView.as_view(), name='update_staff'),
    path('rest/dropCategoriaServico/<int:id>', views.drop_CategoriaServico, name='drop_categoriaservico'),
    path('rest/dropCategoriaProduto/<int:id>', views.drop_CategoriaProduto, name='drop_categoriaproduto'),
    path('rest/dropInstituto/<int:id>', views.drop_instituto, name='drop_instituto'),
    path('rest/dropServico/<int:id>', views.drop_servico, name='drop_servico'),
    path('rest/dropProduto/<int:id>', views.drop_produto, name='drop_produto'),
    path('rest/dropStaff/<int:id>', views.drop_staff, name='drop_staff'),
]