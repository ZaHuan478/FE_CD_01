# Employee Lifecycle – Business Process Map

## 1. Mục tiêu

Trang `/employee-lifecycle` không phải là dashboard CRUD hay module quản lý nhân sự thông thường. Đây là một bản đồ nghiệp vụ cho vòng đời nhân viên trong HRMS.

Nó mô tả:
- dữ liệu nền (Master Data)
- các bước chính trong vòng đời nhân viên (Lifecycle Process)
- các nghiệp vụ phát sinh trong quá trình làm việc (Cross Functional)
- các dịch vụ hỗ trợ xuyên suốt (Shared Services)
- mối quan hệ giữa dữ liệu, quy trình và SOP

---

## 2. Tại sao đây là Business Process Map

Trang này tập trung vào cách nhìn tổng thể của một quy trình nhân sự, không phải khả năng tạo/sửa/xoá dữ liệu theo form.

Người dùng cần hiểu:
1. Bước nghiệp vụ nào đang diễn ra?
2. Dữ liệu nền nào được dùng ở bước đó?
3. SOP nào liên quan đến bước đó?
4. Đầu vào và đầu ra của từng bước là gì?

Vì vậy, UI được thiết kế như một sơ đồ suy luận nghiệp vụ, không phải danh sách form.

---

## 3. Kiến trúc 4 tầng

### Tầng 1 — Master Data
Đây là dữ liệu nền tảng dùng cho nhiều nghiệp vụ.

Ví dụ:
- MD-05: Quản lý cơ cấu tổ chức
- MD-06: Quản lý chức vụ/chức danh
- MD-07: Thiết lập thang/bậc lương
- MD-08: Thiết lập ca và loại nghỉ
- MD-09: Quản lý bảo hiểm/y tế
- MD-10: Quản lý kỷ luật

Master Data là nền tảng dữ liệu để các quy trình khác vận hành.

### Tầng 2 — Employee Lifecycle
Đây là 7 bước chính của vòng đời nhân viên:

1. LIFE-01 – Tiếp nhận nhân viên mới
2. LIFE-02 – Tạo hồ sơ nhân viên
3. LIFE-03 – Bố trí công tác
4. LIFE-04 – Thiết lập hợp đồng
5. LIFE-05 – Lương & chế độ
6. LIFE-06 – Quá trình làm việc
7. LIFE-07 – Nghỉ việc & đóng hồ sơ

Đây là luồng nghiệp vụ chính trong vòng đời nhân viên.

### Tầng 3 — Cross Functional
Đây là các nghiệp vụ phát sinh xuyên suốt quá trình làm việc, không nhất thiết là một bước tuần tự của lifecycle.

Ví dụ:
- Công & phép
- Hợp đồng
- Biến động nhân sự
- Khen thưởng
- Kỷ luật
- Đào tạo
- Đánh giá
- Phát triển nhân viên

### Tầng 4 — Shared Services
Đây là các dịch vụ hỗ trợ chung, dùng trong nhiều phần của hệ thống:
- Phân quyền
- Phê duyệt
- Notification
- Import / Export
- Audit log
- BI
- Báo cáo
- Ngân sách

---

## 4. 7 Lifecycle Business Processes

Trang chính hiển thị 7 bước chính như sau:

01. Tiếp nhận nhân viên mới
02. Tạo hồ sơ nhân viên
03. Bố trí công tác
04. Thiết lập hợp đồng
05. Lương & chế độ
06. Quá trình làm việc
07. Nghỉ việc & đóng hồ sơ

> Đây là Business Process, không phải module CRM/CRUD.

---

## 5. Master Data

Master Data được định nghĩa trong `src/data/master-data.ts`.

Mỗi item Master Data gồm các thuộc tính bổ trợ như:
- id
- title
- inputs
- outputs
- actors
- rules
- usedBy
- sopIds
- process
- sourceStatus

Các Master Data chính trong hệ thống:
- MD-01 → MD-10

Mỗi MD không phải là một form riêng; nó là dữ liệu nền mà nhiều nghiệp vụ dùng.

---

## 6. SOP và Process phân biệt rõ

### SOP
SOP là quy trình / hướng dẫn / chính sách thực hiện.

Ví dụ:
- Tiếp nhận nhân viên mới
- Bổ nhiệm
- Kỷ luật
- Quản lý thang bảng lương
- Quản lý nghỉ phép

### Process
Process là cách hoạt động nghiệp vụ theo từng bước.

Ví dụ:
- Nhận thông tin ứng viên
- Kiểm tra dữ liệu
- Tạo hồ sơ
- Xác nhận dữ liệu

### Quy tắc quan trọng
- SOP ≠ Process
- Process không được coi là SOP
- Một node có thể có SOP mà không phải là SOP

