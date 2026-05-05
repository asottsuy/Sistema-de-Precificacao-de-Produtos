//Não use @Entity() ou @Column() aqui. Essas classes representam apenas a regra de negócio.
export class Ingredient {
  constructor(
    public id: number | null,
    public name: string,
    public costPrice: number,
    public unit: string,
  ) {
    if (this.costPrice < 0)
      throw new Error('O preço de custo não pode ser negativo');
  }
}
