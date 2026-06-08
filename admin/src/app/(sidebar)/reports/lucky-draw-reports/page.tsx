"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportDrawAnalyticsPDF, DrawCampaignSummary } from "@/components/admin/analytics/analytic-pdf";
import AdminLoader from "@/components/admin/AdminLoader";
import { IconDownload } from "@tabler/icons-react";

export default function LuckyDrawReportsPage() {
  const [campaigns, setCampaigns] = useState<DrawCampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCampaigns: 0, totalTickets: 0, uniqueParticipants: 0 });

  useEffect(() => {
    async function fetchDrawAnalytics() {
      try {
        const response = await fetch(`${API_URL}/analytics/draw-analytics`);
        if (response.ok) {
          const data = await response.json();
          // Transform string dates to Date objects
          const transformed = data.campaigns.map((c: any) => ({
            ...c,
            startDate: new Date(c.startDate),
            endDate: new Date(c.endDate)
          }));
          setCampaigns(transformed);
          setStats({
            totalCampaigns: data.totalCampaigns,
            totalTickets: data.totalTickets,
            uniqueParticipants: data.uniqueParticipants
          });
        }
      } catch (error) {
        console.error("Failed to fetch draw analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDrawAnalytics();
  }, []);

  const handleExport = () => {
    exportDrawAnalyticsPDF(campaigns, "All Time");
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
          <h1 className="text-2xl font-bold">Lucky Draw Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total Campaigns: {stats.totalCampaigns} | Total Tickets: {stats.totalTickets} | Participants: {stats.uniqueParticipants}
          </p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <IconDownload size={18} /> Export to PDF
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Prize</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Winners</TableHead>
              <TableHead>Total Tickets</TableHead>
              <TableHead>Participants</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>{campaign.prizeName}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      campaign.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {campaign.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(campaign.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{campaign.winnerCount}</TableCell>
                <TableCell>{campaign.totalTickets}</TableCell>
                <TableCell>{campaign.uniqueParticipants}</TableCell>
              </TableRow>
            ))}
            {campaigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No draw campaigns found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
