# BLUEPRINT NGHIỆP VỤ: PHÁT TRIỂN CON NGƯỜI

> Phiên bản: 1.0  
> Phạm vi: Demo kiến trúc nghiệp vụ Enterprise HRMS tại Việt Nam  
> Mục tiêu: Giúp người chưa có kiến thức HR hiểu doanh nghiệp đánh giá, phát triển, ghi nhận và chuẩn bị đội ngũ kế nhiệm như thế nào.

## 1. Mục đích của cụm nghiệp vụ

“Phát triển con người” tiếp nhận dữ liệu nhân viên, chức danh, năng lực và kết quả làm việc từ Core HR; sau đó trả lại các quyết định phát triển, đào tạo, đãi ngộ và kế nhiệm.

Chuỗi giá trị tổng quát:

```text
Mục tiêu doanh nghiệp
→ Mục tiêu cá nhân
→ Theo dõi hiệu suất
→ Đánh giá kết quả và năng lực
→ Xác định khoảng trống
→ Đào tạo và kế hoạch phát triển
→ Ghi nhận, đãi ngộ
→ Nghề nghiệp và kế nhiệm
```

### 1.1 Kết quả mà cụm phải trả lời được

- Nhân viên cần đạt kết quả gì?
- Nhân viên đang làm tốt đến đâu?
- Nhân viên đang có và còn thiếu năng lực nào?
- Cần học gì, học bằng cách nào và hiệu quả ra sao?
- Ai là nhân sự tiềm năng, ai có thể kế nhiệm vị trí trọng yếu?
- Thành tích được ghi nhận và liên kết với lương thưởng như thế nào?
- Dữ liệu nào được phép xem, sửa, phê duyệt hoặc xuất báo cáo?

## 2. Phạm vi module

| Mã | Module | Vai trò trong hệ thống | Số SOP demo |
|---|---|---|---:|
| KPI | KPI | Thiết lập, phê duyệt, check-in và điều chỉnh mục tiêu | 2 |
| PFM | Đánh giá | Thiết lập chu kỳ, đánh giá, hiệu chỉnh kết quả, khiếu nại và PIP | 4 |
| CMP | Năng lực & Kỹ năng | Xây dựng chuẩn năng lực, đánh giá và xác định khoảng trống | 4 |
| LND | Đào tạo & Phát triển | Lập nhu cầu, tổ chức học tập và đánh giá hiệu quả | 5 |
| TAL | Nghề nghiệp & Kế nhiệm | Quản lý nhân tài, lộ trình nghề nghiệp và người kế nhiệm | 3 |
| ENG | Ghi nhận, Phúc lợi & Gắn kết | Ghi nhận thành tích, quản lý chương trình phúc lợi và trải nghiệm | 2 |

Tổng cộng: **20 SOP lõi**.

## 3. Câu chuyện demo xuyên suốt

Nhân viên mẫu: **Nguyễn Minh An**, Chuyên viên Phân tích nghiệp vụ.

1. Đầu năm, công ty giao mục tiêu kinh doanh xuống phòng ban và cá nhân An.
2. Quản lý và An thống nhất KPI, trọng số, kỳ đo lường và nguồn dữ liệu.
3. Trong quý, hai bên thực hiện check-in, ghi nhận tiến độ và trở ngại.
4. Cuối kỳ, An tự đánh giá; quản lý đánh giá và hội đồng hiệu chỉnh kết quả.
5. Kết quả cho thấy An đạt hiệu suất tốt nhưng thiếu năng lực thuyết trình và quản lý dự án.
6. Hệ thống tạo khoảng trống năng lực và đề xuất kế hoạch phát triển cá nhân.
7. An được cử tham gia khóa học, dự án thực tế và chương trình mentoring.
8. Sau đào tạo, quản lý xác nhận mức độ áp dụng vào công việc.
9. An được ghi nhận thành tích và đưa vào talent pool.
10. Khi vị trí Trưởng nhóm cần người kế nhiệm, hệ thống đối chiếu năng lực, hiệu suất và mức độ sẵn sàng của An.

## 4. Vai trò nghiệp vụ

| Vai trò | Trách nhiệm chính |
|---|---|
| Nhân viên | Thiết lập mục tiêu, tự đánh giá, đăng ký học, cập nhật IDP và phản hồi |
| Quản lý trực tiếp | Giao mục tiêu, check-in, đánh giá, đề cử đào tạo và nhân tài |
| Quản lý cấp trên | Hiệu chỉnh, phê duyệt ngoại lệ và rà soát kế nhiệm |
| HR Performance | Quản trị chu kỳ, biểu mẫu, thang điểm và phiên hiệu chỉnh |
| HR L&D | Quản trị năng lực, nhu cầu, chương trình, lớp học và ngân sách đào tạo |
| Talent Management | Quản lý talent pool, 9-Box, vị trí trọng yếu và kế nhiệm |
| C&B | Tiếp nhận kết quả đã duyệt để tính thưởng, phúc lợi hoặc điều chỉnh thu nhập |
| Ban điều hành | Phê duyệt chính sách, kết quả cấp cao, vị trí trọng yếu và kế nhiệm |
| Tổ chức đại diện NLĐ | Được tham vấn trong phạm vi pháp luật/chính sách yêu cầu và khi tổ chức có tồn tại |
| System Admin | Cấu hình, phân quyền, tích hợp và audit; không tự sửa kết quả nghiệp vụ |

