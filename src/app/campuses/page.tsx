"use client";

import { useMemo, useState } from "react";
import CampusMap from "@/components/CampusMap";
import { campuses as campusData } from "@/data/mockData";

export default function CampusesPage() {
  const campuses = useMemo(() => campusData, []);
  const [selectedCampusId, setSelectedCampusId] = useState<string>(campuses[0]?.id ?? "nairobi");
  const [originText, setOriginText] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Campuses Map</h1>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination campus</label>
            <select
              className="w-full rounded-md border-gray-300 focus:border-[#7F632C] focus:ring-[#7F632C]"
              value={selectedCampusId}
              onChange={(e) => setSelectedCampusId(e.target.value)}
            >
              {campuses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="mt-4 text-sm text-gray-600">
              <div className="font-semibold">Address</div>
              <div>{campuses.find(c => c.id === selectedCampusId)?.address || "—"}</div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your origin (address or place)</label>
            <input
              type="text"
              value={originText}
              onChange={(e) => setOriginText(e.target.value)}
              placeholder="e.g., Kenyatta Avenue, Nairobi or -1.28, 36.82"
              className="w-full rounded-md border-gray-300 focus:border-[#7F632C] focus:ring-[#7F632C]"
            />
            <p className="text-xs text-gray-500 mt-2">Tip: Leave blank to see campuses only. Add origin to draw a directions path.</p>
          </div>
        </div>

        <CampusMap
          campuses={campuses}
          selectedCampusId={selectedCampusId}
          origin={originText.trim() ? originText.trim() : undefined}
          height={520}
        />

        <div className="mt-4 text-sm text-gray-600">
          <p>
            Don’t see the map? Add <code className="px-1 py-0.5 bg-gray-100 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your environment and reload.
          </p>
          <p className="mt-1">
            For an external directions link, you can also use Google Maps directly.
          </p>
        </div>
      </div>
    </div>
  );
}




