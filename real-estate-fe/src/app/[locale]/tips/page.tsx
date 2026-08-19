import NewsPage, { metadata } from '../news/page';

export { metadata };

// Cấu hình route KHÔNG kế thừa qua re-export — phải khai lại ở đây.
export const revalidate = 60;
export default NewsPage;