## 5. Trạng thái dùng chung

```text
Nháp
→ Chờ xác nhận
→ Chờ phê duyệt
→ Đang thực hiện
→ Chờ đánh giá
→ Đang hiệu chỉnh
→ Đã phê duyệt
→ Đã hoàn thành
```

Trạng thái ngoại lệ:

- Trả lại điều chỉnh.
- Tạm hoãn.
- Hủy.
- Đang khiếu nại.
- Đã thay thế bởi phiên bản mới.
- Khóa dữ liệu.

## 6. Danh mục và dữ liệu nền bắt buộc

| Nhóm dữ liệu | Nội dung tối thiểu |
|---|---|
| Cơ cấu tổ chức | Công ty, đơn vị, phòng ban, tuyến quản lý, quản lý ma trận |
| Công việc | Vị trí, chức danh, job family, cấp bậc, mô tả công việc |
| Năng lực | Nhóm năng lực, năng lực, cấp độ thành thạo, hành vi quan sát được |
| Mục tiêu | Thư viện KPI/OKR, đơn vị đo, công thức, tần suất, nguồn dữ liệu |
| Đánh giá | Chu kỳ, mẫu phiếu, thang điểm, trọng số, xếp loại, quy tắc làm tròn |
| Đào tạo | Khóa học, chương trình, hình thức học, giảng viên, nhà cung cấp, chứng chỉ |
| Nhân tài | Talent pool, vị trí trọng yếu, mức sẵn sàng, rủi ro nghỉ việc |
| Phúc lợi | Chương trình, đối tượng hưởng, hạn mức, ngân sách, cách tính thuế |

## 7. Danh mục 20 SOP

### PFM-01. Thiết lập chu kỳ và chính sách đánh giá

- **Mục đích:** Tạo khung đánh giá thống nhất theo năm, quý, thử việc hoặc dự án.
- **Kích hoạt:** Đầu kỳ đánh giá hoặc khi ban hành chính sách mới.
- **RACI:** HR Performance (R), CHRO/Ban điều hành (A), C&B và quản lý đơn vị (C), nhân viên (I).
- **Luồng chính:** Tạo chu kỳ → chọn đối tượng → gán biểu mẫu → cấu hình thời hạn/thang điểm → kiểm tra xung đột → phê duyệt → phát hành.
- **Đầu vào:** Cơ cấu tổ chức, danh sách nhân viên, loại chu kỳ, mẫu đánh giá, chính sách hiệu lực.
- **Đầu ra:** Chu kỳ đã phát hành, danh sách người tham gia, lịch nhắc việc, phiên bản chính sách.
- **Quy tắc:** Không sửa trực tiếp chu kỳ đã phát hành; thay đổi phải tạo phiên bản và lưu effective date.
- **Ngoại lệ:** Nhân viên mới, thử việc, nghỉ dài hạn, chuyển đơn vị, có nhiều quản lý hoặc nghỉ việc giữa kỳ.

### PFM-02. Thiết lập và phê duyệt mục tiêu

- **Mục đích:** Chuyển mục tiêu tổ chức thành mục tiêu đơn vị, nhóm và cá nhân.
- **Kích hoạt:** Chu kỳ được phát hành hoặc nhân viên nhận nhiệm vụ mới.
- **RACI:** Nhân viên/quản lý (R), quản lý phê duyệt (A), HR Performance (C), C&B (I).
- **Luồng chính:** Chọn KPI/OKR → nhập chỉ tiêu → thiết lập trọng số → khai báo nguồn đo → trao đổi → phê duyệt → khóa mục tiêu.
- **Đầu vào:** Thư viện KPI, mục tiêu cấp trên, mô tả công việc, kỳ đo lường.
- **Đầu ra:** Bộ mục tiêu được duyệt và có baseline.
- **Quy tắc:** Tổng trọng số phải bằng 100%; mọi KPI phải có đơn vị đo, nguồn dữ liệu, chiều đo và người xác nhận.
- **Ngoại lệ:** KPI chia sẻ theo nhóm, KPI không định lượng, KPI thay đổi vì tái cơ cấu hoặc mục tiêu cấp trên thay đổi.

### PFM-03. Check-in và điều chỉnh mục tiêu giữa kỳ

