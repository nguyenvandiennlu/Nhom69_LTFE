# Quy định Git của nhóm

## 1. Quy trình làm việc

1. Mỗi người làm trên **nhánh cá nhân**, không code trực tiếp trên `main`.
2. Trong 1 ngày code, các commit mới phải được **push lên nhánh cá nhân**.
3. Tạo **Pull Request (PR)** để merge vào `main`.
4. Người tạo PR **invite các thành viên còn lại** vào review.
5. Chỉ **người tạo PR** được merge, và chỉ merge **sau khi được approve** bởi các thành viên còn lại.
6. Sau khi merge, các thành viên còn lại phải cập nhật code trước khi tiếp tục:

```bash
git checkout main && git pull origin main     # cập nhật main local
git checkout nhanh-ca-nhan && git merge main  # cập nhật nhánh cá nhân
```

## 2. Cách viết commit

Form:

```
Mô tả chung - Chức năng - Trạng thái - Chi tiết
```

Mô tả chung và Trạng thái dùng **từ khóa tiếng Anh**. Chức năng và Chi tiết viết **tiếng Việt**.

| Mô tả chung | Ý nghĩa | Trạng thái | Ý nghĩa |
|---|---|---|---|
| `Improve` | Cải thiện tính năng đã có | `New` | Thêm mới 1 chức năng |
| `Clean code` | Dọn code cũ | `In progress` | Đang thực hiện |
| `Function` | Thực hiện 1 chức năng | `Done` | Hoàn thành |
| `Debug` | Debug code/chức năng | `Hot fix` | Sửa chức năng đã `Done` |

Ví dụ:

```
Function - Gửi tin nhắn - New - Thêm ô nhập và nút gửi
Function - Gửi tin nhắn - Done - Gửi/nhận tin realtime, chặn tin rỗng
Debug - Kết nối WebSocket - Done - Sửa lỗi mở 2 kết nối khi render lại
Improve - Gửi tin nhắn - Hot fix - Sửa lỗi Enter gửi tin 2 lần
```

## 3. Lưu ý

**Thời hạn kết tuần của GitHub là Thứ Bảy.** Nếu để đến Chủ nhật mới commit, GitHub sẽ tính là 1 tuần không commit. Hãy commit và push trước hết thứ Bảy mỗi tuần.
