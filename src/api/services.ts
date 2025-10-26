import api from './axios';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  products: Array<{ productId: string; quantity: number; price: number; name: string }>;
  total: number;
  address: Address;
  status: 'On Process' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  wishlist: string[];
  addresses: Address[];
}

// Categories
export const getCategories = () => api.get<Category[]>('/categories');

// Products
export const getProducts = () => api.get<Product[]>('/products');
export const getProductById = (id: string) => api.get<Product>(`/products/${id}`);
export const createProduct = (product: Omit<Product, 'id'>) => api.post<Product>('/products', product);
export const updateProduct = (id: string, data: Partial<Product>) => api.patch<Product>(`/products/${id}`, data);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

// Orders
export const getOrders = () => api.get<Order[]>('/orders');
export const getOrdersByUserId = (userId: string) => 
  api.get<Order[]>(`/orders?userId=${userId}`);
export const createOrder = (order: Omit<Order, 'id'>) => api.post<Order>('/orders', order);
export const updateOrderStatus = (id: string, status: Order['status']) => 
  api.patch<Order>(`/orders/${id}`, { status });

// Users
export const getUser = (id: string) => api.get<User>(`/users/${id}`);
export const createUser = (user: User) => api.post<User>('/users', user);
export const updateUser = (id: string, data: Partial<User>) => 
  api.patch<User>(`/users/${id}`, data);
