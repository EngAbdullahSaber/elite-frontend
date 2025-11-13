// components/dashboard/faq/FaqTabsForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Control,
  Controller,
  useForm,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import EditFAQSection from "./EditFAQSection";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import SidebarTabs from "@/components/shared/SidebarTabs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  FAQGroup,
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  createItem,
  deleteItem,
} from "@/services/faqs/faqs"; // Updated imports

export type FAQGroupForm = {
  id?: number;
  title: string;
  items: {
    id?: number;
    question: string;
    answer: string;
    groupId?: number;
  }[];
};

export type FaqFormValues = {
  faqGroups: FAQGroupForm[];
};

export default function FaqTabsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<FaqFormValues>({
    defaultValues: { faqGroups: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: control as unknown as Control<any>,
    name: "faqGroups",
  });

  const watchedGroups = useWatch({ control, name: "faqGroups" }) as
    | FAQGroupForm[]
    | undefined;
  const [activeIndex, setActiveIndex] = useState(0);

  // Load FAQ data from API
  useEffect(() => {
    const loadFAQData = async () => {
      try {
        setIsLoading(true);
        const groups = await getGroups(); // Using getGroups instead of getCompleteFAQ

        // Transform API data to form data
        const formData: FAQGroupForm[] = groups.map((group) => ({
          id: group.id,
          title: group.title,
          items:
            group.items?.map((item) => ({
              id: item.id,
              question: item.question,
              answer: item.answer,
              groupId: item.groupId,
            })) || [], // Handle case where items might be undefined
        }));

        reset({ faqGroups: formData });

        if (formData.length > 0) {
          setActiveIndex(0);
        }
      } catch (error) {
        console.error("Error loading FAQ data:", error);
        toast.error("فشل في تحميل بيانات الأسئلة الشائعة");
      } finally {
        setIsLoading(false);
      }
    };

    loadFAQData();
  }, [reset]);

  useEffect(() => {
    if (!watchedGroups || watchedGroups.length === 0) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex > watchedGroups.length - 1) {
      setActiveIndex(watchedGroups.length - 1);
    }
  }, [watchedGroups?.length, activeIndex]);

  const titles = useMemo(() => {
    const list =
      watchedGroups ??
      fields.map(
        (f) =>
          ({
            title: (f as any).title ?? "",
            id: (f as any).id,
          } as FAQGroupForm)
      );

    return list.map(
      (g, i) =>
        `${String(i + 1).padStart(2, "0")}. ${g.title || "مجموعة جديدة"}`
    );
  }, [watchedGroups, fields]);

  const onSubmit = async (values: FaqFormValues) => {
    setIsSubmitting(true);
    try {
      await saveFAQData(values.faqGroups);
      toast.success("تم حفظ التغييرات بنجاح");
      router.refresh();
    } catch (error) {
      console.error("Error saving FAQ data:", error);
      toast.error("فشل في حفظ التغييرات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveFAQData = async (groups: FAQGroupForm[]) => {
    const operations = [];

    for (const group of groups) {
      if (group.id) {
        // Update existing group
        const updatedGroup = await updateGroup(group.id, {
          title: group.title,
        });
 
        // Handle items for existing group
        for (const item of group.items) {
          if (item.id) {
            // For existing items, we only need to handle deletion (done in EditFAQSection)
            // Updates are handled separately if you add updateItem function
           } else {
            // Create new item for existing group
            const newItem = await createItem({
              groupId: group.id,
              question: item.question,
              answer: item.answer,
            });
           }
        }
      } else {
        // Create new group
        const newGroup = await createGroup({
          title: group.title,
        });
 
        // Create items for new group
        for (const item of group.items) {
          const newItem = await createItem({
            groupId: newGroup.id,
            question: item.question,
            answer: item.answer,
          });
         }
      }
    }
  };

  const handleRemoveGroup = async (index: number) => {
    const group = watchedGroups?.[index];
    const total = watchedGroups?.length ?? fields.length;

    if (total <= 1) {
      toast.error("يجب أن يكون هناك مجموعة واحدة على الأقل");
      return;
    }

    if (group?.id) {
      try {
        await deleteGroup(group.id); // Using deleteGroup instead of deleteFAQGroup
        toast.success("تم حذف المجموعة بنجاح");
      } catch (error) {
        console.error("Error deleting group:", error);
        toast.error("فشل في حذف المجموعة");
        return;
      }
    }

    // Update UI
    let nextActive = activeIndex;
    if (index < activeIndex) nextActive = activeIndex - 1;
    else if (index === activeIndex)
      nextActive = activeIndex > 0 ? activeIndex - 1 : 0;

    remove(index);

    const newTotal = total - 1;
    if (nextActive > newTotal - 1) nextActive = Math.max(0, newTotal - 1);
    setActiveIndex(nextActive);
  };

  const handleAddGroup = () => {
    const next = (watchedGroups?.length ?? fields.length) + 1;
    const padded = String(next).padStart(2, "0");
    append({
      title: `مجموعة جديدة (${padded})`,
      items: [],
    });
    setActiveIndex(watchedGroups?.length ?? fields.length);
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:!col-span-4">
          <Card>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded mb-2"></div>
              ))}
            </div>
          </Card>
        </div>
        <div className="col-span-12 xl:!col-span-8">
          <Card>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:!col-span-4">
        <aside className="sticky top-24">
          <Card>
            <SidebarTabs
              titles={titles}
              activeIndex={activeIndex}
              onSelect={(i) => setActiveIndex(i)}
              onRemove={handleRemoveGroup}
              canRemove={(i, total) => total > 1}
              getKey={(t, i) => `${t}-${i}-${watchedGroups?.[i]?.id || "new"}`}
            />
            <button
              type="button"
              onClick={handleAddGroup}
              className="mt-3 text-right focus:outline-none flex gap-2 items-center font-semibold py-3 px-5 rounded-full transition bg-white text-primary border border-primary hover:bg-primary hover:text-white w-full justify-center"
            >
              + إضافة مجموعة جديدة
            </button>
          </Card>
        </aside>
      </div>

      <div className="col-span-12 xl:!col-span-8">
        {watchedGroups && watchedGroups.length > 0 ? (
          <>
            <Card title="عنوان المجموعة" className="mb-4">
              <Controller
                control={control}
                name={`faqGroups.${activeIndex}.title`}
                render={({ field }) => (
                  <TextInput
                    id="faq-group-title"
                    label="العنوان"
                    placeholder="أدخل عنوان المجموعة"
                    {...field}
                  />
                )}
              />
            </Card>

            <Card title="الأسئلة">
              <EditFAQSection
                key={activeIndex}
                control={control as unknown as Control<any>}
                name={`faqGroups.${activeIndex}.items`}
                groupId={watchedGroups[activeIndex]?.id}
              />
            </Card>
          </>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500">لا توجد مجموعات أسئلة</p>
              <button
                type="button"
                onClick={handleAddGroup}
                className="mt-4 text-primary hover:text-primary-dark font-semibold"
              >
                إضافة مجموعة جديدة
              </button>
            </div>
          </Card>
        )}
      </div>

      <div className="col-span-12 flex items-center gap-6 flex-wrap mt-3">
        <PrimaryButton
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          حفظ التغييرات
        </PrimaryButton>
        <SoftActionButton
          onClick={handleCancel}
          type="button"
          disabled={isSubmitting}
        >
          إلغاء
        </SoftActionButton>
      </div>
    </form>
  );
}
