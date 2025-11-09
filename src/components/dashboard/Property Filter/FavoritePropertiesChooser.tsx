"use client";

import { useState } from "react";
import { MdClose } from "react-icons/md";
import InfoCell from "@/components/shared/InfoCell";
import Popup from "@/components/shared/Popup";
import PropertyAssignmentToggle from "./PropertyAssignmentToggle";
import { projectTypeColors } from "@/constants/dashboard/admin/property.tsx/constants";
import { PropertyType, propertyTypeLabels } from "@/types/property";
import { getDefaultProjectpath } from "@/utils/appointment";

export type fevorateProperty = {
  id: string;
  title: string;
  imageLink: string;
  type: PropertyType;
};

type Props = {
  properties: fevorateProperty[];
  label?: string;
  max?: number;
  defaultValue?: fevorateProperty[]; // ✅ new
  onChange?: (properties: fevorateProperty[]) => void;
};

export default function FavoritePropertiesChooser({
  properties,
  label = "العقار",
  max = 5,
  defaultValue = [], // ✅ default empty array
  onChange,
}: Props) {
  const [selected, setSelected] = useState<fevorateProperty[]>(defaultValue);
  const [showPopup, setShowPopup] = useState(false);

  const handleAdd = (newProperty: fevorateProperty) => {
    if (selected.find((p) => p.id === newProperty.id)) {
      setShowPopup(false);
      return; // already chosen
    }
    if (selected.length >= max) {
      alert(`يمكنك اختيار ${max} عقارات كحد أقصى`);
      return;
    }
    const updated = [...selected, newProperty];
    setSelected(updated);
    onChange?.(updated);
    setShowPopup(false);
  };

  const handleRemove = (id: string) => {
    const updated = selected.filter((p) => p.id !== id);
    setSelected(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-3">
      {/* Render chosen properties */}
      <div className="flex flex-wrap gap-2">
        {selected.length === 0 ? (
          <p className="text-gray-500 text-sm">لا توجد عقارات مفضلة محددة</p>
        ) : (
          selected.map((property) => (
            <div
              key={property.id}
              className="relative flex items-center gap-2 border p-2 rounded-md bg-white"
            >
              <div className="flex gap-2">
                <InfoCell
                  title={property.title}
                  image={property.imageLink}
                  defaultImage={getDefaultProjectpath(property.type)}
                  href={`/projects/${property.id}`}
                  imageRounded="lg"
                  subtitleClass={projectTypeColors[property.type]}
                  subtitle={propertyTypeLabels[property.type]}
                />
                <button
                  onClick={() => handleRemove(property.id)}
                  type="button"
                  title="إزالة"
                  className="text-gray-500 hover:text-red-500 p-2 rounded-full"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add new property button */}
      {selected.length < max && (
        <button
          onClick={() => setShowPopup(true)}
          type="button"
          className="w-full py-3 px-4 border font-semibold rounded-md hover:bg-gray-100 transition"
        >
          {selected.length > 0 ? `إضافة ${label} آخر` : `إضافة ${label}`}
        </button>
      )}

      {/* Popup for choosing property */}
      <Popup show={showPopup} onClose={() => setShowPopup(false)}>
        <PropertyAssignmentToggle
          properties={properties}
          label={label}
          onConfirm={handleAdd}
          onCancel={() => setShowPopup(false)}
        />
      </Popup>
    </div>
  );
}