- **Mục đích:** Theo dõi tiến độ, phản hồi liên tục và xử lý thay đổi hợp lệ.
- **Kích hoạt:** Đến lịch check-in hoặc phát sinh thay đổi công việc.
- **RACI:** Nhân viên và quản lý (R), quản lý trực tiếp (A), HR Performance (C).
- **Luồng chính:** Cập nhật tiến độ → đính kèm bằng chứng → ghi nhận trở ngại → phản hồi 1:1 → đề nghị điều chỉnh → phê duyệt thay đổi.
- **Đầu ra:** Lịch sử tiến độ, biên bản check-in, phiên bản mục tiêu điều chỉnh.
- **Quy tắc:** Không ghi đè baseline; lưu đầy đủ giá trị trước/sau và lý do thay đổi.
- **Ngoại lệ:** Đổi quản lý, điều chuyển giữa kỳ, nghỉ thai sản/nghỉ dài hạn, hủy dự án, dữ liệu nguồn bị lỗi.

### PFM-04. Tự đánh giá và đánh giá của quản lý

- **Mục đích:** Thu thập kết quả, bằng chứng và nhận xét theo tiêu chí đã duyệt.
- **Kích hoạt:** Kết thúc kỳ đo lường.
- **RACI:** Nhân viên và quản lý (R), quản lý trực tiếp (A), HR Performance (C).
- **Luồng chính:** Chốt dữ liệu KPI → nhân viên tự đánh giá → quản lý đánh giá → trao đổi kết quả → xác nhận sơ bộ.
- **Đầu vào:** Mục tiêu đã khóa, dữ liệu KPI, bằng chứng, lịch sử check-in.
- **Đầu ra:** Điểm sơ bộ, nhận xét, điểm mạnh, điểm cần cải thiện.
- **Quy tắc:** Phân biệt điểm hệ thống tính và điểm quản lý điều chỉnh; điều chỉnh phải có lý do.
- **Ngoại lệ:** Nhân viên không tự đánh giá, quản lý vắng mặt, dữ liệu thiếu, xung đột lợi ích.

### PFM-05. Hiệu chỉnh và phê duyệt kết quả

- **Mục đích:** Bảo đảm kết quả nhất quán giữa các đơn vị và hạn chế thiên lệch.
- **Kích hoạt:** Hoàn tất đánh giá sơ bộ.
- **RACI:** HR Performance (R), Hội đồng hiệu chỉnh/Ban điều hành (A), quản lý đơn vị và C&B (C), nhân viên (I).
- **Luồng chính:** Tổng hợp phân bố → phát hiện bất thường → họp hiệu chỉnh → cập nhật kết quả → phê duyệt → khóa.
- **Đầu vào:** Điểm sơ bộ, phân bố xếp loại, ngân sách thưởng tham khảo, lịch sử thay đổi.
- **Đầu ra:** Kết quả chính thức và dữ liệu chuyển PAY/Talent/L&D.
- **Quy tắc:** Chỉ vai trò được ủy quyền được thay đổi; bắt buộc ghi lý do và audit trước/sau.
- **Ngoại lệ:** Đơn vị quá nhỏ, người tham gia hội đồng có xung đột lợi ích, thay đổi sau khi đã chuyển lương thưởng.

### PFM-06. Khiếu nại kết quả và kế hoạch cải thiện hiệu suất

- **Mục đích:** Cho phép phúc tra minh bạch và hỗ trợ nhân viên chưa đạt yêu cầu.
- **Kích hoạt:** Nhân viên khiếu nại hoặc kết quả dưới ngưỡng chính sách.
- **RACI:** HR Performance/quản lý (R), cấp có thẩm quyền (A), HRBP và đại diện liên quan (C), nhân viên (I/R đối với phản hồi).
- **Luồng chính:** Gửi yêu cầu → kiểm tra thời hạn → thu thập bằng chứng → phúc tra → ban hành kết quả → lập PIP nếu cần → theo dõi → kết luận.
- **Đầu ra:** Quyết định phúc tra hoặc kế hoạch cải thiện có mục tiêu, hỗ trợ và thời hạn rõ ràng.
- **Quy tắc:** Không tự động dùng một điểm số để ra quyết định chấm dứt quan hệ lao động; phải có human review và kiểm tra quy trình pháp lý.
- **Ngoại lệ:** Khiếu nại quá hạn, quản lý là đối tượng bị khiếu nại, dữ liệu nguồn đã thay đổi.

### CMP-01. Xây dựng từ điển năng lực

- **Mục đích:** Chuẩn hóa ngôn ngữ năng lực dùng chung toàn doanh nghiệp.
- **Kích hoạt:** Xây mới mô hình năng lực hoặc rà soát định kỳ.
- **RACI:** HR L&D (R), CHRO (A), chuyên gia nghiệp vụ và quản lý đơn vị (C), nhân viên (I).
- **Luồng chính:** Xác định nhóm → định nghĩa năng lực → xây cấp độ → mô tả hành vi → phản biện → phê duyệt → phát hành.
- **Đầu ra:** Từ điển năng lực có phiên bản và thời gian hiệu lực.
- **Quy tắc:** Mỗi cấp độ phải có hành vi quan sát được; không chỉ dùng mô tả chung chung.
- **Ngoại lệ:** Năng lực chỉ dùng cho một ngành nghề, năng lực bị trùng hoặc thay thế.

