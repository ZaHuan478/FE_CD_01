import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Inbox,
  Info,
  ListFilter,
  Send,
  ShieldCheck,
  Sparkles,
  Workflow
} from 'lucide-react'
import { SOP_DATABASE } from './workflow-detail/data/sopDatabase'
import type { SopSubProcess } from './workflow-detail/types'
import { useLanguage } from '../../context/LanguageContext'
import type { BusinessClusterId } from './SystemOverviewDashboard'

interface ModuleDefinition {
  id: string
  code: string
  label: string
  workflowIds: string[]
  processCodes?: string[]
  plainMeaning: string
  fallbackInputs: string[]
  fallbackOutputs: string[]
  keyControls: string[]
}

const CLUSTER_MODULE_DEFINITIONS: Record<BusinessClusterId, {
  clusterTitle: string
  clusterTitleEn: string
  subtitle: string
  subtitleEn: string
  modules: ModuleDefinition[]
}> = {
  core: {
    clusterTitle: 'Vận hành lõi',
    clusterTitleEn: 'Core Operations',
    subtitle: 'Theo dõi toàn bộ quá trình từ tuyển chọn, ký hợp đồng, chấm công hàng ngày, tính lương và đóng bảo hiểm, thuế.',
    subtitleEn: 'Track hiring, employee profiling, daily attendance, payroll, social insurance, and income tax.',
    modules: [
      {
        id: 'recruitment',
        code: 'ATS',
        label: 'Tuyển dụng',
        workflowIds: ['LIFE-01'],
        plainMeaning: 'Tiếp nhận hồ sơ ứng viên, tổ chức phỏng vấn và gửi thư mời làm việc cho người trúng tuyển.',
        fallbackInputs: ['Phiếu yêu cầu tuyển dụng đã duyệt', 'Hồ sơ lý lịch ứng viên (CV)', 'Kết quả đánh giá phỏng vấn'],
        fallbackOutputs: ['Thư mời nhận việc (Offer Letter)', 'Thông tin ứng viên trúng tuyển sẵn sàng tạo nhân viên mới'],
        keyControls: ['Không tuyển vượt định biên đã duyệt', 'Bắt buộc kiểm tra bằng cấp và kinh nghiệm', 'Offer phải có phê duyệt thẩm quyền']
      },
      {
        id: 'employee',
        code: 'EMP',
        label: 'Hồ sơ và Hợp đồng',
        workflowIds: ['LIFE-00', 'LIFE-02', 'LIFE-03', 'LIFE-04', 'LIFE-05', 'LIFE-07'],
        plainMeaning: 'Quản lý thông tin cá nhân, hợp đồng lao động, quá trình công tác, khen thưởng kỷ luật và thôi việc.',
        fallbackInputs: ['Hồ sơ nhân thân, bằng cấp', 'Hợp đồng lao động và phụ lục', 'Quyết định bổ nhiệm/điều chuyển'],
        fallbackOutputs: ['Mã nhân viên định danh duy nhất', 'Hồ sơ nhân sự số hóa đầy đủ', 'Trạng thái lao động cập nhật theo ngày hiệu lực'],
        keyControls: ['Kiểm tra trùng số CCCD/MST trên toàn quốc', 'Hợp đồng phải đúng thời hạn luật lao động quy định', 'Bắt buộc đủ hồ sơ trước khi ký chính thức']
      },
      {
        id: 'attendance',
        code: 'ATT',
        label: 'Chấm công và Nghỉ phép',
        workflowIds: ['MODULE-ATT'],
        plainMeaning: 'Ghi nhận thời gian làm việc thực tế, phê duyệt làm thêm giờ (OT), ngày nghỉ phép và chốt bảng công tháng.',
        fallbackInputs: ['Dữ liệu quẹt vân tay / khuôn mặt / GPS', 'Đơn xin nghỉ phép và tăng ca đã duyệt', 'Lịch làm việc và phân ca đã xếp'],
        fallbackOutputs: ['Bảng tổng hợp công chuẩn hóa', 'Số giờ làm việc, giờ OT, ngày nghỉ hợp lệ để tính lương'],
        keyControls: ['Tự động đối soát quẹt thẻ với đơn từ', 'Cảnh báo vi phạm giới hạn làm thêm giờ theo Bộ luật Lao động', 'Khóa bảng công sau khi trưởng đơn vị ký duyệt']
      },
      {
        id: 'payroll',
        code: 'PAY',
        label: 'Tiền lương',
        workflowIds: ['MODULE-PAY'],
        plainMeaning: 'Tổng hợp ngày công, mức lương ngạch bậc, phụ cấp và các khoản khấu trừ để tính thu nhập thực nhận.',
        fallbackInputs: ['Bảng công đã khóa từ phân hệ Chấm công', 'Mức lương và phụ cấp theo hợp đồng', 'Dữ liệu thưởng, tạm ứng trong tháng'],
        fallbackOutputs: ['Bảng thanh toán lương tổng hợp', 'Phiếu lương điện tử (e-Payslip) gửi nhân viên', 'Lệnh chi lương chuyển ngân hàng'],
        keyControls: ['Tự động kiểm tra chéo công và lương', 'Bắt buộc 2 cấp thẩm định và phê duyệt trước khi chuyển tiền', 'Lưu vết lịch sử điều chỉnh lương']
      },
      {
        id: 'insurance',
        code: 'INS',
        label: 'Bảo hiểm xã hội',
        workflowIds: ['MODULE-INS'],
        plainMeaning: 'Quản lý mức đóng BHXH/BHYT/BHTN, khai báo tăng giảm lao động với cơ quan BHXH và xử lý chế độ ốm đau, thai sản.',
        fallbackInputs: ['Hợp đồng lao động và mức lương đóng BHXH', 'Danh sách nhân viên mới tiếp nhận hoặc nghỉ việc', 'Chứng từ nghỉ ốm, thai sản từ bệnh viện'],
        fallbackOutputs: ['Hồ sơ giao dịch điện tử gửi cơ quan BHXH', 'Mã số BHXH, thẻ BHYT đã kích hoạt', 'Tiền trợ cấp ốm đau/thai sản được chi trả'],
        keyControls: ['Đối soát mức đóng với mức lương tối thiểu vùng', 'Báo tăng/giảm đúng thời hạn quy định tránh phạt chậm', 'Kiểm tra tính hợp lệ của chứng từ y tế']
      },
      {
        id: 'tax',
        code: 'TAX',
        label: 'Thuế TNCN',
        workflowIds: ['MODULE-TAX'],
        plainMeaning: 'Đăng ký mã số thuế, đăng ký người phụ thuộc giảm trừ gia cảnh, khấu trừ thuế định kỳ và quyết toán thuế năm.',
        fallbackInputs: ['Thông tin CCCD và đăng ký mã số thuế', 'Hồ sơ người phụ thuộc và cam kết nuôi dưỡng', 'Tổng thu nhập chịu thuế từ bảng lương'],
        fallbackOutputs: ['Mã số thuế cá nhân đã cấp', 'Số thuế TNCN khấu trừ hàng tháng', 'Chứng từ khấu trừ thuế và tờ khai quyết toán năm'],
        keyControls: ['Tự động tính thuế theo biểu thuế lũy tiến từng phần', 'Kiểm tra tính duy nhất của người phụ thuộc', 'Đối chiếu tổng thuế khấu trừ với số thuế nộp kho bạc']
      }
    ]
  },
  people: {
    clusterTitle: 'Phát triển con người',
    clusterTitleEn: 'People Development',
    subtitle: 'Xây dựng mục tiêu công việc, đánh giá hiệu suất định kỳ, bồi dưỡng kỹ năng và hoạch định nhân sự kế cận.',
    subtitleEn: 'Set goals, evaluate performance, develop competencies, provide learning, and plan talent succession.',
    modules: [
      {
        id: 'kpi',
        code: 'KPI',
        label: 'Mục tiêu & KPI',
        workflowIds: ['MODULE-PFM'],
        processCodes: ['PFM-02', 'PFM-03'],
        plainMeaning: 'Giao chỉ tiêu công việc, phân bổ trọng số và theo dõi tiến độ hoàn thành mục tiêu trong kỳ.',
        fallbackInputs: ['Mục tiêu chung của công ty và phòng ban', 'Bản mô tả công việc của vị trí', 'Tiến độ và kết quả thực hiện thực tế'],
        fallbackOutputs: ['Bản cam kết mục tiêu KPI đã duyệt', 'Báo cáo tiến độ và điểm hoàn thành mục tiêu'],
        keyControls: ['Tổng trọng số các mục tiêu phải đúng 100%', 'Mục tiêu phải có tiêu chí đo lường rõ ràng (SMART)', 'Được quản lý trực tiếp xác nhận']
      },
      {
        id: 'review',
        code: 'REV',
        label: 'Đánh giá hiệu suất',
        workflowIds: ['MODULE-PFM'],
        processCodes: ['PFM-01', 'PFM-04', 'PFM-05', 'PFM-06'],
        plainMeaning: 'Nhân viên tự đánh giá, quản lý nhận xét, hiệu chỉnh điểm chung và thống nhất kết quả xếp loại cuối kỳ.',
        fallbackInputs: ['Kết quả thực hiện KPI và bằng chứng công việc', 'Bảng tiêu chí và thang điểm đánh giá', 'Ý kiến nhận xét của quản lý'],
        fallbackOutputs: ['Kết quả xếp loại hiệu suất (A/B/C/D)', 'Căn cứ xét thưởng, tăng lương và bổ nhiệm'],
        keyControls: ['Áp dụng phân bổ xếp loại chuẩn theo chính sách', 'Nhân viên có quyền phản hồi kết quả đánh giá', 'Hiệu chỉnh điểm số qua hội đồng đánh giá']
      },
      {
        id: 'competency',
        code: 'CMP',
        label: 'Khung năng lực',
        workflowIds: ['MODULE-CMP'],
        plainMeaning: 'Xác định các năng lực cần có cho từng vị trí, đánh giá khoảng cách kỹ năng để lập kế hoạch đào tạo.',
        fallbackInputs: ['Từ điển năng lực chuẩn của tổ chức', 'Yêu cầu năng lực theo từng chức danh', 'Kết quả tự đánh giá và đánh giá năng lực'],
        fallbackOutputs: ['Bản đồ năng lực cá nhân và đơn vị', 'Danh sách khoảng trống kỹ năng cần đào tạo bổ sung'],
        keyControls: ['Định nghĩa cấp độ năng lực nhất quán', 'Đánh giá dựa trên hành vi quan sát được', 'Liên kết chặt chẽ với lộ trình phát triển nghề nghiệp']
      },
      {
        id: 'learning',
        code: 'LND',
        label: 'Đào tạo & Phát triển',
        workflowIds: ['MODULE-LND'],
        plainMeaning: 'Lập kế hoạch khóa học, tổ chức lớp đào tạo, theo dõi điểm danh và đánh giá hiệu quả sau khóa học.',
        fallbackInputs: ['Nhu cầu đào tạo từ khoảng trống năng lực', 'Kế hoạch ngân sách đào tạo năm', 'Danh sách nhân viên đăng ký tham gia'],
        fallbackOutputs: ['Chứng chỉ hoàn thành khóa đào tạo', 'Lịch sử học tập cập nhật vào hồ sơ nhân viên', 'Báo cáo đo lường hiệu quả đào tạo'],
        keyControls: ['Kiểm tra điều kiện bắt buộc tham gia đào tạo tuân thủ', 'Cam kết đào tạo đối với các khóa học chi phí cao', 'Đánh giá kết quả học tập trước khi cấp chứng chỉ']
      },
      {
        id: 'talent',
        code: 'TAL',
        label: 'Nhân tài & Kế nhiệm',
        workflowIds: ['MODULE-TAL'],
        plainMeaning: 'Xác định nhân sự tiềm năng cao (HiPo), xếp hạng ma trận 9-Box và chuẩn bị người thay thế cho các vị trí chủ chốt.',
        fallbackInputs: ['Lịch sử hiệu suất nhiều kỳ liên tiếp', 'Mức độ đáp ứng năng lực và tiềm năng phát triển', 'Danh mục các vị trí trọng yếu trong công ty'],
        fallbackOutputs: ['Danh sách nhân sự kế nhiệm sẵn sàng', 'Kế hoạch phát triển riêng cho từng nhân tài'],
        keyControls: ['Mỗi vị trí trọng yếu phải có ít nhất 1-2 ứng viên kế nhiệm', 'Bảo mật danh sách nhân tài', 'Định kỳ rà soát mức độ sẵn sàng thay thế']
      },
      {
        id: 'engagement',
        code: 'ENG',
        label: 'Ghi nhận & Phúc lợi',
        workflowIds: ['MODULE-ENG'],
        plainMeaning: 'Ghi nhận thành tích, khen thưởng đột xuất, quản lý chế độ phúc lợi và khảo sát mức độ gắn kết của nhân viên.',
        fallbackInputs: ['Đề xuất khen thưởng thành tích xuất sắc', 'Chính sách phúc lợi theo thâm niên/cấp bậc', 'Kết quả khảo sát ý kiến nhân viên'],
        fallbackOutputs: ['Quyết định khen thưởng và điểm thưởng', 'Gói quyền lợi bảo hiểm nâng cao, nghỉ mát', 'Kế hoạch cải thiện môi trường làm việc'],
        keyControls: ['Khen thưởng đúng người, đúng thời điểm', 'Phúc lợi áp dụng công bằng theo tiêu chuẩn quy định', 'Bảo mật thông tin phản hồi của nhân viên']
      }
    ]
  },
  organization: {
    clusterTitle: 'Quản trị tổ chức',
    clusterTitleEn: 'Organization Management',
    subtitle: 'Quy hoạch số lượng nhân sự, xây dựng sơ đồ phòng ban, định nghĩa chức danh và kiểm soát từng vị trí ghế ngồi.',
    subtitleEn: 'Plan headcount limits, build organizational charts, define job architecture, and control positions.',
    modules: [
      {
        id: 'headcount',
        code: 'HC',
        label: 'Định biên nhân sự',
        workflowIds: ['MODULE-ORG-HC'],
        plainMeaning: 'Lập kế hoạch số lượng nhân sự cần có cho từng phòng ban và kiểm soát không tuyển vượt ngân sách cho phép.',
        fallbackInputs: ['Kế hoạch sản xuất kinh doanh năm', 'Đề xuất số lượng nhân sự từ các phòng ban', 'Ngân sách chi phí lương được duyệt'],
        fallbackOutputs: ['Hạn mức định biên đã duyệt cho từng đơn vị', 'Báo cáo so sánh nhân sự thực tế với kế hoạch'],
        keyControls: ['Hệ thống chặn tạo yêu cầu tuyển dụng nếu vượt định biên', 'Điều chỉnh định biên phải có phê duyệt cấp cao', 'Định kỳ kiểm soát tỷ lệ lấp đầy định biên']
      },
      {
        id: 'structure',
        code: 'OST',
        label: 'Cơ cấu tổ chức',
        workflowIds: ['MODULE-ORG-ST'],
        plainMeaning: 'Quản lý cây sơ đồ đơn vị, phòng ban, trung tâm và lưu trữ lịch sử thay đổi khi sáp nhập hoặc tái cơ cấu.',
        fallbackInputs: ['Quyết định thành lập, giải thể hoặc sáp nhập đơn vị', 'Mã số và tên phòng ban chuẩn hóa', 'Cấp bậc quản lý và mối quan hệ trực thuộc'],
        fallbackOutputs: ['Sơ đồ cây tổ chức chuẩn hóa toàn công ty', 'Lịch sử cơ cấu tổ chức theo ngày hiệu lực'],
        keyControls: ['Mỗi phòng ban phải có người phụ trách xác định', 'Lịch sử thay đổi không thể bị xóa (Audit Trail)', 'Chỉ cập nhật khi có quyết định ban hành chính thức']
      },
      {
        id: 'job',
        code: 'JOB',
        label: 'Kiến trúc chức danh',
        workflowIds: ['MODULE-ORG-JOB'],
        plainMeaning: 'Chuẩn hóa danh mục nghề nghiệp, bản mô tả công việc (JD), ngạch bậc chuyên môn và cấp độ quản lý.',
        fallbackInputs: ['Yêu cầu năng lực và trách nhiệm công việc', 'Khung chuẩn chức danh và ngạch bậc lương', 'Phân cấp thẩm quyền chuyên môn'],
        fallbackOutputs: ['Từ điển chức danh chuẩn hóa toàn hệ thống', 'Bản mô tả công việc (JD) chính thức'],
        keyControls: ['Tránh đặt tên chức danh trùng lặp hoặc không theo chuẩn', 'Mỗi chức danh phải gắn liền với khung lương tương ứng', 'Được Hội đồng nhân sự phê duyệt']
      },
      {
        id: 'position',
        code: 'POS',
        label: 'Vị trí công tác',
        workflowIds: ['MODULE-ORG-POS'],
        plainMeaning: 'Quản lý từng ghế vị trí cụ thể, người đang đảm nhiệm, tuyến báo cáo trực tiếp và các vị trí đang trống.',
        fallbackInputs: ['Hạn mức định biên đã duyệt của phòng ban', 'Mã chức danh cần tuyển dụng hoặc bổ nhiệm', 'Tuyến báo cáo công việc trực tiếp'],
        fallbackOutputs: ['Mã vị trí công tác duy nhất', 'Sơ đồ ghế vị trí và trạng thái lấp đầy / trống'],
        keyControls: ['Mỗi ghế vị trí chỉ có tối đa 1 người đảm nhiệm chính thức', 'Bắt buộc xác định người báo cáo trực tiếp', 'Tự động mở trạng thái tuyển khi vị trí bị trống']
      },
      {
        id: 'report',
        code: 'RPT',
        label: 'Báo cáo nhân sự',
        workflowIds: ['MODULE-ORG-RPT'],
        plainMeaning: 'Tổng hợp số liệu thống kê lực lượng lao động, tỷ lệ biến động nhân sự và các báo cáo nộp cơ quan nhà nước.',
        fallbackInputs: ['Dữ liệu toàn bộ nhân viên, hợp đồng và quá trình công tác', 'Biến động nhân sự (vào mới, nghỉ việc, chuyển công tác)', 'Quy định mẫu biểu báo cáo định kỳ'],
        fallbackOutputs: ['Báo cáo tổng quan lực lượng lao động', 'Báo cáo tình hình sử dụng lao động nộp Sở LĐ-TB&XH'],
        keyControls: ['Số liệu tổng hợp tự động theo thời gian thực', 'Đúng biểu mẫu quy định của pháp luật hiện hành', 'Phân quyền xem báo cáo theo cấp quản lý']
      }
    ]
  },
  platform: {
    clusterTitle: 'Nền tảng vận hành',
    clusterTitleEn: 'Platform Foundation',
    subtitle: 'Cung cấp các dịch vụ dùng chung: từ điển dữ liệu chuẩn, cấu hình quy tắc, phê duyệt tự động và an toàn bảo mật.',
    subtitleEn: 'Provides shared services: master data catalogs, business configurations, workflows, and enterprise security.',
    modules: [
      {
        id: 'shared',
        code: 'MD',
        label: 'Từ điển danh mục',
        workflowIds: ['MODULE-PLT-MD'],
        plainMeaning: 'Chuẩn hóa các danh mục dữ liệu dùng chung (dân tộc, tỉnh thành, ngân hàng, chức vụ) để tránh sai lệch thông tin.',
        fallbackInputs: ['Yêu cầu thêm mới hoặc chuẩn hóa danh mục', 'Quy chuẩn danh mục theo quy định nhà nước', 'Mã định danh và tên gọi chuẩn'],
        fallbackOutputs: ['Bộ từ điển dữ liệu quy chuẩn có ngày hiệu lực', 'Dữ liệu nguồn cấp cho toàn bộ các phân hệ nghiệp vụ'],
        keyControls: ['Không cho phép xóa danh mục đã có dữ liệu sử dụng', 'Kiểm soát trùng lặp mã danh mục', 'Theo dõi phiên bản danh mục theo thời gian']
      },
      {
        id: 'configuration',
        code: 'CFG',
        label: 'Cấu hình tham số',
        workflowIds: ['MODULE-PLT-CFG'],
        plainMeaning: 'Cài đặt các quy tắc tính toán, mức giảm trừ gia cảnh, ngày khóa công và chính sách riêng theo từng pháp nhân.',
        fallbackInputs: ['Chính sách nhân sự của công ty', 'Quy định luật pháp mới ban hành (mức lương cơ sở, tỷ lệ đóng bảo hiểm)', 'Ngày hiệu lực áp dụng cấu hình'],
        fallbackOutputs: ['Bộ quy tắc tính toán tự động cho phần mềm', 'Tham số vận hành được cập nhật an toàn'],
        keyControls: ['Phân tách cấu hình theo từng công ty thành viên', 'Lưu vết lịch sử cấu hình trước và sau khi đổi', 'Chỉ tài khoản quản trị hệ thống được phép điều chỉnh']
      },
      {
        id: 'workflow',
        code: 'WFL',
        label: 'Tuyến duyệt tự động',
        workflowIds: ['MODULE-PLT-WFL'],
        plainMeaning: 'Thiết lập quy trình duyệt đơn từ (nghỉ phép, tăng ca, bổ nhiệm), tự động chuyển đến đúng người có thẩm quyền.',
        fallbackInputs: ['Sơ đồ phân cấp thẩm quyền phê duyệt', 'Điều kiện chuyển tuyến (số ngày nghỉ, số tiền duyệt)', 'Quy định thời hạn xử lý (SLA) và ủy quyền'],
        fallbackOutputs: ['Tuyến phê duyệt tự động xuyên suốt', 'Hồ sơ được duyệt đúng người, đúng thẩm quyền'],
        keyControls: ['Tự động nhắc việc khi hồ sơ quá hạn duyệt', 'Hỗ trợ ủy quyền phê duyệt khi đi công tác', 'Ngăn chặn tự phê duyệt đơn từ của chính mình']
      },
      {
        id: 'document',
        code: 'DOC',
        label: 'Kho tài liệu số',
        workflowIds: ['MODULE-PLT-DOC'],
        plainMeaning: 'Số hóa, lưu trữ và bảo quản toàn bộ hợp đồng, bằng cấp, quyết định dưới dạng file điện tử an toàn.',
        fallbackInputs: ['Biểu mẫu văn bản chuẩn (mẫu HĐLĐ, mẫu quyết định)', 'File scan giấy tờ nhân thân của nhân viên', 'Chứng từ phát sinh trong quá trình công tác'],
        fallbackOutputs: ['Kho hồ sơ nhân sự điện tử tập trung', 'Kiểm soát phiên bản và liên kết chứng từ với hồ sơ'],
        keyControls: ['Mã hóa file đính kèm lưu trữ an toàn', 'Phân quyền chặt chẽ ai được xem tài liệu nhạy cảm', 'Tự động sao lưu dữ liệu phòng ngừa sự cố']
      },
      {
        id: 'signature',
        code: 'SIG',
        label: 'Ký số điện tử',
        workflowIds: ['MODULE-PLT-SIG'],
        plainMeaning: 'Ký hợp đồng lao động và quyết định trực tuyến bằng chữ ký số hoặc mã OTP, không cần in giấy.',
        fallbackInputs: ['Văn bản đã qua quy trình phê duyệt', 'Thông tin người ký và phương thức xác thực (OTP / Chữ ký số)', 'Thời hạn hoàn thành phiên ký'],
        fallbackOutputs: ['Văn bản có giá trị pháp lý đầy đủ', 'Biên bản chứng thư số và bằng chứng thời gian ký'],
        keyControls: ['Xác thực danh tính 2 lớp trước khi ký', 'Khóa chỉnh sửa văn bản ngay khi có chữ ký đầu tiên', 'Đảm bảo tính bất biến và toàn vẹn của file ký']
      },
      {
        id: 'notification',
        code: 'NTF',
        label: 'Thông báo & Nhắc việc',
        workflowIds: ['MODULE-PLT-NTF'],
        plainMeaning: 'Tự động gửi email, tin nhắn ứng dụng hoặc Zalo để nhắc các việc quan trọng (sắp hết hạn hợp đồng, có đơn cần duyệt).',
        fallbackInputs: ['Sự kiện phát sinh trong hệ thống', 'Mẫu nội dung thông báo chuẩn', 'Kênh nhận tin của người dùng (Email / App / Zalo)'],
        fallbackOutputs: ['Tin nhắn thông báo được gửi đúng người, đúng lúc', 'Nhật ký gửi nhận và trạng thái đã đọc'],
        keyControls: ['Tự động kiểm tra tránh gửi tin nhắn trùng lặp', 'Bảo mật thông tin riêng tư trong nội dung tin nhắn', 'Đảm bảo tỷ lệ gửi thành công qua các kênh']
      },
      {
        id: 'integration',
        code: 'INT',
        label: 'Tích hợp hệ thống',
        workflowIds: ['MODULE-PLT-INT'],
        plainMeaning: 'Kết nối hai chiều giữa HRMS với máy chấm công, phần mềm kế toán ERP, ngân hàng chi lương và bảo hiểm xã hội.',
        fallbackInputs: ['Dữ liệu từ máy chấm công vân tay', 'Gói dữ liệu lương cần hạch toán vào ERP', 'Lệnh thanh toán gửi sang ngân hàng'],
        fallbackOutputs: ['Dữ liệu đồng bộ tự động và thông suốt', 'Nhật ký kết nối (API Log) và cơ chế tự động thử lại khi lỗi'],
        keyControls: ['Mã hóa bảo mật toàn bộ dữ liệu trên đường truyền', 'Đối soát số liệu hai bên trước khi hạch toán', 'Cảnh báo ngay lập tức nếu đường truyền mất kết nối']
      },
      {
        id: 'security',
        code: 'SEC',
        label: 'Phân quyền & Bảo mật',
        workflowIds: ['MODULE-PLT-SEC'],
        plainMeaning: 'Kiểm soát ai được xem thông tin gì, ai được sửa dữ liệu, bảo vệ dữ liệu cá nhân theo đúng luật bảo vệ dữ liệu.',
        fallbackInputs: ['Chức vụ, đơn vị công tác của nhân viên', 'Ma trận phân quyền theo vai trò (Admin, Trưởng phòng, Nhân viên)', 'Quy định về phạm vi xem dữ liệu nhân sự'],
        fallbackOutputs: ['Tài khoản và quyền hạn đăng nhập chính xác', 'Màn hình và dữ liệu hiển thị đúng theo quyền được cấp'],
        keyControls: ['Bắt buộc mật khẩu mạnh và xác thực đa yếu tố (MFA)', 'Ngăn chặn nhân viên xem lương của người khác', 'Tự động khóa tài khoản khi có dấu hiệu bất thường']
      },
      {
        id: 'audit',
        code: 'AUD',
        label: 'Nhật ký kiểm toán',
        workflowIds: ['MODULE-PLT-AUD'],
        plainMeaning: 'Ghi nhận dấu vết bất biến (ai đã xem, sửa, xóa, duyệt thông tin gì, vào thời điểm nào) để giải trình và bảo vệ an toàn.',
        fallbackInputs: ['Mọi thao tác phát sinh của người dùng trên phần mềm', 'Địa chỉ IP, thiết bị và thời gian truy cập', 'Dữ liệu trước và sau khi bị thay đổi'],
        fallbackOutputs: ['Nhật ký lịch sử hệ thống bất biến (Audit Trail)', 'Báo cáo giải trình phục vụ thanh tra, kiểm toán'],
        keyControls: ['Không ai (kể cả Admin) có thể xóa hoặc sửa nhật ký kiểm toán', 'Lưu trữ tối thiểu 5-10 năm theo quy định pháp luật', 'Dễ dàng tra cứu khi có sự cố cần điều tra']
      }
    ]
  }
}

