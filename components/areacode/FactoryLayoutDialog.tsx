"use client";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

interface FactoryLayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factoryFilter: string;
}

const FACTORY_LAYOUT_MAP: Record<string, string> = {
  "1": "factory1-layout.png",
  "2": "factory2-layout.png",
  "3": "factory3-layout.png",
};

export default function FactoryLayoutDialog({ open, onOpenChange, factoryFilter }: FactoryLayoutDialogProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch image from Supabase Storage
  useEffect(() => {
    if (!factoryFilter || !FACTORY_LAYOUT_MAP[factoryFilter]) {
      setImageUrl("");
      return;
    }
    const fetchImage = async () => {
      const { data } = supabase.storage.from("layout").getPublicUrl(FACTORY_LAYOUT_MAP[factoryFilter]);
      // Check if the file actually exists by trying to fetch its HEAD
      try {
        // Always append a timestamp to bust browser cache
        const urlWithTs = data.publicUrl + `?t=${Date.now()}`;
        const res = await fetch(urlWithTs, { method: "HEAD" });
        if (res.ok) {
          setImageUrl(urlWithTs);
        } else {
          setImageUrl("");
        }
      } catch {
        setImageUrl("");
      }
    };
    fetchImage();
  }, [factoryFilter, open]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle upload (replace if exists)
  const handleUpload = async () => {
    if (!selectedFile || !factoryFilter || !FACTORY_LAYOUT_MAP[factoryFilter]) return;
    setUploading(true);
    const filePath = FACTORY_LAYOUT_MAP[factoryFilter];
    // Remove existing file first (optional, but ensures replacement)
    await supabase.storage.from("layout").remove([filePath]);
    // Upload new file (upsert: true will also replace if exists)
    const { error } = await supabase.storage.from("layout").upload(filePath, selectedFile, {
      upsert: true,
      cacheControl: "3600",
      contentType: selectedFile.type,
    });
    setUploading(false);
    if (error) {
      toast({ title: "Error", description: "Failed to upload image.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Layout image updated." });
      setSelectedFile(null);
      // Refresh image
      const { data } = supabase.storage.from("layout").getPublicUrl(filePath);
      setImageUrl(data.publicUrl + `?t=${Date.now()}`); // bust cache
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Factory Layout - {factoryFilter === "1" ? "Factory 1" : factoryFilter === "2" ? "Factory 2" : factoryFilter === "3" ? "Factory 3" : "Select Factory"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center min-h-[300px] gap-4">
          {factoryFilter && FACTORY_LAYOUT_MAP[factoryFilter] ? (
            imageUrl ? (
              <img src={imageUrl} alt={`Factory ${factoryFilter} Layout`} className="max-w-full max-h-[400px] rounded shadow" />
            ) : (
              <div className="text-center text-muted-foreground">No layout image found for this factory.</div>
            )
          ) : (
            <div className="text-center text-muted-foreground">Please select a factory to view its layout.</div>
          )}
          {factoryFilter && FACTORY_LAYOUT_MAP[factoryFilter] && (
            <div className="flex flex-col items-center gap-2 w-full">
              <input
                type="file"
                accept="image/*"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {selectedFile ? selectedFile.name : "Choose New Layout Image"}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Upload & Update Layout"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