### CMP-02. Ánh xạ năng lực với chức danh

- **Mục đích:** Xác định năng lực và mức thành thạo cần thiết cho từng vai trò.
- **Kích hoạt:** Có chức danh mới hoặc thay đổi mô tả công việc.
- **RACI:** HR L&D/HRBP (R), chủ sở hữu job family (A), quản lý chuyên môn (C).
- **Luồng chính:** Chọn chức danh → gán năng lực → chọn mức yêu cầu → xác định trọng số → rà soát → phê duyệt.
- **Đầu ra:** Khung năng lực theo chức danh/cấp bậc.
- **Quy tắc:** Hiệu lực theo thời gian; nhân viên điều chuyển phải được đối chiếu với khung mới từ ngày hiệu lực.
- **Ngoại lệ:** Một nhân viên kiêm nhiệm nhiều chức danh hoặc có nhiệm vụ dự án tạm thời.

### CMP-03. Đánh giá năng lực và kỹ năng

- **Mục đích:** Đo mức năng lực hiện tại bằng tự đánh giá, quản lý hoặc đánh giá chuyên môn.
- **Kích hoạt:** Chu kỳ năng lực, sau đào tạo, khi bổ nhiệm hoặc theo yêu cầu chứng chỉ.
- **RACI:** Nhân viên/quản lý/chuyên gia đánh giá (R), quản lý đơn vị (A), HR L&D (C).
- **Luồng chính:** Phát hành phiếu → tự đánh giá → quản lý đánh giá → kiểm tra/chứng thực → hiệu chỉnh → khóa kết quả.
- **Đầu ra:** Hồ sơ năng lực hiện tại, bằng chứng, người xác nhận và ngày đánh giá.
- **Quy tắc:** Tách “tự khai”, “được quản lý xác nhận” và “được chứng thực”.
- **Ngoại lệ:** Không đủ người đánh giá, chứng chỉ hết hạn, kết quả giữa các nguồn chênh lệch lớn.

### CMP-04. Phân tích khoảng trống và tạo IDP

- **Mục đích:** Chuyển chênh lệch năng lực thành hành động phát triển cụ thể.
- **Kích hoạt:** Có kết quả năng lực hoặc nhân viên chọn vai trò mục tiêu.
- **RACI:** Nhân viên/quản lý (R), quản lý trực tiếp (A), HR L&D/Talent (C).
- **Luồng chính:** So sánh hiện tại với yêu cầu → ưu tiên gap → chọn hành động 70-20-10 → đặt mốc → phê duyệt IDP.
- **Đầu ra:** Kế hoạch phát triển cá nhân liên kết khóa học, mentoring, OJT và dự án.
- **Quy tắc:** Không phải mọi gap đều cần đào tạo; phải cân nhắc mức quan trọng và mục tiêu nghề nghiệp.
- **Ngoại lệ:** Vai trò mục tiêu chưa có khung năng lực hoặc IDP vượt ngân sách.

### LND-01. Khảo sát nhu cầu và lập kế hoạch đào tạo

- **Mục đích:** Tổng hợp nhu cầu từ chiến lược, năng lực, tuân thủ và đề xuất đơn vị.
- **Kích hoạt:** Chu kỳ lập ngân sách hoặc phát sinh yêu cầu bắt buộc.
- **RACI:** HR L&D (R), CHRO/Ban điều hành (A), quản lý đơn vị và Finance (C), nhân viên (I).
- **Luồng chính:** Thu thập nhu cầu → phân loại → xác định đối tượng → ước tính chi phí → ưu tiên → phê duyệt kế hoạch/ngân sách.
- **Đầu ra:** Kế hoạch đào tạo năm và danh mục nhu cầu được duyệt.
- **Quy tắc:** Phân biệt bắt buộc, khắc phục gap, phát triển nghề nghiệp và yêu cầu cá nhân.
- **Ngoại lệ:** Nhu cầu khẩn cấp ngoài kế hoạch hoặc ngân sách bị cắt giảm.

### LND-02. Thiết lập chương trình, khóa học và lớp học

- **Mục đích:** Chuẩn hóa nội dung, điều kiện tham gia, lịch và nguồn lực đào tạo.
- **Kích hoạt:** Kế hoạch được duyệt hoặc có khóa học bắt buộc mới.
- **RACI:** HR L&D (R/A), giảng viên/nhà cung cấp (C), quản lý đơn vị (I).
- **Luồng chính:** Tạo chương trình → tạo khóa/lớp → gán năng lực → đặt điều kiện → lịch/địa điểm → giảng viên → chi phí → phát hành.
- **Đầu ra:** Catalog học tập và lịch lớp.
- **Quy tắc:** Quản lý version nội dung; chứng chỉ phải có hiệu lực và quy tắc tái đào tạo.
- **Ngoại lệ:** Hoãn/hủy lớp, đổi giảng viên, vượt sức chứa, nội dung hết hiệu lực.

