---
name: dan-canh
description: Phân cảnh và dựng hoạt hình 2D cho một truyện của Vườn Truyện Nhỏ (bối cảnh, máy quay, vị trí và chuyển động nhân vật, đạo cụ, hiệu ứng) trong dist/stage.js, kèm dàn cảnh nền trong dist/animation-vn.js và CSS chuyển động mới trong dist/vn.css. Dùng khi cần dàn cảnh cho truyện mới, sửa cảnh bị lỗi hình, hoặc làm cảnh sinh động hơn.
---

# Dàn cảnh hoạt hình

Làm theo cách "bàn đạo diễn" của Toonflow, BigBanana và Wind Comic: mỗi cảnh phải có **bảng phân cảnh** trước, viết code sau. Ở đây mỗi cảnh chỉ cần **một khung hình chính**, chuyển động do CSS lo. **Bong bóng thoại tự hiện trên đầu người đang nói** (`liveBubble` trong `app.js`), nên không cần tự vẽ bong bóng. Chỉ cần người nói có mặt trên sân khấu.

## 1. Bảng phân cảnh (mục 3 của `ke-hoach/<id>.md`)

| Cảnh | Thế giới | Đêm | Máy quay | Nhân vật: type, x, y, k, động tác | Đạo cụ sau / trước | Hiệu ứng |
|---|---|---|---|---|---|---|
| 1 | forest | | (tự chọn) | rabbit 300,345,1.2 boast · turtle 620,345,1.3 idle | flag(840) / | |

Mỗi cảnh chỉ có **một khoảnh khắc chính**: chọn lúc gây cảm xúc mạnh nhất trong lời kể của cảnh đó.

## 2. Code trong `dist/stage.js`

`window.STAGE['<id>']` là một mảng, mỗi phần tử ứng với một cảnh trong `data.js`. Mỗi phần tử là một object, hoặc một hàm `H => object`:

```js
'ten-truyen': [
  {w: 'forest', c: [['rabbit', 300, 345, 1.2, 'boast'], ['turtle', 620, 345, 1.3, 'idle']], p: H => H.flag(840)},
  old(0),                                              // dùng lại nguyên dàn cảnh nền số 0
  add(1, [['owl', 330, 215, .75, 'explain']]),         // dàn cảnh nền số 1, thêm nhân vật
  swap(2, [['rabbit', 420, 323, 1.2, 'sleep']], {e: 'stars'}), // nền số 2, thay toàn bộ nhân vật
  {w: 'mountain', n: true, c: [...], f: () => P.bowl(560, 470, 1.1), e: 'sparkles', cam: 'camera-close'},
],
```

| Khóa | Ý nghĩa |
|---|---|
| `old: k` | Lấy dàn cảnh nền số k (cách dựng cũ 4 cảnh, ở `animation.js` hoặc `animation-vn.js`) làm nền |
| `w` | Thế giới: `garden forest village room river sea palace heaven moon dry mountain` |
| `n` | Ban đêm |
| `c` | Nhân vật: `[type, x, y, k, động_tác]`, hoặc hàm `H => html` cho trường hợp đặc biệt (như bay cõng nhau) |
| `addCast` | Thêm `c` vào nhân vật của nền thay vì thay thế (hàm `add`) |
| `p` / `f` | Đạo cụ phía sau / phía trước nhân vật. `keepProps: true` để giữ đạo cụ của nền |
| `e` | Hiệu ứng: `sparkles` (phép màu) · `hearts` (yêu thương) · `confetti` (chiến thắng) · `stars` (ước mơ, ban đêm) |
| `cam` | Máy quay (xem mục 4). Bỏ trống thì trang tự chọn. |
| `top` | Đưa lớp đạo cụ lên trên nhân vật |

- Sân khấu rộng 960×540, tâm nhân vật nằm khoảng x 120–840.
- Đất: y ≈ 330–350 với forest, garden, room; y ≈ 440–448 với village, sea, palace, heaven. Muốn chắc, xem cảnh có cùng thế giới.
- Cỡ k: con vật nhỏ và trẻ em 0.6–1.2; mẹ 1.6–1.7; vua 1.4; sư tử 1.8. Vật ở xa thì k nhỏ hơn và y nhỏ hơn.
- Đạo cụ: `H.` lấy từ `animation.js` (`tree house flag blocks apple appleTree basket bush rain teaCup log bloom ripples cake mouseHole butterfly soundRings notes nuts leavesFall snow card bouquet countPop mound turnip rainbow colorDots leafUmbrella orange areca cheese corn mud basin grains reeds`). `P.` là `window.VN_PROPS` từ `animation-vn.js` (`bambooGrove melon banhChung banhDay kheTree goldBag drum jar bell gate boat banyan starLantern bowl…`). Đạo cụ riêng thì viết ở đầu `stage.js` bằng `svgG(x, y, k, svg)`.
- Dàn cảnh nền của truyện mới (nếu cần) thêm vào `animation-vn.js` theo mẫu các hàm có sẵn trong object `S`.

