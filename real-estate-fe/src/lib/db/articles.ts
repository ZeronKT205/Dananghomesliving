import 'server-only';

import type { Article } from '@/types';

/** ⚠️ Nội dung demo lấy từ bản thiết kế. Thay bằng bài viết thật hoặc nối CMS. */
const ARTICLES: readonly Article[] = [
  {
    slug: 'international-buyers-guide',
    category: 'Buying guide',
    readingTime: '8 min read',
    title: 'What international buyers should understand before choosing a Da Nang residence',
    excerpt:
      'A practical overview of locations, ownership considerations, service charges and the questions worth asking before making an offer.',
    image: '/images/journal/buying-guide.webp',
    imageAlt: 'Modern Da Nang apartment',
  },
  {
    slug: 'furnished-rental-details',
    category: 'Design',
    readingTime: '5 min read',
    title: 'The details that make a furnished rental feel genuinely premium',
    excerpt:
      'From lighting and storage to acoustic comfort, the quality signals that matter after the first viewing.',
    image: '/images/journal/design-details.webp',
    imageAlt: 'Refined bathroom interior',
  },
  {
    slug: 'choosing-your-neighbourhood',
    category: 'Neighbourhoods',
    readingTime: '6 min read',
    title: 'My Khe, An Thuong or Hai Chau: choosing the right base for your lifestyle',
    excerpt:
      'A concise comparison of three popular areas for coastal living, walkability, work and long-term convenience.',
    image: '/images/journal/neighbourhoods.webp',
    imageAlt: 'Dark luxury bedroom',
  },
];

export async function getArticles(): Promise<Article[]> {
  return [...ARTICLES];
}