### LND-03. Đăng ký, đề cử và phê duyệt học tập

- **Mục đích:** Chọn đúng người học và kiểm soát điều kiện/ngân sách.
- **Kích hoạt:** Nhân viên đăng ký, quản lý đề cử hoặc hệ thống gán bắt buộc.
- **RACI:** Nhân viên/quản lý (R), quản lý hoặc HR L&D (A), Finance (C nếu vượt hạn mức).
- **Luồng chính:** Đăng ký/đề cử → kiểm tra điều kiện → kiểm tra lịch và ngân sách → phê duyệt → xếp lớp/waitlist → thông báo.
- **Đầu ra:** Danh sách học viên và cam kết tham gia.
- **Quy tắc:** Chặn trùng lịch; ưu tiên khóa bắt buộc và gap quan trọng.
- **Ngoại lệ:** Hết chỗ, đổi học viên, từ chối, vắng mặt hoặc hủy sát ngày.

### LND-04. Tổ chức học, điểm danh, kiểm tra và chứng nhận

- **Mục đích:** Ghi nhận đầy đủ quá trình và kết quả học tập.
- **Kích hoạt:** Đến ngày học hoặc nhân viên bắt đầu e-learning/OJT.
- **RACI:** Giảng viên/HR L&D (R), HR L&D (A), quản lý (C), nhân viên (I/R đối với hoàn thành).
- **Luồng chính:** Mở lớp → điểm danh → học → kiểm tra → chấm điểm → xác nhận hoàn thành → cấp chứng nhận → cập nhật hồ sơ năng lực.
- **Đầu ra:** Attendance, điểm, trạng thái hoàn thành, chứng chỉ và chi phí thực tế.
- **Quy tắc:** Phân biệt tham dự và hoàn thành; chứng chỉ có thể yêu cầu điểm tối thiểu.
- **Ngoại lệ:** Mất kết nối e-learning, học bù, thi lại, gian lận, chứng chỉ bị thu hồi.

### LND-05. Đánh giá hiệu quả và quản lý cam kết đào tạo

- **Mục đích:** Đo tác động của đào tạo và quản lý nghĩa vụ khi doanh nghiệp tài trợ chi phí.
- **Kích hoạt:** Hoàn thành khóa hoặc đến mốc đánh giá sau đào tạo.
- **RACI:** HR L&D/quản lý (R), CHRO hoặc người được ủy quyền (A), Finance/Legal/C&B (C), nhân viên (I/R).
- **Luồng chính:** Phản hồi Level 1 → kiểm tra Level 2 → đánh giá áp dụng Level 3 → đo kết quả Level 4 khi phù hợp → kết luận → theo dõi cam kết.
- **Đầu ra:** Báo cáo hiệu quả, năng lực cập nhật, thời hạn cam kết và số chi phí cần xử lý nếu phát sinh.
- **Quy tắc:** Khoản chi đào tạo phải có chứng từ; điều kiện hoàn trả thực hiện theo hợp đồng và quy định hiện hành.
- **Ngoại lệ:** Nghỉ việc, chấm dứt do nguyên nhân không thuộc lỗi nhân viên, khóa học không đạt chất lượng, chi phí không đủ chứng từ.

### TAL-01. Xác định vị trí trọng yếu và talent pool

- **Mục đích:** Xác định vị trí có ảnh hưởng lớn và nhóm nhân sự cần ưu tiên phát triển.
- **Kích hoạt:** Rà soát chiến lược, tái cơ cấu hoặc chu kỳ nhân tài.
- **RACI:** Talent Management (R), Ban điều hành (A), HRBP/quản lý đơn vị (C).
- **Luồng chính:** Đánh giá mức trọng yếu → phê duyệt vị trí → thiết lập tiêu chí talent → đề cử → rà soát → đưa vào talent pool.
- **Đầu ra:** Danh mục vị trí trọng yếu và talent pool có thời hạn rà soát.
- **Quy tắc:** Talent pool không đồng nghĩa cam kết bổ nhiệm; giới hạn người được xem dữ liệu.
- **Ngoại lệ:** Vị trí mới, vị trí bị giải thể, nhân viên không đồng ý tham gia chương trình phát triển.

### TAL-02. Đánh giá 9-Box và hiệu chỉnh nhân tài

- **Mục đích:** Đánh giá tương quan giữa hiệu suất và tiềm năng để ra quyết định phát triển.
- **Kích hoạt:** Kết quả hiệu suất đã duyệt và đến kỳ talent review.
- **RACI:** Talent Management (R), Hội đồng nhân tài/Ban điều hành (A), quản lý/HRBP (C).
- **Luồng chính:** Nạp kết quả hiệu suất → đánh giá tiềm năng → tạo 9-Box → họp hiệu chỉnh → ghi nhận hành động → phê duyệt.
- **Đầu ra:** Phân nhóm nhân tài, hành động phát triển và lịch rà soát.
- **Quy tắc:** Không dùng 9-Box như quyết định tự động; phải có tiêu chí, bằng chứng và human review.
- **Ngoại lệ:** Thiếu lịch sử hiệu suất, mới bổ nhiệm, có xung đột lợi ích hoặc dữ liệu tiềm năng chưa đủ.

