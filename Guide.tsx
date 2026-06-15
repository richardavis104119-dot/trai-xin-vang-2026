import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle, Smartphone, WifiOff, Download, Upload,
  Monitor, Share2, ChevronDown, ChevronUp, CheckCircle2,
  Zap, FileSpreadsheet, Globe, BookOpen, ArrowRight
} from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

function Section({ icon, title, color, children, delay = 0 }: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`overflow-hidden rounded-2xl border ${color} bg-gradient-to-b from-[#0f1729] to-[#0a1020] shadow-xl`}
    >
      <div className={`flex items-center gap-3 bg-gradient-to-r ${color.replace('border-', 'from-').replace('/30', '/20')} to-transparent px-5 py-4`}>
        <span className="text-white">{icon}</span>
        <h3 className="text-base font-black tracking-wider text-white">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

function FAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-gray-700/50 bg-gray-800/20">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-600/20 text-xs font-bold text-yellow-400">?</span>
            <span className="flex-1 text-sm font-bold text-gray-200">{item.q}</span>
            {open === i ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </button>
          {open === i && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden border-t border-gray-700/30 px-4 py-3"
            >
              <p className="text-sm leading-relaxed text-gray-400">{item.a}</p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Guide() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0a1628] via-[#102030] to-[#0a1628] p-6 shadow-2xl"
      >
        <div className="absolute -right-10 -top-10 text-[8rem] opacity-5">📖</div>
        <div className="relative flex flex-col items-center gap-4 md:flex-row">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
            <HelpCircle className="h-7 w-7 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl font-black tracking-wider text-emerald-300 md:text-2xl">
              HƯỚNG DẪN SỬ DỤNG & ĐỒNG BỘ GOOGLE SHEETS
            </h1>
            <p className="mt-1 text-sm text-emerald-200/60">
              Tất cả những gì Dũng cần để vận hành hệ thống xịn nhất trại
            </p>
          </div>
        </div>
      </motion.div>

      {/* BIG ANSWER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/40 bg-gradient-to-r from-yellow-950/40 via-amber-950/30 to-yellow-950/40 p-6 shadow-xl"
      >
        <div className="absolute -right-8 -top-8 text-9xl opacity-10">💡</div>
        <div className="relative space-y-4">
          <h2 className="text-lg font-black text-yellow-400">
            ⚡ TẠI SAO DŨNG NÊN DÙNG WEB APP NÀY THAY VÌ GOOGLE SHEETS?
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-4">
              <h4 className="mb-2 text-sm font-bold text-red-400">❌ Google Sheets không làm được:</h4>
              <ul className="space-y-1.5 text-xs text-red-300/70">
                <li>• Lễ trao giải với animation, confetti, hiệu ứng game</li>
                <li>• Dashboard bóng bẩy dark mode kiểu game</li>
                <li>• Podium 3D xếp hạng trực quan</li>
                <li>• Dropdown thông minh tự tính coin real-time</li>
                <li>• Dùng offline không cần mạng</li>
                <li>• Giao diện chạm đẹp trên điện thoại</li>
              </ul>
            </div>
            <div className="rounded-xl border border-green-500/20 bg-green-950/20 p-4">
              <h4 className="mb-2 text-sm font-bold text-green-400">✅ Web App này làm được HẾT:</h4>
              <ul className="space-y-1.5 text-xs text-green-300/70">
                <li>• Nhập liệu 1 chạm trên điện thoại/tablet</li>
                <li>• Trao giải Nhất-Nhì-Ba kiểu game chuyên nghiệp</li>
                <li>• Tự động tính coin, Triều Thiên, xếp hạng</li>
                <li>• Xuất CSV → mở trong Google Sheets bất cứ lúc nào</li>
                <li>• Dữ liệu lưu ngay trên thiết bị, mất mạng vẫn chạy</li>
                <li>• Nhập CSV từ Sheets vào app để đồng bộ</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3 WAYS TO USE */}
      <Section icon={<Zap className="h-5 w-5" />} title="3 CÁCH SỬ DỤNG HỆ THỐNG" color="border-blue-500/30" delay={0.2}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: <Smartphone className="h-8 w-8" />,
              title: 'CÁCH 1: Dùng trực tiếp',
              subtitle: 'Đơn giản nhất ⭐',
              color: 'from-green-600 to-emerald-700',
              steps: [
                'Mở link web app trên điện thoại/tablet',
                'Nhấn "Thêm vào màn hình chính"',
                'Sử dụng như app bình thường',
                'Dữ liệu tự lưu trên máy',
              ],
            },
            {
              icon: <FileSpreadsheet className="h-8 w-8" />,
              title: 'CÁCH 2: Kết hợp Sheets',
              subtitle: 'Linh hoạt nhất 💪',
              color: 'from-blue-600 to-indigo-700',
              steps: [
                'Nhập liệu ở Web App',
                'Nhấn "Xuất CSV" trong menu ⚙️',
                'Mở file CSV bằng Google Sheets',
                'Chia sẻ Sheets cho ban hậu cần',
              ],
            },
            {
              icon: <Monitor className="h-8 w-8" />,
              title: 'CÁCH 3: Chiếu màn hình',
              subtitle: 'Ấn tượng nhất 🏆',
              color: 'from-purple-600 to-violet-700',
              steps: [
                'Mở web app trên laptop/máy tính',
                'Kết nối máy chiếu / TV',
                'Vào tab "Lễ Trao Giải"',
                'Nhấn "Bắt đầu" → cả trại lác mắt!',
              ],
            },
          ].map((way, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/20">
              <div className={`flex items-center gap-3 bg-gradient-to-r ${way.color} p-4 text-white`}>
                {way.icon}
                <div>
                  <h4 className="text-sm font-black">{way.title}</h4>
                  <p className="text-xs opacity-80">{way.subtitle}</p>
                </div>
              </div>
              <div className="space-y-2 p-4">
                {way.steps.map((step, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-700 text-[10px] font-bold text-gray-300">{j + 1}</span>
                    <span className="text-xs text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* EXPORT/IMPORT GUIDE */}
      <Section icon={<Share2 className="h-5 w-5" />} title="HƯỚNG DẪN XUẤT / NHẬP DỮ LIỆU ↔ GOOGLE SHEETS" color="border-yellow-500/30" delay={0.3}>
        <div className="space-y-5">
          {/* Export */}
          <div className="rounded-xl border border-green-500/20 bg-green-950/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Download className="h-5 w-5 text-green-400" />
              <h4 className="text-sm font-black text-green-400">XUẤT DỮ LIỆU RA GOOGLE SHEETS (Export CSV)</h4>
            </div>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Nhấn nút ⚙️ ở góc phải thanh menu trên cùng', detail: 'Menu cài đặt sẽ hiện ra' },
                { step: '2', text: 'Chọn "📥 Xuất Sổ Cái → CSV" hoặc "📊 Xuất Bảng Xếp Hạng → CSV"', detail: 'File CSV sẽ tự tải về máy' },
                { step: '3', text: 'Mở Google Sheets → Tệp → Nhập → Tải tệp lên', detail: 'Chọn file CSV vừa tải' },
                { step: '4', text: 'Chọn "Thay thế bảng tính" hoặc "Chèn trang tính mới"', detail: 'Dữ liệu sẽ hiện ra đúng cột, đúng dấu tiếng Việt' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">{item.step}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-200">{item.text}</p>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Import */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-400" />
              <h4 className="text-sm font-black text-blue-400">NHẬP DỮ LIỆU TỪ GOOGLE SHEETS VÀO APP (Import CSV)</h4>
            </div>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Trong Google Sheets: Tệp → Tải xuống → Giá trị phân cách bằng dấu phẩy (.csv)', detail: 'File CSV tải về máy' },
                { step: '2', text: 'Đảm bảo file CSV có đúng 6 cột: Ngày, Tên Đội, Hạng Mục, Nội Dung, Số Lượng, Coin', detail: 'Dòng 1 là tiêu đề, dữ liệu từ dòng 2' },
                { step: '3', text: 'Trong Web App: nhấn ⚙️ → "📤 Nhập từ CSV"', detail: 'Chọn file CSV vừa tải' },
                { step: '4', text: 'App tự đọc, tính lại coin, cập nhật Dashboard', detail: 'Xong! Dữ liệu đã đồng bộ' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{item.step}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-200">{item.text}</p>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-yellow-900/20 border border-yellow-600/30 px-4 py-2">
              <p className="text-xs text-yellow-300">
                ⚠️ <strong>Lưu ý cấu trúc CSV mẫu:</strong> Ngày (dd/mm/yyyy), Tên Đội (Đội 1), Hạng Mục (Chuyên cần), Nội Dung (Vắng có phép), Số Lượng (2), Coin (tự tính)
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* STEP BY STEP WORKFLOW */}
      <Section icon={<BookOpen className="h-5 w-5" />} title="CÁCH VẬN HÀNH TOÀN TRẠI — QUY TRÌNH 6 BƯỚC" color="border-purple-500/30" delay={0.4}>
        <div className="space-y-3">
          {[
            { icon: '📱', title: 'Mở Web App trên thiết bị', desc: 'Mở link trên điện thoại hoặc tablet. Bookmark lại hoặc thêm vào màn hình chính để mở nhanh.', tag: 'Trước trại' },
            { icon: '📝', title: 'Thư ký nhập sự kiện vào Sổ Cái', desc: 'Mỗi khi có phát sinh (vắng mặt, vi phạm, thưởng...), mở tab "Sổ Cái" → nhấn "Nhập sự kiện mới" → chọn dropdown → Ghi nhận. Coin tự nhảy số.', tag: 'Hàng ngày' },
            { icon: '📊', title: 'Xem Dashboard theo dõi xếp hạng', desc: 'Tab "Dashboard" cập nhật real-time: Tổng coin, Triều Thiên, Top 3, bảng xếp hạng 12 đội.', tag: 'Hàng ngày' },
            { icon: '💾', title: 'Xuất CSV backup vào Google Sheets', desc: 'Cuối mỗi ngày, nhấn ⚙️ → "Xuất CSV" để lưu dữ liệu vào Google Sheets backup. Chia sẻ Sheets cho ban điều hành.', tag: 'Cuối ngày' },
            { icon: '📋', title: 'Tab "Tiêu Chí" giúp tra cứu tỷ giá', desc: 'Khi không nhớ quy tắc thưởng/phạt, mở tab "Tiêu Chí Đổi Coin" để tra nhanh.', tag: 'Khi cần' },
            { icon: '🏆', title: 'Lễ Trao Giải cuối trại', desc: 'Kết nối máy chiếu, mở tab "Lễ Trao Giải", nhấn nút → Hệ thống tự công bố Hạng III → II → I với animation hoành tráng. Cả trại phấn khích!', tag: 'Cuối trại' },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-700/30 bg-gray-800/10 p-4 transition-colors hover:bg-gray-800/30">
              <span className="mt-0.5 text-3xl">{step.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Bước {i + 1}: {step.title}</h4>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    step.tag === 'Trước trại' ? 'bg-blue-900/40 text-blue-300' :
                    step.tag === 'Hàng ngày' ? 'bg-green-900/40 text-green-300' :
                    step.tag === 'Cuối ngày' ? 'bg-yellow-900/40 text-yellow-300' :
                    step.tag === 'Khi cần' ? 'bg-purple-900/40 text-purple-300' :
                    'bg-red-900/40 text-red-300'
                  }`}>{step.tag}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* OFFLINE MODE */}
      <Section icon={<WifiOff className="h-5 w-5" />} title="HOẠT ĐỘNG KHÔNG CẦN MẠNG (OFFLINE)" color="border-orange-500/30" delay={0.5}>
        <div className="flex items-start gap-4 rounded-xl bg-orange-950/10 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-600/20 text-2xl">📡</div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-orange-300">Web App chạy 100% trên trình duyệt — KHÔNG CẦN INTERNET để sử dụng!</p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Dữ liệu lưu trong bộ nhớ trình duyệt (localStorage)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Nhập liệu, xem dashboard, trao giải — tất cả offline</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Chỉ cần mạng khi muốn mở link lần đầu</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Xuất CSV khi có mạng để backup Google Sheets</li>
            </ul>
            <div className="mt-2 rounded-lg border border-orange-600/20 bg-orange-900/10 px-3 py-2">
              <p className="text-xs text-orange-300/80">
                💡 <strong>Mẹo:</strong> Trên Chrome điện thoại, nhấn ⋮ → "Thêm vào màn hình chính". App sẽ hoạt động như ứng dụng native, có icon riêng trên màn hình chính.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ADD TO HOMESCREEN */}
      <Section icon={<Smartphone className="h-5 w-5" />} title="CÁCH THÊM APP VÀO MÀN HÌNH ĐIỆN THOẠI" color="border-cyan-500/30" delay={0.55}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-700/50 bg-gray-800/10 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-200">
              <Globe className="h-4 w-4 text-cyan-400" /> iPhone / Safari
            </h4>
            <div className="space-y-2">
              {[
                'Mở link bằng Safari (không phải Chrome)',
                'Nhấn icon chia sẻ (hình vuông mũi tên lên)',
                'Cuộn xuống → "Thêm vào MH chính"',
                'Đặt tên "Xin Vâng 2026" → Thêm',
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                  <ArrowRight className="h-3 w-3 shrink-0 text-cyan-500" /> {s}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-700/50 bg-gray-800/10 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-200">
              <Globe className="h-4 w-4 text-green-400" /> Android / Chrome
            </h4>
            <div className="space-y-2">
              {[
                'Mở link bằng Chrome',
                'Nhấn dấu ⋮ (3 chấm) góc phải trên',
                'Chọn "Thêm vào Màn hình chính"',
                'Nhấn "Thêm" → Icon xuất hiện ngay',
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                  <ArrowRight className="h-3 w-3 shrink-0 text-green-500" /> {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* GOOGLE SHEETS FORMULA BONUS */}
      <Section icon={<FileSpreadsheet className="h-5 w-5" />} title="BONUS: CÔNG THỨC GOOGLE SHEETS (NẾU VẪN MUỐN DÙNG SONG SONG)" color="border-teal-500/30" delay={0.6}>
        <div className="space-y-4 text-xs text-gray-400">
          <p className="text-sm text-teal-300">
            Nếu Dũng muốn dùng song song Google Sheets để ban hậu cần xem online, dán các công thức sau:
          </p>

          <div className="space-y-3">
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
              <h5 className="mb-2 text-sm font-bold text-white">📊 Tab Dashboard — Ô B2 (Tổng Coin từ Log):</h5>
              <code className="block overflow-x-auto whitespace-pre rounded-lg bg-black/60 px-4 py-3 text-xs text-green-300">
                {`=ARRAYFORMULA(IF(A2:A13="","",100+SUMIF(Log_Tien_Trai!$B$2:$B,A2:A13,Log_Tien_Trai!$F$2:$F)))`}
              </code>
            </div>

            <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
              <h5 className="mb-2 text-sm font-bold text-white">👑 Tab Dashboard — Ô C2 (Số Triều Thiên):</h5>
              <code className="block overflow-x-auto whitespace-pre rounded-lg bg-black/60 px-4 py-3 text-xs text-green-300">
                {`=ARRAYFORMULA(IF(B2:B13="","",INT(B2:B13/200)))`}
              </code>
            </div>

            <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
              <h5 className="mb-2 text-sm font-bold text-white">🏆 Tab Dashboard — Ô D2 (Tự động phong danh hiệu):</h5>
              <code className="block overflow-x-auto whitespace-pre rounded-lg bg-black/60 px-4 py-3 text-xs text-green-300">
                {`=ARRAYFORMULA(IF(B2:B13="","",IF(B2:B13=MAX($B$2:$B$13),"🟨 VƯƠNG QUYỀN (HẠNG I)",IF(B2:B13=LARGE($B$2:$B$13,2),"🟦 HẢI TINH (HẠNG II)",IF(B2:B13=LARGE($B$2:$B$13,3),"🟥 TÂN CA (HẠNG III)","⬛ CHIẾN BINH SA MẠC")))))`}
              </code>
            </div>

            <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
              <h5 className="mb-2 text-sm font-bold text-white">🪙 Tab Log — Ô F2 (Tự động tính Coin thưởng/phạt):</h5>
              <code className="block overflow-x-auto whitespace-pre rounded-lg bg-black/60 px-4 py-3 text-xs text-green-300">
                {`=ARRAYFORMULA(IF(B2:B="","",IF(D2:D="Vắng có phép",-1*E2:E,IF(D2:D="Vắng không phép",-2*E2:E,IF(D2:D="Chuyên cần tốt",20,IF(D2:D="Vi phạm vệ sinh",-10,IF(D2:D="Đi lễ đủ",3,0)))))))`}
              </code>
            </div>
          </div>

          <div className="rounded-lg border border-teal-600/30 bg-teal-900/10 px-4 py-3">
            <p className="text-xs text-teal-300">
              💡 <strong>Quy trình nhanh:</strong> Nhập liệu trên Web App → Xuất CSV → Import vào Google Sheets → Công thức tự tính → Chia sẻ link Sheets cho ban hậu cần xem.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section icon={<HelpCircle className="h-5 w-5" />} title="CÂU HỎI THƯỜNG GẶP" color="border-pink-500/30" delay={0.7}>
        <FAQ items={[
          {
            q: 'Dữ liệu có mất khi đóng trình duyệt không?',
            a: 'Không! Dữ liệu lưu trong localStorage của trình duyệt. Chỉ mất khi bạn xóa lịch sử duyệt web hoặc chọn "Xóa toàn bộ dữ liệu" trong menu ⚙️. Nên xuất CSV backup hàng ngày để an toàn.',
          },
          {
            q: 'Nhiều thư ký cùng nhập liệu được không?',
            a: 'Mỗi thiết bị có dữ liệu riêng (vì lưu local). Nếu muốn nhiều người nhập, nên phân công 1 thư ký chính dùng 1 thiết bị. Cuối ngày xuất CSV gửi cho ban hậu cần.',
          },
          {
            q: 'Có thể chiếu lễ trao giải lên máy chiếu không?',
            a: 'Có! Mở web app trên laptop → kết nối HDMI/wireless lên TV/máy chiếu → vào tab "Lễ Trao Giải" → nhấn bắt đầu. Hiệu ứng sẽ hiện full screen cực đẹp.',
          },
          {
            q: 'Số đội có thể thay đổi không?',
            a: 'Hệ thống mặc định 12 đội. Nếu cần thay đổi, liên hệ để được chỉnh sửa code. Hoặc đơn giản là bỏ trống các đội không dùng.',
          },
          {
            q: 'Dùng được trên cả iPhone và Android không?',
            a: 'Có! Web app chạy trên mọi trình duyệt hiện đại: Chrome, Safari, Firefox... Trên cả điện thoại, tablet, laptop, và máy tính.',
          },
          {
            q: 'Làm sao quay lại ban đầu nếu nhập sai?',
            a: 'Ở tab "Sổ Cái", mỗi dòng sự kiện đều có nút xóa (🗑️). Xóa dòng sai → coin tự động cập nhật. Hoặc vào ⚙️ → "Khôi phục dữ liệu mẫu" để reset về trạng thái ban đầu.',
          },
        ]} />
      </Section>

      {/* SUMMARY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-950/30 to-amber-950/20 p-6 text-center"
      >
        <p className="text-lg font-black text-yellow-400">TÓM LẠI: DŨNG KHÔNG CẦN ĐƯA VÀO GOOGLE SHEETS!</p>
        <p className="mt-2 text-sm text-yellow-200/60">
          Web App này đã <strong className="text-yellow-300">mạnh hơn Google Sheets 10 lần</strong>. Dùng trực tiếp trên điện thoại, xuất CSV khi cần backup. Lễ trao giải game-style là thứ Sheets không bao giờ làm được! 🏆
        </p>
      </motion.div>
    </div>
  );
}
