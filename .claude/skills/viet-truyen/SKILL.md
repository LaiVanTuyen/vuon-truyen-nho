---
name: viet-truyen
description: Viết hoặc chuyển thể lời kể, lời thoại, bài học và câu hỏi cho một truyện thiếu nhi trong dist/data.js của Vườn Truyện Nhỏ, sao cho sinh động, truyền cảm, hợp bé 3–5 tuổi và đúng quy ước để giọng đọc nhận ra người nói. Dùng khi viết truyện mới, chuyển thể truyện dân gian, sửa lời cho hay hơn, hoặc soạn câu hỏi.
---

# Viết truyện cho bé

## Định dạng trong `dist/data.js`

```js
{id:'ten-khong-dau',title:'Tên Truyện',category:'Ngụ ngôn',age:3,minutes:3,animal:'rabbit',friend:'turtle',color:'#e8edd4',tag:'Sự kiên trì',desc:'Một câu ngắn gợi tò mò.',moral:'Bài học 1–2 câu, xưng "chúng mình".',scenes:[
['Tên cảnh 1','Lời kể cảnh 1…'],
['Tên cảnh 2','…'],['Tên cảnh 3','…'],['Tên cảnh 4','…']],
quiz:[['Câu hỏi?',['Đáp án A','Đáp án B','Đáp án C'],chỉ_số_đáp_án_đúng], …3 câu]},
```

- `category` lấy một trong các thể loại đã có: Ngụ ngôn, Tình bạn, Cổ tích, Trước giờ ngủ, Kỹ năng sống, Thói quen tốt, Học đếm & màu sắc, Đồng dao & thơ, Thiên nhiên, Gia đình, Dân gian Việt Nam. Thể loại `Đồng dao & thơ` được đọc ngắt nhịp theo dấu phẩy.
- `animal`, `friend`: `type` nhân vật chính và bạn đồng hành, dùng để vẽ thẻ truyện (xem `tao-nhan-vat`).
- `color`: màu nền pastel nhạt của thẻ truyện. `age`: 3–6. `minutes`: 2–4.
- Mỗi truyện có **6–8 cảnh** (tối thiểu 4) và **3 câu hỏi, mỗi câu 3 đáp án**.

## Quy ước lời thoại (bắt buộc, giọng đọc dựa vào đây)

`<lời dẫn có tên người nói>: “<lời nhân vật>”`

- Dùng đúng ngoặc kép cong `“ ”`, không dùng `"`. Có dấu hai chấm ngay trước `“`.
- Tên người nói phải là **tên xuất hiện đầu tiên** trong lời dẫn. Viết `Thỏ hỏi Rùa: “…”` thì Thỏ nói. Viết `Thấy Rùa, Thỏ hỏi: “…”` thì sẽ thành **Rùa nói**, sai. Hãy đặt người nói lên đầu: `Thỏ thấy Rùa liền hỏi: “…”`.
- Tên người nói phải có trong `SPEAKERS` của `dist/speech.js`. Nếu chưa có, khai báo thêm (xem `giong-ke`).
- Câu cả nhóm cùng nói (`Cả nhà reo lên: “…”`) được đọc bằng giọng trẻ con mặc định. Như vậy là đúng.
- Lời nghĩ trong đầu cũng dùng quy ước này: `Gấu nghĩ bụng: “…”`.

## Khung truyện: 4 hồi, trải trên 6–8 cảnh

Mỗi hồi chiếm 1–3 cảnh. Ví dụ truyện 8 cảnh: Mở (cảnh 1–2), Rắc rối (cảnh 3–4), Cố gắng (cảnh 5–6), Kết (cảnh 7–8). Mỗi cảnh có 2–4 lượt đối đáp.

| Hồi | Nhiệm vụ | Cách làm sinh động |
|---|---|---|
| 1. Mở | Giới thiệu nhân vật bằng **một nét riêng dễ nhớ** và điều nhân vật muốn | Mở bằng hình ảnh hoặc âm thanh: "Tưng tưng tưng, Thỏ nhảy khắp rừng." Có lời thoại ngay trong cảnh này. |
| 2. Rắc rối | Xuất hiện khó khăn, thử thách hoặc lỗi lầm | Tăng căng thẳng nhẹ: "Bỗng nhiên…", "Ối!". Kết cảnh bằng một câu treo. |
| 3. Cố gắng | Thử lần 1, lần 2, lần 3 (**quy tắc ba lần**), lặp lại có biến tấu | Đoạn nhân vật lặp lại một câu ("Từng bước nhỏ, từng bước nhỏ") để bé đọc theo. Hỏi bé: "Bé đoán xem…?" |
| 4. Kết | Giải quyết, cảm xúc ấm áp, hành động tốt | Có lời xin lỗi, cảm ơn hoặc ôm nhau. Kết bằng hình ảnh vui hoặc yên bình, không giảng đạo lý trong cảnh (bài học để ở `moral`). |

