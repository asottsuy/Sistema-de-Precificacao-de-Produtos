export class Product {
  constructor(
    public readonly id: number | null,
    public name: string,
    public description: string,
    public salePrice: number,
    public items: ProductItem[], // A lista de ingredientes que compõem o produto
  ) {}

  // Método de Negócio: Calcula o custo total baseado nos ingredientes
  get totalCost(): number {
    return this.items.reduce((sum, item) => sum + item.subTotal, 0);
  }

  // Calcula a margem de lucro
  get profitMargin(): number {
    return ((this.salePrice - this.totalCost) / this.salePrice) * 100;
  }
}

export class ProductItem {
  constructor(
    public readonly ingredientId: number,
    public readonly quantity: number,
    public readonly ingredientCostPrice: number, // Preço na hora da composição
  ) {}

  get subTotal(): number {
    return this.quantity * this.ingredientCostPrice;
  }
}
