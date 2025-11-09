"use client";
import { useState, useEffect } from "react";
import FavoritePropertiesChooser, {
  fevorateProperty,
} from "@/components/dashboard/Property Filter/FavoritePropertiesChooser";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import { toggleFavorite, getFavorites } from "@/services/favorites/favorites";
import { Property } from "@/types/property";
import toast from "react-hot-toast";

interface FavoritePropertiesFormProps {
  userId?: number; // Optional: if you want to manage favorites for a specific user
}

export default function FavoritePropertiesForm({
  userId,
}: FavoritePropertiesFormProps) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<
    fevorateProperty[]
  >([]);
  const [currentFavorites, setCurrentFavorites] = useState<number[]>([]);

  // Fetch user's current favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await getFavorites({
          limit: 50, // Get all favorites
          userId: userId, // If you want to get favorites for a specific user
        });

        // Extract property IDs from favorites
        const favoriteIds = response.records.map((fav: any) => fav.propertyId);
        setCurrentFavorites(favoriteIds);

        // Convert favorites to fevorateProperty format for the chooser
        const formattedFavorites: fevorateProperty[] = response.records.map(
          (fav: any) => ({
            id: fav.property.id.toString(),
            title:
              fav.property.title || fav.property.name || "Untitled Property",
            imageLink:
              fav.property.mainImage ||
              fav.property.images?.[0] ||
              "/images/default-property.jpg",
            type: fav.property.type || "apartment",
          })
        );

        setFavoriteProperties(formattedFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("فشل في تحميل العقارات المفضلة", {
          duration: 5000,
          position: "top-center",
          icon: "❌",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Determine which properties to add and which to remove
      const newSelectedIds = selectedProperties.map((p) => parseInt(p.id));

      // Properties to add (in new selection but not in current)
      const toAdd = newSelectedIds.filter(
        (id) => !currentFavorites.includes(id)
      );

      // Properties to remove (in current but not in new selection)
      const toRemove = currentFavorites.filter(
        (id) => !newSelectedIds.includes(id)
      );

      // Add new favorites
      const addPromises = toAdd.map((propertyId) =>
        toggleFavorite({
          propertyId,
          userId: userId, // Optional: if managing for specific user
          isFavorite: true,
        })
      );

      // Remove unfavorited properties
      const removePromises = toRemove.map((propertyId) =>
        toggleFavorite({
          propertyId,
          userId: userId, // Optional: if managing for specific user
          isFavorite: false,
        })
      );

      // Execute all operations
      await Promise.all([...addPromises, ...removePromises]);

      // Update current favorites
      setCurrentFavorites(newSelectedIds);

      toast.success("تم حفظ العقارات المفضلة بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } catch (error) {
      console.error("Error saving favorites:", error);
      toast.error("فشل في حفظ العقارات المفضلة", {
        duration: 5000,
        position: "top-center",
        icon: "❌",
        style: {
          background: "#EF4444",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original favorites
    setSelectedProperties(
      favoriteProperties.map(
        (fav) =>
          ({
            id: fav.id,
            title: fav.title,
            images: [fav.imageLink],
            type: fav.type,
            // Add other required properties from your Property type
          } as Property)
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="mr-2">جاري تحميل العقارات المفضلة...</span>
      </div>
    );
  }

  return (
    <div>
      <FavoritePropertiesChooser
        properties={selectedProperties}
        label="عقار"
        max={5}
        defaultValue={favoriteProperties}
        onChange={(properties) => {
          setSelectedProperties(properties);
        }}
      />

      <div className="col-span-12 flex items-center gap-6 flex-wrap mt-4">
        <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ العقارات المفضلة"}
        </PrimaryButton>
        <SoftActionButton onClick={handleCancel} disabled={saving}>
          إلغاء
        </SoftActionButton>
      </div>

      {/* Debug info - remove in production */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
        <p>العقارات المحددة: {selectedProperties.length} / 5</p>
        <p>المعرفات: {selectedProperties.map((p) => p.id).join(", ")}</p>
      </div>
    </div>
  );
}
