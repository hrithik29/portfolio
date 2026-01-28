interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 sm:mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-neutral-400 mt-3 text-lg">{description}</p>
      )}
    </div>
  );
}
