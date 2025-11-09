'use client';

import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface PriceRangeSliderProps {
    value: [number, number];
    onChange: (val: [number, number]) => void;
}

export default function PriceRangeSlider({ value, onChange }: PriceRangeSliderProps) {
    return (
        <div className="pb-2 pt-4">
            <div className="range-slider relative">
                <Slider
                    range
                    min={100}
                    max={1000000}
                    value={value}
                    onChange={(val) => onChange(val as [number, number])}
                    styles={{
                        track: { backgroundColor: 'var(--primary)', height: 6 },
                        rail: { height: 6 },
                        handle: {
                            borderColor: 'var(--primary)',
                            backgroundColor: 'var(--primary)',
                            width: 18,
                            height: 18,
                            boxShadow: '0 0 0 4px rgba(46,48,190,0.15)',
                        },
                    }}
                    ariaLabelForHandle={['السعر الأدنى', 'السعر الأقصى']}
                />

                <div className="flex justify-center gap-4 py-5 text-[var(--neutral-700)] font-medium">
                    <span>${value[1]}</span>
                    <span>-</span>
                    <span>${value[0]}</span>
                </div>
            </div>
        </div>
    );
}
