# VREB V5 – Customer Portal + Bản đồ quy hoạch thật

## Điểm mới V5

- MapLibre GL JS chạy thật.
- Bản đồ có thể kéo, phóng to, xoay và xem tỷ lệ.
- OpenStreetMap là nền mặc định, chạy ngay không cần API key.
- Hỗ trợ VietMap qua biến môi trường.
- Trang bản đồ riêng tại `/ban-do-quy-hoach`.
- Lớp quy hoạch GeoJSON mẫu có màu và thông tin nguồn.
- Bật/tắt lớp quy hoạch và điểm sản phẩm.
- Marker dự án thật trên bản đồ.
- Bấm vùng quy hoạch để xem loại, nguồn, ngày cập nhật và độ tin cậy.
- Định vị trình duyệt.
- Tìm kiếm mẫu cho Quận 12, Tân Phú, Thủ Đức và Thuận An.
- Responsive trên điện thoại.

## Chạy local

```bash
npm install
npm run dev
```

Mở:

- Trang chủ: http://localhost:3000
- Bản đồ quy hoạch: http://localhost:3000/ban-do-quy-hoach

## VietMap

Tạo `.env.local`:

```env
NEXT_PUBLIC_VIETMAP_MAP_KEY=YOUR_KEY
NEXT_PUBLIC_VIETMAP_STYLE_URL=https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=YOUR_KEY
```

Sau khi sửa `.env.local`, dừng và chạy lại:

```bash
npm run dev
```

## Cảnh báo dữ liệu

`public/data/planning-sample.geojson` chỉ là dữ liệu minh họa kỹ thuật. Không được dùng làm kết luận pháp lý hay quy hoạch chính thức.

## Deploy Render

1. Up toàn bộ thư mục lên GitHub.
2. Render → New → Blueprint.
3. Chọn repository.
4. Thêm `NEXT_PUBLIC_VIETMAP_STYLE_URL` nếu có VietMap key.
5. Deploy.

## Kiến trúc dữ liệu tiếp theo

V5.1 sẽ thay GeoJSON tĩnh bằng API:

```text
GET /api/public/properties/map
GET /api/public/planning/layers
POST /api/public/planning/query-point
POST /api/public/planning/query-parcel
```
