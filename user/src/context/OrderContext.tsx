'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OrderItem {
  id: string;
  productId: number;
  title: string;
  category: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface ShippingDetails {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  date: string; // ISO String
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingDetails: ShippingDetails;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (items: OrderItem[], shippingDetails: ShippingDetails, paymentMethod: string) => Order;
  cancelOrder: (orderId: string) => void;
  isInitialized: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const initialMockOrders: Order[] = [];

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('stevejon_orders');
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (e) {
        console.error('Failed to parse orders from localStorage', e);
        setOrders(initialMockOrders);
      }
    } else {
      // Seed with initial mock orders
      setOrders(initialMockOrders);
      localStorage.setItem('stevejon_orders', JSON.stringify(initialMockOrders));
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage when orders change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('stevejon_orders', JSON.stringify(orders));
    }
  }, [orders, isInitialized]);

  const createOrder = (
    items: OrderItem[],
    shippingDetails: ShippingDetails,
    paymentMethod: string
  ): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digit number
    const newOrder: Order = {
      id: `SJ-${randomNum}`,
      date: new Date().toISOString(),
      items,
      totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'PROCESSING',
      paymentMethod,
      shippingDetails,
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId && (order.status === 'PENDING' || order.status === 'PROCESSING' || order.status === 'SHIPPED')
          ? { ...order, status: 'CANCELLED' }
          : order
      )
    );
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, cancelOrder, isInitialized }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
