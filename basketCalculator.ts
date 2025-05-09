/*
 write a program in TypeScript/JAVA that calculates the price of a basket of shopping.

The solution should be accomplished in roughly two hours.

Items are presented one at a time, in a list, identified by name - for example "Apple" or "Banana".

Multiple items are present multiple times in the list, so for example ["Apple", "Apple", "Banana"] is a basket with two apples and one banana.
 
Items are priced as follows:

 - Apples are 35p each
 - Bananas are 20p each
 - Melons are 50p each, but are available as ‘buy one get one free’
 - Limes are 15p each, but are available in a ‘three for the price of two’ offer

Given a list of shopping, calculate the total cost of those items.

Kindly upload the code repository on GitHub and provide the details of the same. 

*/


type PromotionType = 'BOGOF' | 'THREE_FOR_TWO' | null;

interface Product {
  name: string;
  price: number;
  promotion: PromotionType;
}

const PRODUCTS: Record<string, Product> = {
  Apple: { name: 'Apple', price: 35, promotion: null },
  Banana: { name: 'Banana', price: 20, promotion: null },
  Melon: { name: 'Melon', price: 50, promotion: 'BOGOF' },
  Lime: { name: 'Lime', price: 15, promotion: 'THREE_FOR_TWO' },
};

interface PromotionStrategy {
  calculateTotal(quantity: number, unitPrice: number): number;
}

class NoPromotion implements PromotionStrategy {
  calculateTotal(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }
}

class BuyOneGetOneFree implements PromotionStrategy {
  calculateTotal(quantity: number, unitPrice: number): number {
    const payable = Math.ceil(quantity / 2);
    return payable * unitPrice;
  }
}

class ThreeForTwo implements PromotionStrategy {
  calculateTotal(quantity: number, unitPrice: number): number {
    const sets = Math.floor(quantity / 3);
    const remaining = quantity % 3;
    return (sets * 2 + remaining) * unitPrice;
  }
}

const PROMOTION_STRATEGIES = new Map<PromotionType, PromotionStrategy>([
  [null, new NoPromotion()],
  ['BOGOF', new BuyOneGetOneFree()],
  ['THREE_FOR_TWO', new ThreeForTwo()],
]);
class BasketCalculator {
  private itemCounts: Record<string, number> = {};

  constructor(private items: string[]) {
    this.countItems();
  }

  private countItems() {
    for (const item of this.items) {
      if (!PRODUCTS[item]) throw new Error(`Unknown product: ${item}`);
      this.itemCounts[item] = (this.itemCounts[item] || 0) + 1;
    }
  }

  public calculateTotal(): number {
    let total = 0;
    for (const [item, qty] of Object.entries(this.itemCounts)) {
      const product = PRODUCTS[item];
      const strategy = PROMOTION_STRATEGIES.get(product.promotion)!;
      total += strategy.calculateTotal(qty, product.price);
    }
    return total;
  }

  public formatTotal(): string {
    const pence = this.calculateTotal();
    const pounds = Math.floor(pence / 100);
    const remainder = pence % 100;
    return `£${pounds}.${remainder.toString().padStart(2, '0')}`;
  }
}

// Example usage:
const basket = new BasketCalculator([
  'Apple', 'Apple', 'Banana',
  'Melon', 'Melon', 'Melon',
  'Lime', 'Lime', 'Lime', 'Lime'
]);

console.log(basket.formatTotal()); // Should output: £2.10