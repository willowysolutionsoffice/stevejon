"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportWinnersPDF, WinnerSummary } from "@/components/admin/analytics/analytic-pdf";
import AdminLoader from "@/components/admin/AdminLoader";
import { IconDownload, IconSearch } from "@tabler/icons-react";

export default function WinnerReportsPage() {
  const [winners, setWinners] = useState<WinnerSummary[]>([]);
  const [filteredWinners, setFilteredWinners] = useState<WinnerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchWinners() {
      try {
        const response = await fetch(`${API_URL}/analytics/winners-report`);
        if (response.ok) {
          const data = await response.json();
          // Transform string dates to Date objects
          const transformed = data.map((w: any) => ({
            ...w,
            drawnAt: new Date(w.drawnAt)
          }));
          setWinners(transformed);
          setFilteredWinners(transformed);
        }
      } catch (error) {
        console.error("Failed to fetch winners analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWinners();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase().trim();
    if (!term) {
      setFilteredWinners(winners);
      return;
    }

    const filtered = winners.filter(w => 
      w.ticketNumber.toLowerCase().includes(term) ||
      w.userName.toLowerCase().includes(term) ||
      w.userEmail.toLowerCase().includes(term) ||
      w.campaignName.toLowerCase().includes(term) ||
      w.prizeName.toLowerCase().includes(term)
    );
    setFilteredWinners(filtered);
  }, [search, winners]);

  const handleExport = () => {
    exportWinnersPDF(filteredWinners, "All Time");
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
        <div>
          <h1 className="text-2xl font-bold">Lucky Draw Winner Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Total Winners: {winners.length}</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <IconDownload size={18} /> Export to PDF
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm mb-6 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <IconSearch size={18} />
        </div>
        <input
          type="text"
          placeholder="Search winners, campaigns, tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
        />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket Number</TableHead>
              <TableHead>Winner Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Prize Won</TableHead>
              <TableHead>Drawn At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWinners.map((winner) => (
              <TableRow key={winner.id}>
                <TableCell className="font-mono font-bold text-sky-600">{winner.ticketNumber}</TableCell>
                <TableCell className="font-medium">{winner.userName}</TableCell>
                <TableCell>{winner.userEmail}</TableCell>
                <TableCell>{winner.userPhone}</TableCell>
                <TableCell>{winner.campaignName}</TableCell>
                <TableCell className="font-semibold text-purple-700">{winner.prizeName}</TableCell>
                <TableCell>{new Date(winner.drawnAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {filteredWinners.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No winners found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
