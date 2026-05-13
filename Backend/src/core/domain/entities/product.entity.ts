export class Product {
  constructor(
    public readonly id: number | null,
    public name: string,
    public description: string,
    public items: ProductItem[], // A lista de ingredientes que compõem o produto
  ) {}
  get basePrice(): number {
    return this.items.reduce((sum, item) => sum + item.subTotal, 0);
  }
  // Método de Negócio: Calcula o custo total baseado nos ingredientes
  get totalCost(): number {
    return this.items.reduce((sum, item) => sum + item.ingredientCostPrice, 0);
  }
}

export class ProductItem {
  constructor(
    public readonly ingredientId: number,
    public readonly quantity: number,
    public readonly ingredientCostPrice: number, // Preço na hora da composição
  ) {}

  // o que o produto precisa do ingrediente para fazer os calculos?
  //precisa do id do ingrediente
  //preco por unidade (kg)
  get subTotal(): number {
    // quantidade_usada (ex: 0.001kg) * preco_por_kg (ex: 120.00)
    return this.quantity * this.ingredientCostPrice;
  }
}
