import StockDetailPage, { generateMetadata, generateStaticParams } from "@/app/ma/[ticker]/page";

export const revalidate = 30;

export { generateMetadata, generateStaticParams };
export default StockDetailPage;
