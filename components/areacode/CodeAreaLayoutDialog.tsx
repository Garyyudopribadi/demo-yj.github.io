"use client";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

interface CodeAreaLayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  codearea: string;
}

export default function CodeAreaLayoutDialog({ open, onOpenChange, codearea }: CodeAreaLayoutDialogProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!codearea) {
      setImageUrl("");
      return;
    }
    const fetchImage = async () => {
      const { data } = supabase.storage.from("layout").getPublicUrl(`${codearea}.png`);
      // Always bust cache
      const urlWithTs = data.publicUrl + `?t=${Date.now()}`;
      try {
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
  }, [codearea, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !codearea) return;
    setUploading(true);
    const filePath = `${codearea}.png`;
    await supabase.storage.from("layout").remove([filePath]);
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
      const { data } = supabase.storage.from("layout").getPublicUrl(filePath);
      setImageUrl(data.publicUrl + `?t=${Date.now()}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Code Area Layout - {codearea}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center min-h-[300px] gap-4">
          {codearea ? (
            imageUrl ? (
              <img src={imageUrl} alt={`Layout for ${codearea}`} className="max-w-full max-h-[400px] rounded shadow" />
            ) : (
              <div className="text-center text-muted-foreground">No layout image found for this code area.</div>
            )
          ) : (
            <div className="text-center text-muted-foreground">No code area selected.</div>
          )}
          {codearea && (
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
