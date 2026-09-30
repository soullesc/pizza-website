export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Classic' | 'Special' | 'Vegetarian' | 'Spicy';
}

export interface CartItem extends Pizza {
  quantity: number;
}
