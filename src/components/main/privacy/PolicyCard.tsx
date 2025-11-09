

interface PolicyCardProps {
  title: string;
  items: string[];
}

export default function PolicyCard({ title, items }: PolicyCardProps) {


  return (
    <section className='  group col-span-12 md:col-span-6 xl:col-span-4 rounded-2xl border border-neutral-200 bg-white p-5 lg:p-7 transition-all hover:-translate-y-0.5 hover:shadow-xl focus-within:shadow-xl'>
      {/* Accent */}
      <span className='block h-1 w-16 rounded-full bg-gradient-to-l from-primary to-tertiary opacity-80 mb-4' />

      <h3 className='text-2xl font-bold text-neutral-900 mb-3'>
        {title}
      </h3>

      <ul role='list' className='flex flex-col gap-3 leading-7 text-neutral-700'>
        {items.map((item, idx) => (
          <li key={idx} role='listitem' className='flex items-start gap-3'>
            {/* Check icon (inline SVG to avoid extra deps) */}
            <svg aria-hidden viewBox='0 0 24 24' className='mt-1 h-5 w-5 shrink-0 text-primary' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M20 6L9 17l-5-5' />
            </svg>
            <span className='text-[15px]'>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
