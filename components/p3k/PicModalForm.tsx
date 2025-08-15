import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import React from "react";

interface PicModalFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: any;
  setForm: (form: any) => void;
  uploading: boolean;
  addError: string;
  handleAddPic: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function PicModalForm({ open, setOpen, form, setForm, uploading, addError, handleAddPic }: PicModalFormProps) {
  // Provide default form object if null/undefined
  const safeForm = form || {
    certified_status: true,
    certified_name: "",
    certified_for: "",
    name: "",
    departement: "",
    factory: "",
    nik: "",
    certified_by: "",
    issued_date: "",
    expire_date: "",
    scan_certified: null,
    scan_sio: null,
    certified_ori: false,
    sio_ori: false,
    buku: false,
    phone: "",
    picture_pic: null
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="w-full max-w-lg md:max-w-2xl mx-auto rounded-xl p-4 md:p-8 bg-background shadow-xl border border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-primary mb-2">Add PIC P3K</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddPic} className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Select value={safeForm.certified_status ? "true" : "false"} onValueChange={v => setForm((f: any) => ({ ...f, certified_status: v === "true" }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Certified Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Certified</SelectItem>
                  <SelectItem value="false">Non-Certified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {safeForm.certified_status ? (
              <>
                <Input placeholder="Certified Name" value={safeForm.certified_name ?? ""} onChange={e => setForm((f: any) => ({ ...f, certified_name: e.target.value }))} required className="rounded-lg border px-3 py-2" />
                <Input placeholder="Certified For" value={safeForm.certified_for ?? ""} onChange={e => setForm((f: any) => ({ ...f, certified_for: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <Input placeholder="Certified By" value={safeForm.certified_by ?? ""} onChange={e => setForm((f: any) => ({ ...f, certified_by: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <Input type="date" placeholder="Issued Date" value={safeForm.issued_date ?? ""} onChange={e => setForm((f: any) => ({ ...f, issued_date: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <Input type="date" placeholder="Expire Date" value={safeForm.expire_date ?? ""} onChange={e => setForm((f: any) => ({ ...f, expire_date: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <Input placeholder="Name" value={safeForm.name ?? ""} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <Input placeholder="NIK" value={safeForm.nik ?? ""} onChange={e => setForm((f: any) => ({ ...f, nik: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <Input placeholder="Departement" value={safeForm.departement ?? ""} onChange={e => setForm((f: any) => ({ ...f, departement: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <Input placeholder="Factory" value={safeForm.factory ?? ""} onChange={e => setForm((f: any) => ({ ...f, factory: e.target.value }))} className="rounded-lg border px-3 py-2" />
              </>
            ) : (
              <>
                <Input placeholder="Name" value={safeForm.name ?? ""} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} required className="rounded-lg border px-3 py-2" />
                <Input placeholder="NIK" value={safeForm.nik ?? ""} onChange={e => setForm((f: any) => ({ ...f, nik: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <Input placeholder="Departement" value={safeForm.departement ?? ""} onChange={e => setForm((f: any) => ({ ...f, departement: e.target.value }))} className="rounded-lg border px-3 py-2" />
                <Input placeholder="Factory" value={safeForm.factory ?? ""} onChange={e => setForm((f: any) => ({ ...f, factory: e.target.value }))} className="rounded-lg border px-3 py-2" />
              </>
            )}
            <div className="flex flex-col gap-2">
              <Label>Phone Number</Label>
              <Input type="text" placeholder="Phone Number" value={safeForm.phone ?? ""} onChange={e => setForm((f: any) => ({ ...f, phone: e.target.value }))} className="rounded-lg border px-3 py-2" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Profile Picture</Label>
              <Input type="file" accept="image/*" onChange={e => setForm((f: any) => ({ ...f, picture_pic: e.target.files?.[0] || null }))} className="rounded-lg border px-3 py-2" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Scan Certified (PDF)</Label>
              <Input type="file" accept="application/pdf" onChange={e => setForm((f: any) => ({ ...f, scan_certified: e.target.files?.[0] || null }))} className="rounded-lg border px-3 py-2" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Scan SIO (PDF)</Label>
              <Input type="file" accept="application/pdf" onChange={e => setForm((f: any) => ({ ...f, scan_sio: e.target.files?.[0] || null }))} className="rounded-lg border px-3 py-2" />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Switch checked={safeForm.certified_ori} onCheckedChange={v => setForm((f: any) => ({ ...f, certified_ori: v }))} />
                <Label>Certified Ori</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={safeForm.sio_ori} onCheckedChange={v => setForm((f: any) => ({ ...f, sio_ori: v }))} />
                <Label>SIO Ori</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={safeForm.buku} onCheckedChange={v => setForm((f: any) => ({ ...f, buku: v }))} />
                <Label>Buku</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading} className="w-full rounded-lg bg-primary text-white py-2 font-semibold hover:bg-primary/90 transition-colors">
              {uploading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
          {addError && (
            <div className="text-red-600 text-sm mt-2 text-center">{addError}</div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
