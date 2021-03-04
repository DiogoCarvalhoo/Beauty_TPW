
export class CategoriaServico  {
  id: number;
  nome: string;
  foto: string;

  constructor(nome: string, foto: string) {
    this.nome = nome;
    this.foto = foto;
  }

  public toString(): string {
    return this.nome;
  }
}
