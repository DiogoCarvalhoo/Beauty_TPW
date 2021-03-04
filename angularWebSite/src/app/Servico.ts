import {User} from './User';
import {Instituto} from './Instituto';
import {CategoriaServico} from './CategoriaServico';

export class Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: CategoriaServico;
  foto: string;
  dono: User;
  instituto: Instituto[] = [];

  constructor(nome: string, descricao: string, preco: number, categoria: CategoriaServico,  foto: string, dono: User) {
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
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
