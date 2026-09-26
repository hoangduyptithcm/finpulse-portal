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
  metadataBase: new URL("https://finpulse.aas.ai.vn"),
  title: {
    default: "FinPulse | Sổ phân tích của Minh Anh - Dữ liệu & Cổ phiếu niêm yết",
    template: "%s | FinPulse",
  },
  description:
    "FinPulse - Sổ phân tích độc lập của Minh Anh. Mỗi tuần một câu hỏi về doanh nghiệp niêm yết, phân tích chuyên sâu báo cáo tài chính, dòng tiền và định giá cổ phiếu bằng số liệu thực tế.",
  keywords: [
    "finpulse",
    "finpulse portal",
    "finpulse vn",
    "sổ phân tích của minh anh",
    "minh anh finpulse",
    "phân tích cổ phiếu",
    "báo cáo tài chính",
    "doanh nghiệp niêm yết",
    "định giá cổ phiếu",
    "đầu tư giá trị",
    "vn-index",
  ],
  authors: [{ name: "Minh Anh", url: "https://finpulse.aas.ai.vn/about" }],
  creator: "FinPulse",
  publisher: "FinPulse",
  alternates: {
    canonical: "https://finpulse.aas.ai.vn",
  },
  openGraph: {
    title: "FinPulse | Sổ phân tích của Minh Anh - Dữ liệu & Cổ phiếu niêm yết",
    description:
      "FinPulse - Sổ phân tích độc lập của Minh Anh. Mỗi tuần một câu hỏi về doanh nghiệp niêm yết, phân tích chuyên sâu báo cáo tài chính bằng số liệu công bố.",
    url: "https://finpulse.aas.ai.vn",
    siteName: "FinPulse",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "FinPulse Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinPulse | Sổ phân tích của Minh Anh",
    description:
      "Mỗi tuần một câu hỏi về doanh nghiệp niêm yết, phân tích chuyên sâu báo cáo tài chính bằng số liệu công bố.",
    images: ["/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://finpulse.aas.ai.vn/#website",
      url: "https://finpulse.aas.ai.vn",
      name: "FinPulse",
      alternateName: ["FinPulse Portal", "FinPulse VN", "Sổ phân tích của Minh Anh"],
      description:
        "Sổ phân tích độc lập về doanh nghiệp niêm yết, báo cáo tài chính và thị trường chứng khoán của Minh Anh",
      inLanguage: "vi",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://finpulse.aas.ai.vn/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://finpulse.aas.ai.vn/#organization",
      name: "FinPulse",
      url: "https://finpulse.aas.ai.vn",
      logo: "https://finpulse.aas.ai.vn/icon-512.png",
      sameAs: [],
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#111827]">
        {children}
      </body>
    </html>
  );
}

