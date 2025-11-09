'use client'
import Card from '@/components/shared/Card'
import Image from 'next/image'
import { Campaign } from '@/types/campaign'

interface CampaignImagesCardProps {
    campaign: Campaign
}

export default function CampaignImagesCard({ campaign }: CampaignImagesCardProps) {
    if (!campaign.campaignImages || campaign.campaignImages.length === 0) {
        return (
            <Card title="صور الحملة">
                <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm">لا توجد صور للحملة</p>
                </div>
            </Card>
        )
    }

    return (
        <Card title="صور الحملة">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaign.campaignImages.map((image, index) => (
                    <div key={index} className="relative group">
                        <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-200">
                            <Image
                                src={image.url}
                                alt={`صورة الحملة ${index + 1}`}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />

                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            صورة {index + 1}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    )
}
