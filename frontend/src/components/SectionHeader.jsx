export default function SectionHeader({ eyebrow, title, description, aside }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <span className="section-kicker">{eyebrow}</span> : null}
        <h1 className="display-title mt-4 text-4xl leading-[1.02] text-[var(--color-text)] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? <p className="body-lg mt-4 max-w-2xl">{description}</p> : null}
      </div>
      {aside ? <div className="lg:max-w-sm">{aside}</div> : null}
    </div>
  );
}