### TAL-03. Lập và theo dõi kế hoạch kế nhiệm

- **Mục đích:** Chuẩn bị người kế nhiệm cho vị trí trọng yếu và giảm rủi ro gián đoạn.
- **Kích hoạt:** Vị trí trọng yếu chưa có người kế nhiệm hoặc đến kỳ rà soát.
- **RACI:** Talent Management/quản lý vị trí (R), Ban điều hành (A), HRBP và L&D (C), ứng viên kế nhiệm (I theo chính sách).
- **Luồng chính:** Chọn vị trí → đề cử ứng viên → đánh giá phù hợp/gap → xác định readiness → phê duyệt → tạo IDP → theo dõi → rà soát định kỳ.
- **Đầu ra:** Successor slate, mức sẵn sàng, rủi ro nghỉ việc và kế hoạch phát triển.
- **Quy tắc:** Một vị trí có nhiều ứng viên; một nhân viên có thể được cân nhắc cho nhiều vị trí; không công khai ngoài phạm vi được phép.
- **Ngoại lệ:** Người kế nhiệm rút lui/nghỉ việc, vị trí thay đổi, khẩn cấp cần bổ nhiệm tạm thời.

### ENG-01. Ghi nhận và khen thưởng thành tích

- **Mục đích:** Ghi nhận đóng góp kịp thời, minh bạch và liên kết đúng với C&B/PAY/TAX.
- **Kích hoạt:** Thành tích phát sinh, chiến dịch ghi nhận hoặc kết quả đánh giá được duyệt.
- **RACI:** Quản lý/đồng nghiệp/HR (R), cấp duyệt theo hạn mức (A), C&B/Finance/Tax (C), nhân viên (I).
- **Luồng chính:** Đề cử → kiểm tra tiêu chí/trùng lặp → phê duyệt → công bố theo quyền riêng tư → chuyển thưởng → lưu hồ sơ.
- **Đầu ra:** Quyết định ghi nhận, khoản thưởng/quà, dữ liệu chuyển PAY/TAX.
- **Quy tắc:** Xác định rõ thưởng tiền, hiện vật hoặc phi tài chính; lưu căn cứ và cách xử lý thuế.
- **Ngoại lệ:** Đề cử trùng, vượt ngân sách, nhân viên đã nghỉ, thưởng cần thu hồi/điều chỉnh.

### ENG-02. Quản lý phúc lợi, sức khỏe và gắn kết

- **Mục đích:** Quản lý chương trình phúc lợi, khám sức khỏe và phản hồi trải nghiệm nhân viên.
- **Kích hoạt:** Mở chương trình, đến kỳ khám sức khỏe hoặc phát hành khảo sát.
- **RACI:** HR Total Rewards/Employee Experience (R), CHRO (A), C&B/Finance/Legal/HSE (C), nhân viên (I/R khi đăng ký).
- **Luồng chính:** Thiết lập chương trình → xác định eligibility/hạn mức → nhân viên đăng ký → phê duyệt → cung cấp quyền lợi → đối soát → khảo sát → hành động cải thiện.
- **Đầu ra:** Lịch sử hưởng, chi phí, hồ sơ khám theo phạm vi cho phép, kết quả gắn kết và action plan.
- **Quy tắc:** Dữ liệu sức khỏe chỉ hiển thị theo nhu cầu công việc; báo cáo quản trị ưu tiên dữ liệu tổng hợp/ẩn danh.
- **Ngoại lệ:** Người phụ thuộc, điều chuyển đơn vị, nghỉ việc giữa chương trình, yêu cầu ngoài hạn mức, nhà cung cấp từ chối quyền lợi.

## 8. RACI tổng hợp

| Nhóm quy trình | Nhân viên | Quản lý | HR chuyên môn | C&B/Finance | Ban điều hành |
|---|---|---|---|---|---|
| Mục tiêu và check-in | R | A/R | C | I | I |
| Đánh giá và hiệu chỉnh | R/I | R | R | C | A theo cấp |
| Năng lực và IDP | R | A/R | R | I | I |
| Đào tạo | R/I | R/A | R | C | A theo ngân sách |
| Talent và kế nhiệm | I hạn chế | R | R | I | A |
| Ghi nhận và phúc lợi | I/R | R | R | C/R | A theo hạn mức |

Ký hiệu: R = Responsible, A = Accountable, C = Consulted, I = Informed.

## 9. Tích hợp liên phân hệ

