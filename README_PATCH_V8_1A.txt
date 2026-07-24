VNREB V8.1A INVENTORY REAL PATCH
================================
Yêu cầu: đã cài VNREB V8.0 Project Admin Real Patch.

TÍNH NĂNG
- Phân khu -> Block/Tòa -> Tầng/Dãy -> Sản phẩm.
- Quản lý mã sản phẩm, loại hình, diện tích, phòng ngủ, phòng tắm, hướng.
- Giá gốc, giá bán, chiết khấu và quyền xem.
- Trạng thái: Còn hàng, Đang tư vấn, Đang giữ chỗ, Chờ duyệt cọc, Đã đặt cọc, Đã bán, Tạm khóa.
- Audit log khi tạo, sửa, xóa mềm sản phẩm.
- Không thay package.json, Dockerfile, đăng nhập, OpenAI hoặc cấu hình Render.

CÁCH CÀI
1. Giải nén patch.
2. Chép các thư mục app, components, lib vào repository VNREB đang chạy và chọn ghi đè.
3. Commit: Upgrade VNREB V8.1A Inventory
4. Render -> Manual Deploy -> Deploy latest commit.
5. Không Clear build cache ở lần đầu.

LƯU Ý
- initDb sẽ tự tạo bảng mới trong PostgreSQL khi ứng dụng khởi động.
- Dữ liệu dự án V8.0 được giữ nguyên.
- V8.1A chưa gồm import Excel, sơ đồ mặt bằng tương tác và giữ chỗ tự hết hạn; các phần đó thuộc V8.1B/C/D.
