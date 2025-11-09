'use client';
import Card from '@/components/shared/Card';
import SelectInput from '@/components/shared/Forms/SelectInput';
import { Controller } from 'react-hook-form';

interface TargetSettingsProps {
    control: any;
    errors: any;
}

export default function TargetSettings({ control, errors }: TargetSettingsProps) {
    return (
        <Card title="إعدادات الهدف">
            <div className="space-y-4">
                <Controller
                    control={control}
                    name="targetChannel"
                    render={({ field }) => (
                        <SelectInput
                            label="قناة الهدف"
                            {...field}
                            options={[
                                { label: 'البريد الإلكتروني', value: 'email' },
                                { label: 'واتساب', value: 'whatsapp' },
                            ]}
                            error={errors.targetChannel?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="targetAudience"
                    render={({ field }) => (
                        <SelectInput
                            label="الجمهور المستهدف"
                            {...field}
                            options={[
                                { label: 'جميع المستخدمين', value: 'all_users' },
                                { label: 'الوسطاء', value: 'agents' },
                                { label: 'المسوقين', value: 'marketers' },
                                { label: 'العملاء', value: 'clients' },
                                { label: 'العملاء الجدد', value: 'new_clients' },
                            ]}
                            error={errors.targetAudience?.message}
                        />
                    )}
                />
            </div>
        </Card>
    );
}
