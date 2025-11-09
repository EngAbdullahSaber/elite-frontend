export type PaymentStatus = 'paid' | 'unpaid';

export const paymentStatusMap: Record<PaymentStatus, string> = {
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
};

export const paymentStatusStyle: Record<PaymentStatus, string> = {
    paid: 'bg-emerald-100 text-emerald-700',
    unpaid: 'bg-rose-100 text-rose-700',
};



