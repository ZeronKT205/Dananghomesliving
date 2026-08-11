import Image from 'next/image';

import { TextLink } from '@/components/ui/button';
import { SectionHead, SectionKicker, SectionTitle } from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

export function JournalSection({ articles }: { articles: Article[] }) {
  return (
    <section id="news" className="bg-white py-20 lg:py-24">
      <div className="container-page">
        <SectionHead
          aside={
            <TextLink href="/news" className="text-navy hover:text-gold font-bold">
              View all news &amp; market notes →
            </TextLink>
          }
        >
          <SectionKicker>News &amp; Market Insights</SectionKicker>
          <SectionTitle>Local insight for better property decisions.</SectionTitle>
        </SectionHead>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          {articles.slice(0, 3).map((article, index) => (
            <article
              key={article.slug}
              className={cn(
                'border-line bg-paper hover:shadow-lift group flex flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1.5',
                index === 0 && 'md:col-span-2 lg:col-span-1',
              )}
            >
              <div
                className={cn('relative overflow-hidden', index === 0 ? 'h-[260px]' : 'h-[220px]')}
              >
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="text-gold flex justify-between gap-4 text-[9px] font-bold tracking-[0.13em] uppercase">
                  <span>{article.category}</span>
                  <span>{article.readingTime}</span>
                </div>
                <h3 className="font-display text-navy mt-3 text-[19px] leading-[1.12] font-normal text-balance">
                  {article.title}
                </h3>
                <p className="text-muted mt-3 mb-5 text-[13px] line-clamp-3">{article.excerpt}</p>
                <TextLink href={`/news/${article.slug}`} className="text-navy hover:text-gold mt-auto self-start font-bold">
                  Read article
                </TextLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
