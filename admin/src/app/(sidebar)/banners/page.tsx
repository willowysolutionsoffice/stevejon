"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, MoreVertical, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "@/lib/api-client";

const PAGE_SIZE = 5;
const MAX_ACTIVE = 3;

type Banner = {
  id: string;
  title: string | null;
  desktopImage: string;
  mobileImage: string;
  order: number;
  isActive: boolean;
};

const validateImageSize = (file: File): boolean => {
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image must be under 5 MB");
    return false;
  }
  return true;
};

// ─── Delete Dialog ─────────────────────────────────────────────────────────
function DeleteBannerDialog({ open, setOpen, banner, onDeleted }: {
  open: boolean; setOpen: (v: boolean) => void; banner: Banner; onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/banners/${banner.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Banner deleted successfully");
      onDeleted();
    } catch { toast.error("Failed to delete banner"); }
    finally { setLoading(false); setOpen(false); }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Banner</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <strong>{banner.title || "this banner"}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" disabled={loading} onClick={handleDelete}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Toggle Dialog ─────────────────────────────────────────────────────────
function ToggleActiveDialog({ open, setOpen, banner, activeCount, onToggled }: {
  open: boolean; setOpen: (v: boolean) => void;
  banner: Banner; activeCount: number; onToggled: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const nextState = !banner.isActive;

  // Block activation if already at max
  const isBlocked = nextState && activeCount >= MAX_ACTIVE;

  const handleToggle = async () => {
    if (isBlocked) {
      toast.error(`Maximum ${MAX_ACTIVE} banners can be active at a time. Hide one first.`);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("isActive", String(nextState));
      
      const res = await fetch(`${API_URL}/banners/${banner.id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error();
      toast.success(`Banner marked as ${nextState ? "Active" : "Hidden"}`);
      onToggled();
    } catch { toast.error("Failed to update banner"); }
    finally { setLoading(false); setOpen(false); }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{nextState ? "Activate Banner" : "Hide Banner"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isBlocked
              ? `You already have ${MAX_ACTIVE} active banners. Please hide one before activating another.`
              : nextState
                ? `This will make "${banner.title || "this banner"}" visible on the homepage.`
                : `This will hide "${banner.title || "this banner"}" from the homepage.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {!isBlocked && (
            <AlertDialogAction asChild>
              <Button variant={nextState ? "default" : "outline"} disabled={loading} onClick={handleToggle}>
                {loading ? "Updating..." : nextState ? "Yes, Activate" : "Yes, Hide"}
              </Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Edit Dialog ──────────────────────────────────────────────────────────
function EditBannerDialog({ open, setOpen, banner, onUpdated }: {
  open: boolean; setOpen: (v: boolean) => void; banner: Banner; onUpdated: () => void;
}) {
  const [title, setTitle] = useState(banner.title || "");
  const [desktopPreview, setDesktopPreview] = useState<string>(banner.desktopImage);
  const [mobilePreview, setMobilePreview] = useState<string>(banner.mobileImage);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const desktopRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, type: "desktop" | "mobile") => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!validateImageSize(f)) return;
    const preview = URL.createObjectURL(f);
    if (type === "desktop") { setDesktopFile(f); setDesktopPreview(preview); }
    else { setMobileFile(f); setMobilePreview(preview); }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      if (desktopFile) formData.append("desktopImage", desktopFile);
      if (mobileFile) formData.append("mobileImage", mobileFile);
      
      const res = await fetch(`${API_URL}/banners/${banner.id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error();
      toast.success("Banner updated successfully");
      onUpdated(); setOpen(false);
    } catch { toast.error("Failed to update banner"); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>Edit Banner</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Title (optional)</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Sale" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Desktop Image</label>
              <input ref={desktopRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, "desktop")} />
              <div onClick={() => desktopRef.current?.click()}
                className="relative border-2 border-dashed border-border rounded-lg cursor-pointer overflow-hidden hover:border-primary transition-colors"
                style={{ height: 100 }}>
                <Image src={desktopPreview} alt="Desktop" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Mobile Image</label>
              <input ref={mobileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, "mobile")} />
              <div onClick={() => mobileRef.current?.click()}
                className="relative border-2 border-dashed border-border rounded-lg cursor-pointer overflow-hidden hover:border-primary transition-colors"
                style={{ height: 100 }}>
                <Image src={mobilePreview} alt="Mobile" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Row Actions ──────────────────────────────────────────────────────────
function BannerActions({ banner, activeCount, onRefresh }: {
  banner: Banner; activeCount: number; onRefresh: () => void;
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openToggle, setOpenToggle] = useState(false);
  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setOpenEdit(true)}>Edit Banner</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setOpenToggle(true)}>
            {banner.isActive ? "Hide Banner" : "Activate Banner"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setOpenDelete(true)}>
            Delete Banner
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openEdit && (
        <EditBannerDialog open={openEdit} setOpen={setOpenEdit} banner={banner}
          onUpdated={() => { setOpenEdit(false); onRefresh(); }} />
      )}
      <ToggleActiveDialog open={openToggle} setOpen={setOpenToggle} banner={banner}
        activeCount={activeCount}
        onToggled={() => { setOpenToggle(false); onRefresh(); }} />
      <DeleteBannerDialog open={openDelete} setOpen={setOpenDelete} banner={banner}
        onDeleted={() => { setOpenDelete(false); onRefresh(); }} />
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [title, setTitle] = useState("");
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);

  const desktopRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(banners.length / PAGE_SIZE);
  const paginatedBanners = banners.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeCount = banners.filter((b) => b.isActive).length;

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/banners`);
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load banners"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, []);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [banners.length, totalPages, currentPage]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, type: "desktop" | "mobile") => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!validateImageSize(f)) return;
    const preview = URL.createObjectURL(f);
    if (type === "desktop") { setDesktopFile(f); setDesktopPreview(preview); }
    else { setMobileFile(f); setMobilePreview(preview); }
  };

  const handleAdd = async () => {
    if (!desktopFile || !mobileFile) { toast.error("Please select both desktop and mobile images"); return; }
    if (activeCount >= MAX_ACTIVE) {
      toast.error(`Maximum ${MAX_ACTIVE} banners can be active at a time. Hide one before adding more.`);
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desktopImage", desktopFile);
      formData.append("mobileImage", mobileFile);
      
      const res = await fetch(`${API_URL}/banners`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      toast.success("Banner added successfully");
      setTitle(""); setDesktopFile(null); setMobileFile(null);
      setDesktopPreview(null); setMobilePreview(null);
      fetchBanners();
    } catch { toast.error("Failed to add banner"); }
    finally { setUploading(false); }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const idx = banners.findIndex((b) => b.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === banners.length - 1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    
    try {
        const formData1 = new FormData();
        formData1.append("order", String(swapIdx));
        const formData2 = new FormData();
        formData2.append("order", String(idx));
        
        await Promise.all([
          fetch(`${API_URL}/banners/${banners[idx].id}`, { method: "PATCH", body: formData1 }),
          fetch(`${API_URL}/banners/${banners[swapIdx].id}`, { method: "PATCH", body: formData2 }),
        ]);
        fetchBanners();
    } catch {
        toast.error("Failed to reorder");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="container flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
              <p className="text-muted-foreground">Manage homepage banner slides</p>
            </div>
            {/* Active count indicator */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Active:</span>
              <span className={`font-semibold ${activeCount >= MAX_ACTIVE ? "text-destructive" : "text-foreground"}`}>
                {activeCount} / {MAX_ACTIVE}
              </span>
            </div>
          </div>

          {/* Add Banner */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Banner</CardTitle>
              <CardDescription>
                Upload desktop and mobile images for a new slide
                {activeCount >= MAX_ACTIVE && (
                  <span className="ml-2 text-destructive font-medium">
                    — Active limit reached. Hide a banner first.
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Title (optional)</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Sale" className="max-w-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Desktop Image <span className="text-muted-foreground font-normal">(1920×800)</span></label>
                  <input ref={desktopRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, "desktop")} />
                  <div onClick={() => desktopRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors overflow-hidden"
                    style={{ height: 140 }}>
                    {desktopPreview ? (
                      <div className="relative w-full h-full"><Image src={desktopPreview} alt="Desktop preview" fill className="object-cover" /></div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs">Click to upload desktop image</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Mobile Image <span className="text-muted-foreground font-normal">(750×1000)</span></label>
                  <input ref={mobileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, "mobile")} />
                  <div onClick={() => mobileRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors overflow-hidden"
                    style={{ height: 140 }}>
                    {mobilePreview ? (
                      <div className="relative w-full h-full"><Image src={mobilePreview} alt="Mobile preview" fill className="object-cover" /></div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs">Click to upload mobile image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={handleAdd} disabled={uploading || !desktopFile || !mobileFile || activeCount >= MAX_ACTIVE}>
                {uploading ? "Uploading..." : "Add Banner"}
              </Button>
            </CardContent>
          </Card>

          {/* Banners List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Banners</CardTitle>
                  <CardDescription className="mt-1">
                    {banners.length} banner{banners.length !== 1 ? "s" : ""} total
                    {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
                  </CardDescription>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8"
                      disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button key={page} variant={currentPage === page ? "default" : "outline"}
                        size="icon" className="h-8 w-8" onClick={() => setCurrentPage(page)}>
                        {page}
                      </Button>
                    ))}
                    <Button variant="outline" size="icon" className="h-8 w-8"
                      disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
                </div>
              ) : banners.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                  No banners yet. Add your first banner above.
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {paginatedBanners.map((banner, pageIdx) => {
                      const globalIdx = (currentPage - 1) * PAGE_SIZE + pageIdx;
                      return (
                        <div key={banner.id} className="flex items-center gap-3 border border-border rounded-lg p-3 bg-card">
                          <div className="relative rounded-md overflow-hidden flex-shrink-0 bg-muted border border-border" style={{ width: 110, height: 56 }}>
                            <Image src={banner.desktopImage} alt="Desktop" fill className="object-cover" />
                            <span className="absolute bottom-0 left-0 bg-black/50 text-white text-[9px] px-1">Desktop</span>
                          </div>
                          <div className="relative rounded-md overflow-hidden flex-shrink-0 bg-muted border border-border" style={{ width: 38, height: 56 }}>
                            <Image src={banner.mobileImage} alt="Mobile" fill className="object-cover" />
                            <span className="absolute bottom-0 left-0 bg-black/50 text-white text-[9px] px-0.5">Mob</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {banner.title || <span className="text-muted-foreground italic">No title</span>}
                            </p>
                            <p className="text-xs text-muted-foreground">Slide #{globalIdx + 1}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            banner.isActive
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {banner.isActive ? "Active" : "Hidden"}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <Button variant="ghost" size="icon" className="h-6 w-6"
                              disabled={globalIdx === 0} onClick={() => handleReorder(banner.id, "up")}>
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6"
                              disabled={globalIdx === banners.length - 1} onClick={() => handleReorder(banner.id, "down")}>
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                          <BannerActions banner={banner} activeCount={activeCount} onRefresh={fetchBanners} />
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, banners.length)} of {banners.length}
                      </p>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8"
                          disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button key={page} variant={currentPage === page ? "default" : "outline"}
                            size="icon" className="h-8 w-8" onClick={() => setCurrentPage(page)}>
                            {page}
                          </Button>
                        ))}
                        <Button variant="outline" size="icon" className="h-8 w-8"
                          disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
