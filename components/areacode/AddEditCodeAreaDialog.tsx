import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CodeArea } from "./CodeAreaTable";


interface AddEditCodeAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  codeArea: any;
  formErrors: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (imageFile?: File | null) => void;
}

import { useRef, useState } from "react";

export default function AddEditCodeAreaDialog({
  open,
  onOpenChange,
  isEdit = false,
  codeArea,
  formErrors,
  onInputChange,
  onSelectChange,
  onSubmit,
}: AddEditCodeAreaDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedFile);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Code Area" : "Add New Code Area"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">Code</Label>
            <Input id="code" name="code" value={codeArea.code} onChange={onInputChange} className="col-span-3" />
            {formErrors.code && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.code}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="factory" className="text-right">Factory</Label>
            <Select onValueChange={value => onSelectChange('factory', value)} value={codeArea.factory?.toString() || ''}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Factory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">F1</SelectItem>
                <SelectItem value="2">F2</SelectItem>
                <SelectItem value="3">F3</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.factory && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.factory}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="area" className="text-right">Area</Label>
            <Input id="area" name="area" value={codeArea.area} onChange={onInputChange} className="col-span-3" />
            {formErrors.area && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.area}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="floor" className="text-right">Floor</Label>
            <Select onValueChange={value => onSelectChange('floor', value)} value={codeArea.floor?.toString() || ''}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.floor && <p className="col-span-4 text-right text-red-500 text-sm">{formErrors.floor}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codearea" className="text-right">Code Area</Label>
            <Input id="codearea" name="codearea" value={codeArea.code && codeArea.factory && codeArea.floor ? `F${codeArea.factory}-${codeArea.code}${codeArea.floor}` : ''} className="col-span-3" disabled />
          </div>
          {!isEdit && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="layout-image" className="text-right">Layout Image</Label>
              <input
                id="layout-image"
                type="file"
                accept="image/*"
                ref={inputRef}
                className="col-span-3"
                onChange={handleFileChange}
              />
              {selectedFile && <span className="col-span-4 text-right text-xs text-muted-foreground">{selectedFile.name}</span>}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{isEdit ? "Save Changes" : "Add Code Area"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
