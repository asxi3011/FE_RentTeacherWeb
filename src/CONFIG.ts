export const BASE_URL = "http://localhost:8080";
export const suggestionsMajor = [
    // Công nghệ - Kỹ thuật
    "Công nghệ thông tin", "Khoa học máy tính", "Kỹ thuật phần mềm", "An toàn thông tin", "Hệ thống thông tin",
    "Kỹ thuật điện", "Kỹ thuật điện tử", "Kỹ thuật viễn thông", "Cơ điện tử", "Kỹ thuật cơ khí",
    "Kỹ thuật ô tô", "Kỹ thuật xây dựng", "Công nghệ sinh học", "Công nghệ thực phẩm", "Kỹ thuật môi trường",
    "Trí tuệ nhân tạo", "Khoa học dữ liệu", "Robot và tự động hóa", "Kỹ thuật hàng không", "Kỹ thuật y sinh",

    // Y tế - Sức khỏe
    "Y khoa", "Dược học", "Điều dưỡng", "Răng - Hàm - Mặt", "Y học cổ truyền",
    "Xét nghiệm y học", "Kỹ thuật phục hồi chức năng", "Quản lý bệnh viện", "Dinh dưỡng và An toàn thực phẩm",

    // Kinh tế - Quản lý
    "Quản trị kinh doanh", "Marketing", "Tài chính - Ngân hàng", "Kế toán", "Kinh tế quốc tế",
    "Thương mại điện tử", "Quản trị nhân sự", "Quản lý chuỗi cung ứng", "Logistics", "Bảo hiểm",
    "Bất động sản", "Kinh doanh quốc tế", "Quản trị khách sạn", "Quản trị du lịch và lữ hành",

    // Luật - Hành chính
    "Luật", "Luật kinh tế", "Luật quốc tế", "Quan hệ công chúng", "Quản lý nhà nước", "Chính trị học",
    "Khoa học quản lý", "Công tác xã hội", "Báo chí - Truyền thông", "Quản lý công nghiệp",

    // Sư phạm - Giáo dục
    "Sư phạm Toán", "Sư phạm Văn", "Sư phạm Anh", "Sư phạm Lý", "Sư phạm Hóa",
    "Sư phạm Sinh", "Sư phạm Lịch sử", "Sư phạm Địa lý", "Sư phạm Tiểu học", "Giáo dục mầm non",
    "Giáo dục đặc biệt", "Tâm lý học giáo dục", "Quản lý giáo dục",

    // Nghệ thuật - Thiết kế
    "Kiến trúc", "Thiết kế đồ họa", "Thiết kế nội thất", "Xây dựng", "Quy hoạch đô thị",
    "Mỹ thuật công nghiệp", "Thời trang", "Sân khấu điện ảnh", "Nhạc viện", "Diễn viên",
    "Đạo diễn", "Nhiếp ảnh", "Hoạt hình & Game Design",

    // Ngôn ngữ - Khoa học xã hội
    "Ngôn ngữ Anh", "Ngôn ngữ Trung", "Ngôn ngữ Nhật", "Ngôn ngữ Hàn", "Ngôn ngữ Pháp",
    "Ngôn ngữ Đức", "Quan hệ quốc tế", "Triết học", "Văn hóa học", "Xã hội học",
    "Lịch sử", "Địa lý học", "Tâm lý học", "Công tác xã hội", "Nhân học",

    // Thể dục - Thể thao
    "Giáo dục thể chất", "Huấn luyện thể thao", "Quản lý thể thao", "Y học thể thao",

    // Các ngành đặc thù khác
    "Hàng không", "Kỹ thuật tàu thủy", "Khoa học hàng hải", "Kỹ thuật điện lạnh", "Nông nghiệp công nghệ cao",
    "Khoa học cây trồng", "Chăn nuôi - Thú y", "Kỹ thuật địa chất", "Dầu khí", "Khí tượng thủy văn"
];

export const companiesSuggestions = [
    "FPT Corporation",
    "VNG Corporation",
    "Viettel Group",
    "VNPT",
    "CMC Corporation",
    "Momo",
    "Vietcombank",
    "Techcombank",
    "BIDV",
    "MB Bank",
    "VPBank",
    "Vingroup",
    "Novaland",
    "Sun Group",
    "Hoà Bình Construction",
    "Phú Mỹ Hưng",
    "Thế Giới Di Động (MWG)",
    "Lazada Việt Nam",
    "Tiki",
    "Shopee Việt Nam",
    "Central Retail Vietnam",
    "VinFast",
    "Hòa Phát Group",
    "Petrovietnam (PVN)",
    "SABECO",
    "Vietnam Airlines",
    "VietJet Air",
    "Grab Vietnam",
    "DHL Vietnam",
    "Masan Group"
];

export const certificatesSuggestions = [
    "AWS Certified Solutions Architect",
    "Google Professional Cloud Architect",
    "Microsoft Certified: Azure Solutions Architect",
    "Cisco Certified Network Associate (CCNA)",
    "CompTIA Security+",
    "Certified Information Systems Security Professional (CISSP)",
    "Project Management Professional (PMP)",
    "Scrum Master Certified (SMC)",
    "Certified Business Analysis Professional (CBAP)",
    "Chartered Financial Analyst (CFA)",
    "Certified Public Accountant (CPA)",
    "TOEFL (Test of English as a Foreign Language)",
    "IELTS (International English Language Testing System)",
    "Cambridge English: C1 Advanced (CAE)",
    "Google Digital Marketing & E-commerce",
    "HubSpot Content Marketing Certification",
    "Certified Ethical Hacker (CEH)",
    "Six Sigma Green Belt",
    "Data Science Professional Certificate (IBM)",
    "Oracle Certified Professional (OCP)"
];

export const POST_API_CREATE_TEACHER = `${BASE_URL}/teacher/add`


export const MIXIMUM_DESCRIPTION = 20;
export const MAXIMUM_DESCRIPTION = 200;
export const MINIMUM_GRADUATE = 1
export const MAXIMUM_GRADUATE = 2
export const MAXIMUM_EXPERIENCE = 4
export const MAXIMUM_CERTIFICATE = 4
export const MAX_FILE_SIZE = 4 * 1024 * 1024
export const MAX_UPLOAD_FILE = 10 * 1024 * 1024
export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png']

export const TYPE_TIME_WORK = ["FULLTIME", "PARTTIME"]
export const WAGE_PAYMENTS = ["DAY", "HOUR", "WEEK", "MONTH"]