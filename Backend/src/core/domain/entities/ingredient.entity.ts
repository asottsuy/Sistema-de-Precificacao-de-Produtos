//Não use @Entity() ou @Column() aqui. Essas classes representam apenas a regra de negócio.
export class Ingredient {
  public id: number | null;
  public name: string;
  public costPrice: number;
  public unit: string;

  constructor(
    id: number | null,
    name: string,
    costPrice: number,
    unit: string,
  ) {
    this.id = id;
    this.name = name;
    this.costPrice = costPrice;
    this.unit = unit;
  }
}
