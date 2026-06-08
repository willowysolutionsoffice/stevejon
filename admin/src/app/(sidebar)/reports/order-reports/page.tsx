"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportOrdersPDF } from "@/components/admin/analytics/analytic-pdf";
import AdminLoader from "@/components/admin/AdminLoader";
import { IconDownload } from "@tabler/icons-react";

interface OrderSummary {
  id: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  razorpayPaymentId?: string;
  createdAt: Date;
}

export default function OrderReportsPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`${API_URL}/analytics/orders-summary`);
        if (response.ok) {
          const data = await response.json();
          // Transform string dates to Date objects
          const transformed = data.map((d: any) => ({
            ...d,
            createdAt: new Date(d.createdAt)
          }));
          setOrders(transformed);
        }
      } catch (error) {
        console.error("Failed to fetch order summary:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleExport = () => {
    exportOrdersPDF(orders, "All Time");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <AdminLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Reports</h1>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <IconDownload size={18} /> Export to PDF
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-xs">{order.id}</TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell>{order.userEmail}</TableCell>
                <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${order.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
