---
name: tao-nhan-vat
description: Thiết kế hồ sơ nhân vật và vẽ nhân vật SVG mới hoặc biến thể (màu, phụ kiện, kiểu "Mẹ", người Việt) trong dist/characters.js của Vườn Truyện Nhỏ, giữ nhân vật nhất quán giữa các cảnh và các truyện. Dùng khi truyện cần nhân vật chưa có, khi cần đổi hoặc sửa hình nhân vật, hoặc khi lập bảng nhân vật cho một bộ truyện.
---

# Tạo hình nhân vật

Các nền tảng làm phim AI phải dùng ảnh tham chiếu ba góc nhìn và LoRA để giữ nhân vật không bị đổi mặt. Ở dự án này nhân vật được **vẽ bằng code**, nên cùng một `type` luôn ra cùng một hình. Muốn nhân vật nhất quán thì chỉ cần **một nhân vật = một `type` cố định**, kèm một hồ sơ ghi rõ.

## 1. Hồ sơ nhân vật

Ghi vào mục 2 của `ke-hoach/<id>.md`. Nhân vật xuất hiện ở nhiều truyện thì ghi vào `ke-hoach/nhan-vat.md`.

```markdown
### Rùa
- type: turtle          (có sẵn / cần vẽ mới / biến thể của …)
- Tên trong lời dẫn: Rùa          → SPEAKERS: ['Rùa','child','turtle']
- Tính cách (3 từ): chậm rãi, kiên trì, hiền
- Dấu hiệu nhận ra: mai xanh lá, cười hiền
- Cỡ trên sân khấu (k): 1.1–1.35     Đứng ở: bên trái khi đi cùng Thỏ
- Vai giọng: child     Câu cửa miệng: "Từng bước nhỏ…"
- Chuyển động hay dùng: turtle-forward, idle, celebrate
```

Quy tắc giữ nhất quán:
- Trong cùng một truyện, **không đổi `type` và không đổi cỡ quá ±0.2**, trừ khi máy quay cố ý zoom.
- Hai nhân vật cùng loài phải phân biệt được: dùng kiểu `-mom` (nơ hoa và tạp dề), hoặc thêm một biến thể có màu và khăn khác (xem mục 3).
- Mẹ và con cùng loài: mẹ có cỡ k ≈ 1.6–1.7, con k ≈ 1.1–1.3.

## 2. Nhân vật đang có

Gọi bằng `window.drawToonCharacter(type, mood)`.

- **Con vật:** `rabbit bear pig mouse fox lion cat squirrel goat wolf tiger turtle ant owl bird crow duck chick rooster hen sparrow phoenix toad crab bee shrimp tep`, cùng `mouse-old` (chuột già đeo kính).
- **Kiểu Mẹ:** thêm `-mom` vào con vật có thân thú, ví dụ `rabbit-mom bear-mom pig-mom`. Riêng chim dùng `duck-mom hen-mom` (có nơ).
- **Người:** `human-child human-child2 human-boy human-girl human-elder human-man human-man2 human-coat human-lady human-fairy human-grandma human-king human-rich human-but human-thunder`.

Tâm trạng được lấy theo **chuyển động** (`moodOf` trong `characters.js`), không truyền riêng:

| Chuyển động | Mặt |
|---|---|
| `sleep`, `nap` | mắt nhắm, ngáy |
| `celebrate` | mắt cười híp |
| `wave boast hug-child hug-parent relax` | cười tươi |
| `sad concern lie` | buồn, lông mày cụp |
| `tremble shiver float-distress` | sợ, mắt to, giọt mồ hôi |
| `explain boast argue` | đang nói |
| `strain huff hammer gnaw` | gắng sức, nghiến răng |
| `argue huff` | tức giận |

## 3. Thêm nhân vật: chọn cách nhẹ nhất có thể

1. **Có sẵn loài gần giống, chỉ khác màu.** Thêm một bảng màu vào `Object.assign(P,{…})`, rồi dùng lại hình của loài gốc (giống cách `wolf` dùng hình `fox`, `tiger` dùng hình `cat`, xem đầu hàm `drawToonCharacter`).
2. **Người Việt mới** (ông lão, cô Tấm, chàng trai…): thêm một dòng vào `HUM` với các thuộc tính `top topS leg hair hairC` và tùy chọn `skirt robe coat belly beard crown halo staff cane glasses wrinkle axe sash`. Không cần vẽ thêm gì.
3. **Thú bốn chân mới:** làm theo `goat`, thêm nhánh `type==='…'` vào 4 hàm `ears`, `headShape`, `muzzle`, `back`, cộng một bảng màu trong `P`. Nếu muốn có khăn quàng thì thêm loài đó vào danh sách `neck`.
4. **Hình dạng hoàn toàn mới** (như cóc, cua, ong, tôm): viết hàm riêng `ten(id,p,m)` rồi gọi từ `drawToonCharacter`.

Quy tắc khi vẽ (để hoạt hình còn chạy và giữ đúng phong cách):
- Khung vẽ `viewBox -160 -260 320 340`. **Chân chạm y ≈ 0–24** (bóng ở cy=26), đầu quanh y ≈ -80. Nhân vật nhìn thẳng ra trước.
- **Giữ đúng tên các bộ phận** để CSS điều khiển được: `rig-head rig-arm left/right rig-leg left/right rig-ear rig-tail rig-wing rig-blink rig-pupil rig-mouth rig-scarf`. Thiếu `rig-mouth` thì nhân vật không mấp máy miệng khi nói.
- Màu ghi `#hex` trong bảng `P`/`HUM` và đổi qua `R()` thành `rgb()`, vì `app.js` có bộ tăng màu cho dạng hex. Viền dùng `O(độ dày)` (mực nâu `INK`). Dùng gradient lông từ `grads(id,p)` với các khóa: `l` sáng, `b` chính, `s` bóng, `m` bụng/mõm, `a` điểm nhấn, `n` mũi, `i` tròng mắt, `sc` khăn.
- Mặt dùng lại `eye()`, `brows()`, `mouth()`, `blush()` để có đủ biểu cảm theo tâm trạng.
- Phong cách chung: tròn, mập, mắt to có ánh sáng, má hồng, màu tươi nhưng không gắt, không có chi tiết đáng sợ (sói và hổ cũng phải trông ngộ nghĩnh).

## 4. Kiểm tra hình

1. `node tools/kiem-tra-truyen.mjs`. Nhân vật chưa khai báo sẽ báo LỖI "không có hình" (loại lạ bị vẽ thành Gấu, nên phải dựa vào báo cáo này).
2. `node preview.cjs`, mở truyện có nhân vật đó, xem lần lượt các tâm trạng: đứng yên, nói, cười, buồn, sợ, ngủ. Cùng lúc xem nhân vật đứng cạnh các nhân vật khác để so cỡ và màu.
3. Nếu sau này cần đưa nhân vật sang các tool làm video AI (Toonflow, LocalMiniDrama…) làm ảnh tham chiếu, hãy xuất SVG của `drawToonCharacter(type, mood)` ra PNG theo nhiều tâm trạng. Đó chính là "bảng nhân vật" cho các tool đó.
