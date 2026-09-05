# FrontEnd: feature-based + Atomic Design

## Cấu trúc đang dùng

```text
src/
  app/
    App.tsx
    router.tsx
    providers/            ghép SessionProvider và LanguageProvider
    layouts/              ProtectedRoute/PublicOnlyRoute
    styles/               CSS ứng dụng, giữ nguyên thiết kế
  pages/
    login/                ghép DevelopmentLoginForm
    employee-lifecycle/   ghép EmployeeWorkspace
    not-found/
  widgets/
    employee-workspace/   điều phối các vùng trong cổng nghiệp vụ
    app-sidebar/
    app-support/
    app-guide/
    module-explorer/
    master-data-studio/
    lifecycle-journey/
    sop-stepper/
    cross-module-flow/
    operations-grid/
  features/
    authentication/       đăng nhập, phiên, bootstrap, hooks và UI
    sop-search/           tìm kiếm trên dataset được Backend trả về
    sop-viewer/           xem SOP, bước và luồng
    policy-browser/       tra cứu quy định, chi tiết và mô phỏng
    policy-acknowledgement/ hook ghi/đọc xác nhận và UI
    wireframe-viewer/
  entities/
    user/                 kiểu phiên và nhãn vai trò
    module/               kiểu phân hệ, dữ liệu và helper lọc hiển thị
    sop/                  nội dung SOP, selectors, cross-functional
    policy/
    lifecycle/
    master-data/
    process-flow/
    business-node/
  shared/
    ui/
      atoms/              Button, Input, Spinner
      molecules/          SearchField, LanguageSelector, FullPageLoading
    api/                  HTTP client, endpoint đang sử dụng, wire DTO
    config/               API base URL
    lib/                  credentials, i18n, runtime dataset store
  main.tsx
tests/                    kiểm thử import, API, UI nền tảng
```

Không tạo thư mục rỗng hoặc API giả chỉ để giống một cây mẫu. Các màn hình home/module-detail/admin-access và API tương ứng chỉ nên được thêm khi triển khai chức năng thực sự. Phần admin hiện có vẫn là màn hiển thị quyền; đợt refactor này không bổ sung UI cấp/thu hồi quyền mới.

## Ranh giới trách nhiệm

Hướng phụ thuộc: **app → pages → widgets → features → entities → shared**. Có thể bỏ qua lớp trung gian nếu hợp lý, nhưng không import ngược lên lớp cao hơn.

- App quản lý router, provider và cổng bảo vệ route.
- Page là điểm vào route, ghép feature/widget; không gọi HTTP trực tiếp.
- Widget là khối giao diện nghiệp vụ lớn (organism), có thể ghép các widget/feature khác.
- Feature chứa hành vi người dùng, state/hook, điều phối API và UI nghiệp vụ.
- Entity chứa kiểu, dữ liệu, adapter và hàm xử lý nghiệp vụ; không import widget/page.
- Shared không phụ thuộc nghiệp vụ ở các lớp trên. Wire DTO của endpoint nằm cùng lớp API; entity tái sử dụng các kiểu tương ứng.

Đây là cấu trúc thực dụng theo feature/layer, không tuyên bố áp dụng toàn bộ quy tắc Feature-Sliced Design. Các feature/widget cùng lớp vẫn có một số phụ thuộc với nhau để tái sử dụng giao diện hiện có. EmployeeWorkspace còn lớn; có thể tách tiếp theo vùng giao diện mà không đổi public URL.

## Atomic Design

- Atom: Button/Input giữ nguyên props, className, type và thuộc tính accessibility của phần tử HTML gốc. Spinner là icon trình bày.
- Molecule: SearchField ghép icon + Input + nút xóa; không biết SOP là gì. LanguageSelector và FullPageLoading là UI dùng chung.
- Organism: đặt tại widgets thay vì dồn mọi component nghiệp vụ vào shared/ui/organisms.
- Template/layout: app/layouts và bố cục của workspace.
- Page: pages.

Không đưa PolicyCard, SOP step hay ma trận nghiệp vụ vào atoms/molecules chỉ vì component nhỏ. Chúng phụ thuộc nghiệp vụ và thuộc feature/widget/entity tương ứng.

Atoms/molecules không gọi API; tên/giá trị tìm kiếm được feature truyền vào SearchField. Không thay đổi thiết kế, class CSS hoặc URL chỉ để phù hợp tên thư mục.

## API và bootstrap

Các endpoint hiện dùng được giữ nguyên:

| File | Endpoint |
|---|---|
| shared/api/auth.api.ts | GET /me, GET /auth/development-accounts, POST /auth/development-login |
| shared/api/bootstrap.api.ts | GET /bootstrap |
| shared/api/policy-acknowledgement.api.ts | GET/PUT /policy-acknowledgements/:id |
| shared/api/httpClient.ts | headers, base URL, timeout, lỗi HTTP |

Đường dẫn có prefix /api/v1 hoặc VITE_API_BASE_URL như trước. Không có driver database trong trình duyệt. Runtime store giữ JSON nhận từ API, không phải database client.

Đăng nhập và xác nhận đọc chính sách gọi API trong hook/model của feature. UI không tự tạo request. SessionProvider tải /me và bootstrap song song, chỉ hiển thị workspace sau khi hoàn tất; đăng xuất xóa credentials và runtime store.

Các adapter dữ liệu cũ trong entities vẫn đọc dataset khi module được import. Vì vậy giữ lazy loading của workspace sau bootstrap, không import trực tiếp các adapter này vào app/router hoặc UI đăng nhập.

Tìm kiếm hiện giữ nguyên cơ chế tìm trong dataset bootstrap đã được Backend lọc. Chưa đổi sang /search trên các bảng SOP chuẩn hóa đang rỗng, để tránh làm mất kết quả đang hiển thị. Không tạo các file modules.api/sops.api/search.api/admin-access.api chưa có consumer hoặc giả lập kết quả của chúng.

## Quyền truy cập

Backend là nơi kiểm tra quyền. Helper moduleAccess ở FE chỉ điều khiển hiển thị/điều hướng, không thay thế kiểm tra quyền của API. Giữ nguyên cơ chế JWT/development hiện tại; refactor này không triển khai SSO/OIDC mới.

## Kiểm tra

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

Test kiến trúc kiểm tra import tồn tại, hướng phụ thuộc, các thư mục cũ đã bỏ, page/UI không gọi HTTP và URL không đổi. Test API dùng HTTP giả lập, không kết nối hay thay đổi DB thật; kiểm tra endpoint, body, header user hiện hành và lỗi. Test UI kiểm tra atom không làm thay đổi HTML/props gốc.

Các test này không thay thế kiểm tra SSO thật hoặc mọi tương tác sơ đồ trên trình duyệt. Không thay `.env`, Backend, migration hoặc dữ liệu nghiệp vụ trong đợt refactor này.
