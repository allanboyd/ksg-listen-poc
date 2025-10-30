"use client";

import CampusMap from "@/components/CampusMap";
import { campuses as campusData } from "@/data/mockData";

export type MapCardProps = {
  title?: string;
  description?: string;
  selectedCampusId?: string;
  origin?: string | { lat: number; lng: number };
  height?: number;
};

export default function MapCard({ title = "Campuses Map", description, selectedCampusId, origin, height = 360 }: MapCardProps) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="p-4 border-b">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        {description && <div className="text-xs text-gray-600 mt-1">{description}</div>}
      </div>
      <div className="p-2">
        <CampusMap campuses={campusData} selectedCampusId={selectedCampusId} origin={origin as any} height={height} />
      </div>
    </div>
  );
}


