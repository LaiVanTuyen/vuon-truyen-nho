# Vườn Truyện Nhỏ

Website truyện kể tiếng Việt cho trẻ: xem hoạt hình, nghe kể chuyện, trả lời câu hỏi. HTML/CSS/JavaScript thuần, không cần bước build.

## Xem trên máy

Chạy `node preview.cjs` rồi mở http://127.0.0.1:4173.

## Nội dung

28 truyện, 112 cảnh hoạt hình, 84 câu hỏi, chia theo 10 thể loại: Ngụ ngôn, Tình bạn, Cổ tích, Trước giờ ngủ, Kỹ năng sống, Thói quen tốt, Học đếm & màu sắc, Đồng dao & thơ, Thiên nhiên, Gia đình. Phần lớn dành cho bé mầm non (3–5 tuổi). Lời kể được biên soạn mới; bài "Con mèo mà trèo cây cau" là đồng dao dân gian, bài thơ "Đàn Gà Con" là bài thơ mới viết (không phải bài thơ cùng tên của Phạm Hổ). Không lấy lại hình hoặc âm thanh từ website tham khảo. Sửa nội dung trong `dist/data.js`; thêm truyện mới cần cả phần dàn cảnh trong `dist/animation.js` (một `case` theo id truyện), rồi chạy lại script tạo giọng kể.

## Cấu trúc

- `dist/index.html`, `dist/site.css`, `dist/app.js`: trang chủ (lưới thẻ truyện) và trang xem truyện (`#/truyen/<id>`): màn mở đầu, điều khiển cảnh, giọng/nhạc, toàn màn hình, bài học, câu hỏi có đọc to và tính 1–3 sao.
- `dist/characters.js`: vẽ 20 nhân vật (Thỏ, Gấu, Heo, Chuột, Cáo, Sư Tử, Mèo, Sóc, Cú, Gà Trống, Gà Mái, Gà Con, Vịt, Chim Sẻ, Bồ Câu, Quạ, Rùa, Kiến, bé trai, ông) và kiểu "Mẹ" (thêm `-mom`, ví dụ `rabbit-mom`: nơ hoa và tạp dề). Viền mực, đổ bóng khối, mắt có tròng và ánh sáng, biểu cảm theo tâm trạng. Ghi đè hàm vẽ nhân vật cũ trong `cinema-art.js` nhưng giữ tên các bộ phận chuyển động.
- `dist/animation.js`, `dist/cinema-art.js`, `dist/animation.css`, `dist/cinema.css`: hoạt hình 2D. Mỗi cảnh gồm nhiều lớp HTML: nền SVG tĩnh (vẽ một lần), lớp đạo cụ, mỗi nhân vật một lớp riêng, lớp hiệu ứng; máy quay và di chuyển dùng CSS transform để trình duyệt xử lý bằng GPU. Cảnh vẽ ở khung 960×540 rồi được `app.js` phóng theo kích thước khung chứa.
- `dist/audio/`: giọng kể MP3 tiếng Việt cho phần mở đầu, từng câu của mỗi cảnh, bài học, câu hỏi và lời khen. `audio/manifest.js` liệt kê câu chữ, file, thời lượng và người nói.

## Thao tác khi xem truyện

Chạm vào khung hình để dừng/phát, vuốt ngang để chuyển cảnh. Bàn phím: Space hoặc K dừng/phát, ← → chuyển cảnh, F toàn màn hình, M bật/tắt nhạc. Trang nhớ cảnh đang xem dở và đánh dấu truyện đã xem; màn hình được giữ sáng khi đang phát (trình duyệt hỗ trợ Wake Lock).

## Giọng kể

Người kể dùng giọng nữ HoaiMy, chậm và ấm. Lời thoại sau dấu hai chấm (ví dụ "Thỏ Mẹ dặn: Con chơi ở gần nhà thôi nhé") được đọc bằng giọng của nhân vật: con nhỏ giọng cao, mẹ giọng dịu, ông/bác/Sư Tử dùng giọng nam NamMinh trầm, Cáo giọng nam lém lỉnh, Gà Trống giọng nam vang. Bảng tên nhân vật và giọng nằm ở `SPEAKERS`/`VOICES` trong `tools/gen-audio.mjs`. Khi phát, nhân vật đang nói mấp máy miệng và phụ đề hiện tên người nói. Đồng dao, thơ được đọc ngắt nhịp theo từng vế.

Giọng kể được thu sẵn thành MP3 nên phát được trên mọi máy, không phụ thuộc giọng đọc cài trong thiết bị. Phụ đề chạy theo từng câu và tự chuyển cảnh khi đọc xong. Nếu không tải được file âm thanh, phụ đề vẫn chạy theo thời gian.

Sau khi sửa lời kể trong `dist/data.js`, tạo lại giọng kể:

```
cd tools
npm install
node gen-audio.mjs
```

Script chỉ tạo các câu mới hoặc đã sửa và xóa file không còn dùng. Script dùng dịch vụ đọc văn bản trực tuyến của Microsoft Edge qua thư viện không chính thức `msedge-tts`, nên cần mạng và có thể ngừng hoạt động nếu Microsoft thay đổi dịch vụ.

## Xuất bản

Đưa thư mục `dist/` lên Cloudflare Pages hoặc hosting tĩnh bất kỳ. Số sao và cài đặt giọng/nhạc lưu trong localStorage của trình duyệt.
