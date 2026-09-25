export interface KeyStat {
  value: string;
  label: string;
}

export interface NavCategory {
  name: string;
  slug: string;
  desc: string;
  count: number;
}

export interface TopArticle {
  n: number;
  title: string;
  cat: string;
  slug: string;
  views: string;
  numColor: string;
}

export interface WatchItem {
  name: string;
  value: string;
  change: string;
  color: string;
}

export interface SeriesPart {
  n: number;
  title: string;
  status: string;
  color: string;
  numColor: string;
  slug?: string;
}

export interface RecentNote {
  day: string;
  month: string;
  title: string;
  text: string;
  slug: string;
}

export const CATEGORIES: NavCategory[] = [
  {
    name: "Đọc BCTC",
    slug: "doc-bctc",
    desc: "Tách số từ báo cáo, so sánh nhiều kỳ.",
    count: 18,
  },
  {
    name: "Giải thích khái niệm",
    slug: "giai-thich-khai-niem",
    desc: "P/E, biên lợi nhuận, dòng tiền, thuế.",
    count: 14,
  },
  {
    name: "Nhật ký quan sát",
    slug: "nhat-ky-quan-sat",
    desc: "Hôm nay tôi chú ý điều gì, và vì sao.",
    count: 27,
  },
  {
    name: "Checklist",
    slug: "checklist",
    desc: "Khung phân tích tôi dùng lại nhiều lần.",
    count: 9,
  },
];

export const KEY_STATS: KeyStat[] = [
  { value: "1,9 lần", label: "P/B hiện tại" },
  { value: "18,2%", label: "ROE 4 quý gần nhất" },
  { value: "1,1%", label: "Tỷ lệ nợ xấu" },
];

export const CATEGORY_COLUMNS = [
  {
    name: "Đọc BCTC",
    slug: "doc-bctc",
    desc: "Tách số từ báo cáo, so sánh nhiều kỳ.",
    items: [
      { title: "VCB có đắt sau báo cáo quý 2?", slug: "vcb-co-dat-sau-bao-cao-quy-2", date: "22/09/2026" },
      { title: "Biên lợi nhuận gộp nhóm thép qua 8 quý", slug: "bien-loi-nhuan-gop-nhom-thep-qua-8-quy", date: "18/09/2026" },
      { title: "Tôi đọc nghị quyết ĐHĐCĐ như thế nào", slug: "toi-doc-nghi-quyet-dhdcd-nhu-the-nao", date: "02/09/2026" },
    ],
  },
  {
    name: "Giải thích khái niệm",
    slug: "giai-thich-khai-niem",
    desc: "P/E, biên lợi nhuận, dòng tiền, thuế.",
    items: [
      { title: "P/E thấp chưa chắc đã rẻ: 3 trường hợp cần cẩn thận", slug: "pe-thap-chua-chac-da-re-3-truong-hop-can-can-than", date: "15/09/2026" },
      { title: "Dòng tiền tự do: vì sao lãi đẹp mà công ty vẫn thiếu tiền", slug: "dong-tien-tu-do-vi-sao-lai-dep-ma-cong-ty-van-thieu-tien", date: "05/09/2026" },
      { title: "DCA là gì? Cách bình quân giá cho người mới", slug: "dca-la-gi-cach-binh-quan-gia-cho-nguoi-moi", date: "28/08/2026" },
    ],
  },
  {
    name: "Nhật ký quan sát",
    slug: "nhat-ky-quan-sat",
    desc: "Hôm nay tôi chú ý điều gì, và vì sao.",
    items: [
      { title: "Ghi chép 20/09: vì sao tôi chú ý nhóm bán lẻ", slug: "ghi-chep-20-09-vi-sao-toi-chu-y-nhom-ban-le", date: "20/09/2026" },
      { title: "Ghi chép 16/09: tỷ lệ nợ vay nhóm bất động sản", slug: "ghi-chep-16-09-ty-le-no-vay-nhom-bat-dong-san", date: "16/09/2026" },
      { title: "Ghi chép 11/09: cổ tức tiền mặt mùa này", slug: "ghi-chep-11-09-co-tuc-tien-mat-mua-nay", date: "11/09/2026" },
    ],
  },
  {
    name: "Checklist",
    slug: "checklist",
    desc: "Khung phân tích tôi dùng lại nhiều lần.",
    items: [
      { title: "Checklist 12 câu trước khi mua một cổ phiếu", slug: "checklist-12-cau-truoc-khi-mua-mot-co-phieu", date: "10/09/2026" },
      { title: "Quản lý vốn: vì sao tôi không dồn hết vào một mã", slug: "quan-ly-von-vi-sao-khong-don-het-vao-mot-ma", date: "30/08/2026" },
      { title: "5 dấu hiệu cần đọc kỹ phần thuyết minh BCTC", slug: "5-dau-hieu-can-doc-ky-phan-thuyet-minh-bctc", date: "19/08/2026" },
    ],
  },
];

