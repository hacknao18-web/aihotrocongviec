# Trợ lý quản lý công việc giảng viên

Website/PWA hỗ trợ giảng viên quản lý công việc cá nhân theo mô hình:

**THỰC TRẠNG -> AI HỖ TRỢ -> HIỆU QUẢ**

Ứng dụng không cần backend. Dữ liệu được lưu bằng `localStorage` trên trình duyệt hoặc trong app PWA sau khi cài.

## Cách dùng thuận tiện trên Android và iOS

Cách phù hợp nhất là đưa thư mục này lên một địa chỉ **HTTPS**, sau đó cài như ứng dụng:

- Android: mở bằng Chrome, chọn **Cài đặt ứng dụng** hoặc **Thêm vào màn hình chính**.
- iPhone/iPad: mở bằng Safari, bấm nút **Chia sẻ**, chọn **Thêm vào Màn hình chính**.

Sau khi cài, app mở như ứng dụng riêng, có icon, có màn hình độc lập và có thể mở lại khi không có mạng sau lần tải đầu.

Lưu ý quan trọng: iOS không cho cài PWA từ Chrome/Edge; cần dùng Safari. PWA trên điện thoại cũng cần HTTPS, trừ trường hợp thử nghiệm trên `localhost`.

## Cách thử trên máy tính

Trong thư mục dự án, chạy:

```bash
node server.js
```

Sau đó mở:

```text
http://localhost:8080
```

## Cách thử trên điện thoại cùng Wi-Fi

Chạy:

```bash
node server.js
```

Màn hình sẽ hiện địa chỉ dạng:

```text
http://192.168.x.x:8080
```

Điện thoại kết nối cùng Wi-Fi có thể mở địa chỉ đó để xem giao diện mobile. Tuy nhiên, để **cài PWA thật** trên điện thoại, nên đưa app lên HTTPS như GitHub Pages, Netlify, Vercel hoặc hosting của đơn vị.

## Chức năng chính

- Thêm, sửa, xóa và đánh dấu hoàn thành công việc.
- Quản lý tiêu đề, mô tả, loại công việc, mức ưu tiên, hạn chót và trạng thái.
- Dashboard tổng hợp tổng số công việc, việc hoàn thành, việc đang làm, việc quá hạn và tỷ lệ hoàn thành.
- AI gợi ý công việc nên ưu tiên, kế hoạch trong ngày/tuần, chia nhỏ việc lớn và cảnh báo deadline.
- Nhắc việc sắp đến hạn, đánh dấu đỏ việc quá hạn và việc ưu tiên cao.
- Lọc theo loại công việc, trạng thái, mức ưu tiên và tìm kiếm theo tên.
- Biểu đồ thống kê đơn giản theo trạng thái và loại công việc.
- Có thể cài như PWA và dùng lại khi không có mạng sau lần tải đầu.

## Mô tả từng file

- `index.html`: Cấu trúc giao diện và các thẻ hỗ trợ PWA/mobile cho Android, iOS.
- `style.css`: Định dạng giao diện responsive, vùng an toàn iPhone, thẻ công việc, dashboard và biểu đồ.
- `script.js`: Xử lý dữ liệu, lưu `localStorage`, thêm/sửa/xóa công việc, lọc/tìm kiếm, thống kê, tạo gợi ý AI và đăng ký service worker.
- `manifest.webmanifest`: Khai báo tên app, màu chủ đạo, icon, chế độ hiển thị và đường dẫn khởi động.
- `service-worker.js`: Lưu cache các file chính để app có thể mở lại khi không có mạng.
- `server.js`: Máy chủ tĩnh cục bộ để thử app qua `localhost` hoặc trong cùng Wi-Fi.
- `assets/icon.svg`, `assets/icon-180.png`, `assets/icon-192.png`, `assets/icon-512.png`: Icon dùng cho PWA trên Android và iOS.

## Khi nào cần APK/IPA?

Nếu muốn phát hành qua Google Play hoặc App Store, có thể bọc app này bằng Capacitor để tạo APK/AAB cho Android và IPA cho iOS. Android có thể làm trên Windows; iOS thường cần máy Mac và tài khoản Apple Developer.