## 3. Chọn động tác theo động từ trong lời kể

| Lời kể | Động tác |
|---|---|
| đi, bước | `walk` `walk-on` `bent-walk` (người già) · `sneak` (rón rén) |
| chạy, đuổi | `run` `dash` `race-away` `run-to-safe` `fox-exit` (bỏ đi) |
| nhảy, vui | `hop` `leap` `celebrate` |
| chào | `wave` · khoe khoang: `boast` · giảng giải: `explain` · cãi nhau: `argue` · tức: `huff` |
| buồn, lo | `sad` `concern` · sợ: `tremble` `shiver` · nằm: `lie` `sit-down` |
| ngủ | `sleep` `nap` · ngắm trăng: `look-moon` · thư giãn: `relax` |
| làm việc | `hammer` `strain` (kéo, đẩy) `tidy` (dọn) `gnaw` (gặm) `peck` (mổ) `drink` |
| bay | `flutter` `fly-in` `fly-away` `fly-wobble` `fly-safe` `fly-rescue` · bơi: `swim` |
| thương yêu | `hug-child` `hug-parent` · phép màu xuất hiện: `appear` |
| riêng một truyện | `jump-grapes` `turtle-forward` `pass-sleeper` `late-arrival` `climb-up` `drop-pebble` `fly-to-jug` `leaf-ride` `float-distress` `rescue-duck` `ant-shuttle` `bump-tower` `pounce` |

Nếu cần động tác mới, thêm `.motion.ten-moi` vào `dist/vn.css`:
- Chỉ dùng `transform` và `opacity`.
- Dùng biến `--d` để các nhân vật không nhún đồng loạt.
- Các bộ phận được điều khiển qua `.motion.ten-moi .rig-arm.left {…}`.
- Script kiểm tra sẽ báo nếu động tác chưa có CSS.

## 4. Máy quay

`camera-drift` (trôi nhẹ) · `camera-wide` (toàn cảnh) · `camera-follow` (đuổi theo) · `camera-close` (lại gần) · `camera-up` (nhìn lên).

Nếu cảnh không tự chọn, `compose()` trong `animation.js` tự chọn như sau:
- Cảnh 1: `wide`.
- Cảnh có nhân vật chạy, bay hoặc nhảy: `follow`.
- Cảnh cuối, khi mọi nhân vật đứng trong khoảng x 250–710: `close`.

Chỉ đặt `cam` khi muốn khác quy tắc này. Ví dụ `camera-up` cho cây cao, bầu trời; `camera-close` cho cảnh xin lỗi hay ôm nhau ở giữa truyện.

## 5. Quy tắc để cảnh sống động và liền mạch

- **Người đang nói phải có mặt trên sân khấu**, thì mới mấp máy miệng và có bong bóng thoại trên đầu. Script kiểm tra sẽ báo nếu thiếu. Nếu người nói ở xa thật (Vua ra lệnh từ kinh thành), để vậy cũng được.
- **Giữ hướng và chỗ đứng qua các cảnh liền nhau.** Nhân vật ở bên trái thì vẫn ở bên trái, trừ khi lời kể nói nhân vật đã di chuyển.
- **Đừng đặt nhân vật lên vật đang chuyển động** (thuyền trôi, mây bay): lớp nhân vật và lớp đạo cụ chuyển động riêng, nên nhân vật sẽ bị lơ lửng giữa trời.
- **Có ít nhất một thứ động trong mọi cảnh** ngoài nhân vật: lá rơi, gợn nước, bướm bay, mưa, lấp lánh.
- Không vẽ cảnh đáng sợ. Kẻ xấu có thể `huff` hoặc `fox-exit`, không có cảnh đánh nhau hay máu.

## 6. Xem thử

`node preview.cjs`, mở `http://127.0.0.1:4173/#/truyen/<id>`, dùng ← → để xem đủ các cảnh. Kiểm tra:
- Không có gì bị cắt khỏi khung.
- Bong bóng thoại không che mặt nhân vật khác.
- Cỡ nhân vật hợp lý.
- Hình vẫn ổn khi thu nhỏ cửa sổ về khổ điện thoại.
