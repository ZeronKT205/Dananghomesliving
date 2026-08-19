import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { SiteFooter } from '@/app/_components/site-footer';
import { SiteHeader } from '@/app/_components/site-header';
import { APP_NAME } from '@/config/constants';
import { DEFAULT_LOCALE, isLocale } from '@/config/locales';
import { Link } from '@/i18n/routing';
import { getArticleBySlug, getArticles } from '@/lib/db/articles';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, isLocale(locale) ? locale : DEFAULT_LOCALE);

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
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('News');
  const tp = await getTranslations('Property');

  const lang = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const article = await getArticleBySlug(slug, lang);

  if (!article) {
    notFound();
  }

  const allArticles = await getArticles(lang);
  const relatedArticles = allArticles.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main className="bg-paper animate-fade-in-up min-h-screen pt-10 pb-6 lg:pt-16 lg:pb-8">
        <article className="container-page max-w-4xl">
          {/* Breadcrumbs & Category Header */}
          <div className="mb-6 flex items-center gap-2 text-[12px]">
            <Link href="/" className="text-muted hover:text-navy transition-colors">
              {tp('breadcrumbHome')}
            </Link>
            <span className="text-muted">/</span>
            <Link href="/news" className="text-muted hover:text-navy transition-colors">
              News
            </Link>
            <span className="text-muted">/</span>
            <span className="text-gold max-w-[200px] truncate font-bold sm:max-w-xs">{article.category}</span>
          </div>

          <div className="text-gold flex flex-wrap items-center gap-3 text-[10px] font-bold tracking-[0.15em] uppercase">
            <span className="bg-gold/10 text-gold border-gold/20 border px-3 py-1">{article.category}</span>
            <span className="text-muted">•</span>
            <span className="text-muted">{article.readingTime}</span>
            <span className="text-muted">•</span>
            <span className="text-muted">{article.date || 'August 2026'}</span>
          </div>

          {/* Article Title */}
          <h1 className="font-display text-navy mt-4 text-[32px] font-normal leading-[1.12] sm:text-[42px] lg:text-[50px]">
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
                    className="ring-gold/30 h-11 w-11 object-cover ring-1"
                  />
                )}
                <div>
                  <p className="text-navy text-[14px] font-bold">{article.author.name}</p>
                  <p className="text-muted text-[11px]">{article.author.role}</p>
                </div>
              </div>

              <Link
                href="/news"
                className="border-line text-navy hover:border-gold hover:text-gold hidden items-center gap-2 border px-4 py-2 text-[11px] font-bold tracking-wider uppercase transition-colors sm:inline-flex"
              >
                ← {t('backToNews')}
              </Link>
            </div>
          )}

          {/* Featured Image */}
          <div className="border-line relative mb-10 h-[300px] overflow-hidden border sm:h-[420px] lg:h-[500px]">
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
          <div className="prose prose-lg prose-slate text-navy/90 font-sans max-w-none leading-relaxed">
            <p className="border-gold font-display text-navy border-l-2 my-6 pl-4 text-balance text-[20px] font-normal italic leading-relaxed">
              {article.excerpt}
            </p>

            {article.content ? (
              /* Nội dung là HTML do trình soạn thảo CMS sinh, đã sanitize ở
                 server lúc lưu (`sanitizeArticleHtml`) và lúc AI trả về. Bọc
                 trong `.article-body` — CHÍNH stylesheet mà CMS dùng lúc soạn,
                 nên bài hiện ra đúng như biên tập nhìn thấy. */
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <p className="text-muted text-[16px]">{t('contentPending')}</p>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="border-line border-t mt-12 pt-6">
              <span className="text-muted block mb-3 text-[11px] font-bold tracking-wider uppercase">{t('topicTags')}</span>
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
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-display text-navy text-[28px] font-normal">Related News &amp; Insights</h3>
              <Link href="/news" className="text-gold hover:underline text-[12px] font-bold tracking-wider uppercase">
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
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-gold text-[9px] font-bold tracking-widest uppercase">{rel.category}</span>
                    <h4 className="font-display text-navy group-hover:text-gold mt-2 text-[17px] font-normal leading-tight">
                      {rel.title}
                    </h4>
                    <span className="text-navy mt-auto pt-4 text-[11px] font-bold tracking-wider uppercase">Read story →</span>
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
