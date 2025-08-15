"use client";
import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// Dynamically import the RichTextEditor
const RichTextEditor = dynamic(() => import("@/components/quill/RichTextEditor"), {
  ssr: false,
});

// Define the RichTextEditorHandle type
import type { RichTextEditorHandle } from "@/components/quill/RichTextEditor";

export default function RichTextModal({ onSubmit }: { onSubmit?: (content: string) => void }) {
  const editorRef = useRef<RichTextEditorHandle>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setEditorContent(content);
      if (onSubmit) onSubmit(content);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Add Text</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Rich Text</DialogTitle>
        </DialogHeader>
        <div className="my-4">
          <RichTextEditor ref={editorRef} />
        </div>
        <DialogFooter>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit
          </button>
          <DialogClose asChild>
            <button className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
