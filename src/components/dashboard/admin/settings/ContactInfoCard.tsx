'use client';

import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Card from '@/components/shared/Card';
import TextInput from '@/components/shared/Forms/TextInput';

type Props = {
    control: Control<any>;
};

export default function ContactInfoCard({ control }: Props) {
    return (
        <Card title='معلومات التواصل'>
            <div className="grid grid-cols-1 gap-3">
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="contact-email"
                            label="البريد الإلكتروني"
                            placeholder="example@domain.com"
                            name={field.name}
                            type="email"
                            value={field.value ?? ''}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="contact-phone"
                            label="رقم الهاتف"
                            placeholder="+966501234567"
                            name={field.name}
                            type="tel"
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            className='ltr-data'
                        />
                    )}
                />

                <Controller
                    name="twitter"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="contact-twitter"
                            label="تويتر (Twitter)"
                            placeholder="الرابط"
                            name={field.name}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange((e.target.value ?? '').replace(/^@+/, ''))}
                        />
                    )}
                />

                <Controller
                    name="instagram"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="contact-instagram"
                            label="انستجرام (Instagram)"
                            placeholder="الرابط"
                            name={field.name}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange((e.target.value ?? '').replace(/^@+/, ''))}
                        />
                    )}
                />

                <Controller
                    name="snapchat"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="contact-snapchat"
                            label="سناب شات (Snapchat)"
                            placeholder="الرابط"
                            name={field.name}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange((e.target.value ?? '').replace(/^@+/, ''))}
                        />
                    )}
                />

                <Controller
                    name="tiktok"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="contact-tiktok"
                            label="تيك توك (TikTok)"
                            placeholder="الرابط"
                            name={field.name}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange((e.target.value ?? '').replace(/^@+/, ''))}
                        />
                    )}
                />

                <Controller
                    name="youtube"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            id="contact-youtube"
                            label="يوتيوب (YouTube)"
                            placeholder="الرابط"
                            name={field.name}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                    )}
                />

            </div>
        </Card>
    );
}
