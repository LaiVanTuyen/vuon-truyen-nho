---
name: giong-ke
description: Giọng kể và âm thanh cho Vườn Truyện Nhỏ. Bao gồm gán giọng theo vai cho nhân vật (SPEAKERS trong dist/speech.js, VOICES trong tools/gen-audio.mjs), chỉnh lời để Edge TTS đọc truyền cảm, tạo lại MP3 giọng kể, và nhạc nền. Dùng khi thêm nhân vật biết nói, giọng đọc sai người hoặc đọc đều đều, cần tạo lại giọng sau khi sửa lời, hoặc muốn thêm âm thanh.
---

# Giọng kể truyền cảm

Đường đi của một câu: `dist/data.js` → `SPEECH.split()` (`dist/speech.js`) tách thành lời dẫn và lời thoại → mỗi câu một file MP3 (`tools/gen-audio.mjs`, Edge TTS) → `dist/audio/manifest.js` → `app.js` phát lần lượt từng câu, cho người đang nói mấp máy miệng và chạy phụ đề. Trang web và script tạo giọng dùng chung một hàm tách câu, nên hai bên luôn khớp nhau.

## 1. Khai báo người nói: `SPEAKERS` trong `dist/speech.js`

Mỗi dòng: `['Tên trong lời dẫn', 'vai giọng', 'type trên sân khấu' | ['type1','type2']]`

- Tên được so **phân biệt chữ hoa, chữ thường**, khớp theo nguyên từ. Nếu tên có thể đứng giữa câu thì thêm cả bản viết thường (`['Bà',…]` và `['bà',…]`).
- Khi lời dẫn có nhiều tên, **tên xuất hiện trước thắng**. Nếu hai tên bắt đầu cùng một chỗ thì tên dài hơn thắng, nên `Thỏ Mẹ` thắng `Thỏ`. Vì vậy chỉ cần thêm tên cụ thể, không phải sắp xếp lại bảng.
- Cột 3 là nhân vật sẽ mấp máy miệng. Nếu là danh sách thì lấy nhân vật đầu tiên có mặt trong cảnh. Để `''` nếu người nói không hiện hình (Gió, Đất Mẹ, hạt mầm).
- Đặt dòng mới vào đúng nhóm (Mẹ/bà · Ông/bác · Con vật) để dễ tìm.

## 2. Vai giọng: `VOICES` trong `tools/gen-audio.mjs`

Edge TTS chỉ có hai giọng tiếng Việt: nữ **HoaiMy** và nam **NamMinh**. Mỗi vai được tạo ra bằng cách chỉnh **tốc độ (rate)** và **cao độ (pitch)**:

| Vai | Giọng | Dùng cho |
|---|---|---|
| `narrator` | nữ, chậm, ấm | người kể |
| `poem` | nữ, chậm hơn, cao | đồng dao, thơ |
| `cheer` | nữ, cao, vui | tên truyện, câu hỏi, lời khen |
| `child` | nữ, cao | trẻ con, con vật nhỏ, mặc định khi không rõ ai nói |
| `tiny` | nữ, rất cao, nhanh | Gà Con, Kiến, Chim Sẻ, Chuột Nhắt |
| `mother` / `lady` / `grandma` | nữ dịu / nữ trang nhã / nữ trầm chậm | mẹ / Bà Tiên, vợ / bà |
| `oldman` / `uncle` / `man` | nam trầm chậm / nam trầm / nam thường | ông, Bụt, Cú Mèo / bác, Gấu lớn / chàng trai |
| `king` / `big` | nam rất trầm chậm / nam trầm nhất | vua, Trời / Sư Tử, Sói, Hổ |
| `rich` / `sly` / `proud` | nam hơi cao / nam lém lỉnh / nam vang | phú ông / Cáo, Mèo / Gà Trống, Cóc, Gió |

- Hãy ưu tiên dùng vai có sẵn. Chỉ thêm vai mới khi tính cách thật sự khác. Giữ `pitch` trong khoảng −20…+30% và `rate` trong khoảng −20…+10%. Ra ngoài khoảng này giọng sẽ méo, nghe như máy.
- Hàm `prosody()` đã tự xử lý: câu kết bằng `!` thì cao hơn và nhanh hơn, câu kết bằng `?` thì lên giọng.

## 3. Viết để máy đọc truyền cảm

TTS không hiểu cảm xúc, nó chỉ dựa vào **dấu câu và cách chia câu**. Mỗi câu được thu thành một file riêng, nên **giữa hai câu luôn có một khoảng nghỉ tự nhiên**.

| Muốn | Viết |
|---|---|
| Hồi hộp, chờ đợi | `Rồi… cánh cửa từ từ mở ra.` (ba chấm `…` là một ký tự) |
| Dồn dập ở cao trào | Nhiều câu thật ngắn: `Sói thổi. Phù! Phù! Nhà rơm bay mất!` |
| Nhấn một từ | Đặt từ đó ở cuối câu, sau dấu phẩy: `Người về đích trước, chính là… Rùa!` |
| Nghỉ lấy hơi | Dấu phẩy. Câu kể dài quá 120 ký tự sẽ bị tách tại dấu phẩy. |
| Nhịp đồng dao | Thể loại `Đồng dao & thơ`: mỗi vế cách nhau bằng dấu phẩy, mỗi câu thơ kết bằng dấu chấm |
| Tiếng động | Viết từ tượng thanh thành câu riêng có `!`: `Ùm!` `Cốc, cốc, cốc!` |

Tránh: chữ số (viết "ba con heo"), viết tắt, ngoặc đơn, chữ IN HOA, emoji, dấu `-` ở đầu câu, ngoặc kép thẳng `"`. Những thứ này làm máy đọc sai hoặc làm hỏng việc nhận lời thoại.

## 4. Tạo lại giọng

```
cd tools
npm install            # lần đầu
node gen-audio.mjs --dry   # xem có bao nhiêu câu sẽ tạo mới
node gen-audio.mjs         # cần mạng; chỉ tạo câu mới hoặc câu đã sửa, xóa file thừa
```

Trên Windows có thể bấm đúp `tao-giong-doc.bat`. Tên file là mã băm của giọng, tham số và câu chữ. Vì vậy **mỗi lần đổi `VOICES` hay đổi vai của một người nói, mọi câu của vai đó sẽ được tạo lại**. Thư viện `msedge-tts` không chính thức nên đôi khi lỗi mạng; script tự thử lại 6 lần. Chạy xong, kiểm tra lại bằng `node tools/kiem-tra-truyen.mjs`, không được còn chú ý "giọng kể chưa khớp".

Nghe thử: mở truyện, nghe đủ các cảnh. Chú ý ba chỗ: lời thoại đúng giọng nhân vật, nhân vật đúng người mấp máy miệng, và không có chỗ ngắt câu vô lý.

## 5. Nhạc và tiếng động

- Nhạc nền là giai điệu sinh bằng Web Audio trong `app.js` (`music`). Nhạc tự nhỏ đi khi có giọng đọc (`music.duck`). Không cần file nhạc.
- **Hiện chưa có tiếng động (SFX).** Nếu muốn thêm, hãy hỏi người dùng trước, vì phải sửa code. Cách gợi ý: sinh tiếng bằng Web Audio trong `app.js` (tiếng chuông cho `sparkles`, tiếng "bụp" khi chuyển cảnh, tiếng vỗ tay cho `confetti`), phát theo `event` của cảnh, âm lượng nhỏ hơn giọng kể và tắt theo nút nhạc. Không lấy file âm thanh của website khác.
