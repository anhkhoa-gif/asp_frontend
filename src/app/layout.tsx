import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "OpenBoox - Thuê Sách Online | Giao Tận Nhà, Chỉ Từ 1.500đ/Ngày",
  description: "Nền tảng thuê sách trực tuyến hàng đầu Việt Nam với hơn 15.000+ đầu sách đa dạng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-white min-h-screen font-sans">
        <ClientLayoutWrapper 
          footer={
            <footer className="bg-soft py-20 px-8 border-t border-gray-100">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                      <span className="text-white font-black text-sm">O</span>
                    </div>
                    <span className="text-lg font-black tracking-tighter text-navy">OPENBOOX</span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    OpenBoox là nền tảng thuê sách trực tuyến, giúp bạn tiếp cận hàng ngàn đầu sách với chi phí tiết kiệm nhất.
                  </p>
                  <div className="flex gap-3">
                    {['f', 't', 'i', 'y'].map(s => (
                      <div key={s} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-muted hover:border-primary hover:text-primary cursor-pointer transition-all">{s}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-navy uppercase mb-6">Thông tin</h4>
                  <ul className="space-y-4 text-sm text-muted">
                    <li className="hover:text-primary cursor-pointer transition-colors">Về OpenBoox</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Tin tức & Sự kiện</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Tuyển dụng</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-navy uppercase mb-6">Dịch vụ</h4>
                  <ul className="space-y-4 text-sm text-muted">
                    <li className="hover:text-primary cursor-pointer transition-colors">Gói thuê cá nhân</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Gói thuê doanh nghiệp</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Quy trình giao nhận</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-navy uppercase mb-6">Chính sách</h4>
                  <ul className="space-y-4 text-sm text-muted">
                    <li className="hover:text-primary cursor-pointer transition-colors">Điều khoản sử dụng</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Chính sách bảo mật</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Chính sách bồi thường</li>
                  </ul>
                </div>
              </div>
              <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted/60">
                <p>&copy; 2026 OpenBoox. Tất cả quyền được bảo lưu.</p>
                <div className="flex gap-6">
                  <span>Hotline: 1900 633 633</span>
                  <span>Email: hello@openboox.vn</span>
                </div>
              </div>
            </footer>
          }
        >
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
