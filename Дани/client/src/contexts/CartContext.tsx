import React, { createContext, useContext, useState } from 'react';

interface Product {
  productid: number;
  productname: string;
  price: number;
  current_stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.productid === product.productid);
      
      if (existingItem) {
        // Проверяем, не превышает ли новое количество доступный запас
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.current_stock) {
          return prevItems; // Не добавляем, если превышает запас
        }
        
        return prevItems.map(item =>
          item.product.productid === product.productid
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.product.productid !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(prevItems => {
      const item = prevItems.find(item => item.product.productid === productId);
      if (!item) return prevItems;
      
      // Проверяем, не превышает ли новое количество доступный запас
      if (quantity > item.product.current_stock) {
        return prevItems;
      }
      
      return prevItems.map(item =>
        item.product.productid === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 