| Nguồn/đích | Dữ liệu trao đổi |
|---|---|
| EMP/Core HR | Hồ sơ, chức danh, đơn vị, cấp bậc, quản lý, trạng thái làm việc |
| Master Data | Cơ cấu, job family, năng lực, thang điểm, danh mục khóa học |
| ATT/Leave | Thời gian làm việc, nghỉ dài hạn, tình trạng đủ điều kiện đánh giá/học tập |
| PAY/C&B | Kết quả hiệu suất, thưởng, khoản phúc lợi chịu thuế, hoàn trả đào tạo |
| TAX | Phân loại và giá trị quyền lợi/thưởng cần tính thuế |
| Recruitment/Internal Mobility | Năng lực, readiness và ứng viên nội bộ cho vị trí trống |
| Document/e-Sign | Chính sách, biên bản, hợp đồng đào tạo, quyết định ghi nhận |
| Workflow | Phê duyệt, ủy quyền, escalation và SLA |
| Notification | Nhắc mục tiêu, đánh giá, lớp học, chứng chỉ và rà soát kế nhiệm |
| BI/Analytics | Chỉ số tổng hợp, xu hướng và cảnh báo |

## 10. Mô hình dữ liệu khái niệm

```text
Employee
├── GoalPlan
│   ├── Goal
│   ├── CheckIn
│   └── PerformanceReview
├── CompetencyProfile
│   ├── CompetencyRating
│   └── SkillEvidence
├── DevelopmentPlan
│   ├── DevelopmentGoal
│   ├── LearningAssignment
│   └── Mentoring/OJT Action
├── TalentProfile
│   ├── TalentPoolMembership
│   ├── NineBoxResult
│   └── SuccessionNomination
└── RewardAndBenefitHistory
```

Mọi bản ghi quan trọng phải có tối thiểu:

- Mã định danh.
- Người sở hữu/người được đánh giá.
- Tổ chức và chức danh tại thời điểm phát sinh.
- Phiên bản và effective date.
- Trạng thái.
- Người tạo, sửa, duyệt và thời điểm.
- Lý do thay đổi.
- Nguồn dữ liệu.
- Mức độ bảo mật.

## 11. Quy tắc bảo mật và dữ liệu cá nhân

- Nhân viên chỉ xem dữ liệu cá nhân được chính sách cho phép.
- Quản lý chỉ xem nhân viên thuộc phạm vi quản lý hợp lệ tại thời điểm truy cập.
- Kết quả 9-Box, tiềm năng và kế nhiệm dùng quyền riêng, không kế thừa mặc định từ quyền xem hồ sơ nhân viên.
- Dữ liệu sức khỏe được tách khỏi hồ sơ đánh giá và báo cáo quản trị thông thường.
- Không công khai phản hồi 360 nếu chính sách quy định ẩn danh.
- Export dữ liệu nhạy cảm phải được kiểm soát và audit.
- Mọi quyết định ảnh hưởng lớn đến nghề nghiệp phải có người có thẩm quyền xem xét, không tự động hóa hoàn toàn bằng điểm số/AI.
- Chính sách lưu trữ và xóa dữ liệu phải cấu hình được theo loại hồ sơ và quy định có hiệu lực.

## 12. Chỉ số báo cáo đề xuất

### Hiệu suất

- Tỷ lệ hoàn tất thiết lập mục tiêu đúng hạn.
- Tỷ lệ check-in đúng hạn.
- Tỷ lệ hoàn tất đánh giá.
- Phân bố xếp loại theo đơn vị/cấp bậc.
- Tỷ lệ kết quả bị điều chỉnh hoặc khiếu nại.
- Tỷ lệ hoàn thành PIP.

### Năng lực và đào tạo

- Tỷ lệ chức danh có khung năng lực.
- Khoảng trống năng lực bình quân.
- Tỷ lệ IDP đang thực hiện/hoàn thành.
- Tỷ lệ hoàn thành đào tạo bắt buộc.
- Chi phí đào tạo bình quân.
- Tỷ lệ áp dụng sau đào tạo.
- Tỷ lệ chứng chỉ sắp hết hạn.

### Nhân tài và kế nhiệm

- Tỷ lệ vị trí trọng yếu có người kế nhiệm.
- Số người kế nhiệm trung bình trên vị trí.
- Tỷ lệ Ready now/1-2 years/3+ years.
- Tỷ lệ lấp vị trí bằng ứng viên nội bộ.
- Tỷ lệ nghỉ việc của talent pool.
- Mức độ hoàn thành IDP của ứng viên kế nhiệm.

### Ghi nhận và gắn kết

- Tỷ lệ nhân viên được ghi nhận.
- Phân bố ghi nhận theo đơn vị/giới tính/cấp bậc để phát hiện thiên lệch.
- Mức sử dụng ngân sách phúc lợi.
- Tỷ lệ tham gia khảo sát.
- Điểm gắn kết và tỷ lệ hoàn thành action plan.

Tham khảo hệ thống chỉ số cân bằng cho L&D và báo cáo vốn nhân lực tại ISO/TS 30437:2023 và ISO 30414:2025.

## 13. Wireframe tối thiểu cần có trong demo

