import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import CodeAreaLayoutDialog from "./CodeAreaLayoutDialog";
import clsx from "clsx";

export interface CodeArea {
  id: number;
  code: string;
  codearea: string;
  factory: number;
  area: string;
  floor: number;
}

interface CodeAreaTableProps {
  codeAreas: CodeArea[];
  loading: boolean;
  error: string | null;
  onEdit: (codeArea: CodeArea) => void;
  onDelete: (id: number) => void;
}


export default function CodeAreaTable({ codeAreas, loading, error, onEdit, onDelete }: CodeAreaTableProps) {
  const [layoutDialogOpen, setLayoutDialogOpen] = useState(false);
  const [selectedCodeArea, setSelectedCodeArea] = useState<string>("");

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!codeAreas || codeAreas.length === 0) return <div>No code areas found.</div>;

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factory</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Code Area</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codeAreas.map((codeArea) => (
              <TableRow key={codeArea.id}>
                <TableCell>{codeArea.factory}</TableCell>
                <TableCell>{codeArea.area}</TableCell>
                <TableCell>{codeArea.codearea}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(codeArea)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedCodeArea(codeArea.codearea); setLayoutDialogOpen(true); }} title="View/Update Layout">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(codeArea.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden flex flex-col gap-4">
        {codeAreas.map((codeArea) => (
          <div key={codeArea.id} className="rounded-lg border bg-background p-4 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-base">{codeArea.codearea}</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(codeArea)} aria-label="Edit">
                  <Edit className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setSelectedCodeArea(codeArea.codearea); setLayoutDialogOpen(true); }} aria-label="View/Update Layout">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(codeArea.id)} aria-label="Delete">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div><span className="font-medium text-foreground">Factory:</span> {codeArea.factory}</div>
              <div><span className="font-medium text-foreground">Area:</span> {codeArea.area}</div>
            </div>
          </div>
        ))}
      </div>

      <CodeAreaLayoutDialog
        open={layoutDialogOpen}
        onOpenChange={(open) => {
          setLayoutDialogOpen(open);
          if (!open) setSelectedCodeArea("");
        }}
        codearea={selectedCodeArea}
      />
    </>
  );
}
