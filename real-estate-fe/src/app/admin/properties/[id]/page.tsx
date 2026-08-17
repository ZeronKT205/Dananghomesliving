import { ActivityLog } from './_components/activity-log';
import { AmenitiesSelector } from './_components/amenities-selector';
import { BasicInfo } from './_components/basic-info';
import { DescriptionEditor } from './_components/description-editor';
import { LocationEditor } from './_components/location-editor';
import { MediaManager } from './_components/media-manager';
import { PageHeader } from './_components/page-header';
import { PublicPreview } from './_components/public-preview';
import { PublishingSettings } from './_components/publishing-settings';
import { SeoSettings } from './_components/seo-settings';
import { SimilarProperties } from './_components/similar-properties';
import { Specifications } from './_components/specifications';

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === 'new';

  return (
    <div className="min-h-[calc(100vh-76px)]">
      {/* Sticky Top Header for this specific page */}
      <PageHeader isNew={isNew} />

      <div className="p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Main 70/30 Split Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-8">
            
            {/* Left Column: Main Editing (70%) */}
            <div className="space-y-8 min-w-0">
              <BasicInfo isNew={isNew} />
              <Specifications isNew={isNew} />
              <MediaManager isNew={isNew} />
              <DescriptionEditor isNew={isNew} />
              <AmenitiesSelector isNew={isNew} />
              <LocationEditor isNew={isNew} />
              {!isNew && <SimilarProperties isNew={isNew} />}
              {!isNew && <ActivityLog isNew={isNew} />}
            </div>

            {/* Right Column: Settings & Publishing (30%) */}
            <div className="space-y-8">
              <PublishingSettings isNew={isNew} />
              {!isNew && <PublicPreview isNew={isNew} />}
              <SeoSettings isNew={isNew} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
