---
name: tao-truyen
description: Quy trình đầy đủ để làm một truyện mới (hoặc làm lại truyện cũ) cho Vườn Truyện Nhỏ, từ ý tưởng tới khi lên web có hoạt hình, giọng kể và câu hỏi. Dùng khi người dùng nói "làm truyện mới", "thêm truyện", "chuyển thể truyện …", "làm lại truyện …", hoặc muốn làm cả một bộ truyện. Skill này điều phối các skill viet-truyen, tao-nhan-vat, dan-canh, giong-ke, duyet-truyen.
---

# Làm một truyện từ đầu tới cuối

Quy trình học theo các nền tảng làm phim AI (Toonflow, BigBanana: **Kịch bản → Tài sản → Khung hình**; drama-skills: mỗi tập có tài liệu riêng cho kịch bản, hình ảnh, phân cảnh và lời đọc), nhưng làm theo kiến trúc của dự án này: nhân vật vẽ bằng SVG trong code, hoạt hình bằng CSS, giọng kể là MP3 thu sẵn bằng Edge TTS. Không gọi API sinh ảnh hay video nào.

Nguyên tắc: **khóa từng lớp trước khi sang lớp sau.** Khi đã chốt nhân vật thì không đổi loài hay màu lúc dàn cảnh. Khi đã chốt phân cảnh thì sửa lời kể không được làm thay đổi ai có mặt trong cảnh.

## Hồ sơ kế hoạch

Mỗi truyện có một file `ke-hoach/<id>.md` để giữ mọi quyết định (không đưa lên web). Tạo file này ở bước 1, các bước sau ghi tiếp vào. Mẫu:

```markdown
# <Tên truyện> (<id>)
## 1. Khung truyện      ← viet-truyen
## 2. Nhân vật          ← tao-nhan-vat
## 3. Phân cảnh         ← dan-canh
## 4. Lời kể và giọng   ← giong-ke
## 5. Duyệt             ← duyet-truyen (ghi kết quả kiểm tra và điểm chấm)
```

## Các bước

| # | Việc | Skill | Kết quả | Cổng chặn (phải đạt mới đi tiếp) |
|---|---|---|---|---|
| 1 | Chọn truyện, độ tuổi, bài học; viết khung 6–8 cảnh | `viet-truyen` | Mục 1 của hồ sơ | Người dùng đồng ý khung truyện |
| 2 | Lập hồ sơ nhân vật; vẽ thêm nhân vật còn thiếu | `tao-nhan-vat` | Mục 2, sửa `dist/characters.js` nếu cần | Mọi nhân vật đều có `type` vẽ được |
| 3 | Phân cảnh: bối cảnh, máy quay, vị trí, động tác nhân vật | `dan-canh` | Mục 3, thêm vào `dist/stage.js` | Xem thử thấy đủ các cảnh |
| 4 | Viết lời kể đầy đủ và lời thoại cho truyền cảm; khai báo người nói | `viet-truyen` + `giong-ke` | Thêm vào `dist/data.js`, `dist/speech.js` | `node tools/kiem-tra-truyen.mjs <id>` báo 0 lỗi |
| 5 | Tạo giọng kể | `giong-ke` | `dist/audio/<id>/*.mp3`, `manifest.js` | Không còn chú ý "giọng kể chưa khớp" |
| 6 | Duyệt nội dung và hình | `duyet-truyen` | Mục 5 của hồ sơ | Không còn lỗi; điểm truyền cảm ≥ 4/5 |
| 7 | Cập nhật README (số truyện, số cảnh, thể loại); commit khi người dùng yêu cầu | | | |

Bước 1 làm xong phải dừng lại hỏi người dùng. Bước 2 và 3 có thể làm liền nhau. Nếu cần vẽ nhân vật mới, cho người dùng xem trước khi dàn cảnh.

## Làm cả một bộ nhiều truyện

- Lập `ke-hoach/bo-<tên>.md`: danh sách truyện, bài học của từng truyện, những nhân vật xuất hiện lại.
- Nhân vật dùng chung giữ nguyên `type`, màu, phụ kiện và vai giọng ở mọi truyện. Ghi họ vào `ke-hoach/nhan-vat.md` (bảng nhân vật chung, xem `tao-nhan-vat`).
- Làm xong trọn một truyện mẫu qua cả 7 bước rồi mới làm hàng loạt. Tạo giọng một lần cho cả bộ.

## Lệnh hay dùng

```
node tools/kiem-tra-truyen.mjs [id]      # kiểm tra nội dung, không cần mạng
cd tools && node gen-audio.mjs --dry     # đếm số câu cần tạo giọng
cd tools && node gen-audio.mjs           # tạo giọng (cần mạng)
node preview.cjs                          # xem ở http://127.0.0.1:4173/#/truyen/<id>
```
