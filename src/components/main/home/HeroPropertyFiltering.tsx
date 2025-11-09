'use client';

import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import Slider from 'rc-slider';
import SelectDropdown from '@/components/shared/Forms/SelectDropdown';
import PrimaryButton from '@/components/shared/Button';
import { PropertyType } from '@/types/property';

type TransactionType = 'للإيجار' | 'للبيع';
type CityType = 'jeddah' | 'riyadh' | 'dammam' | 'mecca' | 'medina';


export default function HeroPropertyFiltering() {
  const [transaction, setTransaction] = useState<TransactionType>('للإيجار');
  const [city, setCity] = useState<CityType>('jeddah');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [price, setPrice] = useState<number>(40);

  const searchHref = `/projects?deal=${encodeURIComponent(transaction)}&city=${encodeURIComponent(city)}&type=${encodeURIComponent(propertyType)}&price=${price}`;


  return (
    <div className='z-30 p-4 lg:p-5 rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm flex flex-wrap items-center gap-3 relative max-w-[1060px] mx-auto mt-10 border border-neutral-200'>

      <div className="w-full md:w-[48%] xl:w-[22%] cursor-pointer">
        <SelectDropdown
          options={[
            { label: 'جدة', value: 'jeddah' },
            { label: 'الرياض', value: 'riyadh' },
            { label: 'الدمام', value: 'dammam' },
            { label: 'مكة المكرمة', value: 'mecca' },
            { label: 'المدينة المنورة', value: 'medina' },
          ]}
          value={city}
          onChange={(val) => setCity(val as CityType)}
          label="المدينة"
        />
      </div>

      <div className="w-full md:w-[48%] xl:w-[22%] cursor-pointer">
        <SelectDropdown
          options={[
            { label: 'شقة', value: 'apartment' },
            { label: 'فيلا', value: 'villa' },
            { label: 'مكتب', value: 'office' },
          ]}
          value={propertyType}
          onChange={(val) => setPropertyType(val as PropertyType)}
          label="نوع العقار"
        />
      </div>



      {/* Price Slider */}
      <div className='w-full md:w-[48%] xl:w-[22%]'>
        <div className='relative flex items-center gap-2 py-[12px] px-4 bg-bg-1 border rounded-full focus-within:ring-2 focus-within:ring-primary/40'>
          <span className='flex items-center gap-1 text-neutral-700'>
            <AiOutlineSearch className='w-5 h-5' />
            <span className='text-sm'>السعر</span>
          </span>
          <span className='absolute top-[-14px] right-3 bg-white px-3 py-1 rounded-xl shadow-sm text-primary text-xs'>${price}k</span>
          <div className='flex-1 px-2'>
            <Slider
              min={0}
              max={100}
              value={price}
              onChange={val => setPrice(val as number)}
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
              ariaLabelForHandle='سعر أقصى'
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className='w-full xl:flex-1'>
        <PrimaryButton
          href={searchHref}
          className="py-[14px] px-6 w-full flex items-center gap-2 justify-center text-white bg-primary rounded-full hover:bg-[#212391] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="ابحث الآن"
        >
          <AiOutlineSearch className="w-5 h-5 shrink-0" />
          <span className="hidden sm:inline">ابحث الآن</span>
        </PrimaryButton>

      </div>
    </div>
  );
}