export const SERIES_LIST: SeriesPart[] = [
  { n: 1, title: "NIM là gì và vì sao quan trọng", status: "Đã đăng 12/08", color: "#16181D", numColor: "#133A63", slug: "nim-la-gi-va-vi-sao-quan-trong" },
  { n: 2, title: "Nợ xấu và tỷ lệ bao phủ nợ xấu", status: "Đã đăng 26/08", color: "#16181D", numColor: "#133A63", slug: "no-xau-va-ty-le-bao-phu-no-xau" },
  { n: 3, title: "CASA: nguồn vốn rẻ của ngân hàng", status: "Đã đăng 09/09", color: "#16181D", numColor: "#133A63", slug: "casa-nguon-von-re-cua-ngan-hang" },
  { n: 4, title: "Chi phí dự phòng ăn vào lợi nhuận thế nào", status: "Sắp đăng", color: "#5E636B", numColor: "#9A9EA5" },
  { n: 5, title: "Đọc thuyết minh nợ nhóm 2", status: "Sắp đăng", color: "#5E636B", numColor: "#9A9EA5" },
  { n: 6, title: "Tự định giá một ngân hàng bằng P/B", status: "Sắp đăng", color: "#5E636B", numColor: "#9A9EA5" },
];

export const RECENT_NOTES: RecentNote[] = [
  {
    day: "20",
    month: "Th09",
    title: "Vì sao tôi chú ý nhóm bán lẻ",
    slug: "ghi-chep-20-09-vi-sao-toi-chu-y-nhom-ban-le",
    text: "Doanh thu tháng 8 của ba doanh nghiệp bán lẻ lớn đều tăng trên 10% so với cùng kỳ theo công bố thông tin. Tôi muốn xem biên lợi nhuận có đi cùng hay không.",
  },
  {
    day: "16",
    month: "Th09",
    title: "Tỷ lệ nợ vay nhóm bất động sản",
    slug: "ghi-chep-16-09-ty-le-no-vay-nhom-bat-dong-san",
    text: "Tôi lọc các doanh nghiệp có nợ vay trên vốn chủ lớn hơn 1,5 lần và trái phiếu đáo hạn trong 12 tháng tới. Danh sách ngắn hơn tôi nghĩ.",
  },
  {
    day: "11",
    month: "Th09",
    title: "Cổ tức tiền mặt mùa này",
    slug: "ghi-chep-11-09-co-tuc-tien-mat-mua-nay",
    text: "Ghi lại các nghị quyết chia cổ tức tiền mặt đã công bố, so với dòng tiền kinh doanh để xem công ty nào chia từ tiền thật.",
  },
];

export const WATCH_LIST: WatchItem[] = [
  { name: "VN-Index", value: "1.292,40", change: "+0,67%", color: "#0A7A45" },
  { name: "VN30", value: "1.335,20", change: "+0,84%", color: "#0A7A45" },
  { name: "HNX-Index", value: "238,15", change: "-0,19%", color: "#C0271D" },
  { name: "P/E VN-Index", value: "13,4 lần", change: "", color: "#5E636B" },
  { name: "LS qua đêm", value: "4,1%", change: "", color: "#5E636B" },
];

