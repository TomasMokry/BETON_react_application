class AddProductRequest {
  name: string;
  size: string;
  price: number;
  height: number;
  width: number;
  weight: number;
  length: number;
  color: string;
  description: string;
  urlImage: string;
  amount: number;
  categoryId: number;

  constructor(
    name: string,
    size: string,
    price: number,
    height: number,
    width: number,
    weight: number,
    length: number,
    color: string,
    description: string,
    urlImage: string,
    amount: number,
    categoryId: number
  ) {
    this.name = name;
    this.size = size;
    this.price = price;
    this.height = height;
    this.width = width;
    this.weight = weight;
    this.length = length;
    this.color = color;
    this.description = description;
    this.urlImage = urlImage;
    this.amount = amount;
    this.categoryId = categoryId;
  }
}

export default AddProductRequest;