'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { Article } from '@/types';

const CATEGORIES = ['All', 'Buying guide', 'Design', 'Neighbourhoods', 'Market Report', 'Architecture'] as const;

export function NewsClientGrid({ articles }: { articles: Article[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const regularArticles = filtered;

  return (
    <div className="space-y-12">
      {/* Search & Category Filter Toolbar */}
      <div className="border-line bg-white flex flex-col gap-4 border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-4.5 py-2.5 text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-200 cursor-pointer rounded-none',
                  isActive
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-paper text-navy border-line hover:border-gold hover:text-gold border',
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết, chủ đề..."
            className="border-line text-navy placeholder:text-muted focus:border-navy focus:ring-navy/20 w-full border bg-paper py-2.5 pl-10 pr-4 text-[14px] transition-all focus:outline-none focus:ring-1 rounded-none font-medium"
          />
          <svg
            className="text-muted absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Hero Featured Article (Shown when no active search/category filter or when featured matches) */}
      {selectedCategory === 'All' && !searchQuery && featuredArticle && (
        <section aria-label="Featured Story" className="mb-16">
          <div className="border-line bg-white hover:shadow-lift group relative grid overflow-hidden border transition-all duration-500 lg:grid-cols-12 rounded-none">
            <div className="relative min-h-[300px] sm:min-h-[400px] lg:col-span-7 lg:min-h-[480px]">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-gold text-navy px-3.5 py-1.5 text-[11px] font-bold tracking-[0.14em] uppercase shadow-md rounded-none">
                  BÀI VIẾT NỔI BẬT
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
              <div>
                <div className="text-gold flex items-center justify-between gap-2 text-[11px] font-bold tracking-[0.14em] uppercase">
                  <span>{featuredArticle.category}</span>
                  <span className="text-muted font-normal">{featuredArticle.readingTime}</span>
                </div>

                <h2 className="font-display text-navy group-hover:text-gold mt-4 text-[26px] leading-[1.18] font-normal transition-colors sm:text-[32px] lg:text-[36px]">
                  <Link href={`/news/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>

                <p className="text-muted mt-4 text-[15px] sm:text-[16px] leading-relaxed font-sans">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="border-line-soft mt-8 flex items-center justify-between border-t pt-6">
                {featuredArticle.author && (
                  <div className="flex items-center gap-3">
                    {featuredArticle.author.avatar && (
                      <Image
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-cover ring-1 ring-gold/40 rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-navy text-[13px] font-bold leading-tight">
                        {featuredArticle.author.name}
                      </p>
                      <p className="text-muted text-[11px]">{featuredArticle.author.role}</p>
                    </div>
                  </div>
                )}

                <Link
                  href={`/news/${featuredArticle.slug}`}
                  className="bg-navy hover:bg-gold text-white hover:text-navy inline-flex items-center gap-2 px-6 py-3 text-[12.5px] font-bold tracking-wider uppercase transition-all rounded-none shadow-xs"
                >
                  Đọc tiếp
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Articles Grid */}
      {regularArticles.length === 0 ? (
        <div className="border-line bg-white border p-12 text-center rounded-none">
          <p className="font-display text-navy text-[24px]">Không tìm thấy bài viết phù hợp</p>
          <p className="text-muted mt-2 text-[15px]">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-gold hover:underline mt-4 inline-block text-[13px] font-bold uppercase tracking-wider cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularArticles.map((article, idx) => {
            const isWide = idx % 5 === 3;
            const isDark = idx % 5 === 4;

            if (isDark) {
              return (
                <article
                  key={article.slug}
                  className="bg-navy border-navy hover:shadow-lift group flex flex-col justify-between overflow-hidden border p-6 sm:p-7 text-white transition-all duration-300 hover:-translate-y-1.5 md:col-span-1 rounded-none"
                >
                  <div>
                    <div className="text-gold flex justify-between gap-4 text-[11px] font-bold tracking-[0.14em] uppercase">
                      <span>{article.category}</span>
                      <span className="text-white/60 font-normal">{article.readingTime}</span>
                    </div>

                    <h3 className="font-display mt-5 text-[24px] sm:text-[26px] leading-snug font-normal text-white group-hover:text-gold transition-colors">
                      <Link href={`/news/${article.slug}`}>{article.title}</Link>
                    </h3>

                    <p className="text-white/75 mt-4 text-[14.5px] leading-relaxed line-clamp-4 font-sans">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="border-white/10 mt-8 flex items-center justify-between border-t pt-4">
                    <span className="text-[12px] text-white/50">{article.date || 'Gần đây'}</span>
                    <Link
                      href={`/news/${article.slug}`}
                      className="text-gold hover:text-white flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Đọc chi tiết →
                    </Link>
                  </div>
                </article>
              );
            }

            return (
              <article
                key={article.slug}
                className={cn(
                  'border-line bg-white hover:shadow-lift group flex flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 rounded-none',
                  isWide && 'md:col-span-2 lg:col-span-2',
                )}
              >
                <div
                  className={cn(
                    'relative overflow-hidden bg-sand',
                    isWide ? 'h-[240px] sm:h-[300px]' : 'h-[220px]',
                  )}
                >
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-navy/90 text-white backdrop-blur-md px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-none">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="text-muted flex items-center justify-between text-[12px]">
                    <span>{article.date || 'Đã xuất bản'}</span>
                    <span className="text-gold font-bold">{article.readingTime}</span>
                  </div>

                  <h3 className="font-display text-navy group-hover:text-gold mt-3 text-[22px] sm:text-[24px] leading-[1.22] font-normal transition-colors">
                    <Link href={`/news/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className="text-muted mt-3 mb-6 text-[14.5px] leading-relaxed line-clamp-3 font-sans">
                    {article.excerpt}
                  </p>

                  <div className="border-line-soft mt-auto flex items-center justify-between border-t pt-4">
                    {article.author ? (
                      <div className="flex items-center gap-2.5">
                        {article.author.avatar && (
                          <Image
                            src={article.author.avatar}
                            alt={article.author.name}
                            width={32}
                            height={32}
                            className="h-8 w-8 object-cover rounded-full"
                          />
                        )}
                        <span className="text-navy text-[13px] font-semibold">
                          {article.author.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted text-[12.5px]">Da Nang Homes Advisory</span>
                    )}

                    <Link
                      href={`/news/${article.slug}`}
                      className="text-navy hover:text-gold text-[12.5px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Đọc chi tiết →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