const RAW_TOP_ARTICLES = [
  { title: "DCA là gì? Cách bình quân giá cho người mới", cat: "Giải thích khái niệm", slug: "dca-la-gi-cach-binh-quan-gia-cho-nguoi-moi", views: 4812 },
  { title: "Đọc báo cáo tài chính trong 10 phút: 5 chỉ số cần nhớ", cat: "Đọc BCTC", slug: "doc-bao-cao-tai-chinh-trong-10-phut-5-chi-so-can-nho", views: 3960 },
  { title: "VCB có đắt sau báo cáo quý 2?", cat: "Đọc BCTC", slug: "vcb-co-dat-sau-bao-cao-quy-2", views: 3105 },
  { title: "P/E thấp chưa chắc đã rẻ: 3 trường hợp cần cẩn thận", cat: "Giải thích khái niệm", slug: "pe-thap-chua-chac-da-re-3-truong-hop-can-can-than", views: 2744 },
  { title: "Checklist 12 câu trước khi mua một cổ phiếu", cat: "Checklist", slug: "checklist-12-cau-truoc-khi-mua-mot-co-phieu", views: 2431 },
  { title: "Dòng tiền tự do: vì sao lãi đẹp mà công ty vẫn thiếu tiền", cat: "Giải thích khái niệm", slug: "dong-tien-tu-do-vi-sao-lai-dep-ma-cong-ty-van-thieu-tien", views: 1980 },
  { title: "Quản lý vốn: vì sao tôi không dồn hết vào một mã", cat: "Checklist", slug: "quan-ly-von-vi-sao-khong-don-het-vao-mot-ma", views: 1702 },
  { title: "Tôi đọc nghị quyết ĐHĐCĐ như thế nào", cat: "Đọc BCTC", slug: "toi-doc-nghi-quyet-dhdcd-nhu-the-nao", views: 1455 },
  { title: "Biên lợi nhuận gộp nhóm thép qua 8 quý", cat: "Đọc BCTC", slug: "bien-loi-nhuan-gop-nhom-thep-qua-8-quy", views: 1210 },
  { title: "Ghi chép 20/09: vì sao tôi chú ý nhóm bán lẻ", cat: "Nhật ký quan sát", slug: "ghi-chep-20-09-vi-sao-toi-chu-y-nhom-ban-le", views: 1034 },
];

export function getTopArticles(range: "month" | "all"): TopArticle[] {
  const order = range === "all" ? [1, 0, 6, 4, 3, 5, 7, 2, 8, 9] : [2, 0, 1, 3, 9, 4, 5, 6, 8, 7];
  return order.map((idx, k) => {
    const item = RAW_TOP_ARTICLES[idx];
    const viewsNum = range === "all" ? Math.round(item.views * (6.2 - k * 0.3)) : item.views;
    return {
      n: k + 1,
      title: item.title,
      cat: item.cat,
      slug: item.slug,
      views: viewsNum.toLocaleString("vi-VN"),
      numColor: k < 3 ? "#133A63" : "#9A9EA5",
    };
  });
}

export const CATEGORY_RIVER = [
  {
    date: "22/09/2026",
    read: "8 phút đọc",
    title: "VCB có đắt sau báo cáo quý 2?",
    slug: "vcb-co-dat-sau-bao-cao-quy-2",
    dek: "So P/B, ROE và nợ xấu của Vietcombank với chính nó trong 5 năm.",
    stat: "1,9 lần",
    statLabel: "P/B hiện tại",
  },
  {
    date: "18/09/2026",
    read: "6 phút đọc",
    title: "Biên lợi nhuận gộp nhóm thép qua 8 quý",
    slug: "bien-loi-nhuan-gop-nhom-thep-qua-8-quy",
    dek: "Giá bán đi ngang, chi phí quặng giảm: ai giữ được biên tốt nhất?",
    stat: "14,8%",
    statLabel: "Biên gộp trung bình nhóm quý 2",
  },
  {
    date: "02/09/2026",
    read: "7 phút đọc",
    title: "Tôi đọc nghị quyết ĐHĐCĐ như thế nào",
    slug: "toi-doc-nghi-quyet-dhdcd-nhu-the-nao",
    dek: "Ba mục tôi luôn tìm đầu tiên: kế hoạch lợi nhuận, cổ tức và phát hành thêm.",
    stat: "3 mục",
    statLabel: "Đọc trước tiên",
  },
  {
    date: "19/08/2026",
    read: "5 phút đọc",
    title: "5 dấu hiệu cần đọc kỹ phần thuyết minh BCTC",
    slug: "5-dau-hieu-can-doc-ky-phan-thuyet-minh-bctc",
    dek: "Phải thu tăng nhanh hơn doanh thu là dấu hiệu đầu tiên.",
    stat: "5",
    statLabel: "Dấu hiệu cảnh báo",
  },
];

