// app/users/[id]/page.tsx or app/users/UserDetail.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { API_URL } from '@/lib/api-client';

// This is a Server Component, so we can use async directly
export default async function UserDetailPage({ id }: { id: string }) {
  let result;
  try {
    const response = await fetch(`${API_URL}/users/${id}`, { cache: 'no-store' });
    result = await response.json();
  } catch (error) {
    return (
      <div className="p-4 text-center text-red-500">
        An error occurred while fetching user details.
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {result.error}
      </div>
    );
  }

  const user = result.user;

  if (!user) {
    return (
      <div className="p-4 text-center text-gray-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">User Details</h1>
      
      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone ?? "N/A"}</p>
          <p><strong>Joined:</strong> {format(new Date(user.createdAt), "PPP")}</p>
        </CardContent>
      </Card>

      {/* User Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {user.orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.orders.map((order: { id: string; totalAmount: number; status: string; createdAt: string }) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), "PPP")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-center text-muted-foreground">
              No orders found for this user.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
