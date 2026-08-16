import { BasicInfo } from './_components/basic-info';
import { Specifications } from './_components/specifications';
import { MediaManager } from './_components/media-manager';
import { DescriptionEditor } from './_components/description-editor';
import { AmenitiesSelector } from './_components/amenities-selector';
import { LocationEditor } from './_components/location-editor';
import { PublicPreview } from './_components/public-preview';
import { SimilarProperties } from './_components/similar-properties';
import { SeoSettings } from './_components/seo-settings';
import { PublishingSettings } from './_components/publishing-settings';
import { ActivityLog } from './_components/activity-log';
import { PageHeader } from './_components/page-header';

export default function EditPropertyPage() {
  return (
    <div className="min-h-[calc(100vh-76px)]">
      {/* Sticky Top Header for this specific page */}
      <PageHeader />

      <div className="p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Main 70/30 Split Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-8">
            
            {/* Left Column: Main Editing (70%) */}
            <div className="space-y-8 min-w-0">
              <BasicInfo />
              <Specifications />
              <MediaManager />
              <DescriptionEditor />
              <AmenitiesSelector />
              <LocationEditor />
              <SimilarProperties />
              <ActivityLog />
            </div>

            {/* Right Column: Settings & Publishing (30%) */}
            <div className="space-y-8">
              <PublishingSettings />
              <PublicPreview />
              <SeoSettings />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
