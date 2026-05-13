//Não use @Entity() ou @Column() aqui. Essas classes representam apenas a regra de negócio.
export class Ingredient {
  public id: number | null;
  public name: string;
  public costPrice: number;
  public unit: string;
  public packageSize: number;

  constructor(
    id: number | null,
    name: string,
    costPrice: number,
    unit: string,
    packageSize: number,
  ) {
    this.id = id;
    this.name = name;
    this.costPrice = costPrice;
    this.unit = unit;
    this.packageSize = packageSize;
  }

  get pricePerUnit(): number {
    const factor = this.unit === 'g' || this.unit === 'ml' ? 1000 : 1;
    return (this.costPrice / this.packageSize) * factor;
  }
}

//unidade base de conversao do sistema e por kg.
//tem q ter uma regra de 3 para converter e enviar todos os valores prontos para o produto.
//
