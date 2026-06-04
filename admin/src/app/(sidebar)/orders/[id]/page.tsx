import OrderDetail from "@/components/admin/order/order-detail-page"; 
import { API_URL } from "@/lib/api-client";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_URL}/orders/${id}`, {
        cache: 'no-store',
        headers: {
            cookie: cookieHeader,
        }
    });
    const res = await response.json();
    const orderData = res.data || res;

    if (!response.ok || !orderData) {
      return <div className="p-6 text-red-500">Order not found</div>;
    }

    return <OrderDetail order={orderData} />;
  } catch (error) {
    return <div className="p-6 text-red-500">Error loading order</div>;
  }
}