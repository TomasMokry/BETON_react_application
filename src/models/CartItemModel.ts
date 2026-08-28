import type CartProductModel from "./CartProductModel";


class CartItemModel {
  product: CartProductModel;
  quantity: number;
  totalPrice: number;

  constructor(
    product: CartProductModel,
    quantity: number,
    totalPrice: number
  ) {
    this.product = product;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
  }
}

export default CartItemModel;