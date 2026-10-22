# Vườn Truyện Nhỏ

Website truyện kể tiếng Việt cho trẻ: xem hoạt hình, nghe kể chuyện, trả lời câu hỏi. HTML/CSS/JavaScript thuần, không cần bước build.

## Xem trên máy

Chạy `node preview.cjs` rồi mở http://127.0.0.1:4173. Trên Windows có thể bấm đúp `chay-demo.bat`.

## Nội dung

40 truyện, 160 cảnh hoạt hình, 120 câu hỏi, chia theo 11 thể loại: Ngụ ngôn, Tình bạn, Cổ tích, Trước giờ ngủ, Kỹ năng sống, Thói quen tốt, Học đếm & màu sắc, Đồng dao & thơ, Thiên nhiên, Gia đình và **Dân gian Việt Nam** (Cây Tre Trăm Đốt, Sự Tích Dưa Hấu, Tích Chu, Bánh Chưng Bánh Dày, Cây Khế, Cóc Kiện Trời, Chú Cuội Cung Trăng, Đeo Nhạc Cho Mèo, Mèo Dạy Hổ). Đồng dao dân gian: Con Mèo Mà Trèo Cây Cau, Dung Dăng Dung Dẻ, Bà Còng Đi Chợ, Con Kiến Mà Leo Cành Đa. Bài thơ "Đàn Gà Con" là bài thơ mới viết (không phải bài thơ cùng tên của Phạm Hổ). Phần lớn dành cho bé mầm non (3–5 tuổi). Lời kể được biên soạn mới; không lấy lại hình hoặc âm thanh từ website tham khảo.

### Sửa và thêm truyện

- Nội dung nằm trong `dist/data.js`. Lời thoại viết theo mẫu `Thỏ Mẹ dặn: “Con chơi gần nhà thôi nhé!”`: tên người nói đứng đầu lời dẫn, lời nhân vật đặt trong ngoặc kép “ ”. Tên người nói, giọng đọc và nhân vật mấp máy miệng khai báo trong `dist/speech.js`.
- Dàn cảnh truyện cũ ở `dist/animation.js` (một `case` theo id truyện); truyện dân gian Việt Nam ở `dist/animation-vn.js` (một hàm theo id truyện). Chuyển động mới ở `dist/vn.css`.
- Sửa lời xong thì tạo lại giọng kể (xem mục Giọng kể). Khi file giọng chưa khớp lời mới, trang tự chạy phụ đề theo thời gian thay vì đọc lời cũ.
- Câu hỏi được tráo thứ tự đáp án mỗi lần hỏi.

## Cấu trúc

- `dist/index.html`, `dist/site.css`, `dist/app.js`: trang chủ (lưới thẻ truyện) và trang xem truyện (`#/truyen/<id>`): màn mở đầu, điều khiển cảnh, giọng/nhạc, toàn màn hình, bài học, câu hỏi có đọc to và tính 1–3 sao.
- `dist/characters.js`: vẽ hơn 40 nhân vật, gồm cả người Việt (bà, vua, phú ông, ông Bụt, Bà Tiên, anh nông dân, bé gái) và cóc, cua, ong, tôm, tép, dê, hổ, sói, chim lạ; trước đây là 20 nhân vật (Thỏ, Gấu, Heo, Chuột, Cáo, Sư Tử, Mèo, Sóc, Cú, Gà Trống, Gà Mái, Gà Con, Vịt, Chim Sẻ, Bồ Câu, Quạ, Rùa, Kiến, bé trai, ông) và kiểu "Mẹ" (thêm `-mom`, ví dụ `rabbit-mom`: nơ hoa và tạp dề). Viền mực, đổ bóng khối, mắt có tròng và ánh sáng, biểu cảm theo tâm trạng. Ghi đè hàm vẽ nhân vật cũ trong `cinema-art.js` nhưng giữ tên các bộ phận chuyển động.
- `dist/animation.js`, `dist/cinema-art.js`, `dist/animation.css`, `dist/cinema.css`: hoạt hình 2D. Mỗi cảnh gồm nhiều lớp HTML: nền SVG tĩnh (vẽ một lần), lớp đạo cụ, mỗi nhân vật một lớp riêng, lớp hiệu ứng; máy quay và di chuyển dùng CSS transform để trình duyệt xử lý bằng GPU. Cảnh vẽ ở khung 960×540 rồi được `app.js` phóng theo kích thước khung chứa.
- `dist/audio/`: giọng kể MP3 tiếng Việt cho phần mở đầu, từng câu của mỗi cảnh, bài học, câu hỏi và lời khen. `audio/manifest.js` liệt kê câu chữ, file, thời lượng và người nói.

## Thao tác khi xem truyện

Chạm vào khung hình để dừng/phát, vuốt ngang để chuyển cảnh. Bàn phím: Space hoặc K dừng/phát, ← → chuyển cảnh, F toàn màn hình, M bật/tắt nhạc. Trang nhớ cảnh đang xem dở và đánh dấu truyện đã xem; màn hình được giữ sáng khi đang phát (trình duyệt hỗ trợ Wake Lock).

## Giọng kể

Người kể dùng giọng nữ HoaiMy, chậm và ấm. Lời thoại sau dấu hai chấm (ví dụ "Thỏ Mẹ dặn: Con chơi ở gần nhà thôi nhé") được đọc bằng giọng của nhân vật: con nhỏ giọng cao, mẹ giọng dịu, ông/bác/Sư Tử dùng giọng nam NamMinh trầm, Cáo giọng nam lém lỉnh, Gà Trống giọng nam vang. Bảng tên nhân vật nằm ở `SPEAKERS` trong `dist/speech.js`, bảng giọng ở `VOICES` trong `tools/gen-audio.mjs`. Bà, vua, phú ông, ông Bụt, Bà Tiên… có giọng riêng. Khi phát, nhân vật đang nói mấp máy miệng và phụ đề hiện tên người nói. Đồng dao, thơ được đọc ngắt nhịp theo từng vế.

Giọng kể được thu sẵn thành MP3 nên phát được trên mọi máy, không phụ thuộc giọng đọc cài trong thiết bị. Phụ đề chạy theo từng câu và tự chuyển cảnh khi đọc xong. Nếu không tải được file âm thanh, phụ đề vẫn chạy theo thời gian.

Sau khi sửa lời kể trong `dist/data.js`, tạo lại giọng kể (trên Windows có thể bấm đúp `tao-giong-doc.bat`):

```
cd tools
npm install
node gen-audio.mjs
```

Script chỉ tạo các câu mới hoặc đã sửa và xóa file không còn dùng. Script dùng dịch vụ đọc văn bản trực tuyến của Microsoft Edge qua thư viện không chính thức `msedge-tts`, nên cần mạng và có thể ngừng hoạt động nếu Microsoft thay đổi dịch vụ.

## Xuất bản

Đưa thư mục `dist/` lên Cloudflare Pages hoặc hosting tĩnh bất kỳ. Số sao và cài đặt giọng/nhạc lưu trong localStorage của trình duyệt.
