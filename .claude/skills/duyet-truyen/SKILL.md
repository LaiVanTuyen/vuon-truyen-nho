---
name: duyet-truyen
description: Duyệt một truyện hoặc toàn bộ truyện của Vườn Truyện Nhỏ trước khi xuất bản. Chạy kiểm tra tự động (tools/kiem-tra-truyen.mjs), chấm độ sinh động và truyền cảm, kiểm tra an toàn cho trẻ 3–5 tuổi, xem hình và nghe giọng. Dùng sau khi viết hoặc sửa truyện, trước khi commit, hoặc khi người dùng hỏi "truyện này ổn chưa", "rà lại truyện".
---

# Duyệt truyện

Làm theo bước "duyệt thành phẩm" của drama-skills và cổng chất lượng của Wind Comic: **máy kiểm tra trước, người xem sau**, và ghi kết quả vào mục 5 của `ke-hoach/<id>.md`.

## 1. Kiểm tra tự động (bắt buộc)

```
node tools/kiem-tra-truyen.mjs <id>      # bỏ <id> để kiểm tra mọi truyện
```

- **LỖI** phải sửa hết: thiếu trường dữ liệu, ngoặc kép sai hoặc lệch, chỉ số đáp án sai, đáp án trùng, nhân vật chưa có hình, truyện chưa dàn cảnh, SPEAKERS trỏ tới nhân vật không tồn tại.
- **CHÚ Ý**: đọc từng dòng.
  - "giọng trẻ con mặc định" là đúng nếu cả nhóm cùng nói.
  - "không có nhân vật … trên sân khấu" thì xem có nên đưa người nói vào cảnh không. Riêng Trời hay Vua nói vọng từ xa thì để vậy cũng được.
  - "giọng kể chưa khớp" thì phải tạo lại giọng.
- Script cũng có thể chạy lúc đang viết, không cần mạng.

## 2. Chấm độ sinh động (mỗi tiêu chí 1–5, cần trung bình ≥ 4)

| Tiêu chí | 5 điểm khi |
|---|---|
| Móc câu | Câu đầu cảnh 1 có hình ảnh hoặc âm thanh. Cuối các cảnh (trừ cảnh cuối) thường có câu treo hoặc câu hỏi bé. |
| Nhịp | Có xen câu ngắn và câu dài. Cao trào dồn dập, kết êm. Có lặp lại ba lần. |
| Âm thanh của chữ | Mỗi cảnh có từ láy hoặc tượng thanh, có thán từ. Đọc to thấy vui tai. |
| Lời thoại | Mỗi cảnh có 2–4 lượt thoại. Mỗi nhân vật có giọng văn riêng, nghe như trẻ con nói thật. |
| Cảm xúc | Nhân vật trải qua thay đổi cảm xúc rõ (vui → lo → cố gắng → hạnh phúc). Chuyển động và máy quay đi theo cảm xúc đó. |
| Bài học | Bài học hiện ra qua hành động. `moral` nói điều nên làm. Câu hỏi 3 nối được với đời sống của bé. |

Tiêu chí nào dưới 4 thì đề xuất **câu viết lại cụ thể** (trích câu cũ và câu mới), không chỉ nhận xét chung chung.

## 3. An toàn cho trẻ (một điểm sai là phải sửa)

- Không có cái chết, máu, đánh nhau hay hình phạt tàn nhẫn được tả ra. Kẻ xấu không bị hành hạ.
- Không có hành vi nguy hiểm mà bé có thể bắt chước nếu truyện không chỉ ra cách làm đúng (qua đường, leo cao, đi theo người lạ, chơi gần nước).
- Không chê ngoại hình, không định kiến giới tính hay vùng miền. Lời trêu chọc trong truyện phải được sửa lại ở cuối truyện.
- Không có từ ngữ khó hoặc từ Hán Việt mà bé không hiểu, trừ khi được giải thích ngay trong câu.
- Truyện dân gian đã làm dịu theo `viet-truyen`, và hồ sơ có ghi lại những gì đã làm dịu.

## 4. Xem và nghe (người duyệt phải tự làm)

`node preview.cjs`, mở `http://127.0.0.1:4173/#/truyen/<id>`:
- [ ] Đủ các cảnh. Không có hình bị cắt, không có nhân vật bị vẽ thành Gấu do sai `type`.
- [ ] Người đang nói mấp máy miệng, phụ đề hiện đúng tên.
- [ ] Giọng đúng vai (mẹ dịu, Cáo lém lỉnh…). Không có chỗ ngắt câu vô lý.
- [ ] Cảnh tự chuyển khi đọc xong. Bài học và 3 câu hỏi được đọc to. Khen và tính sao hoạt động.
- [ ] Thu cửa sổ về khổ điện thoại: hình và bong bóng vẫn ổn.
- [ ] Thẻ truyện ở trang chủ có đúng màu, đúng nhân vật, nằm đúng thể loại.

Claude không tự nghe được âm thanh. Hãy báo rõ phần nào đã tự kiểm tra bằng script và phần nào người dùng cần tự xem, nghe.

## 5. Ghi kết quả

```markdown
## 5. Duyệt (ngày …)
- kiem-tra-truyen: 0 lỗi, 1 chú ý (Trời nói từ xa — giữ nguyên)
- Điểm: móc câu 5 · nhịp 4 · âm thanh 5 · thoại 4 · cảm xúc 4 · bài học 5 → 4.5
- An toàn: đạt
- Đã sửa: …        Cần người dùng xem/nghe: …
```
