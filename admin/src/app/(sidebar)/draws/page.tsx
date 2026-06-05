"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Trophy,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Search,
  Image as ImageIcon,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/lib/api-client";
import Image from "next/image";

interface DrawCampaign {
  id: string;
  name: string;
  prizeName: string;
  prizeImage: string;
  startDate: string;
  endDate: string;
  winnerCount: number;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  createdAt: string;
}

export default function DrawsPage() {
  const [campaigns, setCampaigns] = useState<DrawCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Editing state
  const [editingCampaign, setEditingCampaign] = useState<DrawCampaign | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [prizeName, setPrizeName] = useState("");
  const [prizeImageFile, setPrizeImageFile] = useState<File | null>(null);
  const [winnerCount, setWinnerCount] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE" | "COMPLETED">("DRAFT");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Tickets Dialog state
  const [ticketsCampaign, setTicketsCampaign] = useState<DrawCampaign | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [isTicketsDialogOpen, setIsTicketsDialogOpen] = useState(false);

  const openTicketsDialog = async (campaign: DrawCampaign) => {
    setTicketsCampaign(campaign);
    setIsTicketsDialogOpen(true);
    setLoadingTickets(true);
    try {
      const response = await fetch(`${API_URL}/draws/${campaign.id}/tickets`);
      const res = await response.json();
      if (response.ok && res.success) {
        setTickets(res.data);
      } else {
        toast.error(res.error || "Failed to load tickets");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading tickets");
    } finally {
      setLoadingTickets(false);
    }
  };


  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/draws`);
      const res = await response.json();
      if (response.ok && res.success) {
        setCampaigns(res.data);
      } else {
        toast.error(res.error || "Failed to load draw campaigns");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading draw campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const resetForm = () => {
    setName("");
    setPrizeName("");
    setPrizeImageFile(null);
    setWinnerCount("1");
    setStartDate("");
    setEndDate("");
    setStatus("DRAFT");
    setPreviewUrl(null);
    setEditingCampaign(null);
  };

  const openEditDialog = (campaign: DrawCampaign) => {
    setEditingCampaign(campaign);
    setName(campaign.name);
    setPrizeName(campaign.prizeName);
    setWinnerCount(campaign.winnerCount.toString());
    
    // Format dates to fit local datetime picker input values (YYYY-MM-DDTHH:MM)
    const start = new Date(campaign.startDate);
    const startFormatted = new Date(start.getTime() - start.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    
    const end = new Date(campaign.endDate);
    const endFormatted = new Date(end.getTime() - end.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setStartDate(startFormatted);
    setEndDate(endFormatted);
    setStatus(campaign.status);
    setPreviewUrl(campaign.prizeImage);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prizeName.trim() || !startDate || !endDate || !winnerCount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!editingCampaign && !prizeImageFile) {
      toast.error("Please upload a prize image");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("prizeName", prizeName.trim());
      formData.append("startDate", new Date(startDate).toISOString());
      formData.append("endDate", new Date(endDate).toISOString());
      formData.append("winnerCount", winnerCount);
      formData.append("status", status);
      
      if (prizeImageFile) {
        formData.append("prizeImage", prizeImageFile);
      }

      const url = editingCampaign 
        ? `${API_URL}/draws/${editingCampaign.id}`
        : `${API_URL}/draws`;
      
      const method = editingCampaign ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const res = await response.json();
      if (response.ok && res.success) {
        toast.success(
          editingCampaign 
            ? `Draw Campaign updated successfully` 
            : `Draw Campaign created successfully`
        );
        setIsDialogOpen(false);
        resetForm();
        fetchCampaigns();
      } else {
        toast.error(res.error || "Failed to save campaign");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving draw campaign");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCampaign = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete campaign "${name}"?`)) return;

    try {
      const response = await fetch(`${API_URL}/draws/${id}`, {
        method: "DELETE",
      });
      const res = await response.json();
      if (response.ok && res.success) {
        toast.success(`Campaign "${name}" deleted`);
        setCampaigns(prev => prev.filter(c => c.id !== id));
      } else {
        toast.error(res.error || "Failed to delete campaign");
      }
    } catch (error) {
      toast.error("Error deleting campaign");
    }
  };

  const getValidityString = (campaign: DrawCampaign) => {
    const start = new Date(campaign.startDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const end = new Date(campaign.endDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${start} - ${end}`;
  };

  const getStatusBadge = (status: DrawCampaign["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none transition-colors">
            Active
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white border-none transition-colors">
            Completed
          </Badge>
        );
      case "DRAFT":
      default:
        return (
          <Badge className="bg-gray-400 text-white hover:bg-gray-500 border-none transition-colors">
            Draft
          </Badge>
        );
    }
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.prizeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Draw Campaigns
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage draw promotions, active rewards, and campaign entries.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all shadow-md shadow-indigo-100 dark:shadow-none">
              <Plus className="h-4 w-4" />
              Create Draw Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleFormSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                  <Trophy className="h-5 w-5 text-amber-500 animate-bounce" />
                  {editingCampaign ? "Edit Draw Campaign" : "New Draw Campaign"}
                </DialogTitle>
                <DialogDescription>
                  Configure details for your promotional draw event. Fill in specifications below.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Draw Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Draw Campaign Name *
                  </label>
                  <Input
                    placeholder="e.g. Eid Mega Lucky Draw"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="focus-visible:ring-indigo-500"
                  />
                </div>

                {/* Prize Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Prize Name *
                  </label>
                  <Input
                    placeholder="e.g. iPhone 16 Pro Max"
                    value={prizeName}
                    onChange={(e) => setPrizeName(e.target.value)}
                    required
                    className="focus-visible:ring-indigo-500"
                  />
                </div>

                {/* Prize Image File Upload */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Prize Image *
                  </label>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPrizeImageFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      required={!editingCampaign}
                      className="cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {previewUrl && (
                      <div className="relative h-32 w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-2 mt-1 overflow-hidden group">
                        <Image
                          src={previewUrl}
                          alt="Prize Preview"
                          fill
                          sizes="(max-width: 500px) 100vw, 500px"
                          className="object-contain transition-transform group-hover:scale-105 duration-300"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Start Date *
                    </label>
                    <Input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      End Date *
                    </label>
                    <Input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Winner Count & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Winner Count *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={winnerCount}
                      onChange={(e) => setWinnerCount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Campaign Status
                    </label>
                    <Select
                      value={status}
                      onValueChange={(val: typeof status) => setStatus(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4 gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={submitting} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
                >
                  {submitting ? "Processing..." : editingCampaign ? "Save Changes" : "Create Campaign"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Table Card */}
      <Card className="border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 dark:bg-zinc-950/20 border-b border-gray-100 dark:border-zinc-800 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Gift className="h-5 w-5 text-indigo-500" />
                Campaign Listing
              </CardTitle>
              <CardDescription>
                Overview of current, completed, and scheduled lucky draw campaigns.
              </CardDescription>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns or prizes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
              <span className="text-sm font-medium">Loading draw campaigns...</span>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-t border-gray-100 dark:border-zinc-800 text-muted-foreground gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-gray-300" />
              </div>
              <div className="text-center">
                <span className="block font-semibold text-foreground text-sm">No campaigns found</span>
                <span className="text-xs">Create your first draw campaign to see it listed here.</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/30 dark:bg-zinc-950/10">
                  <TableRow>
                    <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider">Draw Name</TableHead>
                    <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider">Prize Detail</TableHead>
                    <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider">Validity Period</TableHead>
                    <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider text-center">Winners</TableHead>
                    <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider">Status</TableHead>
                    <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="hover:bg-gray-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                      <TableCell className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                        {campaign.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex-shrink-0 overflow-hidden">
                            <Image
                              src={campaign.prizeImage}
                              alt={campaign.prizeName}
                              fill
                              sizes="40px"
                              className="object-contain"
                            />
                          </div>
                          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                            {campaign.prizeName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {getValidityString(campaign)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-center text-indigo-600 dark:text-indigo-400">
                        {campaign.winnerCount}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(campaign.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                            onClick={() => openTicketsDialog(campaign)}
                            title="View Tickets"
                          >
                            <Ticket className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                            onClick={() => openEditDialog(campaign)}
                            title="Edit Campaign"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                            title="Delete Campaign"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tickets List Dialog */}
      <Dialog open={isTicketsDialogOpen} onOpenChange={setIsTicketsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col p-6">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Ticket className="h-5 w-5 text-indigo-500" />
              Tickets for {ticketsCampaign?.name}
            </DialogTitle>
            <DialogDescription>
              Displaying all generated lucky draw tickets for this campaign.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {loadingTickets ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
                <span className="text-sm font-medium">Loading tickets...</span>
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-gray-300" />
                </div>
                <div>
                  <span className="block font-semibold text-foreground text-sm">No tickets generated yet</span>
                  <span className="text-xs">Tickets will automatically be generated for orders placed during this campaign.</span>
                </div>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50/50 dark:bg-zinc-950/20">
                    <TableRow>
                      <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider">Ticket No.</TableHead>
                      <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider">Customer</TableHead>
                      <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider">Order ID</TableHead>
                      <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider">Status</TableHead>
                      <TableHead className="font-semibold text-xs uppercase text-gray-500 tracking-wider">Generated At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((t) => {
                      const isInvalid = t.order?.status === 'CANCELLED' || t.order?.status === 'FAILED';
                      return (
                        <TableRow key={t.id} className={`hover:bg-gray-50/20 transition-colors ${isInvalid ? 'opacity-60 bg-red-50/10' : ''}`}>
                          <TableCell className="font-mono text-xs font-bold text-gray-900 dark:text-gray-100">
                            {t.ticketNumber}
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="font-semibold text-gray-700 dark:text-gray-300">
                              {t.user?.name || "Unknown"}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {t.user?.email || ""}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-[11px] text-gray-600 dark:text-gray-400">
                            {t.orderId}
                          </TableCell>
                          <TableCell>
                            {isInvalid ? (
                              <Badge className="bg-red-500 hover:bg-red-600 text-white border-none py-0.5 px-1.5 text-[9px]">
                                Invalid
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none py-0.5 px-1.5 text-[9px]">
                                Valid
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-[11px] text-gray-500">
                            {new Date(t.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t flex justify-end">
            <Button onClick={() => setIsTicketsDialogOpen(false)} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