export const VCB_ARTICLE_DATA = {
  title: "VCB có đắt sau báo cáo quý 2?",
  slug: "vcb-co-dat-sau-bao-cao-quy-2",
  excerpt:
    "Tôi so P/B, ROE và nợ xấu của Vietcombank với chính nó trong 5 năm để xem mức giá hiện tại đang phản ánh điều gì.",
  author: "Minh Anh",
  date: "22/09/2026",
  readTime: "8 phút đọc",
  category: "Đọc BCTC",
  categorySlug: "doc-bctc",
  metaNote: "Nháp có hỗ trợ AI, số liệu do tác giả kiểm tra",
  shortAnswer:
    "Chưa đắt so với chính nó 5 năm qua. Nhưng nợ xấu tăng hai quý liên tiếp là lý do tôi chưa coi đây là vùng giá rẻ.",
  shortAnswerBullets: [
    "P/B 1,9 lần, thấp hơn trung bình 5 năm (2,3 lần).",
    "ROE vẫn trên 18%, thuộc nhóm cao nhất ngành.",
    "Tỷ lệ nợ xấu 1,1% là số tôi sẽ theo dõi ở báo cáo quý 3.",
  ],
  qBars: [
    { m: "Q1/25", label: "10,2", h: "79%", color: "#133A63" },
    { m: "Q2/25", label: "10,8", h: "84%", color: "#133A63" },
    { m: "Q3/25", label: "11,5", h: "89%", color: "#133A63" },
    { m: "Q4/25", label: "12,9", h: "100%", color: "#133A63" },
    { m: "Q1/26", label: "11,9", h: "92%", color: "#133A63" },
    { m: "Q2/26", label: "12,6", h: "98%", color: "#16181D" },
  ],
  compareTable: [
    { k: "P/B", avg: "2,3 lần", now: "1,9 lần", note: "Rẻ hơn trung bình", color: "#0A7A45" },
    { k: "ROE", avg: "20,1%", now: "18,2%", note: "Giảm nhẹ", color: "#2B2F36" },
    { k: "Tỷ lệ nợ xấu", avg: "0,9%", now: "1,1%", note: "Tăng, cần theo dõi", color: "#C0271D" },
    { k: "CASA", avg: "33%", now: "35%", note: "Cải thiện", color: "#0A7A45" },
  ],
  quote: "Mức giá này đang trả cho chất lượng tài sản của hai năm trước. Nếu nợ xấu quý 3 dừng tăng, tôi sẽ viết lại bài này với kết luận khác.",
  risks: [
    { n: 1, text: "Nợ xấu tiếp tục tăng ở nhóm khách hàng bất động sản trong hai quý tới." },
    { n: 2, text: "Biên lãi thuần (NIM) giảm nhanh hơn dự kiến nếu ngân hàng phải hạ lãi suất cho vay." },
    { n: 3, text: "Tôi dùng số hợp nhất; một số khoản thu bất thường có thể làm ROE quý này đẹp hơn thực tế." },
  ],
  glossary: [
    {
      term: "P/B",
      def: "Giá cổ phiếu chia cho giá trị sổ sách mỗi cổ phần. P/B 1,9 lần nghĩa là thị trường trả 1,9 đồng cho mỗi đồng vốn chủ.",
    },
    {
      term: "ROE",
      def: "Lợi nhuận sau thuế chia cho vốn chủ sở hữu. Cho biết mỗi đồng vốn của cổ đông sinh ra bao nhiêu lợi nhuận mỗi năm.",
    },
    {
      term: "CASA",
      def: "Tỷ lệ tiền gửi không kỳ hạn trên tổng tiền gửi. CASA cao giúp ngân hàng có nguồn vốn rẻ.",
    },
  ],
  sources: [
    { n: 1, label: "Báo cáo tài chính hợp nhất quý 2/2026 – Vietcombank", where: "Công bố thông tin trên HOSE" },
    { n: 2, label: "Nghị quyết ĐHĐCĐ thường niên 2026", where: "Trang quan hệ cổ đông của VCB" },
    { n: 3, label: "Giá đóng cửa ngày 20/09/2026", where: "HOSE" },
  ],
  tags: ["VCB", "Ngân hàng", "Đọc BCTC", "P/B"],
  related: [
    { cat: "Chuỗi bài · Phần 3", title: "CASA: nguồn vốn rẻ của ngân hàng", date: "09/09/2026", slug: "casa-nguon-von-re-cua-ngan-hang" },
    { cat: "Giải thích khái niệm", title: "P/E thấp chưa chắc đã rẻ: 3 trường hợp cần cẩn thận", date: "15/09/2026", slug: "pe-thap-chua-chac-da-re-3-truong-hop-can-can-than" },
    { cat: "Checklist", title: "Checklist 12 câu trước khi mua một cổ phiếu", date: "10/09/2026", slug: "checklist-12-cau-truoc-khi-mua-mot-co-phieu" },
  ],
};

