class ProductModel {
    id: number;
    name: string;
    size: string;
    price: number;
    height: number;
    description: string;
    width: number;
    weight: number;
    length: number;
    color: string;
    urlImage: string;
    categoryId: number;
    amount: number;

    constructor(data: {
        id: number;
        name: string;
        size: string;
        price: number;
        height: number;
        description: string;
        width: number;
        weight: number;
        length: number;
        color: string;
        urlImage: string;
        categoryId: number;
        amount: number
    }) {
        this.id = data.id;
        this.name = data.name;
        this.size = data.size;
        this.price = data.price;
        this.height = data.height;
        this.description = data.description;
        this.width = data.width;
        this.weight = data.weight;
        this.length = data.length;
        this.color = data.color;
        this.urlImage = data.urlImage;
        this.categoryId = data.categoryId;
        this.amount = data.amount;
    }
}

export default ProductModel;