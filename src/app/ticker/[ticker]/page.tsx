import StockDetailPage, { generateMetadata } from "@/app/ma/[ticker]/page";

export const revalidate = 30;

export { generateMetadata };
export default StockDetailPage;
