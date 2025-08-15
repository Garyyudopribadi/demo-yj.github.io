
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { PicItem } from "@/hooks/usePicData";

interface PicTableProps {
  loading: boolean;
  data: PicItem[];
  onDetail?: (pic: PicItem) => void;
  onDelete?: (pic: PicItem) => void;
  onEdit?: (pic: PicItem) => void;
}

export default function PicTable({ loading, data, onDetail, onDelete, onEdit }: PicTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Certified Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>NIK</TableHead>
            <TableHead>Departement</TableHead>
            <TableHead>Factory</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>Loading...</TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No PIC data found.</TableCell>
            </TableRow>
          ) : (
            data.map((pic) => (
              <TableRow key={pic.id}>
                <TableCell>{pic.certified_status ? 'Certified' : 'Non-Certified'}</TableCell>
                <TableCell>{pic.name}</TableCell>
                <TableCell>{pic.nik}</TableCell>
                <TableCell>{pic.departement}</TableCell>
                <TableCell>{pic.factory}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => onDetail && onDetail(pic)}>Detail</Button>
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => onEdit && onEdit(pic)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" color="red" onClick={() => onDelete && onDelete(pic)}><Trash className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
