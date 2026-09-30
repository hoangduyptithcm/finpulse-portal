export interface GlossaryItem {
  term: string;
  fullName: string;
  category: "Ngân hàng" | "Định giá" | "Hiệu quả hoạt động" | "Dòng tiền & Nợ";
  shortDef: string;
  formula?: string;
  benchmark?: string;
  example?: string;
  slug: string;
}

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: "NIM",
    fullName: "Net Interest Margin (Biên lãi thuần)",
    category: "Ngân hàng",
    shortDef:
      "Tỷ lệ đo lường chênh lệch giữa thu nhập lãi từ cho vay/đầu tư và chi phí huy động vốn của ngân hàng.",
    formula: "NIM = Thu nhập lãi thuần / Tổng tài sản sinh lời bình quân",
    benchmark:
      "Ngân hàng Việt Nam thường đạt NIM từ 3.2% - 4.8%. Ngân hàng có CASA cao thường duy trì được NIM vượt trội.",
    example:
      "Một ngân hàng cho vay bình quân lãi suất 9%/năm nhưng huy động vốn chỉ mất 4.5%/năm thì sẽ có biên lãi thuần NIM rất khỏe.",
    slug: "nim",
  },
  {
    term: "CASA",
    fullName: "Current Account Savings Account (Tiền gửi không kỳ hạn)",
    category: "Ngân hàng",
    shortDef:
      "Tỷ lệ tiền gửi thanh toán lãi suất rất thấp (chỉ 0.1 - 0.5%/năm) trên tổng tiền gửi của khách hàng.",
    formula: "Tỷ lệ CASA = Tiền gửi không kỳ hạn / Tổng tiền gửi khách hàng",
    benchmark:
      "CASA cao (như TCB, MBB đạt 35% - 40%) giúp ngân hàng có nguồn vốn rẻ, hạ thấp chi phí vốn COF và mở rộng biên lãi NIM.",
    example:
      "Tiền bạn để trong tài khoản ngân hàng để chi tiêu hàng ngày hưởng lãi 0.2%/năm chính là nguồn tiền CASA cho ngân hàng mang đi cho vay.",
    slug: "casa",
  },
  {
    term: "NPL",
    fullName: "Non-Performing Loan (Tỷ lệ nợ xấu)",
    category: "Ngân hàng",
    shortDef:
      "Tỷ lệ các khoản nợ từ nhóm 3 đến nhóm 5 (nợ dưới tiêu chuẩn, nghi ngờ, có khả năng mất vốn) trên tổng dư nợ.",
    formula: "NPL = (Nợ nhóm 3 + Nhóm 4 + Nhóm 5) / Tổng dư nợ cho vay",
    benchmark:
      "Mức an toàn thường dưới 2% - 3%. Ngân hàng có NPL thấp và tỷ lệ bao phủ nợ xấu (LLR) trên 150% được coi là chất lượng tài sản rất tốt.",
    slug: "npl",
  },
  {
    term: "P/E",
    fullName: "Price-to-Earnings Ratio (Hệ số Giá trên Thu nhập)",
    category: "Định giá",
    shortDef:
      "Mức giá thị trường mà nhà đầu tư sẵn sàng trả cho mỗi 1 đồng lợi nhuận sau thuế của doanh nghiệp.",
    formula: "P/E = Thị giá cổ phiếu / Thu nhập trên mỗi cổ phần (EPS)",
    benchmark:
      "VN-Index trung bình 10 năm dao động từ 12x - 16x. P/E thấp có thể là món hời nhưng cũng có thể là bẫy giá trị nếu lợi nhuận đang tạo đỉnh.",
    slug: "pe",
  },
  {
    term: "P/B",
    fullName: "Price-to-Book Ratio (Hệ số Giá trên Giá trị sổ sách)",
    category: "Định giá",
    shortDef:
      "So sánh giá thị trường với giá trị tài sản ròng (vốn chủ sở hữu) trên mỗi cổ phần. Rất chuẩn xác cho ngành Ngân hàng & Bất động sản.",
    formula: "P/B = Thị giá cổ phiếu / (Vốn chủ sở hữu / Số lượng cổ phiếu lưu hành)",
    benchmark:
      "P/B < 1.0x nghĩa là thị trường đang định giá doanh nghiệp thấp hơn giá trị tài sản kế toán; ngành ngân hàng VN thường có P/B từ 1.2x - 1.8x.",
    slug: "pb",
  },
  {
    term: "ROE",
    fullName: "Return on Equity (Lợi nhuận trên Vốn chủ sở hữu)",
    category: "Hiệu quả hoạt động",
    shortDef:
      "Thước đo cho thấy ban lãnh đạo tạo ra bao nhiêu đồng lợi nhuận từ 100 đồng vốn góp của cổ đông.",
    formula: "ROE = Lợi nhuận sau thuế / Vốn chủ sở hữu bình quân",
    benchmark:
      "Doanh nghiệp tuyệt vời thường có ROE duy trì liên tục trên 15% - 20% trong 3-5 năm liên tiếp mà không cần dùng đòn bẩy nợ quá đà.",
    slug: "roe",
  },
  {
    term: "ROA",
    fullName: "Return on Assets (Lợi nhuận trên Tổng tài sản)",
    category: "Hiệu quả hoạt động",
    shortDef:
      "Đo lường hiệu quả sinh lời trên toàn bộ nguồn lực tài sản (cả vốn tự có và vốn đi vay).",
    formula: "ROA = Lợi nhuận sau thuế / Tổng tài sản bình quân",
    benchmark:
      "Với ngân hàng, ROA > 1.8% - 2.0% là xuất sắc. Với doanh nghiệp sản xuất, ROA trên 10% là rất hiệu quả.",
    slug: "roa",
  },
  {
    term: "Biên lãi gộp",
    fullName: "Gross Profit Margin (Biên lợi nhuận gộp)",
    category: "Hiệu quả hoạt động",
    shortDef:
      "Tỷ lệ phần trăm doanh thu còn lại sau khi đã trừ đi trực tiếp giá vốn hàng bán (COGS).",
    formula: "Biên lãi gộp = (Doanh thu thuần - Giá vốn hàng bán) / Doanh thu thuần",
    benchmark:
      "Biên gộp phản ánh lợi thế cạnh tranh (moat) hoặc sức mạnh định giá sản phẩm (pricing power) của doanh nghiệp trước nhà cung ứng và đối thủ.",
    slug: "bien-lai-gop",
  },
  {
    term: "FCF",
    fullName: "Free Cash Flow (Dòng tiền tự do)",
    category: "Dòng tiền & Nợ",
    shortDef:
      "Số tiền mặt thực sự còn lại sau khi doanh nghiệp đã thanh toán chi phí vận hành và đầu tư tài sản cố định (CapEx).",
    formula: "FCF = Dòng tiền từ HĐKD (CFO) - Chi phí đầu tư tài sản cố định (CapEx)",
    benchmark:
      "Lợi nhuận kế toán có thể bị 'thổi phồng' bằng thủ thuật ghi nhận doanh thu, nhưng Dòng tiền tự do FCF dương đều đặn là minh chứng tiền tươi thóc thật.",
    slug: "fcf",
  },
  {
    term: "EBITDA",
    fullName: "Lợi nhuận trước Lãi vay, Thuế và Khấu hao",
    category: "Hiệu quả hoạt động",
    shortDef:
      "Đo lường khả năng sinh lời cốt lõi từ hoạt động kinh doanh mà loại bỏ tác động của cấu trúc vốn vay và chính sách kế toán khấu hao.",
    formula: "EBITDA = Lợi nhuận trước thuế + Chi phí lãi vay + Chi phí khấu hao tài sản",
    benchmark:
      "Thường dùng để so sánh các doanh nghiệp trong cùng ngành có mức độ đầu tư máy móc và đòn bẩy tài chính khác nhau.",
    slug: "ebitda",
  },
  {
    term: "CIR",
    fullName: "Cost to Income Ratio (Tỷ lệ Chi phí trên Thu nhập)",
    category: "Ngân hàng",
    shortDef:
      "Tỷ lệ phần trăm chi phí hoạt động của ngân hàng chiếm bao nhiêu phần thu nhập hoạt động thuần.",
    formula: "CIR = Tổng chi phí hoạt động / Tổng thu nhập hoạt động (TOI)",
    benchmark:
      "CIR càng thấp thể hiện ngân hàng vận hành bộ máy càng tinh gọn và chuyển đổi số hiệu quả. Ngân hàng hàng đầu có CIR quanh 28% - 35%.",
    slug: "cir",
  },
  {
    term: "D/E",
    fullName: "Debt to Equity Ratio (Hệ số Nợ trên Vốn chủ)",
    category: "Dòng tiền & Nợ",
    shortDef:
      "Mức độ đòn bẩy tài chính, cho thấy doanh nghiệp đang tài trợ hoạt động bằng bao nhiêu đồng nợ vay so với vốn chủ sở hữu.",
    formula: "D/E = Tổng nợ vay tài chính / Vốn chủ sở hữu",
    benchmark:
      "Với doanh nghiệp phi tài chính, D/E an toàn thường dưới 1.0x - 1.5x. Nếu D/E > 2.5x khi lãi suất tăng cao sẽ tiềm ẩn rủi ro thanh khoản rất lớn.",
    slug: "de",
  },
];

export const GLOSSARY_MAP = new Map(GLOSSARY_ITEMS.map((item) => [item.term.toUpperCase(), item]));
