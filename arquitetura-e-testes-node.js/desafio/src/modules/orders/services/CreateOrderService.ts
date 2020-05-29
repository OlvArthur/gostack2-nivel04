import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const orderProducts = await this.productsRepository.findAllById(products);

    if (orderProducts.length !== products.length) {
      throw new AppError('Invalid id(s) for 1 or more products');
    }

    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found', 400);
    }

    const updatedProducts = orderProducts.map((product, index) => {
      if (product.quantity < products[index].quantity) {
        throw new AppError(`${product.name} has insufficient stock available`);
      }

      return {
        product_id: product.id,
        price: product.price,
        quantity: products[index].quantity,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: updatedProducts,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateOrderService;
