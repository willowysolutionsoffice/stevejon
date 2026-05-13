

import React from "react";
import { DataTable } from "@/components/admin-user/Table";
import { columns } from "@/components/admin-user/Columns";

export default function AdminUserPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin – Manage Users</h1>
      <DataTable columns={columns} />
    </div>
  );
}
