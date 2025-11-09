type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-dark text-white">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20" />
      <div className="absolute -top-40 inset-x-0 h-[360px] opacity-20 pointer-events-none bg-[radial-gradient(60%_50%_at_50%_0%,#6b72ff_0%,rgba(107,114,255,0)_70%)]" />

      <div className="container relative z-[1] text-center py-[60px] px-3 lg:py-[120px]">
        <h1 className="h1 font-extrabold tracking-tight mb-3 lg:mb-4">{title}</h1>
        {description && (
          <p className="mx-auto max-w-[760px] text-neutral-200 leading-8">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