Câu cuối mỗi cảnh (trừ cảnh cuối) nên là **móc câu**, kiểu phim ngắn: một câu hỏi, một chuyện bất ngờ, hay một âm thanh lạ khiến bé muốn xem cảnh sau.

## Viết cho tai nghe (truyền cảm khi đọc)

- Mỗi cảnh **120–280 ký tự** (các truyện hiện có trung bình khoảng 180), 3–6 câu, có **2–4 lượt thoại**. Câu kể dưới 120 ký tự (dài hơn sẽ bị tách theo dấu phẩy).
- **Câu ngắn ở chỗ gay cấn**, câu dài hơn ở chỗ êm đềm. Trước cao trào, viết vài câu thật ngắn: "Thỏ chạy. Chạy mãi. Không kịp nữa rồi!"
- Dùng **từ láy, từ tượng thanh, tượng hình**: lạch bạch, tưng tưng, khò khò, ừng ực, rộp rộp, lấp lánh, phì phò. Mỗi cảnh ít nhất một từ.
- **Thán từ** để giọng đọc lên cảm xúc: Ôi! Ối! A ha! Hoan hô! Ơ kìa…
- **Lặp lại có biến tấu** ("qua hòn đá, qua bụi hoa, qua cả chỗ Thỏ đang ngủ") để tạo nhịp.
- Dấu câu điều khiển giọng đọc: `,` nghỉ ngắn, `…` ngập ngừng hoặc hồi hộp, `!` vui và nhanh hơn, `?` lên giọng. Không dùng ngoặc đơn, gạch đầu dòng, emoji, chữ IN HOA hay viết tắt. Số viết bằng chữ ("ba quả táo").
- Mỗi nhân vật có **giọng văn riêng**: Cáo nói lém lỉnh và hay khen nịnh, Rùa nói chậm rãi, Gà Con nói líu lo câu ngắn, ông bà nói "cháu ơi…".
- Lời thoại là lời nói thật của trẻ con, không phải văn viết: "Tớ xin lỗi nhé!" thay vì "Tôi thành thật xin lỗi bạn."

## Chuyển thể truyện dân gian và cổ tích

- Tự viết lại lời mới. Không chép lời hay hình từ sách hoặc website khác (README đã cam kết điều này).
- **Làm dịu** chi tiết đáng sợ cho bé 3–5 tuổi: không có cái chết hay bạo lực được tả ra, không trả thù tàn nhẫn. Kẻ xấu thì biết lỗi, bỏ đi, hoặc bị chê cười. Ghi lại những gì đã làm dịu vào mục 1 của hồ sơ.
- Giữ chi tiết văn hóa đúng: tên gọi, món ăn, lễ Tết, câu thần chú quen thuộc ("Khắc nhập, khắc nhập!").
- Đồng dao giữ nguyên lời dân gian. Thơ mới viết thì ghi rõ trong README (như bài "Đàn Gà Con").

## Bài học và câu hỏi

- `moral`: 1–2 câu, nói điều nên làm (không nói "không được…"), xưng "chúng mình".
- Câu 1 hỏi nhớ lại chi tiết, câu 2 hỏi ai hoặc thứ tự sự việc, câu 3 hỏi bé sẽ làm gì ngoài đời.
- Đáp án ngắn (≤ 5 từ), các đáp án sai phải hợp lý và vui, không dùng đáp án đánh đố. Thứ tự đáp án được tráo khi hiển thị, nên chỉ số đúng là theo mảng gốc.

## Kiểm tra trước khi giao

Chạy `node tools/kiem-tra-truyen.mjs <id>`, sửa hết LỖI, rồi đọc to từng cảnh một lần trong đầu: chỗ nào vấp thì thêm dấu phẩy hoặc tách câu.
