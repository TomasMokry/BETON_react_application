import CartItemModel from "./CartItemModel";

class OrderModel {
  id: string;
  method: string;
  createdAt: string;
  totalPrice: number;
  items: CartItemModel[];

  constructor(
    id: string,
    method: string,
    totalPrice: number,
    createdAt: string,
    items: CartItemModel[]
  ) {
    this.id = id;
    this.method = method;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
    this.items = items;
  }
}

export default OrderModel;