export const ABOUT_PAGE_DATA = {
  useSrc: [
    "Số liệu công bố trên HOSE, HNX, Ủy ban Chứng khoán",
    "Báo cáo tài chính, nghị quyết ĐHĐCĐ, công bố thông tin doanh nghiệp",
    "Văn bản pháp luật, thông cáo của cơ quan nhà nước",
    "Kinh nghiệm, checklist và mô hình của riêng tôi",
  ],
  noSrc: [
    "Bài viết của báo chí, kể cả khi diễn đạt lại",
    "Phỏng vấn, điều tra hay phân tích độc quyền của báo",
    "Ảnh, infographic, video, biểu đồ của báo",
  ],
  process: [
    { n: 1, text: "Tôi chọn một câu hỏi cụ thể cho mỗi bài." },
    { n: 2, text: "Tôi lấy số từ nguồn gốc (BCTC, HOSE, SSC) và lưu link." },
    { n: 3, text: "AI soạn nháp chỉ từ số liệu tôi đưa vào." },
    { n: 4, text: "Tôi sửa luận điểm, rủi ro và tự viết kết luận." },
    { n: 5, text: "Cuối bài luôn có nguồn số liệu và miễn trừ trách nhiệm." },
  ],
};

export const ADMIN_OVERVIEW_DATA = {
  stats: [
    { label: "Lượt đọc 7 ngày", value: "21.870", note: "+4% so với tuần trước", noteColor: "#0A7A45" },
    { label: "Người nhận email", value: "1.240", note: "+38 trong tuần", noteColor: "#0A7A45" },
    { label: "Bài đã xuất bản", value: "5", note: "1 bài trong tuần này", noteColor: "#5E636B" },
    { label: "Bản nháp", value: "2", note: "1 bản nháp chưa có nguồn", noteColor: "#C0271D" },
  ],
  drafts: [
    { title: "Ghi chép 23/09: dòng tiền quay lại nhóm ngân hàng", cat: "Nhật ký quan sát", time: "20 phút trước", slug: "ghi-chep-23-09" },
    { title: "Chi phí dự phòng ăn vào lợi nhuận thế nào", cat: "Đọc BCTC", time: "2 ngày trước", slug: "chi-phi-du-phong" },
  ],
  topWeek: [
    { title: "VCB có đắt sau báo cáo quý 2?", views: "3.105" },
    { title: "P/E thấp chưa chắc đã rẻ", views: "2.744" },
    { title: "Checklist 12 câu trước khi mua cổ phiếu", views: "2.431" },
    { title: "Dòng tiền tự do: vì sao lãi đẹp mà vẫn thiếu tiền", views: "1.980" },
  ],
};

export const ADMIN_POSTS_DATA = [
  { id: "1", title: "VCB có đắt sau báo cáo quý 2?", cat: "Đọc BCTC", st: "pub", views: "3.105", date: "22/09/2026", src: 3, featured: true, slug: "vcb-co-dat-sau-bao-cao-quy-2" },
  { id: "2", title: "Ghi chép 23/09: dòng tiền quay lại nhóm ngân hàng", cat: "Nhật ký quan sát", st: "draft", views: "—", date: "23/09/2026", src: 0, featured: false, slug: "ghi-chep-23-09" },
  { id: "3", title: "Chi phí dự phòng ăn vào lợi nhuận thế nào", cat: "Đọc BCTC", st: "draft", views: "—", date: "21/09/2026", src: 2, featured: false, slug: "chi-phi-du-phong" },
  { id: "4", title: "Biên lợi nhuận gộp nhóm thép qua 8 quý", cat: "Đọc BCTC", st: "pub", views: "1.210", date: "18/09/2026", src: 4, featured: false, slug: "bien-loi-nhuan-gop-nhom-thep-qua-8-quy" },
  { id: "5", title: "P/E thấp chưa chắc đã rẻ: 3 trường hợp cần cẩn thận", cat: "Giải thích khái niệm", st: "pub", views: "2.744", date: "15/09/2026", src: 2, featured: false, slug: "pe-thap-chua-chac-da-re-3-truong-hop-can-can-than" },
  { id: "6", title: "Checklist 12 câu trước khi mua một cổ phiếu", cat: "Checklist", st: "pub", views: "2.431", date: "10/09/2026", src: 1, featured: false, slug: "checklist-12-cau-truoc-khi-mua-mot-co-phieu" },
  { id: "7", title: "Dòng tiền tự do: vì sao lãi đẹp mà công ty vẫn thiếu tiền", cat: "Giải thích khái niệm", st: "pub", views: "1.980", date: "05/09/2026", src: 3, featured: false, slug: "dong-tien-tu-do-vi-sao-lai-dep-ma-cong-ty-van-thieu-tien" },
];
