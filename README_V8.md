# VNREB V8.0

Bản nâng cấp từ source `VNREB-main.zip`, giữ nguyên lõi đăng nhập, PostgreSQL, OpenAI và Render; bổ sung Project Admin, Project Digital Passport, Media/Video Center, PDF documents và trang chi tiết dự án.

## Trang mới
- `/quan-tri` — quản lý dự án và media.
- `/du-an/[slug]` — trang chi tiết dự án công khai.

## API mới
- `GET/POST /api/admin/projects`
- `GET/PATCH/DELETE /api/admin/projects/[id]`
- `POST /api/admin/projects/[id]/media`
- `GET /api/projects`
- `GET /api/projects/[slug]`

## Database
V8 tự tạo các bảng: `projects`, `project_media`, `project_documents`, `project_document_versions`, `audit_logs` khi ứng dụng khởi động.
