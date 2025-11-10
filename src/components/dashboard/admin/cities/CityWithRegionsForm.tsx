"use client";

import PrimaryButton from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import SoftActionButton from "@/components/shared/SoftActionButton";
import { City, Region } from "@/types/dashboard/city";
import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import {
  getRegionsByCity,
  createRegion,
  createCity,
  updateCity,
  updateRegion,
  deleteRegion,
  deleteCity,
} from "@/services/cities/cities";
import toast from "react-hot-toast";

type Props = {
  cities: City[];
  titleText: string;
  onSave?: (data: any) => void;
};

interface CityWithRegions extends City {
  regions: Region[];
  isEditing?: boolean;
  newRegionName?: string;
}

export default function CityWithRegionsForm({
  cities,
  titleText,
  onSave,
}: Props) {
  const [allCities, setAllCities] = useState<CityWithRegions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [deletingItem, setDeletingItem] = useState<{
    type: "city" | "region";
    id: number;
  } | null>(null);

  // Initialize cities with their regions
  useEffect(() => {
    const loadCitiesWithRegions = async () => {
      setIsLoading(true);
      try {
        const citiesWithRegions = await Promise.all(
          cities.map(async (city) => {
            try {
              const regionsResponse = await getRegionsByCity(city.id);
              return {
                ...city,
                regions: regionsResponse.records || [],
                isEditing: false,
                newRegionName: "",
              };
            } catch (error) {
              console.error(
                `Error loading regions for city ${city.id}:`,
                error
              );
              return {
                ...city,
                regions: [],
                isEditing: false,
                newRegionName: "",
              };
            }
          })
        );
        setAllCities(citiesWithRegions);
      } catch (error) {
        console.error("Error loading cities:", error);
        toast.error("فشل في تحميل البيانات", {
          duration: 5000,
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCitiesWithRegions();
  }, [cities]);

  // City Operations
  const handleAddCity = async () => {
    if (!newCityName.trim()) {
      toast.error("يرجى إدخال اسم المدينة", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newCityData = { name: newCityName.trim(), isActive: true };
      const createdCity = await createCity(newCityData);

      const newCity: CityWithRegions = {
        ...createdCity,
        regions: [],
        isEditing: false,
        newRegionName: "",
      };

      setAllCities((prev) => [...prev, newCity]);
      setNewCityName("");

      toast.success("تم إضافة المدينة بنجاح", {
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
      console.error("Error creating city:", error);
      toast.error("فشل في إنشاء المدينة", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCity = (city: CityWithRegions) => {
    setAllCities((prev) =>
      prev.map((c) => ({
        ...c,
        isEditing: c.id === city.id,
        newRegionName: c.id === city.id ? c.name : c.newRegionName,
      }))
    );
  };

  const handleUpdateCity = async (city: CityWithRegions) => {
    if (!city.newRegionName?.trim()) {
      toast.error("يرجى إدخال اسم المدينة", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateCity(city.id, { name: city.newRegionName.trim() });

      setAllCities((prev) =>
        prev.map((c) =>
          c.id === city.id
            ? { ...c, name: city.newRegionName!.trim(), isEditing: false }
            : c
        )
      );

      toast.success("تم تحديث المدينة بنجاح", {
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
      console.error("Error updating city:", error);
      toast.error("فشل في تحديث المدينة", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCity = async (cityId: number) => {
    setDeletingItem({ type: "city", id: cityId });
    try {
      await deleteCity(cityId);

      setAllCities((prev) => prev.filter((c) => c.id !== cityId));

      toast.success("تم حذف المدينة بنجاح", {
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
    } catch (error: any) {
      console.error("Error deleting city:", error);

      let errorMessage = "فشل في حذف المدينة";
      if (error.response?.status === 409) {
        errorMessage = "لا يمكن حذف المدينة لأنها تحتوي على مناطق مرتبطة بها";
      } else if (error.response?.status === 404) {
        errorMessage = "المدينة غير موجودة";
      }

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setDeletingItem(null);
    }
  };

  const cancelEditCity = (city: CityWithRegions) => {
    setAllCities((prev) =>
      prev.map((c) =>
        c.id === city.id ? { ...c, isEditing: false, newRegionName: "" } : c
      )
    );
  };

  // Region Operations
  const handleAddRegion = async (city: CityWithRegions) => {
    if (!city.newRegionName?.trim()) {
      toast.error("يرجى إدخال اسم المنطقة", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newRegionData = {
        name: city.newRegionName.trim(),
        cityId: city.id,
        isActive: true,
      };

      const createdRegion = await createRegion(newRegionData);
      const newRegion: Region = {
        id: createdRegion.id,
        name: createdRegion.name,
        isActive: createdRegion.isActive,
        createdAt: createdRegion.createdAt,
        updatedAt: createdRegion.updatedAt,
      };

      setAllCities((prev) =>
        prev.map((c) =>
          c.id === city.id
            ? {
                ...c,
                regions: [...c.regions, newRegion],
                newRegionName: "",
              }
            : c
        )
      );

      toast.success("تم إضافة المنطقة بنجاح", {
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
      console.error("Error creating region:", error);
      toast.error("فشل في إنشاء المنطقة", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRegion = (city: CityWithRegions, region: Region) => {
    setAllCities((prev) =>
      prev.map((c) =>
        c.id === city.id
          ? {
              ...c,
              regions: c.regions.map((r) =>
                r.id === region.id
                  ? { ...r, isEditing: true, tempName: r.name }
                  : r
              ),
            }
          : c
      )
    );
  };

  const handleUpdateRegion = async (
    city: CityWithRegions,
    region: Region & { tempName?: string }
  ) => {
    if (!region.tempName?.trim()) {
      toast.error("يرجى إدخال اسم المنطقة", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateRegion(region.id, { name: region.tempName.trim() });

      setAllCities((prev) =>
        prev.map((c) =>
          c.id === city.id
            ? {
                ...c,
                regions: c.regions.map((r) =>
                  r.id === region.id
                    ? { ...r, name: region.tempName!.trim(), isEditing: false }
                    : r
                ),
              }
            : c
        )
      );

      toast.success("تم تحديث المنطقة بنجاح", {
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
      console.error("Error updating region:", error);
      toast.error("فشل في تحديث المنطقة", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRegion = async (cityId: number, regionId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه المنطقة؟")) {
      return;
    }

    setDeletingItem({ type: "region", id: regionId });
    try {
      await deleteRegion(regionId);

      setAllCities((prev) =>
        prev.map((c) =>
          c.id === cityId
            ? {
                ...c,
                regions: c.regions.filter((r) => r.id !== regionId),
              }
            : c
        )
      );

      toast.success("تم حذف المنطقة بنجاح", {
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
    } catch (error: any) {
      console.error("Error deleting region:", error);

      let errorMessage = "فشل في حذف المنطقة";
      if (error.response?.status === 404) {
        errorMessage = "المنطقة غير موجودة";
      } else if (error.response?.status === 409) {
        errorMessage = "لا يمكن حذف المنطقة لأنها مرتبطة ببيانات أخرى";
      }

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setDeletingItem(null);
    }
  };

  const cancelEditRegion = (city: CityWithRegions, region: Region) => {
    setAllCities((prev) =>
      prev.map((c) =>
        c.id === city.id
          ? {
              ...c,
              regions: c.regions.map((r) =>
                r.id === region.id ? { ...r, isEditing: false } : r
              ),
            }
          : c
      )
    );
  };

  const handleSaveAll = () => {
    const payload = allCities.map((city) => ({
      cityId: city.id,
      cityName: city.name,
      regions: city.regions.map((region) => ({
        id: region.id,
        name: region.name,
      })),
    }));

    console.log("Saving all data:", payload);

    if (onSave) {
      onSave(payload);
    }

    toast.success("تم حفظ جميع البيانات بنجاح", {
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
  };

  // Check if item is currently being deleted
  const isDeleting = (type: "city" | "region", id: number) => {
    return deletingItem?.type === type && deletingItem?.id === id;
  };

  if (isLoading && allCities.length === 0) {
    return (
      <Card title={titleText}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-2">جاري التحميل...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={titleText}>
      <div className="space-y-6">
        {/* Add New City */}
        <div className="flex gap-2 items-center p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
            placeholder="أدخل اسم المدينة الجديدة"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            disabled={isLoading}
          />
          <button
            onClick={handleAddCity}
            disabled={!newCityName.trim() || isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <FaPlus /> إضافة مدينة
          </button>
        </div>

        {/* Cities List */}
        <div className="space-y-4">
          {allCities.map((city) => (
            <div key={city.id} className="border border-gray-200 rounded-lg">
              {/* City Header */}
              <div className="bg-gray-50 p-4 rounded-t-lg flex justify-between items-center">
                {city.isEditing ? (
                  <div className="flex gap-2 items-center flex-1">
                    <input
                      type="text"
                      value={city.newRegionName || city.name}
                      onChange={(e) =>
                        setAllCities((prev) =>
                          prev.map((c) =>
                            c.id === city.id
                              ? { ...c, newRegionName: e.target.value }
                              : c
                          )
                        )
                      }
                      className="flex-1 p-2 border border-gray-300 rounded-lg"
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => handleUpdateCity(city)}
                      disabled={isLoading}
                      className="bg-blue-500 text-white p-2 rounded-lg"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => cancelEditCity(city)}
                      disabled={isLoading}
                      className="bg-gray-500 text-white p-2 rounded-lg"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{city.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCity(city)}
                        disabled={isLoading || isDeleting("city", city.id)}
                        className="text-blue-500 hover:text-blue-700 p-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCity(city.id)}
                        disabled={isLoading || isDeleting("city", city.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        {isDeleting("city", city.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Regions List */}
              <div className="p-4">
                {/* Add New Region */}
                <div className="flex gap-2 items-center mb-4">
                  <input
                    type="text"
                    value={city.newRegionName || ""}
                    onChange={(e) =>
                      setAllCities((prev) =>
                        prev.map((c) =>
                          c.id === city.id
                            ? { ...c, newRegionName: e.target.value }
                            : c
                        )
                      )
                    }
                    placeholder="أدخل اسم المنطقة الجديدة"
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleAddRegion(city)}
                    disabled={!city.newRegionName?.trim() || isLoading}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
                  >
                    <FaPlus /> إضافة
                  </button>
                </div>

                {/* Regions List */}
                <div className="space-y-2">
                  {city.regions.map((region) => (
                    <div
                      key={region.id}
                      className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      {(region as any).isEditing ? (
                        <div className="flex gap-2 items-center flex-1">
                          <input
                            type="text"
                            value={(region as any).tempName || region.name}
                            onChange={(e) =>
                              setAllCities((prev) =>
                                prev.map((c) =>
                                  c.id === city.id
                                    ? {
                                        ...c,
                                        regions: c.regions.map((r) =>
                                          r.id === region.id
                                            ? { ...r, tempName: e.target.value }
                                            : r
                                        ),
                                      }
                                    : c
                                )
                              )
                            }
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                            disabled={isLoading}
                          />
                          <button
                            onClick={() => handleUpdateRegion(city, region)}
                            disabled={isLoading}
                            className="bg-blue-500 text-white p-2 rounded-lg"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={() => cancelEditRegion(city, region)}
                            disabled={isLoading}
                            className="bg-gray-500 text-white p-2 rounded-lg"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium">{region.name}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditRegion(city, region)}
                              disabled={
                                isLoading || isDeleting("region", region.id)
                              }
                              className="text-blue-500 hover:text-blue-700 p-1"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteRegion(city.id, region.id)
                              }
                              disabled={
                                isLoading || isDeleting("region", region.id)
                              }
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              {isDeleting("region", region.id) ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {city.regions.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      لا توجد مناطق لهذه المدينة
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {allCities.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            لا توجد مدن مضافة حتى الآن
          </div>
        )}

        {/* Save All Button */}
        <div className="flex justify-end pt-4">
          <PrimaryButton
            onClick={handleSaveAll}
            disabled={isLoading || deletingItem !== null}
          >
            حفظ الكل
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
}
