import {User} from './User';
import {Instituto} from './Instituto';
import {CategoriaProduto} from './CategoriaProduto';
import {CategoriaServico} from './CategoriaServico';

export class Produto  {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: CategoriaProduto;
  quantidade: number;
  foto: string;
  dono: User;
  instituto: Instituto[] = [];

  constructor(nome: string, descricao: string, preco: number, quantidade: number, categoria: CategoriaServico,  foto: string, dono: User) {
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.quantidade = quantidade;
    this.categoria = categoria;
    this.foto = foto;
    this.dono = dono;
  }

  public addInstituto(instituto: Instituto) {
    this.instituto.push(instituto);
  }

  public toString(): string {
    return this.nome;
  }
}