---

## 7. Relationship Model

Quan hệ được định nghĩa trong `src/data/relationships.ts`.

Các loại quan hệ gồm:
- `used-by`
- `contains`
- `supports`
- `feeds`
- `related-to`

Ví dụ:
- `MD-05` used-by `LIFE-01`
- `LIFE-03` contains `Điều động/điều chuyển`
- `MD-07` supports `Điều chỉnh thu nhập`

Quan hệ này cho phép UI biết:
- cái nào dùng cái nào
- cái nào liên quan đến cái nào
- cái nào là đầu vào / đầu ra / dữ liệu nền / SOP / process

---

## 8. Detail Panel Specification

Khi click vào một node, panel chi tiết sẽ mở trong cùng trang (không chuyển route).

Panel có các section sau:

01 · Tổng quan
02 · Input
03 · Output
04 · Actor
05 · Master Data / Dữ liệu liên quan
06 · SOP liên quan
07 · Quan hệ dữ liệu
08 · Quy trình thực tế
09 · UI sơ khảo

### Ý nghĩa từng section
- Tổng quan: mục đích, trạng thái nguồn
- Input: dữ liệu vào
- Output: dữ liệu ra
- Actor: người tham gia, vai trò, hành động
- Master Data: các dữ liệu nền liên quan
- SOP: các SOP gắn với node
- Quan hệ dữ liệu: mô tả lifecycle input/output
- Quy trình thực tế: step by step
- UI sơ khảo: khung UI gợi ý cho form hoặc màn hình

---

## 9. Data Status

Các trạng thái được sử dụng trong dữ liệu:
- `official`
- `designed`
- `draft`
- `placeholder`

Mục đích là thể hiện mức độ xác thực của dữ liệu / quy trình / SOP.

Ví dụ:
- `official`: đã có quy trình thực tế
- `designed`: đã được thiết kế nhưng chưa đầy đủ
- `draft`: đang dự thảo
- `placeholder`: chưa có dữ liệu thật / còn chỗ giữ

---

## 10. Data Traceability

Một node trong trang này thường có thể được đọc theo hướng sau:

Master Data
↕
Business Process / Lifecycle
↕
SOP
↕
Process steps
↕
Output

Nói cách khác, hệ thống cho thấy dữ liệu nền → chức năng nghiệp vụ → quy trình → SOP → kết quả.

---

## 11. UI behavior

### Click node
Khi click một node:
- node đó được highlight
- panel detail mở
- nội dung theo item đang chọn

### Click liên kết Master Data / SOP
Khi click một liên kết trong panel:
- item tương ứng sẽ được mở trong panel
- không chuyển trang
- người dùng có thể điều hướng trong cùng luồng tư duy nghiệp vụ

---

## 12. Cấu trúc file chính

### `src/data/master-data.ts`
Chứa Master Data thực thể nền tảng.

### `src/data/lifecycle.ts`
Chứa các lifecycle step chính.

### `src/data/sop.ts`
Chứa danh mục SOP và lookup theo title.

### `src/data/relationships.ts`
Chứa mối quan hệ giữa node và node.

### `src/pages/employee-lifecycle/EmployeeLifecyclePage.tsx`
File render chính cho trang `/employee-lifecycle`.

---

## 13. Đặc điểm quan trọng của trang này

- Không phải dashboard HR
- Không phải CRUD list
- Không phải module riêng lẻ như Employee Management
- Là bản đồ nghiệp vụ tổng thể
- Mục tiêu: hiển thị cái “bức tranh tổng thể” của vòng đời nhân viên

---

## 14. Kết luận

`/employee-lifecycle` là một trang mô phỏng cách nhìn của người quản lý / nhà thiết kế nghiệp vụ khi xem toàn bộ vòng đời nhân viên trong HRMS.

Nó thể hiện:
- node nào là master data
- node nào là lifecycle process
- node nào là cross functional
- node nào là support service
- node nào liên quan với SOP nào
- dữ liệu nào đi vào / đi ra

Đây là đúng hướng của một “business architecture view” thay vì một CRUD page.

---

## 15. Gợi ý cải tiến tiếp theo

- thêm badges trạng thái cho từng node
- bật filter theo tầng / trạng thái / SOP
- thêm connection line rõ hơn giữa node với node
- cải thiện typography và spacing để gần với chuẩn enterprise UI
- bổ sung mapping chặt chẽ hơn cho từng lifecycle process theo MD/SOP thực tế

Tổng kết ngắn gọn:
- đây là bản đồ nghiệp vụ HRMS
- dữ liệu thật quan trọng hơn giao diện đẹp
- khi dữ liệu được map đúng thì UI mới trở nên chuẩn và dễ đọc