1. Dashboard Phát triển con người.
2. Màn hình thiết lập chu kỳ đánh giá.
3. Phiếu mục tiêu/KPI cá nhân.
4. Màn hình check-in.
5. Phiếu tự đánh giá và đánh giá quản lý.
6. Bảng hiệu chỉnh kết quả.
7. Từ điển và ma trận năng lực.
8. Kết quả competency gap.
9. Kế hoạch phát triển cá nhân IDP.
10. Catalog khóa học và đăng ký học.
11. Quản lý lớp học/điểm danh/chứng chỉ.
12. Dashboard hiệu quả đào tạo.
13. Ma trận 9-Box.
14. Successor slate theo vị trí trọng yếu.
15. Trang ghi nhận và phúc lợi của nhân viên.

## 14. Cách trình bày từng SOP trong demo

Mỗi trang SOP dùng cùng một bố cục:

1. **Hiểu nhanh trong 30 giây:** Khi nào dùng, ai làm, đầu vào, đầu ra.
2. **Flowchart:** Các bước, điểm quyết định, vòng trả lại và SLA.
3. **RACI:** Vai trò theo từng bước.
4. **Data Specs:** Trường dữ liệu, nguồn, bắt buộc, kiểm soát và mã thao tác.
5. **Business Rules:** Điều kiện, công thức, effective date và ngoại lệ.
6. **Wireframe:** Màn hình minh họa cho bước được chọn.
7. **Liên kết:** Quy trình trước, quy trình sau và phân hệ nhận dữ liệu.
8. **Kiểm soát:** Audit, phân quyền, bảo mật và bằng chứng.

## 15. Lộ trình triển khai demo

### Giai đoạn 1: Hiểu được câu chuyện

- Tạo 6 module và menu 20 SOP; KPI và Đánh giá được tách thành hai module độc lập.
- Hoàn thiện “Hiểu nhanh”, flowchart và quan hệ đầu vào/đầu ra.
- Dùng câu chuyện nhân viên An xuyên suốt.

### Giai đoạn 2: Hiểu được cách vận hành

- Bổ sung RACI, business rules, trạng thái và ngoại lệ.
- Bổ sung liên kết EMP, PAY, Master Data và Workflow.

### Giai đoạn 3: Nhìn thấy sản phẩm tương lai

- Bổ sung 15 wireframe tối thiểu.
- Bổ sung dashboard chỉ số và dữ liệu mẫu.
- Bổ sung mô phỏng thay đổi trạng thái, phê duyệt và audit.

## 16. Căn cứ và nguồn tham khảo

### Pháp luật Việt Nam

- [Bộ luật Lao động 45/2019/QH14](https://vanban.chinhphu.vn/?classid=1&docid=198540&pageid=27160)
- [Nghị định 145/2020/NĐ-CP](https://vanban.chinhphu.vn/default.aspx?docid=201967&pageid=27160)
- [Luật An toàn, vệ sinh lao động 84/2015/QH13](https://vanban.chinhphu.vn/?docid=180606&pageid=27160)
- [Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15](https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroup=)
- [Luật Thuế thu nhập doanh nghiệp 67/2025/QH15](https://vanban.chinhphu.vn/?classid=1&docid=214607&pageid=27160&typegroupid=3)
- [Nghị định 320/2025/NĐ-CP](https://vanban.chinhphu.vn/?docid=216219&pageid=27160)

### Khung quản trị và sản phẩm tham khảo

- [ISO 30414:2025 Human capital reporting](https://www.iso.org/standard/30414?browse=tc)
- [ISO/TS 30437:2023 Learning and development metrics](https://www.iso.org/standard/68714.html)
- [SAP SuccessFactors Goal Management](https://help.sap.com/docs/successfactors-performance-and-goals/implementing-and-managing-goal-management/adding-goal-wizard)
- [SAP Career and Development Planning](https://help.sap.com/docs/successfactors-succession-and-development/sap-best-practices-for-sap-successfactors-succession-and-development/career-and-development-planning-with-integration-to-cpm-and-lms-3vp?version=2205)
- [SAP Performance integration to Development, Compensation and Succession](https://help.sap.com/docs/successfactors-performance-and-goals/performance-and-goal-management-with-integration-to-development-planning-test-script/succeeding-processes?version=2305)

## 17. Lưu ý sử dụng

- Tài liệu này là blueprint nghiệp vụ và thiết kế demo, không thay thế ý kiến tư vấn pháp lý.
- Trước khi triển khai thật, doanh nghiệp phải rà soát ngành nghề, loại hình doanh nghiệp, thỏa ước lao động, nội quy và các văn bản còn hiệu lực tại thời điểm áp dụng.
- Các mô hình BSC, OKR, 360°, 3P, 70-20-10, Kirkpatrick và 9-Box là phương pháp quản trị tùy chọn, không phải quy định pháp luật bắt buộc.
- Không nên hard-code ngưỡng, biểu mẫu hoặc kết luận pháp lý; hệ thống cần hỗ trợ version, effective date và cấu hình theo chính sách doanh nghiệp.
