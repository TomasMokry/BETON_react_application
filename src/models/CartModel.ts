import CartItemModel from "./CartItemModel";

class CartModel {
  id: string;
  totalPrice: number;
  items: CartItemModel[];

  constructor(
    id: string,
    totalPrice: number,
    items: CartItemModel[]
  ) {
    this.id = id;
    this.totalPrice = totalPrice;
    this.items = items;
  }
}

export default CartModel;