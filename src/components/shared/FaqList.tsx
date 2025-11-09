'use client'

import { useState } from "react";
import FaqCard from "./FaqCard";



type faq = {
    question: string,
    answer: string
}
type FaqListProps = {
    faqs: faq[]
}

export default function FaqList({ faqs }: FaqListProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="w-full flex flex-col gap-4 lg:gap-6 mx-auto px-3 xl:px-0">
            {faqs.map((faq, index) => (
                <FaqCard
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                    }
                />
            ))}
        </div>
    )
}