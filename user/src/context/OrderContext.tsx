'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';

export interface OrderItem {
  id: string;
  productId: string | number;
  variantId?: string;
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
  createOrder: (items: OrderItem[], shippingDetails: ShippingDetails, paymentMethod: string) => Promise<Order>;
  cancelOrder: (orderId: string) => void;
  isInitialized: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session } = authClient.useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch orders from backend when user session changes
  useEffect(() => {
    if (!session?.user) {
      setOrders([]);
      setIsInitialized(true);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${apiUrl}/orders/my-orders`, { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            // Map backend order structure to local context structure
            const formatted: Order[] = result.data.map((o: any) => ({
              id: o.id,
              date: o.createdAt,
              items: o.items.map((i: any) => ({
                id: i.id,
                productId: i.variant?.productId || '',
                variantId: i.variantId,
                title: i.variant?.product?.name || 'Luxury Item',
                category: i.variant?.product?.category?.name || 'Apparel',
                price: i.price,
                image: i.variant?.images?.[0] || i.variant?.product?.image || '',
                size: i.variant?.options?.find((opt: any) => opt.attribute?.name?.toLowerCase() === 'size')?.attributeValue?.value || '',
                color: i.variant?.options?.find((opt: any) => opt.attribute?.name?.toLowerCase() === 'color')?.attributeValue?.value || '',
                quantity: i.quantity
              })),
              totalAmount: o.totalAmount,
              status: o.status as OrderStatus,
              paymentMethod: o.paymentMethod,
              shippingDetails: {
                name: o.user?.name || '',
                phone: o.phoneNumber || '',
                street: o.street || '',
                city: o.city || '',
                state: o.state || '',
                pincode: o.pincode || ''
              }
            }));
            setOrders(formatted);
          }
        }
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setIsInitialized(true);
      }
    };

    fetchOrders();
  }, [session, apiUrl]);

  const createOrder = async (
    items: OrderItem[],
    shippingDetails: ShippingDetails,
    paymentMethod: string
  ): Promise<Order> => {
    const res = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shippingDetails,
        paymentMethod,
        items: items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        }))
      }),
      credentials: 'include'
    });

    if (!res.ok) {
      const errorResult = await res.json();
      throw new Error(errorResult.error || 'Failed to place order');
    }

    const result = await res.json();
    if (!result.success || !result.data) {
      throw new Error('Invalid response from order endpoint');
    }

    const newOrderRaw = result.data;
    const newOrder: Order = {
      id: newOrderRaw.id,
      date: newOrderRaw.createdAt,
      items: items, // Preserve frontend details for optimistic visual display
      totalAmount: newOrderRaw.totalAmount,
      status: newOrderRaw.status as OrderStatus,
      paymentMethod: newOrderRaw.paymentMethod,
      shippingDetails
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    // Keep local cancellation fallback state
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
