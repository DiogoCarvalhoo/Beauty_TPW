import {User} from './User';
import {Trabalho} from './Trabalho';

export class MembroStaff  {
  id: number;
  nome: string;
  foto: string;
  trabalhos: Trabalho[] = [];
  dono: User;

  constructor(nome: string, foto: string, dono: User) {
    this.nome = nome;
    this.foto = foto;
    this.dono = dono;
  }

  public addTrabalho(trabalho: Trabalho) {
    this.trabalhos.push(trabalho);
  }

  public toString(): string {
    return this.nome;
  }
}
