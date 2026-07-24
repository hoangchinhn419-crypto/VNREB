VNREB V8.0 PROJECT ADMIN REAL PATCH
===================================
Patch này được tạo trên đúng lõi VNREB V8 đang chạy và chỉ thay/cộng các file quản trị dự án.

TÍNH NĂNG
- Admin chia tab: Tổng quan, Hình ảnh, Video, PDF, Pháp lý, Sổ đỏ/Sổ hồng, Tiến độ, Bản đồ, AI dữ liệu.
- Upload ảnh hero, album, video MP4/WebM/MOV, PDF và ảnh pháp lý.
- Checklist pháp lý có trạng thái, số văn bản, cơ quan/ngày cấp, ghi chú.
- Hồ sơ sổ đỏ/sổ hồng: số phát hành, số vào sổ, số thửa, tờ bản đồ, diện tích, loại đất, thời hạn, chủ sở hữu, cơ quan/ngày cấp, địa chỉ, xác minh, phân quyền và file scan.
- Timeline tiến độ.
- Project Digital Passport: phần trăm hoàn thiện hồ sơ.
- AI-ready data.
- Audit log cho upload và hồ sơ quyền sử dụng đất.

FILE GHI ĐÈ / BỔ SUNG
app/quan-tri/page.jsx
app/globals.css
components/v8/ProjectAdmin.jsx
app/api/admin/projects/route.js
app/api/admin/projects/[id]/route.js
app/api/admin/projects/[id]/media/route.js
app/api/admin/projects/[id]/land-certificates/route.js
lib/db.js
lib/admin.js
lib/storage.js

CÁCH CẬP NHẬT
1. Giải nén patch.
2. Chép toàn bộ các thư mục app, components, lib vào repository hiện tại và chọn ghi đè.
3. Commit: Upgrade VNREB V8 Project Admin Real Patch
4. Render > Manual Deploy > Deploy latest commit.
5. Không chọn Clear build cache ở lần đầu. Chỉ dùng khi Render vẫn lấy code cũ.

LƯU Ý LƯU TRỮ
- Render local filesystem có thể mất file sau redeploy.
- Production nên cấu hình MEDIA_UPLOAD_ENDPOINT và MEDIA_UPLOAD_TOKEN để lưu ảnh/video/PDF bên ngoài Render.
- Sổ đỏ/sổ hồng mặc định PRIVATE.
