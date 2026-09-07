# Tải dữ liệu theo nhu cầu

FE đã bỏ bootstrap client. Luồng đăng nhập chỉ chờ `/me`, sau đó cấu hình loader/cache cho phiên mới và làm nóng metadata điều hướng. Không cần refactor lại thư mục Atomic Design.

- `shared/api/knowledge.api.ts`: contract HTTP cho dataset, index, workflow detail, tài liệu và tìm kiếm.
- `shared/lib/runtime-datasets/runtimeData.ts`: cache bộ nhớ, gộp request đang chạy, hủy request và loại bỏ kết quả đến trễ sau đổi user. `getRuntimeDataset` là resource read dành cho render/selectors, có thể suspend; không gọi lần đầu từ event handler/effect. Dùng `loadRuntimeDataset` để preload ngoài render.
- `features/authentication/model/knowledgeSession.ts`: cấu hình loader sau khi `/me` thành công; reset theo phiên.
- `app/layouts/KnowledgeBoundary.tsx`: loading/error/retry. Dữ liệu lỗi không làm phiên đăng nhập bị coi là hết hạn.
- `entities/*`: các getter đọc dữ liệu lúc sử dụng, không đọc dataset ngay lúc import. `memoRuntime` giữ tham chiếu ổn định trong phiên và vô hiệu hóa khi đổi phiên.
- `entities/sop/model/sopDatabase.ts`: chỉ mục `SopProcessSummary` tách riêng khỏi `SopSubProcess` đầy đủ. Dùng `getWorkflowProcesses(id)` cho phần chi tiết.
- `features/sop-search/hooks/useGlobalSopSearch.ts`: debounce 300ms, gọi `/knowledge-search`, hủy request cũ và không hiển thị kết quả của truy vấn đã đổi.

Atoms/molecules không gọi API; API tập trung ở shared/api và feature model/hook. Giữ nguyên URL và nội dung giao diện hiện có. Các màn hình sơ đồ cũ dùng endpoint `/ui/*`, không phải mỗi component gọi một request riêng: cùng key trong phiên dùng chung cache/request.

Endpoint list tài liệu có phân trang đã sẵn sàng. Trong giao diện hiện tại, menu/sơ đồ vẫn sử dụng workflow index để giữ hành vi cũ; chưa thay tất cả màn hình bằng một trang danh sách tài liệu mới. Không nhầm việc có API mới với việc đã xây một UI catalog hoàn toàn mới.

Kiểm tra: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. Test có kiểm tra import workspace khi cache trống, race đổi phiên, retry, tham chiếu getter, render trang tổng quan không tải full workflow/master data, và mở URL workflow trực tiếp chỉ tải workflow đó. Đây là kiểm tra render tự động, không phải kiểm thử browser tương tác toàn bộ hệ thống.

Xem `BackEnd/docs/knowledge-read-transition.md` để thực hiện kế hoạch chuyển dữ liệu/đổi nguồn đọc. Không xóa AppConfig hay bảng SOP cũ khi các API tương thích còn dùng chúng.
