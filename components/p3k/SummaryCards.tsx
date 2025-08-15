import React from "react";

interface SummaryCardsProps {
  total: number;
  certified: number;
  nonCertified: number;
}

export default function SummaryCards({ total, certified, nonCertified }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-muted rounded-lg p-4 flex flex-col items-center">
        <span className="text-xs text-muted-foreground">Total PIC</span>
        <span className="text-2xl font-bold">{total}</span>
      </div>
      <div className="bg-muted rounded-lg p-4 flex flex-col items-center">
        <span className="text-xs text-muted-foreground">Certified PIC</span>
        <span className="text-2xl font-bold">{certified}</span>
      </div>
      <div className="bg-muted rounded-lg p-4 flex flex-col items-center">
        <span className="text-xs text-muted-foreground">Non-Certified PIC</span>
        <span className="text-2xl font-bold">{nonCertified}</span>
      </div>
    </div>
  );
}
