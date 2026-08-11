interface PropertyOverviewProps {
  description: string[];
  features: { icon: string; label: string }[];
}

export function PropertyOverview({ description, features }: PropertyOverviewProps) {
  return (
    <div className="space-y-8 pb-10 border-b border-line">
      {/* Description */}
      <div id="overview" className="space-y-4 text-[15px] text-ink leading-relaxed">
        <h2 className="text-[20px] font-display font-medium text-navy mb-4">Tổng quan</h2>
        {description.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
