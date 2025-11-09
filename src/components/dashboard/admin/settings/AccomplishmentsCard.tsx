import React from 'react';
import { Control, Controller } from 'react-hook-form';
import TextInput from '@/components/shared/Forms/TextInput';
import Card from '@/components/shared/Card';

type Props = {
    control: Control<any>;
};

export default function AccomplishmentsCard({ control }: Props) {
    return (
        <Card title='الإنجازات والإحصاءات'>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Controller
                    name="clients"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="ac-clients"
                            label="عدد العملاء"
                            placeholder="مثال: 1200"
                            name={field.name}
                            type="number"
                            value={field.value ?? ''}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name="experienceYears"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="ac-experience"
                            label="سنوات الخبرة"
                            placeholder="مثال: 10"
                            name={field.name}
                            type="number"
                            value={field.value ?? ''}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name="projects"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="ac-projects"
                            label="عدد المشاريع"
                            placeholder="مثال: 250"
                            name={field.name}
                            type="number"
                            value={field.value ?? ''}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>

        </Card>
    );
}