export const UnifiedProcessInputOutputView: React.FC<{ cluster: BusinessClusterId }> = ({ cluster }) => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const clusterData = CLUSTER_MODULE_DEFINITIONS[cluster]

  const [selectedModuleId, setSelectedModuleId] = useState<string>(clusterData.modules[0].id)
  const [selectedSopCode, setSelectedSopCode] = useState<string>('ALL')

  // Reset selected module when cluster changes
  useEffect(() => {
    setSelectedModuleId(clusterData.modules[0].id)
    setSelectedSopCode('ALL')
  }, [cluster, clusterData.modules])

  const activeModule = clusterData.modules.find(m => m.id === selectedModuleId) ?? clusterData.modules[0]

  // Get processes from SOP_DATABASE
  const processes: SopSubProcess[] = useMemo(() => {
    const procs: SopSubProcess[] = []
    for (const workflowId of activeModule.workflowIds) {
      const items = SOP_DATABASE[workflowId] ?? []
      procs.push(...items)
    }
    if (activeModule.processCodes?.length) {
      const allowed = new Set(activeModule.processCodes.map(c => c.toUpperCase().replace(/[^A-Z0-9]/g, '')))
      return procs.filter(p => allowed.has(p.sopCode.toUpperCase().replace(/[^A-Z0-9]/g, '')))
    }
    return procs
  }, [activeModule])

  const activeProcess = processes.find(p => p.sopCode === selectedSopCode)

  const currentInputs = activeProcess?.inputs?.length ? activeProcess.inputs : activeModule.fallbackInputs
  const currentOutputs = activeProcess?.outputs?.length ? activeProcess.outputs : activeModule.fallbackOutputs
  const currentProcessTitle = activeProcess ? activeProcess.sopTitle : activeModule.plainMeaning

  const handleOpenDetail = () => {
    const wfId = activeModule.workflowIds[0]
    if (!wfId) return
    const query = activeProcess ? `?sop=${encodeURIComponent(activeProcess.sopCode)}` : ''
    navigate(`/employee-lifecycle/infographic/${wfId}${query}`)
  }

  return (
    <section className="space-y-5 animate-fadeIn">
      {/* SECTION HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1f5f86] text-white shadow-2xs">
              <Workflow className="h-4 w-4" />
            </span>
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#1f5f86] dark:text-sky-300">
              {language === 'vi' ? 'ĐẦU VÀO VÀ KẾT QUẢ' : 'INPUTS & OUTPUTS'} · {language === 'vi' ? clusterData.clusterTitle : clusterData.clusterTitleEn}
            </span>
          </div>
          <h3 className="mt-1 text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {language === 'vi'
              ? 'Dữ liệu cần chuẩn bị, thao tác xử lý và sản phẩm đầu ra'
              : 'Required inputs, execution process, and deliverables'}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {language === 'vi' ? clusterData.subtitle : clusterData.subtitleEn}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenDetail}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-[#1f5f86] hover:bg-sky-50 hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
        >
          <span>{language === 'vi' ? 'Xem chi tiết quy trình' : 'View workflow details'}</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-[#1f5f86] dark:text-sky-300" />
        </button>
      </header>

      {/* TẦNG 1: MODULE SELECTOR TABS */}
      <nav
        aria-label="Chọn phân hệ nghiệp vụ"
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-950/60"
      >
        {clusterData.modules.map((mod) => {
          const isSelected = mod.id === activeModule.id
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => {
                setSelectedModuleId(mod.id)
                setSelectedSopCode('ALL')
              }}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[#1f5f86] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-white hover:text-[#1f5f86] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <span>{mod.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {mod.code}
              </span>
            </button>
          )
        })}
      </nav>

      {/* TẦNG 2: PROCESS CHIP SELECTOR (Nếu phân hệ có nhiều SOP) */}
      {processes.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 text-xs dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <span className="flex items-center gap-1 text-[10.5px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400 mr-1">
            <ListFilter className="h-3.5 w-3.5 text-[#1f5f86] dark:text-sky-300" />
            {language === 'vi' ? 'Xem theo quy trình:' : 'Select SOP:'}
          </span>
          <button
            type="button"
            onClick={() => setSelectedSopCode('ALL')}
            className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors ${
              selectedSopCode === 'ALL'
                ? 'bg-[#1f5f86] text-white shadow-2xs'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {language === 'vi' ? 'Toàn bộ phân hệ (Tổng hợp)' : 'Entire Module (Overview)'}
          </button>
          {processes.slice(0, 8).map((p) => {
            const isPSelected = p.sopCode === selectedSopCode
            return (
              <button
                key={p.sopCode}
                type="button"
                onClick={() => setSelectedSopCode(p.sopCode)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors ${
                  isPSelected
                    ? 'bg-[#1f5f86] text-white shadow-2xs'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <span className="font-mono text-[10px] mr-1 opacity-80">{p.sopCode}</span>
                <span>{p.sopTitle}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* TẦNG 3: MÔ HÌNH TRỰC QUAN 3 KHỐI DỄ HIỂU (3-STAGE VISUAL DATA FLOW) */}
      <div
        aria-label="Luồng dữ liệu từ đầu vào đến kết quả"
        className="grid grid-cols-1 items-stretch gap-2.5 lg:grid-cols-[1fr_auto_1.1fr_auto_1fr]"
      >
        {/* KHỐI 1: ĐẦU VÀO CẦN CÓ */}
        <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <h4 className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
                <Inbox className="h-4 w-4" />
                <span>{language === 'vi' ? '1. Cần chuẩn bị gì trước? (Đầu vào)' : '1. What inputs are required?'}</span>
              </h4>
              <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9.5px] font-bold text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300">
                {currentInputs.length} {language === 'vi' ? 'mục' : 'items'}
              </span>
            </div>
            <ul className="space-y-2">
              {currentInputs.map((item, idx) => (
                <li key={`${item}-${idx}`} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2e8bbd]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 border-t border-slate-100 pt-2 text-[10.5px] italic text-slate-400 dark:border-slate-800 dark:text-slate-500">
            {language === 'vi' ? 'Dữ liệu hợp lệ mới được đưa vào hệ thống' : 'Verified data before processing'}
          </p>
        </article>

        {/* MŨI TÊN CHUYỂN TIẾP 1 */}
        <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="h-5 w-5 lg:hidden" />
          <ArrowRight className="hidden h-5 w-5 lg:block" />
        </div>

        {/* KHỐI 2: HỆ THỐNG & NHÂN SỰ XỬ LÝ (ĐIỂM NHẤN CHỦ ĐẠO) */}
        <article className="flex flex-col justify-between rounded-xl border border-[#2e8bbd] bg-[#1f5f86] p-4 text-white shadow-sm">
          <div>
            <div className="mb-2.5 flex items-center justify-between border-b border-white/20 pb-2">
              <h4 className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-sky-100">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>{language === 'vi' ? '2. Hệ thống & Nhân sự làm gì? (Xử lý)' : '2. How is it processed?'}</span>
              </h4>
              <span className="rounded bg-white/20 px-2 py-0.5 font-mono text-[10px] font-bold">
                {activeModule.code}
              </span>
            </div>
            <h5 className="text-sm sm:text-base font-black leading-snug">
              {activeProcess ? activeProcess.sopTitle : activeModule.label}
            </h5>
            <p className="mt-2 text-xs leading-relaxed text-sky-100">
              {currentProcessTitle}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-3">
            <span className="text-[10px] font-medium text-sky-200">
              {language === 'vi' ? 'Thao tác chuẩn hóa theo quy trình' : 'Standard operational SOP flow'}
            </span>
            <button
              type="button"
              onClick={handleOpenDetail}
              className="flex items-center gap-1 rounded bg-white/20 px-2.5 py-1 text-[10.5px] font-bold text-white hover:bg-white/30 transition-colors cursor-pointer"
            >
              <span>{language === 'vi' ? 'Xem các bước' : 'View steps'}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </article>

        {/* MŨI TÊN CHUYỂN TIẾP 2 */}
        <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="h-5 w-5 lg:hidden" />
          <ArrowRight className="hidden h-5 w-5 lg:block" />
        </div>

        {/* KHỐI 3: KẾT QUẢ TẠO RA */}
        <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <h4 className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
                <Send className="h-4 w-4" />
                <span>{language === 'vi' ? '3. Nhận được kết quả gì? (Đầu ra)' : '3. What deliverables are produced?'}</span>
              </h4>
              <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9.5px] font-bold text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300">
                {currentOutputs.length} {language === 'vi' ? 'mục' : 'items'}
              </span>
            </div>
            <ul className="space-y-2">
              {currentOutputs.map((item, idx) => (
                <li key={`${item}-${idx}`} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1f5f86] dark:text-sky-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 border-t border-slate-100 pt-2 text-[10.5px] italic text-slate-400 dark:border-slate-800 dark:text-slate-500">
            {language === 'vi' ? 'Sẵn sàng bàn giao cho phân hệ kế tiếp' : 'Ready to hand over to next subsystem'}
          </p>
        </article>
      </div>

      {/* TẦNG 4: THẺ GIẢI THÍCH BÌNH DÂN & ĐIỂM KIỂM SOÁT BẢO VỆ */}
      <article className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-900/60 dark:bg-sky-950/20 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-[#1f5f86] dark:bg-sky-900 dark:text-sky-300">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{language === 'vi' ? 'Vì sao bước này quan trọng và cần kiểm soát gì?' : 'Why is this step crucial & what are the safeguards?'}</span>
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {activeModule.plainMeaning}
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {activeModule.keyControls.map((ctrl, idx) => (
                <div
                  key={`${ctrl}-${idx}`}
                  className="flex items-start gap-2 rounded-lg border border-sky-200/80 bg-white/90 p-2.5 text-[11px] text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1f5f86] dark:text-sky-300" />
                  <span className="font-semibold leading-snug">{ctrl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}
