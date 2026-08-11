import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { APP_NAME } from '@/config/constants';
import { getArticleBySlug, getArticles } from '@/lib/db/articles';

import { SiteFooter } from '../../_components/site-footer';
import { SiteHeader } from '../../_components/site-header';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: `Article Not Found | ${APP_NAME}`,
    };
  }

  const imageUrl = article.image.startsWith('http')
    ? article.image
    : `https://dananghomesliving.vercel.app${article.image}`;

  return {
    title: `${article.title} — ${APP_NAME}`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://dananghomesliving.vercel.app/news/${article.slug}`,
      siteName: APP_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getArticles();
  const relatedArticles = allArticles.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main className="bg-paper min-h-screen pt-10 pb-6 lg:pt-16 lg:pb-8 animate-fade-in-up">
        <article className="container-page max-w-4xl">
          {/* Breadcrumbs & Category Header */}
          <div className="mb-6 flex items-center gap-2 text-[12px]">
            <Link href="/" className="text-muted hover:text-navy transition-colors">
              Home
            </Link>
            <span className="text-muted">/</span>
            <Link href="/news" className="text-muted hover:text-navy transition-colors">
              News
            </Link>
            <span className="text-muted">/</span>
            <span className="text-gold font-bold truncate max-w-[200px] sm:max-w-xs">{article.category}</span>
          </div>

          <div className="text-gold flex flex-wrap items-center gap-3 text-[10px] font-bold tracking-[0.15em] uppercase">
            <span className="bg-gold/10 text-gold px-3 py-1 border border-gold/20">{article.category}</span>
            <span className="text-muted">•</span>
            <span className="text-muted">{article.readingTime}</span>
            <span className="text-muted">•</span>
            <span className="text-muted">{article.date || 'August 2026'}</span>
          </div>

          {/* Article Title */}
          <h1 className="font-display text-navy mt-4 text-[32px] leading-[1.12] font-normal sm:text-[42px] lg:text-[50px]">
            {article.title}
          </h1>

          {/* Author Box */}
          {article.author && (
            <div className="border-line border-y my-8 flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                {article.author.avatar && (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 object-cover ring-1 ring-gold/30"
                  />
                )}
                <div>
                  <p className="text-navy text-[14px] font-bold">{article.author.name}</p>
                  <p className="text-muted text-[11px]">{article.author.role}</p>
                </div>
              </div>

              <Link
                href="/news"
                className="border-line text-navy hover:border-gold hover:text-gold hidden items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors sm:inline-flex"
              >
                ← Back to News
              </Link>
            </div>
          )}

          {/* Featured Image */}
          <div className="relative mb-10 h-[300px] overflow-hidden border border-line sm:h-[420px] lg:h-[500px]">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {/* Article Body Content */}
          <div className="prose prose-lg prose-slate max-w-none text-navy/90 leading-relaxed font-sans">
            <p className="font-display text-navy text-[20px] leading-relaxed italic border-l-2 border-gold pl-4 my-6 text-balance">
              {article.excerpt}
            </p>

            {article.content ? (
              <div className="space-y-6 text-[16px] leading-[1.7] text-navy/85">
                {article.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="font-display text-navy text-[26px] font-normal mt-8 mb-4 border-b border-line pb-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="font-display text-navy text-[30px] font-normal mt-10 mb-4 border-b border-line pb-2">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').map((item) => item.replace(/^[*-]\s*/, ''));
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 text-navy/80">
                        {items.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={index} className="text-[16px] leading-[1.75]">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-[16px] text-muted">Full article content is available for requested subscribers.</p>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="border-line border-t mt-12 pt-6">
              <span className="text-muted text-[11px] font-bold uppercase tracking-wider block mb-3">Topic Tags</span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="bg-paper border-line text-navy border px-3 py-1 text-[11px] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles Section */}
          <section className="border-line border-t mt-16 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-navy text-[28px] font-normal">Related News &amp; Insights</h3>
              <Link href="/news" className="text-gold hover:underline text-[12px] font-bold uppercase tracking-wider">
                View all news →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/news/${rel.slug}`}
                  className="border-line bg-paper hover:shadow-lift group flex flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-[180px] overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.imageAlt}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-gold text-[9px] font-bold tracking-widest uppercase">{rel.category}</span>
                    <h4 className="font-display text-navy group-hover:text-gold mt-2 text-[17px] leading-tight font-normal">
                      {rel.title}
                    </h4>
                    <span className="text-navy text-[11px] font-bold uppercase tracking-wider mt-auto pt-4">Read story →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
