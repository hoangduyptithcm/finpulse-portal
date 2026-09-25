import type { Metadata } from "next";
import { Be_Vietnam_Pro, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinPulse | Sổ phân tích của Minh Anh",
  description:
    "Mỗi tuần một câu hỏi về doanh nghiệp niêm yết, trả lời bằng số liệu công bố. Quan điểm cá nhân – không phải cơ quan báo chí.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${sourceSerif4.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F7F5F0] text-[#16181D]">
        {children}
      </body>
    </html>
  );
}
