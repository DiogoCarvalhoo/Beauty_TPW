from django import forms
from app.models import Instituto, CategoriaServico, CategoriaProduto, User, Servico, Produto, Trabalho
from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm
from django.contrib.auth.models import User

class UtilizadorAutenticacaoForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'class': 'form-control form-control-sm validate',
                                                           'id': 'modalLRInput10', }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control form-control-sm validate',
                                                                 'id': 'modalLRInput11'}))

class UtilizadorRegistroForm(UserCreationForm):
    email = forms.EmailField(widget=forms.TextInput(attrs={'class': 'form-control form-control-sm validate',
                                                           'id': 'modalLRInput12', }))
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control form-control-sm validate',
                                                           'id': 'modalLRInput13', }))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control form-control-sm validate',
                                                                 'id': 'modalLRInput14'}))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control form-control-sm validate',
                                                                 'id': 'modalLRInput15'}))
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


class InserirInstitutoForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=40, widget=forms.TextInput(attrs={'class': 'form-control'}))
    slogan = forms.CharField(label='Slogan: ', max_length=120, widget=forms.TextInput(attrs={'class': 'form-control'}))
    localizacao = forms.CharField(label='Localização: ', max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}))
    email = forms.EmailField(label='Email: ', widget=forms.TextInput(attrs={'class': 'form-control'}))
    website = forms.URLField(label='WebSite: ', widget=forms.TextInput(attrs={'class': 'form-control'}))
    foto = forms.FileField()


class InserirServicoForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=40, widget=forms.TextInput(attrs={'class': 'form-control'}))
    descricao = forms.CharField(label='Descrição: ', max_length=150,
                                widget=forms.TextInput(attrs={'class': 'form-control'}))
    preco = forms.DecimalField(label='Preço: ', max_digits=6, decimal_places=2,  widget=forms.TextInput(attrs={'class': 'form-control'}))
    foto = forms.FileField()
    categoria = forms.ChoiceField(label="Categoria: ", widget=forms.Select(attrs={'class': 'form-control'}))
    instituto = forms.MultipleChoiceField(label="Instituto: ",widget=forms.SelectMultiple(attrs={'class': 'form-control'}))

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(InserirServicoForm, self).__init__(*args, **kwargs)
        institutos = Instituto.objects.filter(dono_id=self.user.id)
        choices = []
        for instituto in institutos:
            choices.append((str(instituto.id), instituto.nome))
        self.fields["instituto"].choices = choices
        categorias = CategoriaServico.objects.all()
        choices = [(-1, "")]
        for categoria in categorias:
            choices.append((str(categoria.id), categoria.nome))
        self.fields["categoria"].choices = choices

class InserirProdutoForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=40, widget=forms.TextInput(attrs={'class': 'form-control'}))
    descricao = forms.CharField(label='Descrição: ', max_length=150,
                                widget=forms.TextInput(attrs={'class': 'form-control'}))
    preco = forms.DecimalField(label='Preço: ', max_digits=6, decimal_places=2,  widget=forms.TextInput(attrs={'class': 'form-control'}))
    foto = forms.FileField()
    quantidade = forms.IntegerField(label="Quantidade (ml/items): ",  widget=forms.TextInput(attrs={'class': 'form-control'}))
    categoria = forms.ChoiceField(label="Categoria: ", widget=forms.Select(attrs={'class': 'form-control'}))
    instituto = forms.MultipleChoiceField(label="Instituto: ",
                                          widget=forms.SelectMultiple(attrs={'class': 'form-control'}))

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(InserirProdutoForm, self).__init__(*args, **kwargs)
        institutos = Instituto.objects.filter(dono_id=self.user.id)
        choices = []
        for instituto in institutos:
            choices.append((str(instituto.id), instituto.nome))
        self.fields["instituto"].choices = choices
        categorias = CategoriaProduto.objects.all()
        choices = [(-1, "")]
        for categoria in categorias:
            choices.append((str(categoria.id), categoria.nome))
        self.fields["categoria"].choices = choices


class EditarInstitutoForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=40, widget=forms.TextInput(attrs={'class': 'form-control'}))
    slogan = forms.CharField(label='Slogan: ', max_length=120, widget=forms.TextInput(attrs={'class': 'form-control'}))
    localizacao = forms.CharField(label='Localização: ', max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}))
    email = forms.EmailField(label='Email: ', widget=forms.TextInput(attrs={'class': 'form-control'}))
    website = forms.URLField(label='WebSite: ', widget=forms.TextInput(attrs={'class': 'form-control'}))
    foto = forms.FileField(required=False)


class EditarServicoForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=40, widget=forms.TextInput(attrs={'class': 'form-control'}))
    descricao = forms.CharField(label='Descrição: ', max_length=150,
                                widget=forms.TextInput(attrs={'class': 'form-control'}))
    preco = forms.DecimalField(label='Preço: ', max_digits=6, decimal_places=2,  widget=forms.TextInput(attrs={'class': 'form-control'}))
    foto = forms.FileField(required=False)
    categoria = forms.ChoiceField(label="Categoria: ", widget=forms.Select(attrs={'class': 'form-control'}))
    instituto = forms.MultipleChoiceField(label="Instituto: ",widget=forms.SelectMultiple(attrs={'class': 'form-control'}))

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(EditarServicoForm, self).__init__(*args, **kwargs)
        institutos = Instituto.objects.filter(dono_id=self.user.id)
        choices = []
        for instituto in institutos:
            choices.append((str(instituto.id), instituto.nome))
        self.fields["instituto"].choices = choices
        categorias = CategoriaServico.objects.all()
        choices = [(-1, "")]
        for categoria in categorias:
            choices.append((str(categoria.id), categoria.nome))
        self.fields["categoria"].choices = choices

class EditarProdutoForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=40, widget=forms.TextInput(attrs={'class': 'form-control'}))
    descricao = forms.CharField(label='Descrição: ', max_length=150,
                                widget=forms.TextInput(attrs={'class': 'form-control'}))
    preco = forms.DecimalField(label='Preço: ', max_digits=6, decimal_places=2,  widget=forms.TextInput(attrs={'class': 'form-control'}))
    foto = forms.FileField(required=False)
    quantidade = forms.IntegerField(label="Quantidade (ml/items): ",  widget=forms.TextInput(attrs={'class': 'form-control'}))
    categoria = forms.ChoiceField(label="Categoria: ", widget=forms.Select(attrs={'class': 'form-control'}))
    instituto = forms.MultipleChoiceField(label="Instituto: ",
                                          widget=forms.SelectMultiple(attrs={'class': 'form-control'}))

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(EditarProdutoForm, self).__init__(*args, **kwargs)
        institutos = Instituto.objects.filter(dono_id=self.user.id)
        choices = []
        for instituto in institutos:
            choices.append((str(instituto.id), instituto.nome))
        self.fields["instituto"].choices = choices
        categorias = CategoriaProduto.objects.all()
        choices = [(-1, "")]
        for categoria in categorias:
            choices.append((str(categoria.id), categoria.nome))
        self.fields["categoria"].choices = choices



class InstitutoQueryForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=40, required=False,
                           widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'ex: Kaya'}))
    localizacao = forms.CharField(label='Localização: ', max_length=100, required=False,
                                  widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'ex: Lisboa'}))




class ServicoQueryForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=40, required=False,
                           widget=forms.TextInput(
                               attrs={'class': 'form-control', 'placeholder': 'ex: corte de cabelo'}))

    instituto = forms.ChoiceField(label="Instituto: ", widget=forms.Select(attrs={'class': 'form-control'}), required=False)
    categoria = forms.ChoiceField(label="Categoria: ",
                                  widget=forms.Select(attrs={'class': 'form-control'}),required=False)
    minprice = forms.DecimalField(label='Preço Mínimo: ', max_digits=6, decimal_places=2, required=False,
                                  widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'ex: 5'}))
    maxprice = forms.DecimalField(label='Preço Máximo: ', max_digits=6, decimal_places=2, required=False,
                                  widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'ex: 15'}))
    def __init__(self, *args, **kwargs):
        super(ServicoQueryForm, self).__init__(*args, **kwargs)
        institutos = Instituto.objects.all()
        choices = [(-1, "")]
        for instituto in institutos:
            choices.append((str(instituto.id), instituto.nome))
        self.fields["instituto"].choices = choices
        categorias = CategoriaServico.objects.all()
        choices = [(-1, "")]
        for categoria in categorias:
            choices.append((str(categoria.id), categoria.nome))
        self.fields["categoria"].choices = choices


class ProdutoQueryForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=100, required=False,
                           widget=forms.TextInput(
                               attrs={'class': 'form-control', 'placeholder': 'ex: Acetona'}))

    instituto = forms.ChoiceField(label="Instituto: ", widget=forms.Select(attrs={'class': 'form-control'}),required=False)
    categoria = forms.ChoiceField(label="Categoria: ",
                                  widget=forms.Select(attrs={'class': 'form-control'}),required=False)
    minprice = forms.DecimalField(label='Preço Mínimo: ', max_digits=6, decimal_places=2, required=False,
                                  widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'ex: 5'}))
    maxprice = forms.DecimalField(label='Preço Máximo: ', max_digits=6, decimal_places=2, required=False,
                                  widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'ex: 15'}))

    def __init__(self, *args, **kwargs):
        super(ProdutoQueryForm, self).__init__(*args, **kwargs)
        institutos = Instituto.objects.all()
        choices = [(-1, "")]
        for instituto in institutos:
            choices.append((str(instituto.id), instituto.nome))
        self.fields["instituto"].choices = choices
        categorias = CategoriaProduto.objects.all()
        choices = [(-1, "")]
        for categoria in categorias:
            choices.append((str(categoria.id), categoria.nome))
        self.fields["categoria"].choices = choices


class InserirStaffForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=40, widget=forms.TextInput(attrs={'class': 'form-control'}))
    foto = forms.FileField()
    trabalhos = forms.MultipleChoiceField(label="Trabalhos: ",
                                          widget=forms.SelectMultiple(attrs={'class': 'form-control'}))

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(InserirStaffForm, self).__init__(*args, **kwargs)
        trabalhos = Trabalho.objects.filter(instituto__dono_id=self.user.id)
        choices = []
        for trabalho in trabalhos:
            choices.append((str(trabalho.id), str(trabalho)))
        self.fields["trabalhos"].choices = choices

class EditarStaffForm(forms.Form):
    nome = forms.CharField(label='Nome: ', max_length=40, widget=forms.TextInput(attrs={'class': 'form-control'}))
    foto = forms.FileField(required=False)
    trabalhos = forms.MultipleChoiceField(label="Trabalhos: ",
                                          widget=forms.SelectMultiple(attrs={'class': 'form-control'}))

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(EditarStaffForm, self).__init__(*args, **kwargs)
        trabalhos = Trabalho.objects.filter(instituto__dono_id=self.user.id)
        choices = []
        for trabalho in trabalhos:
            choices.append((str(trabalho.id), str(trabalho)))
        self.fields["trabalhos"].choices = choices


class InserirCategoriaProdutoForm(forms.Form):
    nome = forms.CharField(max_length=30, widget=forms.TextInput(attrs={'class': 'form-control'}))
    foto = forms.FileField(required=True, widget=forms.FileInput(attrs={'display': 'inline'}))

class InserirCategoriaServicoForm(forms.Form):
    nome = forms.CharField(max_length=30, widget=forms.TextInput(attrs={'class': 'form-control'}))
    foto = forms.FileField(required=True, widget=forms.FileInput(attrs={'display': 'inline'}))


class FormChangePassword(PasswordChangeForm):
    class FormChangePassword(PasswordChangeForm):
        def __init__(self, *args, **kwargs):
            super(FormChangePassword, self).__init__(*args, **kwargs)
            for field in ('old_password', 'new_password1', 'new_password2'):
                self.fields[field].widget.attrs = {'class': 'form-control'}

class FormChangeEmail(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'class': 'form-control',}))