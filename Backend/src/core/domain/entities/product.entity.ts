export class Product {
  constructor(
    public readonly id: number | null,
    public name: string,
    public description: string,
    public items: ProductItem[], // A lista de ingredientes que compõem o produto
    public salePrice: number = 0,
  ) {}
  get basePrice(): number {
    return this.items.reduce((sum, item) => sum + item.subTotal, 0);
  }
  // Método de Negócio: Calcula o custo total baseado nos ingredientes
  get totalCost(): number {
    // 🟢 Proteção: Se não houver itens cadastrados ou carregados, o custo é zero
    if (!this.items || !Array.isArray(this.items)) {
      return 0;
    }

    const totalCost = this.items.reduce((sum, item) => {
      // Garante que o valor seja limpo de strings ou dízimas bizarras
      const cost =
        item && item.ingredientCostPrice ? Number(item.ingredientCostPrice) : 0;
      return sum + cost;
    }, 0);

    return totalCost;
  }

  // Margem de Contribuição: Preço de Venda - Custo Total
  get contributionMargin(): number {
    return this.salePrice - this.totalCost;
  }

  // Margem de Lucro (%): (Lucro / Preço de Venda) * 100
  get profitMarginPercentage(): number {
    if (this.salePrice === 0) return 0;
    return (this.contributionMargin / this.salePrice) * 100;
  }

  // Markup: Preço de Venda / Custo Total
  get markup(): number {
    if (this.totalCost === 0) return 0;
    return this.salePrice / this.totalCost;
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
