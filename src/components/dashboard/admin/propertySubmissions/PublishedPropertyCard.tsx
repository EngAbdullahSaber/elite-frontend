"use client";

import Card from "@/components/shared/Card";
import InfoCell from "@/components/shared/InfoCell";
import { projectTypeColors } from "@/constants/dashboard/admin/property.tsx/constants";
import { MiniProject, propertyTypeLabels } from "@/types/property";
import { getDefaultProjectpath } from "@/utils/appointment";

type Props = {
  publishedProperty: MiniProject;
};

export default function PublishedPropertyCard({ publishedProperty }: Props) {
  return (
    <Card title="العقار المنشور">
      <InfoCell
        image={publishedProperty.image}
        defaultImage={getDefaultProjectpath(publishedProperty.type)}
        title={publishedProperty.title}
        href={`/projects/${publishedProperty.id}`}
        subtitle={propertyTypeLabels[publishedProperty.type]}
        imageRounded="lg"
        subtitleClass={projectTypeColors[publishedProperty.type]}
      />
    </Card>
  );
}
