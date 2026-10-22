# Vườn Truyện Nhỏ

Website tiếng Việt dành cho trẻ, HTML/CSS/JavaScript thuần, không cần bước build.

## Xem trên máy

Chạy `node preview.cjs` rồi mở http://127.0.0.1:4173.

## Nội dung

12 truyện, 48 cảnh minh họa, 36 câu hỏi. Lời kể được biên soạn mới; ba truyện Hạt Mầm Bé Xíu, Thỏ Con Chào Mặt Trăng, Gấu Con Biết Xin Lỗi là nội dung mới. Tranh SVG được tạo bằng mã trong `dist/app.js`. Không lấy lại hình hoặc âm thanh từ website tham khảo.

Sửa nội dung trong `dist/data.js`. Tệp xuất bản nằm trong `dist/`. Có thể đưa thư mục này lên Cloudflare Pages như một website tĩnh, không cần cài thư viện.

## Chức năng

Tìm kiếm, phân loại và lọc tuổi; lưu yêu thích; một hồ sơ bạn nhỏ; lưu cảnh đang đọc; tự chuyển cảnh; đọc bằng Web Speech API với giọng tiếng Việt của thiết bị; tốc độ đọc; toàn màn hình trên trình duyệt hỗ trợ; trắc nghiệm cho thử lại và tính 1–3 sao; huy hiệu; lịch sử; đếm thời gian nghe; giới hạn thời gian nghe; chế độ trước giờ ngủ; hỗ trợ giảm chuyển động.

Dữ liệu lưu ở localStorage của trình duyệt, không có đăng nhập hoặc đồng bộ đám mây. Góc phụ huynh không có khóa tài khoản. Giọng kể phụ thuộc thiết bị: thiếu giọng tiếng Việt thì tự chuyển cảnh với thông báo, không giả vờ có âm thanh. Tranh có chuyển động nhẹ, không phải phim hoạt hình hoàn chỉnh. Giới hạn thời gian chỉ áp dụng phát/tự chuyển lời kể, vẫn cho đọc chữ thủ công.
