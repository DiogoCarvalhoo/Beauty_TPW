import {Instituto} from './Instituto';

export class Trabalho  {
  id: number;
  posicao: string;
  instituto: Instituto;

  public toString(): string {
    return this.instituto.nome + ' - ' + this.posicao;
  }
}
