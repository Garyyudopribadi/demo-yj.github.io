import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PicItem } from "@/hooks/usePicData";
import React from "react";

interface PicDetailModalProps {
  open: boolean;
  onClose: () => void;
  pic: PicItem | null;
}

export default function PicDetailModal({ open, onClose, pic }: PicDetailModalProps) {
  if (!pic) return null;
  // Helper to get public URL for bucket files
  const getPublicUrl = (path: string | undefined) =>
    path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/p3k/${path}` : null;

  // Fallback image handler
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder-user.jpg";
    e.currentTarget.alt = "Image not found";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg md:max-w-2xl mx-auto rounded-xl p-4 md:p-8 bg-background shadow-xl border border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-primary mb-2">PIC Detail</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div><span className="font-semibold">Name:</span> {pic.name}</div>
            <div><span className="font-semibold">NIK:</span> {pic.nik}</div>
            <div><span className="font-semibold">Departement:</span> {pic.departement}</div>
            <div><span className="font-semibold">Factory:</span> {pic.factory}</div>
            <div><span className="font-semibold">Phone:</span> {pic.phone}</div>
            <div><span className="font-semibold">Certified Status:</span> {pic.certified_status ? "Certified" : "Non-Certified"}</div>
            {pic.certified_status && (
              <>
                <div><span className="font-semibold">Certified Name:</span> {pic.certified_name}</div>
                <div><span className="font-semibold">Certified For:</span> {pic.certified_for}</div>
                <div><span className="font-semibold">Certified By:</span> {pic.certified_by}</div>
                <div><span className="font-semibold">Issued Date:</span> {pic.issued_date}</div>
                <div><span className="font-semibold">Expire Date:</span> {pic.expire_date}</div>
              </>
            )}
          </div>
          <div className="space-y-4">
            {pic.picture_pic ? (
              <div>
                <span className="font-semibold">Profile Picture:</span>
                <img src={getPublicUrl(pic.picture_pic) || ""} alt="Profile" className="mt-2 rounded-lg w-full max-w-[180px] h-auto object-cover border" onError={handleImgError} />
              </div>
            ) : (
              <div className="text-muted-foreground">No profile picture uploaded.</div>
            )}
            {pic.scan_certified ? (
              <div>
                <span className="font-semibold">Scan Certified (PDF):</span>
                <a href={getPublicUrl(pic.scan_certified) || "#"} target="_blank" rel="noopener" className="block mt-2 text-blue-600 underline">View PDF</a>
              </div>
            ) : (
              <div className="text-muted-foreground">No Scan Certified PDF uploaded.</div>
            )}
            {pic.scan_sio ? (
              <div>
                <span className="font-semibold">Scan SIO (PDF):</span>
                <a href={getPublicUrl(pic.scan_sio) || "#"} target="_blank" rel="noopener" className="block mt-2 text-blue-600 underline">View PDF</a>
              </div>
            ) : (
              <div className="text-muted-foreground">No Scan SIO PDF uploaded.</div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={onClose} className="w-full rounded-lg bg-primary text-white py-2 font-semibold hover:bg-primary/90 transition-colors">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
