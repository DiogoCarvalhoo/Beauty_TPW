from django.contrib import admin
from app.models import Instituto, Servico, Produto,  CategoriaServico, CategoriaProduto, MembroStaff, Trabalho

# Register your models here.
admin.site.register(Instituto)
admin.site.register(Servico)
admin.site.register(Produto)
admin.site.register(CategoriaServico)
admin.site.register(CategoriaProduto)
admin.site.register(MembroStaff)
admin.site.register(Trabalho)