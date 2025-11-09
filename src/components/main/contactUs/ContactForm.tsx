import PrimaryButton from '@/components/shared/Button';
import TextareaInput from '@/components/shared/Forms/TextareaInput';
import TextInput from '@/components/shared/Forms/TextInput';
import React from 'react';

export default function ContactForm() {
    return (
        <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8">
            <form>
                <h3 className="mb-0 h3">تواصل معنا الآن</h3>
                <div className="border border-dashed my-6"></div>
                <div className="grid grid-cols-12 gap-4">
                    <TextInput id="first-name" label="الاسم" placeholder="أدخل الاسم" name="name" />
                    <TextInput id="enter-email" label="البريد الإلكتروني" placeholder="أدخل البريد الإلكتروني" name="email" type="email" />
                    <TextareaInput id="review-review" label="الرسالة" name="message" placeholder="اكتب رسالتك" />
                    <div className="col-span-12">
                        <PrimaryButton
                            type="submit"
                            className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white hover:text-white font-semibold"
                        >
                            <span className="inline-block">إرسال الرسالة</span>
                        </PrimaryButton>

                    </div>
                </div>
            </form>
        </div>
    );
}
