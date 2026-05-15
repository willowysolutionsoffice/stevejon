import OrderDetail from "@/components/admin/order/order-detail-page"; 
import { API_URL } from "@/lib/api-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
        cache: 'no-store'
    });
    const res = await response.json();

    if (!response.ok || !res.data) {
      return <div className="p-6 text-red-500">Order not found</div>;
    }

    return <OrderDetail order={res.data} />;
  } catch (error) {
    return <div className="p-6 text-red-500">Error loading order</div>;
  }
}