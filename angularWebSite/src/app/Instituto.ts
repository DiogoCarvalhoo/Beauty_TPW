
import {User} from './User';

export class Instituto {
  id: number;
  private _nome: string;
  private _slogan: string;
  private _localizacao: string;
  private _email: string;
  private _website: string;
  private _foto: string;
  dono: User;

  constructor(nome: string, slogan: string, localizacao: string, email: string, website: string,  foto: string, dono: User) {
    this._nome = nome;
    this._slogan = slogan;
    this._localizacao = localizacao;
    this._email = email;
    this._website = website;
    this._foto = foto;
    this.dono = dono;
  }

  get nome(): string {
    return this._nome;
  }

  set nome(nome: string) {
    this._nome = nome;
  }

  get slogan(): string {
    return this._slogan;
  }

  set slogan(slogan: string) {
    this._slogan = slogan;
  }

  get localizacao(): string {
    return this._localizacao;
  }

  set localizacao(localizacao: string) {
    this._localizacao = localizacao;
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
  }

  get foto(): string {
    return this._foto;
  }

  set foto(foto: string) {
    this._foto = foto;
  }

  get website(): string {
    return this._website;
  }

  set website(website: string) {
    this._website = website;
  }

  public toString(): string {
    return this._nome;
  }
}
