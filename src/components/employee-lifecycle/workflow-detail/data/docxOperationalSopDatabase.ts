import type { SopSubProcess } from '../types'

// Generated from the HRM SOP DOCX tables. Do not hand-edit process steps here.
export const DOCX_OPERATIONAL_SOP_DATABASE: Record<string, SopSubProcess[]> = {
  "MODULE-ATT": [
    {
      "sopCode": "SOP-ATT-01",
      "sopTitle": "Quy trình tạo và điều chỉnh lịch làm việc qua portal",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT01.01",
          "title": "Tạo lịch làm việc",
          "actor": "TBP",
          "location": "Portal",
          "timing": "Nếu lịch theo tuần: đầu tuần hoặc trước đó Nếu lịch theo tháng: đầu tháng hoặc trước đó",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Nhân viên có hình thức làm việc là “Gián tiếp” hoặc nhân viên “Trực tiếp” nhưng có lịch đi ca cố định thì Ca làm việc sẽ được định nghĩa trong “Đối tượng công” và không thuộc đối tượng tạo lịch làm việc.\n\nCác nhân viên còn lại sẽ do TBP sẽ phụ trách tạo lịch làm việc cho nhân viên của bộ phận mình phụ trách. Nếu:\n\nCác thông tin cần cập nhật trên màn hình đăng ký lịch đi ca gồm:\n\nLưu ý:\n\nTrường hợp TBP không sử dụng portal thì cập nhật Lịch đi ca vào template và gửi về HRM-C&B import lại vào chương trình (tham khảo quy trình ATT02)",
          "fieldsChecklist": [
            "TBP có sử dụng cổng portal thì sẽ tạo trực tiếp trên portal.",
            "TBP không có sử dụng cổng portal thì sẽ tạo từ file template do bộ phận HRM-C&B gửi (tham khảo quy trình ATT02)",
            "Phòng ban",
            "Nhân viên",
            "Ca áp dụng",
            "Thời gian áp dụng Ca (check mode theo:",
            "Ngày",
            "Tuần",
            "Tháng",
            "Từ ngày đến ngày",
            "Chu kỳ (vòng lập) áp dụng ca (check mode theo:",
            "Liên tục (ví dụ nếu Thời gian áp dụng Ca check theo ngày thì được hiểu là Ca này áp dụng liên tục cho các ngày)",
            "Cách khoảng (ví dụ nếu Thời gian áp dụng Ca check theo Tuần thì Ca này sẽ tự động thiết lập theo tuần cách khoảng)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT01.02",
          "title": "Truy vấn lịch đi ca",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi TBP lập lịch đi ca",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên, nếu:\n\nCác thông tin truy vấn gồm:",
          "fieldsChecklist": [
            "Có sử dụng portal sẽ chủ động truy vấn lịch đi ca trên portal",
            "Không sử dụng portal thì xem thông tin lịch đi ca được in và dán ở bộ phận",
            "Phòng ban",
            "Nhân viên",
            "Ngày làm việc",
            "Ca làm việc"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT01.03",
          "title": "Điều chỉnh lịch đi ca",
          "actor": "NV/TBP",
          "location": "Portal",
          "timing": "Trước khi bắt đầu ca làm việc",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Nhân viên, nếu:\n\nCác thông tin cập nhật trên màn hình đề xuất điều chỉnh gồm:\n\nGửi mail đề xuất thay đổi ca làm việc",
          "fieldsChecklist": [
            "Có sử dụng portal sẽ chủ động đề xuất điều chỉnh lịch đi ca của mình",
            "Không sử dụng portal sẽ trao đổi với TBP để được điều chỉnh trên file template do HRM-C&B cung cấp (tham khảo quy trình ATT02)",
            "Phòng ban",
            "Nhân viên",
            "Ngày làm việc cần điều chỉnh ca",
            "Ca làm việc cần điều chỉnh",
            "Lý do điều chỉnh"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "ATT01.04",
          "title": "Duyệt đề xuất",
          "actor": "TBP",
          "location": "Portal",
          "timing": "Sau khi nhận được mail của nhân viên nhưng trước thời gian chốt công của HRM-C&B",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Đề xuất thay đổi ca làm việc được chuyển đến TBP. Nếu:\n\nCác thông tin tại màn hình duyệt gồm:\n\nGửi mail về cho nhân viên",
          "fieldsChecklist": [
            "Đồng ý với đề xuất: duyệt và cập nhật nhật lại lịch đi ca của nhân viên",
            "Không đồng ý với đề xuất: không duyệt và trả lại đề xuất cho nhân viên để điều chỉnh (nếu có)",
            "Phòng ban",
            "Nhân viên",
            "Ngày làm việc cần điều chỉnh ca",
            "Ca làm việc cần điều chỉnh",
            "Lý do điều chỉnh",
            "Duyệt/Không duyệt (check mode, trong đó nếu chọn Không duyệt thì cột “Lý do” sẽ sáng lên và ràng buộc nhập)",
            "Lý do"
          ],
          "sourceRow": 5
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-ATT-02",
      "sopTitle": "Quy trình tạo và điều chỉnh lịch làm việc, không sử dụng portal",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT02.01",
          "title": "Xuất template file Lịch đi ca",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Trước thời điểm áp dụng lịch làm việc",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "HRM-C&B xuất template file Lịch đi ca cho TBP.\n\nCác thông tin trên template gồm:\n\nGửi mail file template cho TBP",
          "fieldsChecklist": [
            "Phòng ban",
            "Nhân viên/ Mã nhân viên (theo chiều dọc)",
            "31 ngày trong tháng (theo chiều ngang)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT02.02",
          "title": "Lập lịch đi ca",
          "actor": "TBP",
          "location": "Bên ngoài",
          "timing": "Sau khi nhận được mail từ HRM-C&B nhưng trước thời điểm áp dụng lịch làm việc",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Lịch đi ca theo từng ngày của từng nhân viên được điền theo template có sẵn.\n\nGửi mail file template kèm thông tin lịch đi ca về cho HRM-C&B",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT02.03",
          "title": "Cập nhật lịch làm việc",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi nhận được mail từ TBP nhưng trước thời điểm áp dụng lịch làm việc",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Import file template do TBP gửi vào chương trình.\n\nThông tin import gồm:",
          "fieldsChecklist": [
            "Phòng ban",
            "Nhân viên/ Mã nhân viên (theo chiều dọc)",
            "31 ngày trong tháng (theo chiều ngang)",
            "Ca làm việc của từng ngày theo từng nhân viên"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "ATT02.04",
          "title": "Điều chỉnh lịch làm việc",
          "actor": "TBP",
          "location": "Bên ngoài",
          "timing": "Khi có nhu cầu thay đổi lịch đi ca từ nhân viên",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Trong quá trình làm việc, nhân viên hoặc TBP có thay đổi về lịch làm việc sẽ cập nhật lại file template Lịch đi ca\n\nCác thông tin cần cập nhật gồm:",
          "fieldsChecklist": [
            "Phòng ban",
            "Nhân viên/ Mã nhân viên (theo chiều dọc)",
            "31 ngày trong tháng (theo chiều ngang)",
            "Ca của ngày làm việc cần điều chỉnh"
          ],
          "sourceRow": 5
        },
        {
          "stepCode": "ATT02.05",
          "title": "Cập nhật lại lịch",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi nhận được thông tin điều chỉnh tử TBP nhưng trước thời điểm chốt công tính lương",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Import lại Lịch đi ca điều chỉnh vào chương trình.\n\nKhi import cần kiểm tra các điều kiện Ca làm việc đã có trước đó trên chương trình và Ca khi import, nếu:",
          "fieldsChecklist": [
            "Giống nhau thì giữ nguyên Ca đã có trước đó.",
            "Khác nhau nhưng:",
            "Đã xử lý dữ liệu công và chốt công của ngày làm việc thì giữ nguyên ca đã có trước đó",
            "Đã xử lý dữ liệu công nhưng chưa chốt công, có dữ liệu bất thường thì Ca mới sẽ lưu đè lên Ca đã có trước đó",
            "Chưa có Ca làm việc trước đó của ngày làm việc được import thì lưu đè Ca làm việc mới"
          ],
          "sourceRow": 6
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-ATT-03",
      "sopTitle": "Quy trình tạo kế hoạch tăng ca, có sử dụng portal",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT03.01",
          "title": "Đăng ký danh sách tăng ca",
          "actor": "TBP",
          "location": "Portal",
          "timing": "Trước thời điểm chốt công tính lương",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Việc tăng ca của nhân viên (thường áp dụng cho nhân viên có Hình thức làm việc là “Trực tiếp” và do TBP phụ trách đăng ký.\n\nVới nhân viên có Hình thức làm việc là “Gián tiếp”, khi có nhu cầu làm thêm giờ sẽ chủ động đăng ký trên portal.\n\nChỉ đăng ký được tăng ca cho những ngày đã có lịch đi ca\n\nCác thông tin trên màn hình tạo danh sách tăng ca gồm:\n\nCác thông tin truy vấn trên màn hình đăng ký tăng ca gồm:\n\nGửi mail đề xuất tăng ca đến các cấp liên quan",
          "fieldsChecklist": [
            "Phòng ban",
            "Nhân viên đề xuất tăng ca",
            "Ngày tăng ca (dd/mm/yyyy)",
            "Ca làm việc (auto từ Lịch đi ca)",
            "Thời gian tăng ca trước từ (hh/mm)",
            "Thời gian tăng ca sau đến (hh/mm)",
            "Lý do tăng ca (tự nhập thông tin)",
            "Tỷ lệ quy đổi nghỉ bù (load mặc định theo Danh sách loại tăng ca nhưng người dùng có thể sửa lại)",
            "Giờ giờ OT luỹ kế trong tuần tính đến hiện tại",
            "Số giờ OT luỹ kế trong tháng tính đến hiện tại",
            "Số giờ OT luỹ kế trong năm tính đến hiện tại"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT03.02",
          "title": "Duyệt tăng ca",
          "actor": "BOM",
          "location": "Portal",
          "timing": "Trước thời điểm tăng ca hoặc trước thời điểm chốt công tính lương",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Tiếp nhận đề xuất tăng ca và duyệt. Nếu:\n\nGửi mail thông tin kết quả duyệt về các bộ liên quan",
          "fieldsChecklist": [
            "Đồng ý với đề xuất sẽ click “Duyệt”",
            "Không đồng ý với đề xuất sẽ click “Không duyệt”"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT03.03",
          "title": "Truy vấn thông tin duyệt",
          "actor": "TBP/NV/ HRM-C&B",
          "location": "Portal",
          "timing": "Sau khi được duyệt từ BOM",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên hoặc TBP có thể truy vấn thông tin duyệt đề xuất tăng ca sau khi đã được các cấp duyệt\n\nCác thông tin trên màn hình truy vấn gồm:",
          "fieldsChecklist": [
            "Ngày tăng ca",
            "Ca làm việc",
            "Nhân viên tăng ca",
            "Thời gian tăng ca trước",
            "Thời gian tăng ca sau",
            "Tổng số giờ tăng ca",
            "Loại tăng ca (auto theo Ca làm việc và thời gian tăng ca từ/đến ở trên)",
            "Tỷ lệ quy đổi sang nghỉ bù"
          ],
          "sourceRow": 4
        }
      ],
      "notes": [
        "Lưu ý chung: Nếu nhân viên làm thêm ngoài số giờ tăng ca được duyệt thì cần bổ sung đề xuất tăng ca theo quy trình trên. Ngược lại thì không cần làm đề xuất điều chỉnh Kế hoạch tăng ca. Không có nghiệp vụ điều chỉnh Kế hoạch tăng ca, vì thời gian Tăng ca tính lương (hoặc tính nghỉ bù) được đối sánh trên 03 yếu tố: Kế hoạch tăng ca được duyệt Thực tế làm thêm giờ của nhân viên Tăng ca được duyệt tính lương (hoặc tính nghỉ bù) Do đó, kết quả làm thêm giờ vẫn phải được duyệt lần cuối trước khi chuyển sang tính lương hoặc tính nghỉ bù."
      ]
    },
    {
      "sopCode": "SOP-ATT-04",
      "sopTitle": "Quy trình tạo kế hoạch tăng ca, không sử dụng portal",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT04.01",
          "title": "Xuất template file Kế hoạch tăng ca",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Cùng lúc với file template Lịch đi ca",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Template file Kế hoạch tăng ca được HRM-C&B xuất ra từ chương trình và gửi cho TBP\n\nLưu ý:\n\nfile template này được xuất đồng thời cùng lúc với file template Lịch đi ca.\n\nCác thông tin trên file template Kế hoạch tăng ca gồm:\n\nGửi mail kèm file template Kế hoạch tăng ca đến TBP",
          "fieldsChecklist": [
            "Phòng ban",
            "Nhân viên/Mã nhân viên",
            "Ngày tăng ca",
            "Ca làm việc",
            "Tăng ca trước từ (hh:mm)",
            "Tăng ca sau đến (hh:mm)",
            "Tỷ lệ quy đổi nghỉ bù (nếu nhập thì lấy theo giá tỷ lệ nhập, ngược lại thì load default theo Loại tăng ca)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT04.02",
          "title": "Cập nhật kế hoạch tăng ca",
          "actor": "TBP",
          "location": "Bên ngoài",
          "timing": "Sau khi thống nhất kế hoạch tăng ca với các cấp duyệt và phải trước thời gian chốt công tính lương",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "TBP cập nhật các kế hoạch tăng ca (đã được thống nhất trước đó với các cấp duyệt) vào file template Kế hoạch tăng ca.",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT04.03",
          "title": "Import template Kế hoạch tăng ca",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Trước khi nhân viên tăng ca",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "HRM-C&B import nội dung file Kế hoạch tăng ca vào chương trình.\n\nKhi import cần kiểm tra ràng buộc tính chính xác của các thông tin dữ liệu trên file Kế hoạch tăng ca khi import gồm:\n\nVà kiểm tra tính logic của các dữ liệu sau:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Ngày làm việc",
            "Ca làm việc",
            "Thời gian tăng ca từ",
            "Thời gian tăng ca đến",
            "Đã có dữ liệu kế hoạch tăng ca và ngày này đã chốt công thì chặn không cho import",
            "Đã có dữ liệu kế hoạch tăng ca nhưng tồn tại dữ liệu chấm công bất thường và chưa được chốt công thì cho import đè lên",
            "Không có dữ liệu kế hoạch tăng ca trước đó thì cho import"
          ],
          "sourceRow": 4
        }
      ],
      "notes": [
        "Lưu ý chung: Nếu nhân viên làm thêm ngoài số giờ tăng ca được duyệt thì cần bổ sung đề xuất tăng ca theo quy trình trên. Ngược lại thì không cần làm đề xuất điều chỉnh Kế hoạch tăng ca. Không có nghiệp vụ điều chỉnh Kế hoạch tăng ca, vì thời gian Tăng ca tính lương (hoặc tính nghỉ bù) được đối sánh trên 03 yếu tố: Kế hoạch tăng ca được duyệt Thực tế làm thêm giờ của nhân viên Tăng ca được duyệt tính lương (hoặc tính nghỉ bù) Do đó, kết quả làm thêm giờ vẫn phải được duyệt lần cuối trước khi chuyển sang tính lương hoặc tính nghỉ bù."
      ]
    },
    {
      "sopCode": "SOP-ATT-05",
      "sopTitle": "Quy trình đăng ký trễ/sớm, có sử dụng portal",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT05.01",
          "title": "Đăng ký đi trễ/về sớm",
          "actor": "Nhân viên",
          "location": "Portal",
          "timing": "Trước khi phát sinh hoặc trước khi chốt công tính lương",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Khi có nhu cầu đi trễ/về sớm, nhân viên chủ động đăng ký trên chương trình.\n\nCác thông tin trên màn hình đăng ký gồm:\n\nGửi mail đến TBP để được duyệt",
          "fieldsChecklist": [
            "Ngày làm việc",
            "Ca làm việc (auto theo Lịch làm việc)",
            "Đăng ký trễ/sớm (check mode theo:",
            "Đi trễ",
            "Về sớm",
            "Ra sớm",
            "Vào trễ",
            "Thời gian đăng ký (nhập số phút đăng ký",
            "Lý do trễ/sớm"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT05.02",
          "title": "Duyệt đăng ký trễ/sớm",
          "actor": "TBP",
          "location": "Portal",
          "timing": "Trước khi chốt công tính lương",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Nội dung duyệt gồm các thông tin sau:\n\nCó hai hình thức duyệt, nếu:\n\nGửi mail thông báo kết quả duyệt cho Nhân viên",
          "fieldsChecklist": [
            "Nhân viên đề xuất",
            "Ngày làm việc",
            "Ca làm việc (auto theo Lịch làm việc)",
            "Thời gian đi trễ (số phút)",
            "Thời gian về sớm (số phút)",
            "Thời gian ra sớm (số phút)",
            "Thời gian vào trễ (số phút)",
            "Lý do trễ/sớm",
            "Đồng ý thì TBP click “Duyệt",
            "Không đồng ý thì clcik “Không duyệt”"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT05.03",
          "title": "Truy vấn kết quả duyệt",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi được TBP duyệt",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Thông tin kết quả duyệt được NV truy xuất trên portal",
          "fieldsChecklist": [],
          "sourceRow": 4
        }
      ],
      "notes": [
        "Lưu ý chung: Trong trường hợp nhân viên không có portal để đăng ký trễ/sớm thì dữ liệu vào/ra là dữ liệu bất thường và nằm ở Quy trình xử lý dữ liệu bất thuờng."
      ]
    },
    {
      "sopCode": "SOP-ATT-06",
      "sopTitle": "Quy trình đăng ký nghỉ phép/đi công tác, có sử dụng portal",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT06.01",
          "title": "Đăng ký nghỉ phép/đi công tác",
          "actor": "NV",
          "location": "Portal",
          "timing": "Khi có phát sinh nghỉ hoăc trước khi chốt công tính lương",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Nhân viên có nhu cầu nghỉ phép sẽ tự đăng ký lịch nghỉ.\n\nCác thông tin trên màn hình đăng ký gồm:\n\nCác thông tin truy vấn tại màn hình đăng ký nghỉ phép gồm:\n\n(*) Người backup cần trong trường hợp nhân viên nghỉ phép hoặc đi công tác không thể xử lý công việc và tất cả các công việc này sẽ do người backup phụ trách xử lý.\n\nLưu ý:\n\nGửi mail đến các cấp liên quan",
          "fieldsChecklist": [
            "Loại nghỉ (drop down từ Danh mục Loại nghỉ hoặc chọn check mode “Đi công tác” nếu là đăng ký đi công tác. Mode này dùng để đăng ký đi công tác dài ngày bên ngoài công ty).",
            "Nghỉ từ ngày (dd/mm/yyyy và số ngày, sẽ là 0.5 hoặc 1 trong trường hợp nghỉ nữa ngày đầu hoặc nghỉ nữa ngày cuối).",
            "Nghỉ đến ngày (dd/mm/yyyy và số ngày, là 0.5 hoặc 1 trong trường hợp nghỉ nữa ngày đầu hoặc nghỉ nữa ngày cuối)",
            "Tổng số ngày (auto của chương trình)",
            "Người backup(*), chọn trong danh sách hồ sơ nhân viên",
            "Lý do nghỉ phép",
            "Lưới kết quả Giải trừ phép (auto theo thiết lập tại Danh mục Loại phép)",
            "Trạng thái các đăng ký nghỉ phép trước đó",
            "Số phép đã nghỉ tính từ đầu niên độ đến nay",
            "Số phép còn có thể nghỉ trong tháng",
            "Số phép còn có thể nghỉ đến cuối niên độ",
            "Chi tiết các ngày đã nghỉ theo từng loại nghỉ",
            "Thời gian backup trùng với thời gian nghỉ phép của nhân viên viên.",
            "Chương trình tụ động gán roll của nhân viên nghỉ phép cho nhân viên backup này (ví dụ roll Duyệt,…)."
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT06.02",
          "title": "Duyệt phép",
          "actor": "TBP/BOM",
          "location": "Portal",
          "timing": "Khi nhận được mail của NV nhưng trước khi chốt công tính lương",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Thông báo duyệt phép được gửi đến các cấp, phụ thuộc vào thiết lập số cấp duyệt theo từng loại nghỉ tại Danh mục/Loại nghỉ\n\nMàn hình thông tin duyệt phép chính là màn hình đăng ký nghỉ phép của nhân viên.\n\nCó hai hình thức duyệt nghỉ phép:\n\nGửi mail thông báo về NV và các cấp liên quan",
          "fieldsChecklist": [
            "Nếu đồng ý, click “Duyệt”",
            "Nếu không đồng ý, click “Không duyệt”"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT06.03",
          "title": "Truy vấn thông tin duyệt phép",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi được các cấp duyệt qua",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "NV chủ động xem trạng thái các đề xuất nghỉ phép của cá nhân.\n\nThông tin xem trên màn hình truy vấn gồm:",
          "fieldsChecklist": [
            "Đề xuất nghỉ phép",
            "Trạng thái đề xuất (Đã duyệt/Chờ duyệt/Không duyệt)"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "ATT06.04",
          "title": "Đăng ký huỷ phép",
          "actor": "NV",
          "location": "Portal",
          "timing": "Khi phát sinh nhu cầu nhưng trước thời điểm chốt công tính lương",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Với:\n\nTrong các trường hợp này thì nhân viên có thể chủ động đăng ký huỷ phép các ngày nghỉ dư hoặc huỷ các ngày nghỉ đã được duyệt nhưng không nghỉ này.\n\nMàn hình đăng ký huỷ phép gồm các thông tin sau:\n\nGửi mail thông báo đề xuất duyệt đến TBP",
          "fieldsChecklist": [
            "Các đề xuất nghỉ phép đã được duyệt nhưng thực tế NV nghỉ ít",
            "Các đề xuất nghỉ phép đã được duyệt nhưng nhân viên thay đổi không nghỉ",
            "Các đề xuất nghỉ phép chưa được duyệt nhưng nhân viên đổi ý không nghỉ",
            "Chọn một đăng ký nghỉ phép cần đề xuất huỷ",
            "Chọn thời gian huỷ từ ngày (dd/mm/yyyy và nhập số ngày nếu huỷ nửa ngày, là bội số của 0.5) đến ngày (dd/mm/yyyy và nhập số ngày nếu huỷ nửa ngày, là bội số của 0.5)",
            "Lý do huỷ phép"
          ],
          "sourceRow": 5
        },
        {
          "stepCode": "ATT06.05",
          "title": "Duyệt đề xuất huỷ phép",
          "actor": "TBP",
          "location": "Portal",
          "timing": "Sau khi nhận được mail của NV nhưng phải trước khi chốt công tính lương",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Thông tin trên màn hình duyệt đề xuất của TBP gồm:\n\nCó hai hình thức duyệt huỷ đăng ký nghỉ phép, cụ thể:\n\nGửi mai thông báo kết quả duyệt đến NV",
          "fieldsChecklist": [
            "Nhân viên đề xuất huỷ phép",
            "Ngày hủy phép từ (dd/mm/yyyy)",
            "Ngày huỷ phép đến (dd/mm/yyyy)",
            "Nếu đồng ý, click “duyệt”",
            "Nếu không đồng ý, click “không duyệt)"
          ],
          "sourceRow": 6
        },
        {
          "stepCode": "ATT06.06",
          "title": "Truy vấn kết quả duyệt huỷ phép",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi được TBP duyệt",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên có thể truy vấn trạng thái đề xuất huỷ phép trên portal.",
          "fieldsChecklist": [],
          "sourceRow": 7
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-ATT-07",
      "sopTitle": "Quy trình nghỉ phép không sử dụng portal",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT07.01",
          "title": "Điền form nghỉ phép",
          "actor": "NV",
          "location": "Bên ngoài",
          "timing": "Khi có phát sinh nhưng phải trước thời điểm chốt công tính lương",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Nhân viên tự điền đề xuất nghỉ phép vào form nghỉ phép theo mẫu thống nhất chung của Công ty.\n\nNội dung form cơ bản có các trường thông tin sau:",
          "fieldsChecklist": [
            "Tên nhân viên/Mã nhân viên",
            "Phòng ban",
            "Ngày nghỉ từ (dd/mm/yyyy)",
            "Ngày nghỉ đến (dd/mm/yyyy)",
            "Lý do nghỉ phép",
            "Người backup"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT07.02",
          "title": "Duyệt đề xuất",
          "actor": "TBP",
          "location": "Bên ngoài",
          "timing": "Sau khi nhận được form nhưng phải trước thời điểm chốt công tính",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Form nghỉ phép được chuyển cho các cấp duyệt liên quan",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT07.03",
          "title": "Cập nhật thông tin nghỉ phép",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi nhận được thông tin chuyển về nhưng phải trước thời điểm chốt công tính lương",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Thông tin nghỉ phép sau khi được duyệt sẽ chuyển về cho HRM-C&B cập nhật vào chương trình để theo dõi",
          "fieldsChecklist": [],
          "sourceRow": 4
        }
      ],
      "notes": [
        "Lưu ý chung: Nếu nhân viên không sử dụng portal cho đăng ký nghỉ phép thì sẽ không sử dụng tính năng huỷ phép. Việc chênh lệch giữa ngày nghỉ phép thực tế và ngày nghỉ phép được duyệt sẽ được xử lý ở Quy trình dữ liệu công bất thường không dùng portal."
      ]
    },
    {
      "sopCode": "SOP-ATT-08",
      "sopTitle": "Quy trình xử lý dữ liệu chấm công và dữ liệu công bất thường",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT08.01",
          "title": "Tải dữ liệu từ database chấm công",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Theo thời gian thực",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Dữ liệu thô chấm công của nhân viên (raw data) được tải từ database Chấm công về Chương trình.\n\nCác thông tin trên màn hình dữ liệu thô gồm:",
          "fieldsChecklist": [
            "Mã chấm công",
            "Ngày quét",
            "Dữ liệu quét vào",
            "Dữ liệu quét ra",
            "Máy quét",
            "Địa điểm quét (nếu có)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT08.02",
          "title": "Xử lý dữ liệu công",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Hằng ngày và theo một mốc thời gian định nghĩa",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Xử lý dữ liệu công gồm:",
          "fieldsChecklist": [
            "Xử lý dữ liệu thô: nhằm sắp xếp lại trật tự của các dòng dữ liệu quét thẻ của một nhân viên trong một ngày theo các logic sau:",
            "Mapping mã chấm công với mã nhân viên",
            "Xác định số cặp quét vào/ra trong một ca",
            "Xử lý giờ công: nhằm đối sánh và gán thông tin giữa lịch đi ca với thời gian quét vào/ra để xác định số giờ làm việc thực tế của một ca",
            "Xử lý công làm việc theo các logic sau:",
            "Lịch đi ca của từng ngày làm việc",
            "Cặp quét vào/ra khớp với biên độ của ca",
            "Độ dài của ca",
            "Xử lý giờ công tăng ca thực tế theo các logic sau:",
            "Số giờ đăng ký tăng ca được duyệt",
            "Số giờ làm thêm thực tế",
            "Nếu Số giờ đăng ký tăng ca được duyệt =< Số giờ tlàm thêm thực tế thì lấy theo số giờ đăng ký tăng ca được duyệt, ngược lại thì lấy theo số giờ làm thêm thực tế"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT08.03",
          "title": "Thống kê dữ liệu chấm công bất thường",
          "actor": "",
          "location": "Portal",
          "timing": "Sau khi xử lý dữ liệ công",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Các dữ liệu không thoả logic sẽ thuộc dữ liệu bất thường.\n\nMàn hình thống kê dữ liệu chấm công bất thường gồm hai nhóm:\n\nGửi mail dữ liệu công bất thường về các TBP",
          "fieldsChecklist": [
            "Nhóm dữ liệu thô chấm công",
            "Có lịch đi ca nhưng không có dữ liệu quét vào hoặc ra hoặc cả hai",
            "Không có lịch đi ca nhưng có dữ liệu quét vào hoặc ra hoặc cả hai",
            "Có lịch đi ca và có dữ liệ quét vào ra nhưng dữ liệu không nằm trong biên độ của Ca theo lịch",
            "Có phép (bằng 1) nhưng lại có dữ liệu vào hoặc ra hoặc cả hai",
            "Thời gian trễ/sớm thực tế thời gian trễ/sớm được duyệt",
            "Có thời gian trễ/sớm nhưng không có thông tin đăng ký được duyệt",
            "Nhân viên trong thời gian nghỉ thai sản nhưng có dữ liệu quét vào hoặc ra hoặc cả hai",
            "Nhóm dữ liệu chấm công",
            "Không có dữ liệu đăng ký tăng ca được duyệt nhưng có thời gian làm thêm giờ",
            "Thời gian làm thêm giờ > thời gian đăng ký tăng ca được duyệt",
            "Có giờ làm thêm nhưng không có dữ liệu công ca chính và cũng không có phép",
            "Giờ công ca chính + công nghỉ > 1"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "ATT08.04",
          "title": "Xử lý dữ liệu chấm công bất thường",
          "actor": "TBP",
          "location": "Portal",
          "timing": "Sau khi HRM-C&B xử lý dữ liệu công",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "TBP chính là người cung cấp các thông tin để HRM-C&B xử lý các dữ liệu bất thường này.\n\nCác nhóm thông tin TBP cung cấp để xử dữ liệu chấm công bất thường gồm:\n\nGửi mail đề xuất duyệt đến quản lý của bộ phận",
          "fieldsChecklist": [
            "Nhóm Ca và thời gian vào ra, gồm các thông tin sau:",
            "Mã nhân viên",
            "Tên nhân viên",
            "Ca theo lịch (từ lịch làm việc)",
            "Giờ vào thực tế (từ dữ liệu chấm công)",
            "Giờ ra thực tế (từ dữ liệ chấm công)",
            "Ca thực tế (drop down từ Danh mục/Ca làm việc)",
            "Nhóm Trễ/Sớm, bao gồm các thông tin sau:",
            "Mã nhân viên",
            "Tên nhân viên",
            "Số phút đi trễ chênh lêch",
            "Duyệt/Huỷ",
            "Số phút về sớm chênh lệch",
            "Duyệt/Huỷ",
            "Số phút ra sớm chênh lệch",
            "Duyệt/Huỷ",
            "Số phút vào trễ chênh lệch",
            "Duyệt/Huỷ",
            "Nhóm Công/Phép, bao gồm các thông tin sau:",
            "Mã nhân viên",
            "Tên nhân viên",
            "Dữ liệu quét vào/ra thực tế (lấy từ kết quả xử lý dữ liệu chấm công )",
            "Check mode Huỷ công hoặc Huỷ phép",
            "Nhóm Tăng ca bao gồm các thông tin sau:",
            "Số giờ tăng ca được duyệt (từ kết quả duyệt đề xuất tăng ca)",
            "Số giờ làm thêm thực tế (số giờ thực tế làm ngoài giờ của ca chính)",
            "Số giờ tăng ca thực tế (nếu Số giờ tăng ca được duyệt < Số giờ làm thêm thực tế, lấy theo Số giờ tăng ca được được duyệt; nếu ngược lại thì lấy theo Số giờ làm thêm thực tế",
            "Số giờ tăng ca chênh lệch (= Số giờ làm thêm thực tế - Số giờ tăng ca được duyệt, hiển thị giá trị > 0) và check mode “Duyệt” hoặc “Không duyệt”",
            "Số giờ tăng ca được duyệt: default = Số giờ tăng ca thực tế + Số giờ tăng ca chênh lệch (nếu check mode “Duyệt) nhưng người dùng có thể điều chỉnh lại"
          ],
          "sourceRow": 5
        },
        {
          "stepCode": "ATT08.05",
          "title": "Chưa nêu tên bước trong bảng SOP",
          "actor": "Quản lý của TBP",
          "location": "Portal",
          "timing": "Khi nhận thông báo từ BP",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Kết quả xác nhận/bổ sung dữ liệu được quản lý của TBP duyệt qua trước khi chuyển về HRM-C&B",
          "fieldsChecklist": [],
          "sourceRow": 6
        },
        {
          "stepCode": "ATT08.06",
          "title": "Xử lý dữ liệu chấm công",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi dữ liệu bất thường được xử lý và được chốt từ TBP",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Các ngày có dữ liệu công bất thường, sau khi được TBP bổ sung thông tin và chốt dữ liệu bổ sung sẽ được xử lý lại",
          "fieldsChecklist": [],
          "sourceRow": 7
        },
        {
          "stepCode": "ATT08.07",
          "title": "Chốt dữ liệu công",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi dữ liệu chấm công bất thường được xử lý hết",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Khi tất cả các dữ liệu chấm công bất thường được clear thì dữ liệu công của tháng được chốt lại để chuyển sang tính lương.\n\nKhi dữ liệu công đã chốt thì không được hiệu chỉnh tất cả các thông tin liên quan.",
          "fieldsChecklist": [],
          "sourceRow": 8
        },
        {
          "stepCode": "ATT08.08",
          "title": "Chốt dữ liệu phép bù",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi dữ liệu chấm công được chốt",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Dựa theo:\n\nChương trình sẽ quy đổi thành giờ nghỉ bù và chuyển thành ngày nghỉ bù tương ứng (bội số của 0.5) và luỹ kế vào quỹ nghỉ bù của nhân viên",
          "fieldsChecklist": [
            "Tỷ lệ quy đổi phép bù từ giờ tăng ca",
            "Số giờ tăng ca được duyệt"
          ],
          "sourceRow": 9
        }
      ],
      "notes": [],
      "sourceNote": "Bảng nguồn không nêu tên cho bước ATT08.05."
    },
    {
      "sopCode": "SOP-ATT-09",
      "sopTitle": "Quy trình xử lý dữ liệu công bất thường, không sử dụng portal",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT09.01",
          "title": "Xuất file thông tin dữ liệu công bất thường",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi xử lý dữ liệu chấm công",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Dữ liệu chấm công bất thường được xuất theo form template và gửi về các TBP.\n\nCác nhóm thông tin xuất trên template gồm:\n\nGửi mail dữ liệu công bất thường về các TBP",
          "fieldsChecklist": [
            "Nhóm dữ liệu thô chấm công",
            "Có lịch đi ca nhưng không có dữ liệu quét vào hoặc ra hoặc cả hai",
            "Không có lịch đi ca nhưng có dữ liệu quét vào hoặc ra hoặc cả hai",
            "Có lịch đi ca và có dữ liệ quét vào ra nhưng dữ liệu không nằm trong biên độ của Ca theo lịch",
            "Có phép (bằng 1) nhưng lại có dữ liệu vào hoặc ra hoặc cả hai",
            "Thời gian trễ/sớm thực tế thời gian trễ/sớm được duyệt",
            "Có thời gian trễ/sớm nhưng không có thông tin đăng ký được duyệt",
            "Nhân viên trong thời gian nghỉ thai sản nhưng có dữ liệu quét vào hoặc ra hoặc cả hai",
            "Nhóm dữ liệu chấm công",
            "Không có dữ liệu đăng ký tăng ca được duyệt nhưng có thời gian làm thêm giờ",
            "Thời gian làm thêm giờ > thời gian đăng ký tăng ca được duyệt",
            "Có giờ làm thêm nhưng không có dữ liệu công ca chính và cũng không có phép",
            "Giờ công ca chính + công nghỉ > 1"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT09.02",
          "title": "Bổ sung thông tin",
          "actor": "TBP",
          "location": "Bên ngoài",
          "timing": "Trước thời điểm chốt công tính lương",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "TBP chính là người cung cấp các thông tin để HRM-C&B xử lý các dữ liệu bất thường này.\n\nCác nhóm thông tin TBP cung cấp để xử dữ liệu chấm công bất thường gồm:",
          "fieldsChecklist": [
            "Nhóm Ca và thời gian vào ra, gồm các thông tin sau:",
            "Mã nhân viên",
            "Tên nhân viên",
            "Ca theo lịch (từ lịch làm việc)",
            "Giờ vào thực tế (từ dữ liệu chấm công)",
            "Giờ ra thực tế (từ dữ liệ chấm công)",
            "Ca thực tế (drop down từ Danh mục/Ca làm việc)",
            "Nhóm Trễ/Sớm, bao gồm các thông tin sau:",
            "Mã nhân viên",
            "Tên nhân viên",
            "Số phút đi trễ chênh lêch",
            "Duyệt/Huỷ",
            "Số phút về sớm chênh lệch",
            "Duyệt/Huỷ",
            "Số phút ra sớm chênh lệch",
            "Duyệt/Huỷ",
            "Số phút vào trễ chênh lệch",
            "Duyệt/Huỷ",
            "Nhóm Công/Phép, bao gồm các thông tin sau:",
            "Mã nhân viên",
            "Tên nhân viên",
            "Dữ liệu quét vào/ra thực tế (lấy từ kết quả xử lý dữ liệu chấm công )",
            "Check mode Huỷ công hoặc Huỷ phép",
            "Nhóm Tăng ca bao gồm các thông tin sau:",
            "Số giờ tăng ca được duyệt (từ kết quả duyệt đề xuất tăng ca)",
            "Số giờ làm thêm thực tế (số giờ thực tế làm ngoài giờ của ca chính)",
            "Số giờ tăng ca thực tế (nếu Số giờ tăng ca được duyệt < Số giờ làm thêm thực tế, lấy theo Số giờ tăng ca được được duyệt; nếu ngược lại thì lấy theo Số giờ làm thêm thực tế",
            "Số giờ tăng ca chênh lệch (= Số giờ làm thêm thực tế - Số giờ tăng ca được duyệt, hiển thị giá trị > 0) và check mode “Duyệt” hoặc “Không duyệt”",
            "Số giờ tăng ca được duyệt: default = Số giờ tăng ca thực tế + Số giờ tăng ca chênh lệch (nếu check mode “Duyệt) nhưng người dùng có thể điều chỉnh lại"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT09.03",
          "title": "Cập nhật thông tin",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Trước thời điểm chốt công tính lương",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Thông tin trên file của TBP được HRM-C&B cập nhật lại vào chương trình",
          "fieldsChecklist": [],
          "sourceRow": 4
        },
        {
          "stepCode": "ATT09.04",
          "title": "Xử lý dữ liệu chấm công",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Saukhi dữ liệu bât thường được xử lý và được chốt từ TBP",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Các ngày có dữ liệu công bất thường, sau khi được TBP bổ sung thông tin và chốt dữ liệu bổ sung sẽ được xử lý lại",
          "fieldsChecklist": [],
          "sourceRow": 5
        },
        {
          "stepCode": "ATT09.05",
          "title": "Chốt dữ liệu công",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi dữ liệu chấm công bất thường được xử lý hết",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Khi tất cả các dữ liệu chấm công bất thường được clear thì dữ liệu công của tháng được chốt lại để chuyển sang tính lương.\n\nKhi dữ liệu công đã chốt thì không được hiệu chỉnh tất cả các thông tin liên quan.",
          "fieldsChecklist": [],
          "sourceRow": 6
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-ATT-10",
      "sopTitle": "Quy trình quản lý suất ăn theo ca",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT10.01",
          "title": "Đăng ký ăn ca",
          "actor": "NV",
          "location": "Portal",
          "timing": "Trước thời điểm bắt đầu ca làm việc hoặc trước thời điểm bắt đầu ngày làm việc",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Khi cấu hình ca làm việc đã thiết lập Ca này có tổ chức ăn ca hoặc không ăn ca.\n\nNV đăng ký suất ăn khi:\n\nThông tin trên màn hình đăng ký ăn ca của NV gồm các thông tin:\n\nLưu ý:\n\nVề thời điểm đăng ký ăn/không ăn hoặc ăn món gì theo mốc thời gian quy định của Công ty. Nếu quá móc thời gian này thì chươg trình chặn lại không cho đăng ký.\n\nGửi mail thông báo đăng ký đến HRM-C&B",
          "fieldsChecklist": [
            "Không ăn ca của ca làm việc",
            "Ăn ca nhưng chọn món để đăng ký",
            "Ngày đăng ký",
            "Ca đăng ký",
            "Không ăn (check mode, load theo thiết lập của ca làm việc)",
            "Món ăn đăng ký (từ danh mục Món ăn)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT10.02",
          "title": "Tổng hợp thông tin",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Theo một mốc thời gian quy định",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Với một mốc thời gian quy định, chương trình sẽ tiến hành khoá đăng ký và tổng hợp số liệu đăng ký ăn ca của nhân viên.\n\nThông tin trên màn hình tổng hợp số liệu gồm:\n\nXuất danh sách gửi nhà ăn",
          "fieldsChecklist": [
            "Phòng ban",
            "Số lương NV có ăn",
            "Chi tiết NV có ăn",
            "Món ăn theo NV",
            "Chi tiết nhân viên theo món ăn",
            "Số lượng NV không ăn",
            "Chi tiết NV không ăn"
          ],
          "sourceRow": 3
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-ATT-11",
      "sopTitle": "Quy trình điều chỉnh đối tượng phép năm",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT11.01",
          "title": "Thông báo danh sách nhân viên thay đổi đối tượng phép năm",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Từ kết qủa của quy trình Thay đổi quá trình công tác",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Những nhân viên có thay đổi chức vụ dẫn đến thay đổi định mức phép năm (được thiết lặp trong Đối tượng phép năm) sẽ có trong danh sách thông báo này.\n\nCác thông tin trên màn hình thông báo gồm:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Ngày hiệu lức áp dụng Chức vụ mới",
            "Đối tượng phép năm hiện tại",
            "Đối tượng phép năm mới"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT11.02",
          "title": "Điều chỉnh phép năm",
          "actor": "HRM C&B",
          "location": "Bên trong",
          "timing": "Khi phát sinh danh sách thông báo",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Chọn nhân viên cần điều chỉnh phép năm, chương trình auto tính ra phép năm hưởng theo đối tượng phép năm mới (*)\n\nThông tin trên màn hình điều chỉnh phép năm này gồm:\n\n(*) Chương trình tính dựa theo phương pháp đã cấu hình ở Đối tượng phép, cụ thể:\n\nGửi mail thông báo số phép năm thay đổi theo đối tượng mới đến NV",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Ngày hiệu lức áp dụng Chức vụ mới (từ nghiệp vụ Quá trình công tác)",
            "Đối tượng phép năm hiện tại (từ profile)",
            "Đối tượng phép năm mới (từ nghiệp vụ Quá trình công tác)",
            "Phép năm còn lại theo đối tượng cũ (công thức tính dựa theo check mode tại Danh mục/Đối tượng phép)",
            "Phép năm hưởng theo đối tượng mới (Công thức tính dựa theo check mode tại Danh mục/Đối tượng phép)",
            "Tổng phép năm hưởng theo đối tượng mới (Công thức tính dựa theo check mode tại Danh mục/Đối tượng phép)",
            "Tính theo đối tượng phép năm mới trên số tháng còn lại của niên độ phép (ví dụ: chuyển đối tượng phép từ 12 sang 14 từ ngày 1/7 thì tính bình quân phép năm 1 tháng của đối tượng 14 và * 6 tháng còn lại của niên độ phép, không trừ hoặc không cộng số phép đã nghỉ dư hoặc chưa nghỉ theo đối tượng 12) hoặc,",
            "Tính theo đối tượng phép năm mới nhưng có cấn trừ với đối tượng phép năm cũ (ví dụ: chuyển đối tượng phép từ 12 sang 14 từ ngày 1/7 nhưng trước đó chưa nghỉ ngày nào theo đối tượng phép 12 thì vẫn còn tồn 6 phép năm và ở đối tượng phép mới thì tính bình quân phép năm 1 tháng của đối tượng 14 và * 6 tháng còn lại của niên độ phép phép năm theo đối tượng phép mới = Tồn theo đối tượng phép năm cũ + phép năm theo đối tượng mới)"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT11.03",
          "title": "Truy vấn thông tin phép năm",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi thực hiện điều chỉnh đối tượng phép",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên chủ động truy vấn thông tin phép năm của mình trên portal.\n\nThông tin trên màn hình truy vấn gồm:",
          "fieldsChecklist": [
            "Phép năm hưởng đến cuối niên độ phép",
            "Phép năm hưởng trong tháng (tại thời điểm truy vấn)"
          ],
          "sourceRow": 4
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-ATT-12",
      "sopTitle": "Quy trình quyết toán phép với nhân viên nghỉ việc",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT12.01",
          "title": "Thông báo danh sách nhân viên hoàn tất thủ tục thanh lý HĐLĐ",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi trạng thái của nghiệp vụ Thanh lý hợp đồng là “Done”",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên nghỉ việc hoàn tất thủ tục thanh lý HĐLĐ sẽ có trong danh sách nhân viên được quyết toán phép khi nghỉ việc\n\nThông tin tại màn hình danh sách này gồm:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Đối tượng phép năm",
            "Ngày hoàn thành thanh lý hợp đồng",
            "Ngày nghỉ việc dự kiến",
            "Ngày nghỉ việc được duyệt"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT12.02",
          "title": "Quyết toán phép",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Trước khi nhân viên nghỉ việc hoặc khi có yêu cầu khác",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Check chọn từ danh sách nhân viên thoả điều kiện quyết toán. Phần quyết toán sẽ do chương trình auto tính dựa trên thiết lập chính sách quyết toán ở Danh mục/Đối tượng phép.\n\nMàn hình quyết toán phép gồm các thông tin sau:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Phép năm định mức (lấy theo Đối tượng phép năm)",
            "Phép thâm niên hiện có (xét theo thời điểm tính thâm niên ở Danh mục/Đối tượng phép để có giá trị này)",
            "Phép năm có tính đến thời điểm hiện tại (tính từ thời điểm Hưởng phép năm đến thời điểm hiện tại hoặc từ thời điểm Đầu niên độ phép đến thời điểm hiện tại, công cả phép năm thâm niên vào)",
            "Phép năm đã sử dụng tính đến thời điểm hiện tại (luỹ kế số phép năm đã sử dụng tính từ đầu niên độ phép đến thời điểm hiện tại)",
            "Phép năm còn lại (=Phép năm có tính đến thời điểm hiện tại - Phép năm đã sử dụng tính đến thời điểm hiện tại). Nếu giá trị này > 0 thì Cty sẽ thanh toán lại tiền lương phép; nếu ngược lại thì NV hoàn lại tiền phép đã ứng cho Công ty)",
            "Đơn giá một ngày phép năm (= (Lương cơ bản/Ngày công chuẩn, trong đó:",
            "Lương cơ bản: theo tháng nghỉ việc hoặc tháng liền trước tháng nghỉ việc hoặc bình quân 6 tháng liền kề trước tháng nghỉ việc",
            "Ngày công chuẩn: theo đối tượng Công đã định nghĩa ở phần Danh mục)",
            "Lương phép quyết toán (=Phép năm còn lại * Đơn gía một ngày phép năm)",
            "Kỳ lương thanh toán"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT12.03",
          "title": "Truy vấn thông tin quyết toán",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi được thực hiện quyết toán",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên vó thể chủ động truy vấn thông tin quyết toán phép nghỉ việc trên portal\n\nMàn hình truy vấn gồm các thông tin:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Phép năm định mức",
            "Phép thâm niên hiện có",
            "Phép năm có tính đến thời điểm hiện tại",
            "Phép năm đã sử dụng tính đến thời điểm hiện tại",
            "Phép năm còn lại",
            "Đơn giá một ngày phép năm",
            "Lương phép quyết toán",
            "Kỳ lương thanh toán"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "ATT12.04",
          "title": "Kết chuyển dữ liệu",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi khoá kết quả quyết toán",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Kết quả quyết toán được khoá lại và kết chuyển dữ liệu sang phân hệ Tiền lương",
          "fieldsChecklist": [],
          "sourceRow": 5
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-ATT-13",
      "sopTitle": "Quy trình quyết toán phép cuối niên độ",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT13.01",
          "title": "Danh sách nhân viên thoả điều kiện và có mặt tại thời điểm quyết toán",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Cuối niên độ phép",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Dựa vào đối tượng phép đã thiết lập Thời điểm tính phép và Thời điểm hưởng phép, chương trình auto xác định được nhân viên có mặt tại thời điểm quyết toán phép.\n\nThời điểm quyết toán phép là ngày cuối cùng của niên độ phép.\n\nNhân viên tồn tại ở danh sách quyết toán phép nghỉ việc sẽ không nằm trong danh sách này\n\nThông tin tại màn hình danh sách này gồm:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Đối tượng phép năm",
            "Chức vụ"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT13.02",
          "title": "Quyết toán phép",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Trước khi nhân viên nghỉ việc hoặc khi có yêu cầu khác",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Check chọn từ danh sách nhân viên thoả điều kiện quyết toán. Phần quyết toán sẽ do chương trình auto tính dựa trên thiết lập chính sách quyết toán ở Danh mục/Đối tượng phép.\n\nMàn hình quyết toán phép gồm các thông tin sau:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Phép năm định mức (lấy theo Đối tượng phép năm)",
            "Phép thâm niên hiện có (xét theo thời điểm tính thâm niên ở Danh mục/Đối tượng phép để có giá trị này)",
            "Phép năm có tính đến thời điểm hiện tại (tính từ thời điểm Hưởng phép năm đến thời điểm hiện tại hoặc từ thời điểm Đầu niên độ phép đến thời điểm hiện tại, công cả phép năm thâm niên vào)",
            "Phép năm đã sử dụng tính đến thời điểm hiện tại (luỹ kế số phép năm đã sử dụng tính từ đầu niên độ phép đến thời điểm hiện tại)",
            "Phép năm còn lại (=Phép năm có tính đến thời điểm hiện tại - Phép năm đã sử dụng tính đến thời điểm hiện tại). Nếu giá trị này > 0 thì Cty sẽ thanh toán lại tiền lương phép; nếu ngược lại thì NV hoàn lại tiền phép đã ứng cho Công ty)",
            "Ngày phép chuyển tồn (theo thiết lập ở Danh mục/Đối tượng phép)",
            "Ngày phép chuyển sang lương (theo tiết lập ở Danh mục/Đối tượng phép)",
            "Số ngày phép huỷ (theo thiết lập ở Danh mục/Đối tượng phép)",
            "Đơn giá một ngày phép năm (= (Lương cơ bản/Ngày công chuẩn, trong đó:",
            "Lương cơ bản: theo tháng nghỉ việc hoặc tháng liền trước tháng nghỉ việc hoặc bình quân 6 tháng liền kề trước tháng nghỉ việc",
            "Ngày công chuẩn: theo đối tượng Công đã định nghĩa ở phần Danh mục)",
            "Lương phép quyết toán (=Phép năm còn lại * Đơn gía một ngày phép năm)",
            "Kỳ lương thanh toán"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT13.03",
          "title": "Truy vấn thông tin quyết toán",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi được thực hiện quyết toán",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên vó thể chủ động truy vấn thông tin quyết toán phép nghỉ việc trên portal\n\nMàn hình truy vấn gồm các thông tin:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Phép năm định mức",
            "Phép thâm niên hiện có",
            "Phép năm có tính đến thời điểm hiện tại",
            "Phép năm đã sử dụng tính đến thời điểm hiện tại",
            "Phép năm còn lại",
            "Phép năm chuyển tồn",
            "Phép năm thanh toán lương",
            "Phép năm bị huỷ",
            "Đơn giá một ngày phép năm",
            "Lương phép quyết toán",
            "Kỳ lương thanh toán"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "ATT13.04",
          "title": "Kết chuyển dữ liệu",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi khoá kết quả quyết toán",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Kết quả quyết toán được khoá lại và kết chuyển dữ liệu sang phân hệ Tiền lương hoặc chuyển tồn sang năm sau",
          "fieldsChecklist": [],
          "sourceRow": 5
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-ATT-14",
      "sopTitle": "Quy trình đăng ký chế độ thai sản/con nhỏ, có dùng portal",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT14.01",
          "title": "Đăng ký chế độ thai sản/con nhỏ",
          "actor": "NV",
          "location": "Portal",
          "timing": "Ở thời điểm phát sinh chế độ hưởng",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "NV chủ động đăng ký chế độ thai sản hoặc con nhỏ khi đến thời điểm phát sinh.\n\nThông tin trên màn hình đăng ký gồm:\n\n+ Đăng ký thông tin thai sản\n\n+ Thông tin con nhỏ\n\nGửi mail thông báo đề xuất duyệt đến TBP",
          "fieldsChecklist": [
            "Thời gian thai tròn 6 tháng tuổi (dd/mm/yyyy, tự nhập)",
            "Thời gian bắt đầu hưởng chế độ (=Thời gian thai sản tròn 6 tháng tuổi + 1)",
            "Đăng ký đi trễ hoặc về sớm (check mode)",
            "Thời gian đăng ký áp dụng chế độ (dạng lưới để đăng ký từ dd/mm/yyyy đến dd/mm/yyyy. Nếu không nhập thời gian đến thì mặc nhiên hiểu đến hết thời gian của chế độ thai sản hoặc con nhỏ)",
            "Ngày nghỉ thai sản dự kiến",
            "Ngày nghỉ thai sản thực tế",
            "Ngày đi làm lại dự kiến",
            "Ngày đi làm lại thực tế",
            "Đăng ký đi trễ hoặc về sớm (check mode)",
            "Thời gian áp dụng (dạng lưới để đăng ký từ dd/mm/yyyy đến dd/mm/yyyy. Nếu không nhập thời gian đến thì mặc nhiên hiểu đến hết thời gian của chế độ thai sản hoặc con nhỏ)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT14.02",
          "title": "Duyệt đăng ký thai sản",
          "actor": "TBP",
          "location": "Portal",
          "timing": "Trước thời điểm hưởng",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Có hai hình thức duyệt, nếu:\n\nThông tin truy vấn trên màn hình duyệt gồm:\n\n+ Đăng ký thông tin thai sản\n\n+ Thông tin con nhỏ\n\nGửi thông tin duyệt về NV và HRM-C&B",
          "fieldsChecklist": [
            "Đồng ý, click “Duyệt”",
            "Không đồng ý, click “Không duyệt” và bổ sung ở cột “Lý do”",
            "Thời gian thai tròn 6 tháng tuổi (dd/mm/yyyy, tự nhập)",
            "Thời gian bắt đầu hưởng chế độ (=Thời gian thai sản tròn 6 tháng tuổi + 1)",
            "Đăng ký đi trễ hoặc về sớm (check mode)",
            "Thời gian đăng ký áp dụng chế độ (dạng lưới để đăng ký từ dd/mm/yyyy đến dd/mm/yyyy)",
            "Trạng thái nhân viên (default “Thai sản” hoặc “Con nhỏ”)",
            "Ngày nghỉ thai sản dự kiến",
            "Ngày nghỉ thai sản thực tế",
            "Ngày đi làm lại dự kiến",
            "Ngày đi làm lại thực tế",
            "Đăng ký đi trễ hoặc về sớm (check mode)",
            "Thời gian áp dụng (dạng lưới để đăng ký từ dd/mm/yyyy đến dd/mm/yyyy)",
            "Trạng thái nhân viên (default “Thai sản” hoặc “Con nhỏ”)"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT14.03",
          "title": "Lưu trữ thông tin đăng ký",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi TBP duyệt",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Thông tin duyệt của TBP được lưu lại làm cơ sở tính giờ quét vào/ra, tính trễ sớm hoặc tính tăng ca (nếu có) trong chương trình.",
          "fieldsChecklist": [],
          "sourceRow": 4
        },
        {
          "stepCode": "ATT14.04",
          "title": "Thay đổi thời gian hưởng chính sách",
          "actor": "NV",
          "location": "Portal",
          "timing": "Khi có phát sinh",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Khi có thay đổi về thời gian đi trễ/về sớm thì nhân viên chủ động vào màn hình tại bước ATT14.01 bổ sung thông tin ở lưới “Thời gian áp dụng”.\n\nLưu ý:\n\nLưới nhập liệu “Thời gian áp dụng” nhân viên chỉ nhập “Thời gian từ” ở dòng mới nhất. Khi đó, “Thời gian đến” ở dòng liền kề trước đó chương trình tự default (= Thời gian từ mới nhất - 1)\n\nGửi mail thông báo duyệt đến TBP",
          "fieldsChecklist": [],
          "sourceRow": 5
        },
        {
          "stepCode": "ATT14.05",
          "title": "Duyệt thông tin thay đổi",
          "actor": "TBP",
          "location": "Portal",
          "timing": "Trước thời điểm thay đổi thông tin",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Có hai hình thức duyệt, nếu:\n\nThông tin truy vấn duyệt tương tự như màn hình tại bước ATT14.02\n\nGửi mail thông báo kết quả duyệt đến NV và HRM-C&B",
          "fieldsChecklist": [
            "Đồng ý, click “Duyệt”",
            "Không đồng ý, click “Không duyệt” và bổ sung ở cột “Lý do”"
          ],
          "sourceRow": 6
        },
        {
          "stepCode": "ATT14.06",
          "title": "Cập nhật thông tin đăng ký",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi nhận được thông tin duyệt từ TBP",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Thông tin đăng ký của NV, sau khi được TBP duyệt sẽ lưu vào chương trình để quản lý thông tin vào/ra, trễ /sớm hoặc tăng ca của NV (nếu có)",
          "fieldsChecklist": [],
          "sourceRow": 7
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-ATT-15",
      "sopTitle": "Quy trình đăng ký chế độ thai sản/con nhỏ, không dùng portal",
      "sopCategory": "Phân hệ Chấm công",
      "description": "",
      "steps": [
        {
          "stepCode": "ATT15.01",
          "title": "Bổ sung thông tin đăng ký chế độ thai sản hoặc con nhỏ",
          "actor": "NV",
          "location": "Bên ngoài",
          "timing": "Khi phát sinh hưởng chế độ",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "NV điền vào form “Đăng ký chế độ thai sản hoặc Con nhỏ” và chuyển về TBP duyệt\n\nCác thông tin trên form gồm:\n\n+ Thông tin thai sản\n\n+ Thông tin con nhỏ",
          "fieldsChecklist": [
            "Thời gian thai tròn 6 tháng tuổi (dd/mm/yyyy)",
            "Thời gian bắt đầu hưởng chế độ (tự nhập)",
            "Đăng ký đi trễ hoặc về sớm (check mode)",
            "Thời gian áp dụng (từ dd/mm/yyyy đến dd/mm/yyyy. Nếu không nhập thời gian đến thì mặc nhiên hiểu đến hết thời gian của chế độ thai sản hoặc con nhỏ)",
            "Ngày nghỉ thai sản dự kiến",
            "Ngày nghỉ thai sản thực tế",
            "Ngày đi làm lại dự kiến",
            "Ngày đi làm lại thực tế",
            "Đăng ký đi trễ hoặc về sớm (check mode)",
            "Thời gian áp dụng (từ dd/mm/yyyy đến dd/mm/yyyy. Nếu không nhập thời gian đến thì mặc nhiên hiểu đến hết thời gian của chế độ thai sản hoặc con nhỏ)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "ATT15.02",
          "title": "Cập nhật thông tin đăng ký",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi nhận được thông tin duyệt từ TBP",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Thông tin đăng ký của NV, sau khi được TBP duyệt sẽ chuyển về cho HRM-C&B cập nhật vào chương trình để quản lý thông tin vào ra và trễ sớm.",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "ATT15.03",
          "title": "Thay đổi thời gian hưởng chính sách",
          "actor": "NV",
          "location": "Bên ngoài",
          "timing": "Khi có phát sinh",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Khi có thay đổi về thời gian áp dụng, nhân viên điền mới vào form “Đăng ký chế độ thai sản hoặc Con nhỏ” và chuyển về TBP duyệt.\n\nNội dung thông tin tương tự như ở bước ATT15.01",
          "fieldsChecklist": [],
          "sourceRow": 4
        },
        {
          "stepCode": "ATT15.04",
          "title": "Cập nhật thông tin đăng ký",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi nhận được thông tin duyệt từ TBP",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Thông tin đăng ký của NV, sau khi được TBP duyệt sẽ chuyển về cho HRM-C&B cập nhật vào chương trình để quản lý thông tin vào ra và trễ sớm",
          "fieldsChecklist": [],
          "sourceRow": 5
        }
      ],
      "notes": []
    }
  ],
  "MODULE-PAY": [
    {
      "sopCode": "SOP-PAY-01",
      "sopTitle": "Quy trình tính lương ứng",
      "sopCategory": "Phân hệ Lương",
      "description": "",
      "steps": [
        {
          "stepCode": "PAY01.01",
          "title": "Tổng hợp công.phép cho nhân viên thoả điều kiện",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Ngày cuối của chu kỳ lương ứng",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Dựa trên cấu hình master data của kỳ lương ứng, gồm:\n\nThực hiện nghiệp vụ tổng hợp công.phép cho kỳ lưng ứng. Các thông tin tại màn hình này gồm:",
          "fieldsChecklist": [
            "Cấu hình về chu kỳ lương ứng",
            "Cấu hình về đối tượng được tham gia tính lương ứng",
            "Cấu hình về phương phá tính lương ứng",
            "Nhân viên thoả điều kiện tính lương ứng",
            "Ngày công tính lương ứng (dựa vào cấu hình để xác định đây là ngày công tính lương hay ngày công thực tế). Trong đó, Ngày công tính lương = Ngày công thưc tế + Ngày nghỉ Công ty thanh toán lương"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "PAY01.02",
          "title": "Tính lương",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Ngày cuối cùng của kỳ lương ứng + 1",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Từ kết quả màn hình tổng hợp công.phép của kỳ lương ứng, click nút tính lương.\n\nThông tin hiển thị kết quả tính lương tại màn hình này gồm:\n\nGửi mail đến các cấp liên quan",
          "fieldsChecklist": [
            "Người tính lương",
            "Kỳ lương tháng…",
            "Kỳ lương lần …",
            "Phòng ban",
            "Mã nhân viên",
            "Tên nhân viên",
            "Ngày công tính lương (hoặc ngày công làm việc)",
            "Mức lương cơ bản (hoặc mức lương gross)",
            "Đơn giá ngày công",
            "Tiền lương ứng"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "PAY01.03",
          "title": "Duyệt kết quả tính lương",
          "actor": "BOM",
          "location": "Portal",
          "timing": "Khi nhận được mail từ HRM-C&B",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Bảng lương ứng chuyển lên BOM duyệt.\n\nThông tin trên màn hình duyệt gồm:\n\nGửi mail thông báo kết quả duyệt bảng lương",
          "fieldsChecklist": [
            "Kỳ lương tháng…",
            "Kỳ ứng lần …",
            "Phòng ban",
            "Mã nhân viên",
            "Tên nhân viên",
            "Ngày công tính lương (hoặc ngày công làm việc)",
            "Mức lương cơ bản (hoặc mức lương gross)",
            "Đơn giá ngày công",
            "Tiền lương ứng",
            "Duyệt bảng lương"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "PAY01.04",
          "title": "Khoá bảng lương",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi kết quả tính lương được BOM duyệt",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Kết quả duyệt bảng lương sẽ là cơ sở cho HRM-C&B khoá bảng lương.\n\nMục đích khoá bảng lương để:",
          "fieldsChecklist": [
            "Không tính lại được lương sau khi BOM duyệt",
            "In bảng lương cho BOM ký",
            "In bảng chuyển khoản ngân hàng"
          ],
          "sourceRow": 5
        },
        {
          "stepCode": "PAY01.05",
          "title": "Xuất bảng lương",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Thời điểm thanh toán lương",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Bảng lương trình cho BOM ký/Bảng chuyển khoản ngân hàng/Phiếu lương sẽ in từ kết quả lương được khoá.",
          "fieldsChecklist": [],
          "sourceRow": 6
        },
        {
          "stepCode": "PAY01.06",
          "title": "Truy vấn kết quả tính lương",
          "actor": "Nhân viên",
          "location": "Portal",
          "timing": "Sau khi bảng lương được BOM ký",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "HRM-C&B chủ động post thông tin phiếu lương lên portal và gửi mail kèm phiếu đến nhân viên",
          "fieldsChecklist": [],
          "sourceRow": 7
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-PAY-02",
      "sopTitle": "Quy trình tính lương nhân viên nghỉ việc",
      "sopCategory": "Phân hệ Lương",
      "description": "",
      "steps": [
        {
          "stepCode": "PAY02.01",
          "title": "Chọn nhân viên cần tính lương nghỉ việc",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi có nhân viên trong danh sách cảnh báo",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Từ danh sách cảnh báo nhân viên nghỉ việc đã hoàn tất thủ tục thanh lý hợp đồng, check chọn nhân viên cần tính lương nghỉ việc.\n\nMàn hình cảnh báo gồm các thông tin sau:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Loại hợp đồng lao động",
            "Ngày đăng ký nghỉ việc",
            "Ngày nghỉ việc mong muốn",
            "Ngày nghỉ việc được duyệt",
            "Thời gian báo trước (Ngày nghỉ việc mong muốn – Ngày đăng ký nghỉ việc)",
            "Thời gian vi phạm báo trước (30 hoặc 45 theo loại hợp đồng lao động – Thời gian báo trước)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "PAY02.02",
          "title": "Tổng hợp công",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi có nhân viên trong danh sách cảnh báo",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Từ danh sách nhân viên được chọn tính lương nghỉ việc:\n\n+ Click Tổng hợp công.\n\nMục đích tổng hợp công:\n\nVùng thời gian tổng hợp công: từ đầu chu kỳ công đến ngày nghỉ việc được duyệt – 1\n\nMàn hình kết quả tổng hợp công gồm:\n\n+ Click Quyết toán phép\n\nMục đích quyết toán phép: tính số phép năm/phép bù tồn của nhân viên tại thời điểm nghỉ việc.\n\nMàn hình thông tin quyết toán phép gồm:",
          "fieldsChecklist": [
            "Tổng hợp số công làm việc thực tế",
            "Tổng hợp số ngày nghỉ Công ty thanh toán lương",
            "Tổng hợp số ngày nghỉ Công ty không thanh toán lương",
            "Tổng hợp số giờ OT theo từng loại (ngày thường/ngày nghỉ/ngày lễ)",
            "Tên nhân viên",
            "Mã nhân viên",
            "Phòng ban",
            "Ngày nghỉ việc được duyệt",
            "Công làm việc thực tế",
            "Giờ tăng ca ngày thường (150%)",
            "Giờ tăng ca đêm ngày thường (200%)",
            "Giờ tăng ca đêm ngày thường và có làm thêm vào ban ngày (210%)",
            "Giờ tăng ca ngày nghỉ (200%)",
            "Giờ tăng ca ngày nghỉ có làm đêm (270%)",
            "Giờ tăng ca ngày nghỉ có làm đêm và trước đó có làm thêm ban ngày (270%)",
            "Giờ tăng ca ngày lễ/tết (300%)",
            "Giờ tăng ca ngày lễ tết nhưng có làm đêm (390%)",
            "Giờ tăng ca ngày lễ/tết có làm đêm và trước đó có làm thêm ban ngày (390%)",
            "Loại phép: Phép năm hay Phép bù",
            "Số lượng phép có tính từ đầu niên độ đến thời điểm nghỉ việc",
            "Số lượng phép đã sử dụng",
            "Số lượng phép còn lại",
            "Tiền phép"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "PAY02.03",
          "title": "Cập nhật các khoản thu nhập phát sinh",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi có nhân viên trong danh sách cảnh báo",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Tại màn hình danh sách chọn nhân viên nghỉ việc tính lương, click chọn Bổ sung thu nhập.\n\nMục đích của Bổ sung thu nhập là để cập nhật giá trị các khoản thu nhập phát sinh không thường xuyên của tháng và không có nguyên tắc.\n\nMàn hình cập nhật gồm các thông tin:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Mã khoản thu nhập",
            "Giá trị phát sinh của khoản thu nhập",
            "Kỳ lương phát sinh"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "PAY02.04",
          "title": "Tính lương",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Trong vòng 7 ngày kể từ nhân viên được duyệt nghỉ việc",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Tại màn hình Danh sách nhân viên nghỉ việc đươc tính lương, sau khí có kết quả tổng hợp Công.phép và giá trị của các khoản thu nhập phát sinh đột xuất, click nút tính lương.\n\nThông tin hiển thị kết quả tính lương tại màn hình này gồm:\n\nGửi mail đến các cấp liên quan",
          "fieldsChecklist": [
            "Người tính lương",
            "Kỳ lương tháng…",
            "Phòng ban",
            "Mã nhân viên",
            "Tên nhân viên",
            "Giá trị từng khoản thu nhập (bao gồm cả bảo hiểm và thuế PIT tạm trích nộp)",
            "Kỳ thanh toán lương (gồm thanh toán ngay, thanh toán theo kỳ lương hiện tại hoặc tháng cụ thể do người dùng nhập vào – liên quan đến việc giữ lương)",
            "Ngày thanh toán lương dự kiến",
            "Phương thức thanh toá lương (set default theo Đối tượng lương ở danh mục nhưng có thể chọn lại)"
          ],
          "sourceRow": 5
        },
        {
          "stepCode": "PAY02.05",
          "title": "Duyệt kết quả tính lương",
          "actor": "BOM",
          "location": "Portal",
          "timing": "Khi nhận được mail của HRM-C&B",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Bảng lương ứng chuyển lên BOM duyệt.\n\nThông tin trên màn hình duyệt gồm:",
          "fieldsChecklist": [
            "Kỳ lương tháng…",
            "Phòng ban",
            "Mã nhân viên",
            "Tên nhân viên",
            "Giá trị từng khoản thu nhập (bao gồm cả bảo hiểm và thuế PIT tạm trích nộp)",
            "Kỳ thanh toán lương (gồm thanh toán ngay, thanh toán theo kỳ lương hiện tại hoặc tháng cụ thể do người dùng nhập vào – liên quan đến việc giữ lương)",
            "Ngày thanh toán lương dự kiến"
          ],
          "sourceRow": 6
        },
        {
          "stepCode": "PAY02.06",
          "title": "Khoá bảng lương",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi kết quả tính lương được BOM duyệt",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Kết quả duyệt bảng lương sẽ là cơ sở cho HRM-C&B khoá bảng lương.\n\nMục đích khoá bảng lương để:",
          "fieldsChecklist": [
            "Không tính lại được lương sau khi BOM duyệt",
            "In bảng lương cho BOM ký",
            "In bảng chuyển khoản ngân hàng"
          ],
          "sourceRow": 7
        },
        {
          "stepCode": "PAY02.07",
          "title": "Xuất bảng lương",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Thời điểm thanh toán lương",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Bảng lương trình cho BOM ký/Bảng chuyển khoản ngân hàng/Phiếu lương sẽ in từ kết quả lương được khoá.",
          "fieldsChecklist": [],
          "sourceRow": 8
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-PAY-03",
      "sopTitle": "Quy trình tính lương tháng",
      "sopCategory": "Phân hệ Lương",
      "description": "",
      "steps": [
        {
          "stepCode": "PAY03.01",
          "title": "Chốt hồ sơ nhân sự tháng",
          "actor": "HRM-Nhân sự",
          "location": "Bên trong",
          "timing": "Bất kỳ thời điểm nào nhưng phải trước thời điểm chốt công tính lương",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Mục đích của chốt hồ sơ Nhân sự là khoá lại tất cả các dữ liệu liên quan có thể ảnh hưởng đến kết quả tính lương của nhân viên trong tháng.\n\nCác dữ liệu có thể ảnh hưởng đến kết quả tính lương của nhân viên cần phải chốt lại, gồm:\n\nHồ sơ nhân sự chỉ chốt được khi không tồn tại các đăng ký chờ duyệt từ NV hoặc từ TBP liên quan đến các dữ liệu ở trên.",
          "fieldsChecklist": [
            "Mức lương",
            "Các khoản phụ cấp",
            "Chức vụ",
            "Địa điểm làm việc",
            "Bộ phận làm việc",
            "Hình thức làm việc (Thời vụ/Chính thức/Thử việc)",
            "Trạng thái làm việc",
            "Quá trình công tác (bổ nhiệm/kiêm nhiệm/miễn nhiệm/điều động/điều chuyển)",
            "Hình thức lao động (gián tiếp/trực tiếp)",
            "Tăng/Giảm lao động"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "PAY03.02",
          "title": "Chốt hồ sơ Công.Phép",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Bất kỳ thời điểm nào nhưng phải trước thời điểm chốt công tính lương",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Chốt hồ sơ Công.Phép dùng để chốt công làm việc, giờ tăng ca và các loại phep nghỉ hưởng lương/không hưởng lương Công ty.\n\nHồ sơ Công phép chỉ chốt được khi không còn bất thường của dữ liệu công.phép",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "PAY03.03",
          "title": "Chốt hồ sơ bảo hiểm tháng",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Bất kỳ thời điểm nào nhưng phải trước thời điểm chốt công tính lương",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Chốt hồ sơ Bảo hiểm dùng để chốt danh sách nhân viên có tham gia bảo hiểm trong tháng cũng như mức lương trích nộp bảo hiểm thay đổi khi thực hiện các nghiệp vụ bảo hiểm (báo tăng/báo giảm/điều chỉnh/bổ sung)",
          "fieldsChecklist": [],
          "sourceRow": 4
        },
        {
          "stepCode": "PAY03.04",
          "title": "Cập nhật các khoản thu nhập phát sinh",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Với nhân viên có phát sinh giá trị các khoản thu nhập này",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Thực hiện nghiệp vụ bổ sung thu nhập phát sinh\n\nMục đích của Bổ sung thu nhập là để cập nhật giá trị các khoản thu nhập phát sinh không thường xuyên của tháng và không có nguyên tắc.\n\nMàn hình cập nhật gồm các thông tin:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Mã khoản thu nhập",
            "Giá trị phát sinh của khoản thu nhập",
            "Kỳ lương phát sinh"
          ],
          "sourceRow": 5
        },
        {
          "stepCode": "PAY03.05",
          "title": "Tính lương",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Trong vòng 7 ngày kể từ nhân viên được duyệt nghỉ việc",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Nghiệp vụ tính lương tháng, click Tính.\n\nThông tin hiển thị kết quả tính lương tại màn hình này gồm:\n\nGửi mail đến các cấp liên quan",
          "fieldsChecklist": [
            "Người tính lương",
            "Kỳ lương tháng…",
            "Phòng ban",
            "Mã nhân viên",
            "Tên nhân viên",
            "Giá trị từng khoản thu nhập (bao gồm cả bảo hiểm và thuế PIT tạm trích nộp)",
            "Kỳ thanh toán lương (gồm thanh toán ngay, thanh toán theo kỳ lương hiện tại hoặc tháng cụ thể do người dùng nhập vào – liên quan đến việc giữ lương)",
            "Ngày thanh toán lương dự kiến",
            "Phương thức thanh toán lương (set default theo Đối tượng lương ở danh mục nhưng có thể chọn lại)"
          ],
          "sourceRow": 6
        },
        {
          "stepCode": "PAY03.06",
          "title": "Đối chiếu kết quả tính lương",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi tính lương",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Đối chiếu dữ liệu tính lương mục đích để so sánh kết quả tính lương của tháng hiện tại so với tháng trước để tìm ra dữ liệu bất thường.\n\nCụ thể tại màn hình phân tích dữ liệu bất thường này gồm các vector phân tích:\n\nMàn hình phân tích những nhân viên có dữ liệu thu nhập bất thường gồm các thông tin sau:\n\n+ Thông tin lưới trái:\n\n+ Lưới phải (click focus vào một nhân viên)",
          "fieldsChecklist": [
            "Có thay đổi các tham số đầu vào của lương nhưng kết quả tính lương không thay đổi (so với kỳ lương trước đó liền kề)",
            "Không thay đổi các tham số đầu vào của lương nhưng kết quả tính lương có thay đổi (so với kỳ tính lương trước đó liền kề)",
            "Có thay đổi các tham số đầu vào của lương và có thay đổi kết quả tính lương nhưng phân tích % độ chênh lệch thay đổi của các tham số đầu vào (tăng/giảm quá bao nhiêu % thì xem là bất thường)",
            "Mã nhân viên",
            "Tên nhân viên",
            "Chức vụ",
            "Phòng ban",
            "Khoản thu nhập bất thường",
            "Kết qủa tính tháng này",
            "Kết quả tính của tháng trước",
            "Số tiền chênh lệch",
            "Tỷ lệ chênh lệch"
          ],
          "sourceRow": 7
        },
        {
          "stepCode": "PAY03.07",
          "title": "Duyệt kết quả tính lương",
          "actor": "BOM",
          "location": "Portal",
          "timing": "Khi nhận được mail của HRM-C&B",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Bảng lương ứng chuyển lên BOM duyệt.\n\nThông tin trên màn hình duyệt gồm:\n\nGửi mail thông báo kết quả duyệt đến HRM-C&B",
          "fieldsChecklist": [
            "Kỳ lương tháng…",
            "Phòng ban",
            "Mã nhân viên",
            "Tên nhân viên",
            "Giá trị từng khoản thu nhập (bao gồm cả bảo hiểm và thuế PIT tạm trích nộp)",
            "Kỳ thanh toán lương (gồm thanh toán theo kỳ lương hiện tại hoặc tháng cụ thể do người dùng nhập vào – liên quan đến việc giữ lương)",
            "Ngày thanh toán lương dự kiến"
          ],
          "sourceRow": 8
        },
        {
          "stepCode": "PAY03.08",
          "title": "Khoá bảng lương",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi kết quả tính lương được BOM duyệt",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Kết quả duyệt bảng lương sẽ là cơ sở cho HRM-C&B khoá bảng lương.\n\nMục đích khoá bảng lương để:",
          "fieldsChecklist": [
            "Không tính lại được lương sau khi BOM duyệt",
            "In bảng lương cho BOM ký",
            "In bảng chuyển khoản ngân hàng"
          ],
          "sourceRow": 9
        },
        {
          "stepCode": "PAY03.09",
          "title": "Xuất bảng lương",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Thời điểm thanh toán lương",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Bảng lương trình cho BOM ký/Bảng chuyển khoản ngân hàng/Phiếu lương sẽ in từ kết quả lương được khoá.",
          "fieldsChecklist": [],
          "sourceRow": 10
        },
        {
          "stepCode": "PAY03.10",
          "title": "Truy vấn kết quả tính lương",
          "actor": "Nhân viên",
          "location": "Sau khi bảng lương được BOM ký, HRM",
          "timing": "N",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "HRM-C&B chủ động post thông tin phiếu lương lên portal và gửi mail kèm phiếu đến nhân viên",
          "fieldsChecklist": [],
          "sourceRow": 11
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-PAY-04",
      "sopTitle": "Quy trình tính thưởng",
      "sopCategory": "Phân hệ Lương",
      "description": "",
      "steps": [
        {
          "stepCode": "PAY04.01",
          "title": "Thiết lập phương pháp tính thưởng",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi có phát sinh",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Với các loại thưởng có nguyên tắc tính thưởng (như thưởng tháng 13) thì HRM-C&B thiết lập phương pháp tính thưởng (tham khảo ở phần Cấu hình tính lương/thưởng)\n\nNếu các loại thưởng không có nguyên tắc tính thì xem đó như một khoản thu nhập phát sinh không thường xuyên nên sẽ import kết quả vào chương trình mà không cần thiết lập phương pháp tính thưởng.",
          "fieldsChecklist": [],
          "sourceRow": 2
        },
        {
          "stepCode": "PAY04.02",
          "title": "Chọn nhân viên được tính thưởng và tính thưởng",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi có phát sinh chính sách thưởng được duyệt",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Từ nghiệp vụ tính thưởng:\n\nCác thông tin của màn hình kết quả tính thưởng gồm:\n\nGửi mail thông báo đề xuất duyệt kết quả tính thưởng đến BOM",
          "fieldsChecklist": [
            "Chọn danh sách nhân viên được tính thưởng",
            "Chọn phương pháp tính thưởng",
            "Mã nhân viên",
            "Tên nhân viên",
            "Giá trị tính thưởng",
            "Thuế PIT tạm nộp (10% trên Giá trị tính thưởng)",
            "Thời điểm trả thưởng (tháng)",
            "Ngày trả thưởng (dd/mm/yyyy)"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "PAY04.03",
          "title": "Duyệt kết quả tính thưởng",
          "actor": "BOM",
          "location": "Portal",
          "timing": "Khi nhận được mail của HRM-C&B",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Bảng thưởng chuyển lên BOM duyệt.\n\nThông tin trên màn hình duyệt gồm:",
          "fieldsChecklist": [
            "Phòng ban",
            "Mã nhân viên",
            "Tên nhân viên",
            "Giá trị thưởng",
            "Thuế PIT trích nộp",
            "Ngày chi trả dự kiến"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "PAY04.04",
          "title": "Khoá bảng thưởng",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi kết quả tính thưởng được BOM duyệt",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Kết quả duyệt bảng thưởng sẽ là cơ sở cho HRM-C&B khoá thưởng\n\nMục đích khoá bảng thưởng:",
          "fieldsChecklist": [
            "Không tính lại được thưởng sau khi BOM duyệt",
            "In bảng thưởng cho BOM ký",
            "In bảng chuyển khoản ngân hàng"
          ],
          "sourceRow": 5
        },
        {
          "stepCode": "PAY04.05",
          "title": "Xuất bảng thưởng",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Sau khi khoá bảng thưởng",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Bảng thưởng trình cho BOM ký/Bảng chuyển khoản ngân hàng/Phiếu tính thưởng (nếu có) sẽ in từ kết quả thưởng được khoá.",
          "fieldsChecklist": [],
          "sourceRow": 6
        },
        {
          "stepCode": "PAY04.06",
          "title": "Truy vấn kết quả tính thưởng",
          "actor": "Nhân viên",
          "location": "Portal",
          "timing": "Sau khi bảng lương được BOM ký",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "HRM-C&B chủ động post thông tin kết quả tính thưởng lên portal và gửi mail kèm phiếu đến nhân viên",
          "fieldsChecklist": [],
          "sourceRow": 7
        }
      ],
      "notes": []
    }
  ],
  "MODULE-INS": [
    {
      "sopCode": "SOP-INS-01",
      "sopTitle": "Quy trình quản lý thông tin hồ sơ bảo hiểm",
      "sopCategory": "Phân hệ Bảo hiểm",
      "description": "",
      "steps": [
        {
          "stepCode": "INS01.01",
          "title": "Quản lý thông tin hồ sơ bảo hiểm",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Khởi tạo auto vào đầu chu kỳ bảo hiểm, kế thừa từ tháng trước để có số tồn đầu kỳ",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Hồ sơ bảo hiểm là nơi lưu trữ các thông tin bảo hiểm của nhân viên, gồm:",
          "fieldsChecklist": [
            "Kỳ bảo hiểm (dùng thống kê nhân viên có tham gia bảo hiểm hoặc có các nghiệp vụ bảo hiểm phát sinh trong kỳ; các trường dữ liệu hiển thị tiếp theo bên dưới phải đổ theo kỳ này)",
            "Mã nhân viên",
            "Tên nhân viên",
            "Trạng thái nhân viên (dựa trên nghiệp vụ bảo hiểm để xác định trạng thái, cụ thể:",
            "Nghỉ việc không lương",
            "Nghỉ chế độ ốm đau",
            "Nghỉ chế độ thai sản",
            "Ngày vào làm",
            "Phòng ban",
            "Ngạch lương (load từ profile)",
            "Bậc lương (load từ profile)",
            "Mức lương tham gia bảo hiểm (load từ profile)",
            "Phụ cấp tham gia bảo hiểm (load từ profile)",
            "Loại tiền tham gia (chọn VND hoặc Khác)",
            "Tỷ giá (nếu Loại tiền tham gia là “Khác”, khai báo – tỷ giá này lấy theo Cơ quan bảo hiểm, 6 tháng thay đổi một lần)",
            "Tỷ lệ % BHXH NSDLD đóng (default từ Đối tượng bảo hiểm)",
            "Mức BHXH NSDLD tham gia",
            "Tỷ lệ % BHXH NLD đóng (default từ Đối tượng bảo hiểm)",
            "Mức BHXH NLD tham gia ([Mức lương tham gia bảo hiểm + Phụ cấp tham gia bảo hiểm] * Tỷ lệ",
            "Tỷ lệ % BHYT NSDLD đóng (default từ Đối tượng bảo hiểm)",
            "Mức BHYT NSDLD tham gia ([Mức lương tham gia bảo hiểm + Phụ cấp tham gia bảo hiểm] * Tỷ lệ",
            "Tỷ lệ % BHYT NLD đóng (default từ Đối tượng bảo hiểm)",
            "Mức BHYT NLD tham gia ([Mức lương tham gia bảo hiểm + Phụ cấp tham gia bảo hiểm] * Tỷ lệ",
            "Tỷ lệ % BHTN NSDLD đóng (default từ Đối tượng bảo hiểm)",
            "Mức BHTN NSDLD tham gia ([Mức lương tham gia bảo hiểm + Phụ cấp tham gia bảo hiểm] * Tỷ lệ",
            "Tỷ lệ % BHTN NLD đóng (default từ Đối tượng bảo hiểm)",
            "Mức BHTN NLD tham gia ([Mức lương tham gia bảo hiểm + Phụ cấp tham gia bảo hiểm] * Tỷ lệ",
            "Tỷ lệ % BHTNLD-BNN NSDLD đóng (default từ Đối tượng bảo hiểm)",
            "Mức BHTNDL-BNN NSDLD tham gia ([Mức lương tham gia bảo hiểm + Phụ cấp tham gia bảo hiểm] * Tỷ lệ",
            "Tỷ lệ % BHTNLD-BNN NLD đóng (default từ Đối tượng bảo hiểm)",
            "Mức BHTNLD-BNN NLD tham gia ([Mức lương tham gia bảo hiểm + Phụ cấp tham gia bảo hiểm] * Tỷ lệ"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "INS01.02",
          "title": "Quản lý lịch sử BH tại Công ty",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Sau khi Hồ sơ bảo hiểm từng tháng được khoá",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Thông tin được cập nhật tự động từ các nghiệp vụ Bảo hiểm phát sinh và người dùng không được phép điều chỉnh nội dung thông tin này.\n\nCác thông tin ở màn hình lịch sử (dạng lưới) này gồm:",
          "fieldsChecklist": [
            "Từ thời gian (dd/mm/yyyy)",
            "Đến thời gian (dd/mm/yyyy)",
            "Mức lương tham gia bảo hiểm",
            "Phòng ban",
            "Chức danh",
            "Chức vụ"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "INS01.03",
          "title": "Lịch sử BH trước khi vào Công ty",
          "actor": "",
          "location": "Bên trong",
          "timing": "Thời gian Onboarding",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Thông tin được người dùng chủ động cập nhật (nếu chưa có thông tin khi cập nhật CV lúc nhận việc). Thông tin nhập liệu là mức lương của 6 tháng gần nhất trước khi vào Công ty\n\nCác thông tin ở màn hình (dạng lưới) này gồm:",
          "fieldsChecklist": [
            "Từ thời gian (dd/mm/yyyy)",
            "Đến thời gian (dd/mm/yyyy)",
            "Mức lương tham gia bảo hiểm (text, tự khai báo)",
            "Công ty (text, tự khai báo)",
            "Phòng ban (text, tự khai báo)",
            "Chức danh (text, tự khai báo)",
            "Chức vụ (text, tự khai báo)"
          ],
          "sourceRow": 4
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-INS-02",
      "sopTitle": "Quy trình báo tăng bảo hiểm",
      "sopCategory": "Phân hệ Bảo hiểm",
      "description": "",
      "steps": [
        {
          "stepCode": "INS02.01",
          "title": "Cảnh báo danh sách nhân viên cần báo tăng BH trong tháng",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Thời gian phát sinh của các dữ kiện nằm trong khoảng từ 16 tháng này đến 15 tháng sau",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên thuộc danh sách cảnh báo này gồm:",
          "fieldsChecklist": [
            "Nhân viên ký mới hợp đồng lao động",
            "Nếu ngày ký trước ngày 16 thì báo tăng trong tháng",
            "Nếu ngày ký sau ngày 16 sẽ báo tăng ở tháng sau liền kề",
            "Nhân viên nghỉ thai sản đi làm lại",
            "Nếu đi làm lại trước ngày 16 thì báo tăng trong tháng đi làm lại",
            "Nếu đi làm lại sau ngày 16 thì báo tăng ở tháng sau liền kề",
            "Nhân viên nghỉ ốm (chế độ bảo hiểm trên 14 ngày) đi làm lại",
            "Số ngày nghỉ không lương ở tháng đi làm lại < 14 ngày thì tăng trong tháng đi làm lại",
            "Số ngày nghỉ không lương ở tháng đi làm lại >=14 ngày thì báo tăng ở tháng sau liền kề",
            "Nhân viên nghỉ không lương (trên 14 ngày) đi làm lại",
            "Số ngày nghỉ không lương ở tháng đi làm lại < 14 ngày thì tăng trong tháng đi làm lại",
            "Số ngày nghỉ không lương ở tháng đi làm lại >=14 ngày thì báo tăng ở tháng sau liền kề",
            "Nhân viên có thay đổi chức danh trong tháng nhưng không thay đổi mức đóng bảo hiểm"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "INS02.02",
          "title": "Chọn nhân viên được báo tăng BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm hiện tại",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Dựa trên danh sách nhân viên được cảnh báo, HRM-Bảo hiểm chọn nhân viên thoả điều kiện báo tăng bảo hiểm.\n\nVí dụ:\n\nNhân viên nghỉ thai sản có ngày đi làm lại dự kiến là 10/8/2020, nhưng vì một lý do cá nhân nên đề nghị thời gian đi làm lại là 3/9/2020, vì thế nhân viên sẽ không được lựa chọn báo tăng bảo hiểm trong kỳ tháng 8/2020.",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "INS02.03",
          "title": "Báo tăng BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm hiện tại",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Nhân viên được lựa chọn báo tăng bảo hiểm sẽ xuất hiện tại màn hình Báo tăng bảo hiểm.\n\nCác thông tin cần bổ sung tại màn hình báo tăng gồm:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban (từ profile)",
            "Chức danh (từ profile)",
            "Chức vụ (từ profile)",
            "Đối tượng bảo hiểm (từ profile)",
            "Ngạch lương (từ profile)",
            "Bậc lương (từ profile)",
            "Level theo Job grade (từ profile)",
            "Mức. lương (từ profile)",
            "Ngày thực hiện báo tăng (default từ ngày hiện tại theo Windows)",
            "Tháng báo tăng từ, với:",
            "Nếu tăng từ tháng hiện tại thì chương trình deffault.",
            "Nếu tăng lùi cho các tháng trước đó thì người dùng chủ động cập nhật vào",
            "Tháng báo tăng đến, với:",
            "Báo tăng từ tháng hiện tại thì thông tin này để trống",
            "Báo tăng lùi từ tháng quá khứ đến tháng hiện tại thì thông tin này để trống",
            "Báo tăng cho một số tháng trong quá khứ nhưng không bao gồm tháng hiện tại thì phải nhập giá trị, đồng thời kiểm soát đã tồn tại dòng báo tăng tháng hiện tại thì giá trị này không được vi phạm (không được >= tháng hiện tại)",
            "Tỷ lệ BHXH NSDLD đóng/Mức đóng (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHXH NLD đóng/Mức đóng (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHYT NSDLD đóng/Mức đóng (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHYT NLD đóng/Mức đóng (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHTN NSDLD đóng/Mức đóng (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHTN NLD đóng/Mức đóng (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHTNLD-BNN NSDLD đóng/Mức đóng (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHTNLD-BNN NLD đóng/Mức đóng (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Địa điểm làm việc (dùng để xác định Vùng làm việc và mức lương tối thiểu vùng)",
            "Đợt thực hiện (tự bổ sung, dùng để nhóm các nhân viên cùng đợt để kết chuyển sang phần mềm bảo hiểm)"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "INS02.04",
          "title": "Xuất template kết nối phần mềm BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm thực tế",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Danh sách nhân viên báo tăng được xuất ra theo template quy định của mỗi phần. mềm kê khai bảo hiểm (ví dụ TS24, VNPT hay EFY,…)",
          "fieldsChecklist": [],
          "sourceRow": 5
        },
        {
          "stepCode": "INS02.05",
          "title": "Truy vấn thông tin báo tăng BH",
          "actor": "NV",
          "location": "Portal",
          "timing": "Khi hồ sơ bảo hiểm tháng được khoá",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên truy vấn được kết quả báo tăng bảo hiểm của họ trên portal\n\nThông tin truy vấn gồm:",
          "fieldsChecklist": [
            "Tháng tăng bảo hiểm",
            "Mức lương làm cơ sở trích nộp",
            "Tỷ lệ trích nộp BHXH/ Mức trích nộp",
            "Tỷ lệ trích nộp BHYT/ Mức trích nộp",
            "Tỷ lệ trích nộp BHTN/ Mức trích nộp",
            "Tỷ lệ trích nôp BHTNLD-BNN/ Mức trích nộp"
          ],
          "sourceRow": 6,
          "sourceCode": "INSS02.05"
        }
      ],
      "notes": [],
      "sourceNote": "Chuẩn hóa mã gõ nhầm trong bảng nguồn: INSS02.05 → INS02.05."
    },
    {
      "sopCode": "SOP-INS-03",
      "sopTitle": "Quy trình báo giảm bảo hiểm",
      "sopCategory": "Phân hệ Bảo hiểm",
      "description": "",
      "steps": [
        {
          "stepCode": "INS03.01",
          "title": "Cảnh báo danh sách nhân viên báo giảm bảo hiểm",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Thời gian phát sinh của các dữ kiện nằm trong khoảng từ 16 tháng này đến 15 tháng sau",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Những nhân viên thuộc danh sách cảnh báo này gồm:",
          "fieldsChecklist": [
            "Nhân viên nghỉ việc",
            "Ngày nghỉ việc trước ngày 16: báo giảm trong tháng nghỉ việc",
            "Ngày nghỉ việc sau ngày 16: báo giảm ở tháng sau liền kề",
            "Nhân viên nghỉ thai sản:",
            "Số ngày nghỉ thai sản trong tháng >=14: báo ở tháng nghỉ",
            "Số ngày nghỉ thai sản trong tháng < 14: báo giảm ở tháng sau liền kề",
            "Nhân viên nghỉ chế độ bảo hiểm (ốm ngắn ngày/ốm đài ngày/con ổm): tổng số ngày nghỉ hưởng chế độ bảo hiểm trong tháng >=14 ngày; ngược lại không báo",
            "Nhân viên nghỉ không lương có số ngày nghỉ không lương >=14 ngày trong tháng; ngược lại không báo"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "INS03.02",
          "title": "Chọn nhân viên được báo giảm BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm hiện tại",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Dựa trên danh sách nhân viên được cảnh báo, HRM-Bảo hiểm chọn nhân viên thoả điều kiện báo giảm bảo hiểm",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "INS03.03",
          "title": "Báo giảm BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm hiện tại",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Nhân viên được lựa chọn báo giảm bảo hiểm sẽ xuất hiện tại màn hình Báo giảm bảo hiểm.\n\nCác thông tin cần bổ sung tại màn hình báo giảm gồm:\n\nLưu ý:\n\nNếu Tháng báo giảm từ có thông tin thì sẽ chương trình sẽ cảnh báo ở SOP INS01, ngược lại thì chương trình không có cảnh báo.",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban (từ profile)",
            "Chức danh (từ profile)",
            "Chức vụ (từ profile)",
            "Đối tượng bảo hiểm (từ profile)",
            "Ngạch lương (từ profile)",
            "Bậc lương (từ profile)",
            "Level theo Job grade (từ profile)",
            "Mức lương trước khi báo giảm (từ profile)",
            "Ngày thực hiện báo giảm (default từ ngày hiện tại theo Windows)",
            "Tháng báo giảm từ, với:",
            "Nếu giảm từ tháng hiện tại thì chương trình deffault.",
            "Nếu giảm lùi cho các tháng trước đó thì người dùng chủ động cập nhật vào",
            "Tháng báo giảm đến, với:",
            "Báo giảm từ tháng hiện tại thì thông tin này để trống",
            "Báo giảm lùi từ tháng quá khứ đến tháng hiện tại thì thông tin này để trống",
            "Báo giảm lùi cho các tháng trong quá khứ nhưng không bao gồm tháng hiện tại thì phải nhập giá trị ở trường thông tin này, đồng thời kiểm soát đã tồn tại dòng báo giảm tháng hiện tại thì giá trị này không được vi phạm (không được >= tháng hiện tại)",
            "Nhân viên xác đinh được tháng đi làm lại thì cần nhập vào, làm cơ sở để cảnh báo cho SOP INS01, và phải kiểm tra điều kiện giá trị nhập vào > Tháng báo giảm từ",
            "Tỷ lệ BHXH NSDLD đóng: reset về 0%",
            "Tỷ lệ BHXH NLD đóng: reset về 0%",
            "Tỷ lệ BHYT NSDLD đóng: reset về 0%",
            "Tỷ lệ BHYT NLD đóng: reset về 0%",
            "Tỷ lệ BHTN NSDLD đóng: reset về 0%",
            "Tỷ lệ BHTN NLD đóng: reset về 0%",
            "Tỷ lệ BHTNLD-BNN NSDLD đóng: reset về 0%",
            "Tỷ lệ BHTNLD-BNN NLD đóng: reset về 0%",
            "Đợt thực hiện (tự bổ sung, dùng để nhóm các nhân viên cùng đợt để kết chuyển sang phần mềm bảo hiểm)"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "INS03.04",
          "title": "Xuất template kết nối phần mềm BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm thực tế",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Danh sách nhân viên báo giảm được xuất ra theo template quy định của mỗi phần. mềm kê khai bảo hiểm (ví dụ TS24, VNPT hay EFY,…)",
          "fieldsChecklist": [],
          "sourceRow": 5
        },
        {
          "stepCode": "INS03.05",
          "title": "Truy vấn thông tin báo tăng BH",
          "actor": "NV",
          "location": "Portal",
          "timing": "Khi hồ sơ bảo hiểm tháng được khoá",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên truy vấn được kết quả báo giảm bảo hiểm của họ trên portal\n\nThông tin truy vấn gồm:",
          "fieldsChecklist": [
            "Tháng báo giảm bảo hiểm từ",
            "Tháng báo giảm bảo hiểm đến",
            "Mức lương tại thời điểm báo giảm",
            "Tỷ lệ giảm BHXH/ Mức giảm",
            "Tỷ lệ giảm BHYT/ Mức giảm",
            "Tỷ lệ giảm BHTN/Mức giảm",
            "Tỷ lệ giảm BHTNLD-BNN/ Mức giảm"
          ],
          "sourceRow": 6,
          "sourceCode": "INSS03.05"
        }
      ],
      "notes": [],
      "sourceNote": "Chuẩn hóa mã gõ nhầm trong bảng nguồn: INSS03.05 → INS03.05."
    },
    {
      "sopCode": "SOP-INS-04",
      "sopTitle": "Quy trình điều chỉnh mức nộp bảo hiểm",
      "sopCategory": "Phân hệ Bảo hiểm",
      "description": "",
      "steps": [
        {
          "stepCode": "INS04.01",
          "title": "Cảnh báo danh sách nhân viên điều chỉnh mức nộp BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Dữ liệu phát sinh từ ngày 16 tháng hiện tại đến 15 của tháng sau liền kề",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Danh sách nhân viên được cảnh báo gồm:",
          "fieldsChecklist": [
            "Nhân viên có điều chỉnh mức lương tham gia bảo hiểm trong tháng"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "INS04.02",
          "title": "Lựa chọn nhân viên",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm hiện tại",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "HRM-Bảo hiểm lựa chọn nhân viên thoả điều kiện thực hiện điều chỉnh mức nộp bảo hiểm",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "INS04.03",
          "title": "Thực hiện điều chỉnh mức nộp",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm hiện tại",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Nhân viên được lựa chọn sẽ xuất hiện tại màn hình Điều chỉnh mức nộp bảo hiểm.\n\nCác thông tin cần bổ sung tại màn hình này gồm:\n\nLưu ý:\n\nChênh lệch sẽ do chương trình tự tính nếu Tháng điều chỉnh từ có dữ liệu",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban (từ profile)",
            "Chức danh (từ profile)",
            "Chức vụ (từ profile)",
            "Đối tượng bảo hiểm (từ profile)",
            "Ngạch lương (từ profile)",
            "Bậc lương (từ profile)",
            "Level theo Job grade (từ profile)",
            "Mức lương trước khi điều chỉnh (từ profile)",
            "Mức lương sau khi điều chỉnh (từ nghiệp vụ Điều chỉnh thu nhập)",
            "Ngày thực hiện điều chỉnh (default từ ngày hiện tại theo Windows)",
            "Tháng điều chỉnh từ, với:",
            "Nếu điều chỉnh từ tháng hiện tại thì chương trình deffault.",
            "Nếu điều chỉnh lùi cho các tháng trước đó thì người dùng chủ động cập nhật vào",
            "Tháng điều chỉnh đến, nếu:",
            "Điều chỉnh từ tháng hiện tại thì thông tin này để trống",
            "Điều chỉnh lùi từ tháng quá khứ đến tháng hiện tại thì thông tin này để trống",
            "Điều chỉnh lùi cho các tháng trong quá khứ nhưng không bao gồm tháng hiện tại thì phải nhập giá trị ở trường thông tin này, đồng thời kiểm soát đã tồn tại dòng điều chỉnh tháng hiện tại thì giá trị này không được vi phạm (không được >= tháng hiện tại)",
            "Chênh lệch mức lương tham gia bảo hiểm (= Mức lương sau khi điều chỉnh - Mức lương trước khi điều chỉnh)",
            "Tỷ lệ BHXH NSDLD đóng/Mức đóng/Chênh lệch (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHXH NLD đóng/Mức đóng/Chênh lệch (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHYT NSDLD đóng/Mức đóng/Chênh lệch (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHYT NLD đóng/Mức đóng/Chênh lệch (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHTN NSDLD đóng/Mức đóng/Chênh lệch (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHTN NLD đóng/Mức đóng/Chênh lệch (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHTNLD-BNN NSDLD đóng/Mức đóng/Chênh lệch (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Tỷ lệ BHTNLD-BNN NLD đóng/Mức đóng/Chênh lệch (%, từ thiết lập ở Đối tượng bảo hiểm)",
            "Đợt thực hiện (tự bổ sung, dùng để nhóm các nhân viên cùng đợt để kết chuyển sang phần mềm bảo hiểm)"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "INS04.04",
          "title": "Xuất template kết nối phần mềm BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm thực tế",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "Danh sách nhân viên điều chỉnh mức nộp bảo hiểm được xuất ra theo template quy định của mỗi phần. mềm kê khai bảo hiểm (ví dụ TS24, VNPT hay EFY,…)",
          "fieldsChecklist": [],
          "sourceRow": 5
        },
        {
          "stepCode": "INS04.05",
          "title": "Truy vấn thông tin",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi khoá hồ sơ bảo hiểm tháng",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên truy vấn thông tin điều chỉnh mức nộp của họ, gồm:",
          "fieldsChecklist": [
            "Mức lương điều chỉnh",
            "Điều chỉnh từ tháng…. Đến tháng….",
            "Mức trích nộp chênh lệch"
          ],
          "sourceRow": 6
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-INS-05",
      "sopTitle": "Quy trình bổ sung mức nộp bảo hiểm",
      "sopCategory": "Phân hệ Bảo hiểm",
      "description": "",
      "steps": [
        {
          "stepCode": "INS05.01",
          "title": "Cảnh báo nhân viên bổ sung mức nộp BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm của tháng hiện tại",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên có trong danh sách cảnh báo là nhân viên nghỉ việc hoặc nghỉ không lương/nghỉ chế độ bảo hiểm >= 14 ngày nhưng ngày trả thẻ BHYT sau ngày 1 của tháng nghỉ.\n\nSố liệu thống kê lấy từ nguồn nghiệp vụ Báo giảm bảo hiểm của phân hệ INS và có ngày trả thẻ >= 1",
          "fieldsChecklist": [],
          "sourceRow": 2
        },
        {
          "stepCode": "INS05.02",
          "title": "Chọn nhân viên",
          "actor": "",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm của tháng hiện tại",
          "typeCode": "M",
          "sourceTypeCode": "M",
          "description": "HRM-Bảo hiểm lựa chọn nhân viên cần bổ sung tăng mức nộp bảo hiểm",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "INS05.03",
          "title": "Thực hiện bổ sung mức nộp BH",
          "actor": "",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm của tháng hiện tại",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Nhân viên được chọn sẽ có tại màn hình Bổ sung tăng mức nộp.\n\nCác thông tin cập nhật tại màn hình này gồm:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Chức danh",
            "Chức vụ",
            "Cấp bậc theo job grade",
            "Mức lương tham gia BH hiện tại",
            "Tháng bổ sung (load default tháng hiện tại)",
            "Tỷ lệ BHYT NSDLD bổ sung/Mức bổ sung",
            "Tỷ lệ BHYT NLD bổ sung /Mức bổ sung",
            "Đợt thực hiện"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "INS05.04",
          "title": "Xuất template",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Trong kỳ bảo hiểm của tháng hiện tại",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Xuất template theo quy định của các phần mềm kê khai bảo hiểm (ví dụ TS24, EFY hay VNPT,…)",
          "fieldsChecklist": [],
          "sourceRow": 5
        },
        {
          "stepCode": "INS05.05",
          "title": "Truy vấn thông tin",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi khoá hồ sơ bảo hiểm tháng",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên chủ động truy vấn được thông tin bổ sung mức nộp BHYT của họ.\n\nThông tin truy vấn gồm:",
          "fieldsChecklist": [
            "Tháng bổ sung",
            "Mức lương trích nộp",
            "Tỷ lệ BHYT bổ sung",
            "Mức bổ sung"
          ],
          "sourceRow": 6
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-INS-06",
      "sopTitle": "Quy trình giải quyết chế độ trợ cấp bảo hiểm (ốm đau/thai sản)",
      "sopCategory": "Phân hệ Bảo hiểm",
      "description": "",
      "steps": [
        {
          "stepCode": "INS06.01",
          "title": "Cập nhật chứng từ và tính chế độ trợ cấp BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Nhân viên phát sinh chế độ hưởng và nộp đủ chứng từ",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Chứng từ nghỉ ốm đau (bản thân ốm hoặc Con ốm) hoặc chế độ thai sản được HRM-Bảo hiểm cập nhật ở màn hình Chế độ trợ cấp bảo hiểm.\n\nCác thông tin cập nhật gồm:\n\nLưu ý:\n\n(*) Người chấm phép quản lý thông tin nghỉ phát sinh của nhân viên ở phân hệ ATT, người làm chế độ bảo hiểm kế thừa thông tin này sang và điều chỉnh lại cho phù hợp với chứng từ của Bệnh viện. Trường hợp chấm nghỉ thiếu hoặc sai sót thì dữ liệu của người làm bảo hiểm ảnh hưởng theo.\n\n(**) Người làm chế độ bảo hiểm không kế thừa thông tin nghỉ phép từ phân hệ ATT mà chỉ dựa trên chứng từ của bệnh viện để cập nhật và quản lý.\n\nLưu ý:\n\nNếu chọn “Con ốm” ở drop down Chế độ trợ cấp bảo hiểm thì phải nhập thêm các thông tin sau:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Chức danh",
            "Chức vụ",
            "Check mode nhập liệu, cụ thể:",
            "Mode “Từ nghỉ phép” (*) để kế thừa tự động các ngày nghỉ với loại nghỉ có check chọn “Là loại nghỉ có chứng từ y tế” đã được cập nhật tại phân hệ ATT hoặc,",
            "Mode “Nhập trực tiếp” (**) người dùng trực tiếp nhập các ngày nghỉ chế độ phát sinh mà không kế thừa thông tin nghỉ từ phân hệ ATT",
            "Ngày nghỉ từ, nếu:",
            "Chọn (*) thì chương trình tự load thông tin từ phân hệ ATT",
            "Chọn (**) thì người dùng phải nhập",
            "Ngày nghỉ đến, nếu:",
            "Chọn (*) thì chương trình tự load thông tin từ phân hệ ATT",
            "Chọn (**) thì người dùng phải nhập",
            "Chế độ trợ cấp bảo hiểm (drop down từ Danh mục/ Chế độ trợ cấp bảo hiểm)",
            "Họ và tên của con (drop down từ mối quan hệ gia đình trong profile)",
            "Năm sinh của con (drop down từ mối quan hệ trong profile)",
            "Tuổi của con (chương trình tự tính, tính đến ngày hiện tại)",
            "Ngày công chuẩn (load default = 24, theo Chế độ trợ cấp bảo hiểm đã thiết lập)",
            "Số ngày nghỉ tính hưởng (auto tính, = Ngày ngày đến – Ngày nghỉ từ, có hoặc không loại trừ các ngày nghỉ hằng tuần/ngày lễ/ngày tết theo Chế độ trợ cấp bảo hiểm đã thiết lập)",
            "Thâm niên tham gia bảo hiểm (xx Năm và yy Tháng, xx và yy do chương trình tự tính dựa theo ngày tham gia bảo hiểm được quản lý ở Hồ sơ bảo hiểm và ngày hiện tại)",
            "Số ngày nghỉ hưởng định mức (load auto dựa theo thiết lập ở Chế độ trợ cấp bảo hiểm)",
            "Số ngày nghỉ hưởng tính từ đầu năm đến hiện tại (load auto bằng cách luỹ kế số ngày nghỉ đã phát sinh nhưng được cơ quan BH duyệt tính từ đầu năm dương lịch đến trước thời điểm thực hiện nghiệp vụ này)",
            "Số ngày nghỉ hưởng còn lại (tính tự động, = Số ngày nghỉ hưởng định mức - Số ngày nghỉ hưởng tính từ đầu năm đến hiện tại)",
            "Số ngày nghỉ đề nghị tính hưởng (so sánh, nếu:",
            "Số ngày nghỉ tính hưởng =< Số ngày nghỉ hưởng còn lại thì lấy theo Số ngày nghỉ tính hưởng",
            "Số ngày nghỉ tính hưởng > Số ngày nghỉ hưởng còn lại thì lấy theo Số ngày nghỉ hưởng còn lại",
            "Mức lương tham gia bảo hiểm (chương trình tự tính, dựa theo thiết lập tại Chế độ trợ cấp bảo hiểm và thông tin lịch sử lương tại Hồ sơ bảo hiểm)",
            "Đơn giá một ngày nghỉ hưởng (Mức lương tham gia bảo hiểm/Ngày công chuẩn)",
            "Mức hưởng dự tính (chương trình tính, = Đơn giá một ngày nghỉ hưởng * Số ngày nghỉ đề nghị tính hưởng)",
            "Ngày thực hiện nghiệp vụ (load default theo ngày của Windows)",
            "Đợt thực hiện (dùng để nhóm và xuất đúng dữ liệu)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "INS06.03",
          "title": "Xuất template",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Khi hoàn tất nghiệp vụ và đủ chứng từ",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Xuất kết quả thực hiện ở bước INS06.02 theo mẫu quy định của Cơ quan BH (mẫu 01B-HSB)",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "INS06.04",
          "title": "Cập nhật kết quả duyệt của BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Khi có thông tin duyệt của Cơ quan Bảo hiểm",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Sau khi có kết quả duyệt của Cơ quan bảo hiểm, HRM-Bảo hiểm cập nhật lại kết quả vào chương trình để đối sánh với kết qủa đề xuất trước đó.\n\nThông tin cần cập nhật trực tiếp gồm:\n\nGửi mail thông báo đến Nhân viên",
          "fieldsChecklist": [
            "Ngày nghỉ được duyệt tính hưởng",
            "Mức lương tính hưởng",
            "Giá trị hưởng"
          ],
          "sourceRow": 4
        },
        {
          "stepCode": "INS06.05",
          "title": "Truy vấn thông tin",
          "actor": "NV",
          "location": "Portal",
          "timing": "Khi HRM-Bảo hiểm gửi mail",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên có thể truy vấn được thông tin chế độ bảo hiểm được duyệt của họ\n\nCác thông tin có thể truy vấn gồm:",
          "fieldsChecklist": [
            "Loại chế độ trợ cấp bảo hiểm",
            "Thâm niên tham gia bảo hiểm (yyyy và mm)",
            "Số ngày nghỉ tính từ đầu năm đến nay",
            "Số ngày nghỉ được Cơ quan BH duyệt",
            "Số ngày nghỉ còn lại trong định mức",
            "Số tiền thanh toán được duyệt"
          ],
          "sourceRow": 5
        }
      ],
      "notes": [],
      "sourceNote": "Bảng nguồn không có dòng bước INS06.02; giao diện giữ nguyên khoảng trống này."
    },
    {
      "sopCode": "SOP-INS-07",
      "sopTitle": "Quy trình giải quyết chế độ lao động và bệnh nghề nghiệp",
      "sopCategory": "Phân hệ Bảo hiểm",
      "description": "",
      "steps": [
        {
          "stepCode": "INS07.01",
          "title": "Cập nhật biên bản giám định thương tật và tính mức hưởng",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Khi có biên bản giám định của Hội đồng Giám định Y khoa",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Sau khi có kết quả giám định thương tật từ Hội đồng Giám định Y. khoa, HRM-Bảo hiểm cập nhật kết quả giám định vào màn hình Giải quyết chế độ tai nạn lao động và bệnh nghề nghiệp\n\nCác thông tin cập nhật gồm:\n\nLưu ý:\n\nDựa vào (*) và (**) để xác định mức trợ cấp bồi thường của Công ty. Mức lương làm cơ sở tính trợ cấp bồi thường là mức lương và các khoản phụ cấp thể hiện trên HĐLĐ.\n\nGửi mail thông tin đến nhân viên\n\nLưu ý chung:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Chức danh",
            "Chức vụ",
            "Lý do tai nạn",
            "Địa điểm xảy ra tai nạn (check chọn theo:",
            "Trong giờ làm, tại nơi làm việc",
            "Trong giờ làm, ngoài giờ làm việc",
            "Ngoài giờ làm việc, ngoài nơi làm việc",
            "Ngoài giờ làm việc, tại nơi làm việc",
            "Thực hiện công việc khác theo yêu cầu của NSDLD",
            "Trên đường đi và về (trường hợp Tai nạn giao thông được xác định là Tai nạn lao động, khi đó nhập bổ sung các thông tin:",
            "+Số biên bản điều tra tai nạn giao thông/Ngày lập biên bản",
            "+Số biên bản khám nghiệm hiện trường/Ngày lập biên bản.",
            "Loại bệnh nghề nghiệp (drop down từ Danh mục/Loại bệnh nghề nghiệp, chuẩn theo danh mục của Bộ LĐTBXH – Bộ Y tế ban hành)",
            "Ngày bị bênh nghề nghiệp (dd/mm/yyyy)",
            "Bị bệnh nghề nghiệp lần thứ (khai báo)",
            "Kết quả hội chuẩn hoặc giấy khám bệnh (số/ngày cấp/cơ quan cấp, khai báo)",
            "Tỷ lệ thương tật (nhập tỷ lệ %)",
            "Mức độ suy giảm lao động (nhập tỷ lệ %) (*)",
            "Nguyên nhân tai nạn (**) (drop down chọn:",
            "Do lỗi của NSDLD",
            "Do lỗi của NLD",
            "Mức trợ cấp của Công ty (theo luật Lao động), nếu:",
            "Do lỗi NSDLD và Mức độ suy giảm lao động (***):",
            "# Từ 5% - 10%: 1.5 tháng lương",
            "# Từ 11% - 80%: mỗi 1% tăng thêm được bồi thường thêm 0.4 tháng lương",
            "# Trên 81%: 30 tháng tiền lương",
            "Do lỗi NLD: 30% của mục (***)",
            "Ngày thực hiện nghiệp vụ (load default theo ngày của Windows)",
            "Kỳ thanh toán (dùng để HRM-C&B lấy thông tin sang phân hệ PAY để thanh toán cho NLD)",
            "Chương trình không tính mức trợ cấp của Cơ quan bảo hiểm mà chỉ in form mẫu 05-HBS gửi cho Cơ quan Bảo hiểm."
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "INS07.02",
          "title": "In chứng từ gửi Cơ quan BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Khi có biên bản giám định của Hội đồng Giám định Y khoa và sau khi hoàn bước INS07.01",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Mẫu 05-HBS được in từ chương trình gửi cho Cơ quan Bảo hiểm",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "INS07.03",
          "title": "Truy vấn thông tin chế độ hưởng",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi hoàn tất bước INS07.01",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên chủ động truy vấn thông tin của bước INS07.01 trên portal của họ",
          "fieldsChecklist": [],
          "sourceRow": 4
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-INS-08",
      "sopTitle": "Quy trình giải quyết chế đô tử tuất",
      "sopCategory": "Phân hệ Bảo hiểm",
      "description": "",
      "steps": [
        {
          "stepCode": "INS08.01",
          "title": "Cập nhật danh sách nhân viên tử tuất hưởng chế độ tử tuất",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Khi có Giấy chứng tử/Giấy báo tử/Giấy tờ của Toà án xác nhận",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Nhân viên tử tuất được cập nhật ở màn hình Giải quyết chế độ tử tuất.\n\nCác thông tin tại màn hình này gồm:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Phòng ban",
            "Chức danh",
            "Chức vụ",
            "Thâm niên tham gia bảo hiểm",
            "Ngày mất (khai báo)",
            "Thông tin người thân (check mode Từ hồ sơ nhân viên)",
            "Họ tên người nhận trợ cấp mai táng (khai báo)",
            "Họ tên người nhận trợ cấp một lần (khai báo)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "INS08.02",
          "title": "In hồ sơ gửi Cơ quan BH",
          "actor": "HRM-Bảo hiểm",
          "location": "Bên trong",
          "timing": "Khi hoàn tất bước INS08.01",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Mẫu 09A-HSB được in từ chương trình gửi đến Cơ quan Bảo hiểm",
          "fieldsChecklist": [],
          "sourceRow": 3
        }
      ],
      "notes": []
    }
  ],
  "MODULE-TAX": [
    {
      "sopCode": "SOP-TAX-01",
      "sopTitle": "Quy trình quản lý hồ sơ thuế TNCN",
      "sopCategory": "Phân hệ Thuế",
      "description": "",
      "steps": [
        {
          "stepCode": "TAX01.01",
          "title": "Gán đối tượng thuế TNCN",
          "actor": "HRM-Nhân sự",
          "location": "Profile nhân viên",
          "timing": "Nhập profile nhân viên hoặc khi thay đổi HĐLĐ",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Đối tượng thuế TNCN sẽ đi cùng với Hình thức làm việc (thử việc, cộng tác viên, chính thức).\n\nKhi nhập profile nhân viên đầu vào đã khai báo Hình thức làm việc, khi đó Đối tượng thuế TNCN sẽ auto.\n\nHợp đồng lao động thay đổi Hình thức làm việc thay đổi Đối tượng thuế TNCN thay đổi.",
          "fieldsChecklist": [],
          "sourceRow": 2
        },
        {
          "stepCode": "TAX01.02",
          "title": "Gán/Bổ sung thông tin người phụ thuộc",
          "actor": "HRM-C&B",
          "location": "Thông tin giảm trừ ở màn hình profile nhân viên",
          "timing": "Khi nhập nhân viên mới hoặc khi nhân viên bổ sung",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Người phụ thuộc được gán khi nhập profile nhân viên.\n\nTrong quá trình làm việc, nếu có phát sinh người phụ thuộc sẽ được cập nhật.\n\nCác thông tin cập nhật ở màn hình Thông tin người phụ thuộc gồn:",
          "fieldsChecklist": [
            "Mã nhân viên",
            "Tên nhân viên",
            "Chức danh",
            "Chức vụ",
            "Phòng ban",
            "Tên người phụ thuộc",
            "Mối quan hệ người phụ thuộc với nhân viên (drop down chọn từ Danh mục/Mối quan hệ)",
            "Số CMND/CCCD",
            "Ngày cấp CMND/CCCD",
            "Nơi cấp CMND/CCCD",
            "Số giấy khai sinh",
            "Mã số thuế TNCN người phụ thuộc",
            "Giới tính người phụ thuộc",
            "Ngày/Tháng/Năm sinh",
            "Ngày tròn 18 tuổi (nếu mối quan hệ là Con)",
            "Ngày hiệu lực",
            "Ngày hết hiệu lực",
            "Chứng từ đính kèm (check mode theo phân loại và cho đính kèm theo từng phân loại, gồm :",
            "Giấy khai sinh",
            "Sổ hộ khẩu",
            "Giấy đăng ký kết hôn",
            "Giấy xác nhận đang theo học ở trường",
            "CMND/CCCD)"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "TAX01.03",
          "title": "Truy vấn thông tin",
          "actor": "NV",
          "location": "Portal",
          "timing": "Sau khi thông tin được cập nhật trong profile",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên chủ động xem thông tin người phụ thuộc của họ.\n\nCác thông tin truy vấn gồm:",
          "fieldsChecklist": [
            "Tên người phụ thuộc",
            "Mối quan hệ người phụ thuộc với nhân viên (drop down chọn từ Danh mục/Mối quan hệ)",
            "Số CMND/CCCD",
            "Ngày cấp CMND/CCCD",
            "Nơi cấp CMND/CCCD",
            "Số giấy khai sinh",
            "Mã số thuế TNCN người phụ thuộc",
            "Giới tính người phụ thuộc",
            "Ngày/Tháng/Năm sinh",
            "Ngày tròn 18 tuổi (nếu mối quan hệ là Con)",
            "Ngày hiệu lực",
            "Ngày hết hiệu lực",
            "Chứng từ đính kèm (check mode theo phân loại và cho đính kèm theo từng phân loại, gồm :",
            "Giấy khai sinh",
            "Sổ hộ khẩu",
            "Giấy đăng ký kết hôn",
            "Giấy xác nhận đang theo học ở trường",
            "CMND/CCCD)"
          ],
          "sourceRow": 4
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-TAX-02",
      "sopTitle": "Quy trình kê khai tạm nộp thuế TNCN",
      "sopCategory": "Phân hệ Thuế",
      "description": "",
      "steps": [
        {
          "stepCode": "TAX02.01",
          "title": "Danh sách nhân viên kê khai tạm nộp thuế",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Hàng tháng hoặc hàng quý và sau khi khoá kỳ tính lương",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên có mặt trong danh sách này là nhân viên có gắn Đối tượng thuế và có xuất hiện trong bảng lương tháng.\n\nThông tin chọn tại màn hình này:\n\nLưu ý:\n\n+ Nếu kê khai tạm nộp theo tháng thì Tháng áp dụng từ sẽ trùng với Tháng áp dụng đến\n\n+ Nếu kê khai tạm nộp theo quý thì khi chọn Tháng áp dụng từ sẽ tự động sinh ra Tháng áp dụng đến",
          "fieldsChecklist": [
            "Check mode Tờ khai tháng hoặc Tờ khai quý",
            "Tháng áp dụng từ (dd/mm/yyyy)",
            "Tháng áp dụng đến (dd/mm/yyyy)",
            "Loại đối tượng thuế TNCN (drop down, để chọn đúng mẫu Kê khai theo từng đối tượng)"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "TAX02.02",
          "title": "Xuất file 05KK-TNCN",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Tại thời điểm kê khai nộp thuế",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Người dùng chọn “Xuất file” hoặc “Xuất Báo cáo” để xuất thông tin theo đúng nội dung quy định của mẫu 05KK-TNCN hiện hành",
          "fieldsChecklist": [],
          "sourceRow": 3
        },
        {
          "stepCode": "TAX02.03",
          "title": "Truy vấn thông tin",
          "actor": "NV",
          "location": "Portal",
          "timing": "Kết thúc kỳ tính lương và theo thời gian kê khai tạm nộp thuế",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Nhân viên chủ động xem thông tin số liệu thuế TNCN tạm nộp trong tháng/quý của họ",
          "fieldsChecklist": [],
          "sourceRow": 4
        }
      ],
      "notes": []
    },
    {
      "sopCode": "SOP-TAX-03",
      "sopTitle": "Quy trình quyết toán thuế TNCN",
      "sopCategory": "Phân hệ Thuế",
      "description": "",
      "steps": [
        {
          "stepCode": "TAX03.01",
          "title": "Thống kê thông tin quyết toán trên bảng kê 05-1BK-QTT-TNCN hoặc 05-2BK-QTT-TNCN",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi quyết toán thuế",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Dùng tổng hợp số liệu phát sinh trong niên độ thuế. Số liệu gồm:\n\nLưu ý:\n\nKhi thực hiện quyết toán cần:\n\nXuất thông tin theo template 05-1BK-QTT-TNCN hoặc 05-2BK-QTT-TNCN",
          "fieldsChecklist": [
            "Tổng thu nhập chịu thế trong năm",
            "Số lượng NPT tính giảm trừ",
            "Tổng giảm trừ gia cảnh trong năm (bao gồm tổng giảm trừ bản thân và Tổng giảm trừ phụ thuộc)",
            "Tổng giảm trừ do đóng góp cho Từ thiện/Nhân đạo/Khuyến học trong năm",
            "Tổng giảm trừ do trích nộp Bảo hiểm trong năm (BHXH/BHYT/BHTN)",
            "Tổng Thu nhập tính thuế trong năm (= Tổng thu nhập chịu thuế trong năm – Tổng các khoảng giảm trừ trong năm)",
            "Thu nhập tính thuế bình quân tháng (chương trình auto tính, = Tổng thu nhập tính thuế trong năm/12)",
            "Tổng số thuế TNCN đã khấu trừ (luỹ kế số thuế TNCN đã trích nộp hàng tháng/quý)",
            "Chọn vùng thời gian để quyết toán, nếu chọn Thời gian từ và Thời gian đến thì số liệu ở trên sẽ tự thay đổi theo vùng thời gian đã chọn",
            "Chọn mẫu bảng kê (05BK-1 hoặc 05BK-2)",
            "Chọn bộ phận/nhân viên để quyết toán",
            "Check Chọn hoặc Không chọn quyết toán cho Nhân viên đã nghỉ việc",
            "Check Chọn hoặc Không chọn quyết toán cho Nhân viên tự quyết toán"
          ],
          "sourceRow": 2
        },
        {
          "stepCode": "TAX03.02",
          "title": "Thống kê thông tin người phụ thuộc trên bảng kê 05-3BK-QTT-TNCN",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi quyết toán thuế",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Tổng hợp danh sách thông tin người phụ thuộc của một nhân viên\n\nCác thông tin tổng hơp gồm:\n\nXuất thông tin theo template 05-3BK-QTT-TNCN",
          "fieldsChecklist": [
            "Họ và tên nhân viên",
            "Mã số thuế TNCN của nhân viên",
            "Họ và tên người phụ thuộc (lấy từ profile nhân viên)",
            "Mã số thuế TNCN của người phụ thuộc (lấy từ profile nhân viên)",
            "Quan hệ với nhân viên (lấy từ profile nhân viên)",
            "Thời gian tính giảm trừ từ tháng (lấy từ profile nhân viên)",
            "Thời gian tính giảm trừ đến tháng (lấy từ profile nhân viên)"
          ],
          "sourceRow": 3
        },
        {
          "stepCode": "TAX03.03",
          "title": "Xuất thông tin theo template 05/QTT-TNCN",
          "actor": "HRM-C&B",
          "location": "Bên trong",
          "timing": "Khi quyết toán",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Tập hợp các thông tin của bước TAX03.01 và TAX03.02 để xuất template 05/QTT-TNCN",
          "fieldsChecklist": [],
          "sourceRow": 4
        }
      ],
      "notes": []
    }
  ],
  "MODULE-MD-FUNCTIONS": [
    {
      "sopCode": "MD-01",
      "sopTitle": "Thêm mới giá trị danh mục",
      "sopCategory": "Chức năng quản lý danh mục",
      "description": "",
      "inputs": [
        "Tên danh mục cha, mã giá trị, tên giá trị, mô tả, thứ tự hiển thị, trạng thái (Hoạt động/Ngừng)."
      ],
      "outputs": [
        "Giá trị danh mục mới được thêm vào, sẵn sàng sử dụng trong các danh sách chọn (dropdown) liên quan; ghi log audit trail."
      ],
      "rules": [
        "Mã giá trị không được trùng trong phạm vi cùng một danh mục cha; tên giá trị bắt buộc nhập; định dạng mã kiểm tra theo quy ước riêng của từng loại danh mục (ví dụ: mã phòng ban tối đa 10 ký tự chữ-số); giá trị mới mặc định ở trạng thái Hoạt động."
      ],
      "steps": [
        {
          "stepCode": "MD-01",
          "title": "Thêm mới giá trị danh mục",
          "actor": "HR Admin / Quản trị hệ thống",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Mã giá trị không được trùng trong phạm vi cùng một danh mục cha; tên giá trị bắt buộc nhập; định dạng mã kiểm tra theo quy ước riêng của từng loại danh mục (ví dụ: mã phòng ban tối đa 10 ký tự chữ-số); giá trị mới mặc định ở trạng thái Hoạt động.",
          "fieldsChecklist": [],
          "sourceRow": 9
        }
      ]
    },
    {
      "sopCode": "MD-02",
      "sopTitle": "Cập nhật giá trị danh mục",
      "sopCategory": "Chức năng quản lý danh mục",
      "description": "",
      "inputs": [
        "Giá trị danh mục cần sửa, nội dung thay đổi (tên, mô tả, thứ tự)."
      ],
      "outputs": [
        "Giá trị danh mục được cập nhật; các màn hình đang tham chiếu hiển thị tên mới ngay lập tức."
      ],
      "rules": [
        "Không cho phép đổi mã giá trị đã được dữ liệu nghiệp vụ tham chiếu; hệ thống kiểm tra và cảnh báo số lượng bản ghi đang sử dụng giá trị trước khi cho phép sửa; lưu lịch sử thay đổi (giá trị trước/sau)."
      ],
      "steps": [
        {
          "stepCode": "MD-02",
          "title": "Cập nhật giá trị danh mục",
          "actor": "HR Admin / Quản trị hệ thống",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Không cho phép đổi mã giá trị đã được dữ liệu nghiệp vụ tham chiếu; hệ thống kiểm tra và cảnh báo số lượng bản ghi đang sử dụng giá trị trước khi cho phép sửa; lưu lịch sử thay đổi (giá trị trước/sau).",
          "fieldsChecklist": [],
          "sourceRow": 10
        }
      ]
    },
    {
      "sopCode": "MD-03",
      "sopTitle": "Khóa/kích hoạt giá trị danh mục",
      "sopCategory": "Chức năng quản lý danh mục",
      "description": "",
      "inputs": [
        "Giá trị danh mục, trạng thái mới (Khóa/Kích hoạt), lý do (tùy chọn)."
      ],
      "outputs": [
        "Trạng thái hoạt động/ngừng của danh mục được cập nhật và áp dụng ngay cho toàn hệ thống."
      ],
      "rules": [
        "Giá trị đã khóa sẽ không còn hiển thị trong danh sách chọn khi tạo hồ sơ/giao dịch mới, nhưng vẫn hiển thị đầy đủ trên các hồ sơ đã sử dụng giá trị đó trước khi khóa (bảo toàn dữ liệu lịch sử theo BR-03)."
      ],
      "steps": [
        {
          "stepCode": "MD-03",
          "title": "Khóa/kích hoạt giá trị danh mục",
          "actor": "HR Admin / Quản trị hệ thống",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Giá trị đã khóa sẽ không còn hiển thị trong danh sách chọn khi tạo hồ sơ/giao dịch mới, nhưng vẫn hiển thị đầy đủ trên các hồ sơ đã sử dụng giá trị đó trước khi khóa (bảo toàn dữ liệu lịch sử theo BR-03).",
          "fieldsChecklist": [],
          "sourceRow": 11
        }
      ]
    },
    {
      "sopCode": "MD-04",
      "sopTitle": "Quản lý địa giới hành chính 3 cấp",
      "sopCategory": "Chức năng quản lý danh mục",
      "description": "",
      "inputs": [
        "Tỉnh/Thành phố (mã, tên tiếng Việt/Anh, mã BHXH, mã cơ quan Thuế), Quận/Huyện (mã, tên, tỉnh cha), Phường/Xã (mã, tên, huyện cha)."
      ],
      "outputs": [
        "Danh mục địa giới hành chính chuẩn hóa 3 cấp, dùng chung cho khai báo địa chỉ thường trú/tạm trú, nơi cấp CCCD, nơi cấp giấy khai sinh."
      ],
      "rules": [
        "Quan hệ cha-con bắt buộc nhất quán theo 3 cấp Tỉnh/Thành phố → Quận/Huyện → Phường/Xã; không cho phép chọn Phường/Xã không thuộc Quận/Huyện đã chọn, hoặc Quận/Huyện không thuộc Tỉnh/Thành phố đã chọn (kiểm tra ràng buộc tại mọi màn hình nhập địa chỉ G02)."
      ],
      "steps": [
        {
          "stepCode": "MD-04",
          "title": "Quản lý địa giới hành chính 3 cấp",
          "actor": "HR Admin / Quản trị hệ thống",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Quan hệ cha-con bắt buộc nhất quán theo 3 cấp Tỉnh/Thành phố → Quận/Huyện → Phường/Xã; không cho phép chọn Phường/Xã không thuộc Quận/Huyện đã chọn, hoặc Quận/Huyện không thuộc Tỉnh/Thành phố đã chọn (kiểm tra ràng buộc tại mọi màn hình nhập địa chỉ G02).",
          "fieldsChecklist": [],
          "sourceRow": 12
        }
      ]
    },
    {
      "sopCode": "MD-05",
      "sopTitle": "Quản lý cơ cấu tổ chức (Org Tree)",
      "sopCategory": "Chức năng quản lý danh mục",
      "description": "",
      "inputs": [
        "Tên đơn vị/phòng ban, mã đơn vị, đơn vị cấp trên trực tiếp, người phụ trách, cost center, ngày hiệu lực/hết hiệu lực."
      ],
      "outputs": [
        "Sơ đồ/cây cơ cấu tổ chức hiện hành (Org Tree) dùng làm nền cho bố trí vị trí công tác, thiết lập định biên (CD-17) và phân quyền theo đơn vị (SYS-01)."
      ],
      "rules": [
        "Cây tổ chức phải là cấu trúc phân cấp không được phép tạo vòng lặp (đơn vị con không được là cha của chính đơn vị cha nó); đơn vị đã khóa/ngừng hoạt động không được chọn khi bố trí vị trí công tác mới (CD-07) nhưng vẫn giữ nguyên trên lịch sử công tác đã có; hỗ trợ tách/nhập/đổi tên đơn vị và lưu vết lịch sử biến động."
      ],
      "steps": [
        {
          "stepCode": "MD-05",
          "title": "Quản lý cơ cấu tổ chức (Org Tree)",
          "actor": "HR Admin / Quản trị hệ thống",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Cây tổ chức phải là cấu trúc phân cấp không được phép tạo vòng lặp (đơn vị con không được là cha của chính đơn vị cha nó); đơn vị đã khóa/ngừng hoạt động không được chọn khi bố trí vị trí công tác mới (CD-07) nhưng vẫn giữ nguyên trên lịch sử công tác đã có; hỗ trợ tách/nhập/đổi tên đơn vị và lưu vết lịch sử biến động.",
          "fieldsChecklist": [],
          "sourceRow": 13
        }
      ]
    },
    {
      "sopCode": "MD-06",
      "sopTitle": "Quản lý chức vụ / chức danh / cấp bậc (Level)",
      "sopCategory": "Chức năng quản lý danh mục",
      "description": "",
      "inputs": [
        "Tên chức vụ (Job Position), tên chức danh (Job Title), cấp bậc/level, mô tả công việc (JD) đính kèm, nhóm ngạch lương liên kết."
      ],
      "outputs": [
        "Danh mục chức vụ/chức danh/level dùng cho bố trí vị trí công tác (CD-07), thiết lập định biên (CD-17) và thang bảng lương 3P (MD-07)."
      ],
      "rules": [
        "Mỗi chức vụ phải gắn với đúng một level và bản mô tả công việc tương ứng; chức danh liên kết với cost center và tiêu chuẩn công việc để tự động tải khi bố trí vị trí (CD-07)."
      ],
      "steps": [
        {
          "stepCode": "MD-06",
          "title": "Quản lý chức vụ / chức danh / cấp bậc (Level)",
          "actor": "HR Admin / Quản trị hệ thống",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Mỗi chức vụ phải gắn với đúng một level và bản mô tả công việc tương ứng; chức danh liên kết với cost center và tiêu chuẩn công việc để tự động tải khi bố trí vị trí (CD-07).",
          "fieldsChecklist": [],
          "sourceRow": 14
        }
      ]
    },
    {
      "sopCode": "MD-07",
      "sopTitle": "Thang bảng lương 3P",
      "sopCategory": "Chức năng quản lý danh mục",
      "description": "",
      "inputs": [
        "Tên thang lương, bậc lương, mức lương tương ứng theo Vị trí (Position) - Năng lực (Person) - Hiệu quả (Performance), ngày hiệu lực."
      ],
      "outputs": [
        "Bảng thang/bậc lương 3P dùng làm cơ sở khi thiết lập và điều chỉnh lương nhân viên (CD-09)."
      ],
      "rules": [
        "Mỗi bậc lương phải thuộc về đúng một thang lương; giá trị mức lương không âm; không cho phép hai khoảng hiệu lực chồng lấn nhau trên cùng một thang/bậc; thang bảng lương phải được rà soát khi lương tối thiểu vùng thay đổi (liên kết BR nghiệp vụ rà soát tháng 12 hằng năm, xem CD-09)."
      ],
      "steps": [
        {
          "stepCode": "MD-07",
          "title": "Thang bảng lương 3P",
          "actor": "Chuyên viên C&B",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Mỗi bậc lương phải thuộc về đúng một thang lương; giá trị mức lương không âm; không cho phép hai khoảng hiệu lực chồng lấn nhau trên cùng một thang/bậc; thang bảng lương phải được rà soát khi lương tối thiểu vùng thay đổi (liên kết BR nghiệp vụ rà soát tháng 12 hằng năm, xem CD-09).",
          "fieldsChecklist": [],
          "sourceRow": 15
        }
      ]
    },
    {
      "sopCode": "MD-08",
      "sopTitle": "Ca làm việc & Loại nghỉ",
      "sopCategory": "Chức năng quản lý danh mục",
      "description": "",
      "inputs": [
        "Tên ca làm việc, giờ vào/ra, thời gian nghỉ giữa ca, tên loại nghỉ phép, số ngày phép quy định theo loại, có/không trừ lương."
      ],
      "outputs": [
        "Danh mục ca làm việc và loại nghỉ phép dùng cho ghi nhận chấm công (CD-13) và tạo đơn nghỉ phép (CD-14) tại phân hệ Chấm công (ATT)."
      ],
      "rules": [
        "Giờ vào phải nhỏ hơn giờ ra (có hỗ trợ ca đêm qua ngày); mỗi loại nghỉ phép cấu hình rõ có trừ vào số dư phép năm hay không, có cần chứng từ đính kèm hay không (ví dụ nghỉ ốm/thai sản bắt buộc chứng từ)."
      ],
      "steps": [
        {
          "stepCode": "MD-08",
          "title": "Ca làm việc & Loại nghỉ",
          "actor": "HR Admin / Chuyên viên C&B",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Giờ vào phải nhỏ hơn giờ ra (có hỗ trợ ca đêm qua ngày); mỗi loại nghỉ phép cấu hình rõ có trừ vào số dư phép năm hay không, có cần chứng từ đính kèm hay không (ví dụ nghỉ ốm/thai sản bắt buộc chứng từ).",
          "fieldsChecklist": [],
          "sourceRow": 16
        }
      ]
    },
    {
      "sopCode": "MD-09",
      "sopTitle": "Khai báo nơi khám chữa bệnh (KCB) & Đối tượng tham gia BHXH",
      "sopCategory": "Chức năng quản lý danh mục",
      "description": "",
      "inputs": [
        "Tên/mã cơ sở khám chữa bệnh ban đầu, địa chỉ, tuyến, danh mục đối tượng tham gia BHXH/BHYT/BHTN."
      ],
      "outputs": [
        "Danh mục dùng khi khai báo bảo hiểm nhân viên (CD-10) và đồng bộ sang phân hệ Bảo hiểm (INS)."
      ],
      "rules": [
        "Cơ sở khám chữa bệnh phải đang hoạt động theo danh sách công bố của cơ quan BHXH; đối tượng tham gia bảo hiểm được phân loại theo quy định pháp luật hiện hành (người Việt Nam, người nước ngoài, đối tượng đặc thù)."
      ],
      "steps": [
        {
          "stepCode": "MD-09",
          "title": "Khai báo nơi khám chữa bệnh (KCB) & Đối tượng tham gia BHXH",
          "actor": "Chuyên viên bảo hiểm",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Cơ sở khám chữa bệnh phải đang hoạt động theo danh sách công bố của cơ quan BHXH; đối tượng tham gia bảo hiểm được phân loại theo quy định pháp luật hiện hành (người Việt Nam, người nước ngoài, đối tượng đặc thù).",
          "fieldsChecklist": [],
          "sourceRow": 17
        }
      ]
    },
    {
      "sopCode": "MD-10",
      "sopTitle": "Danh mục Kỷ luật",
      "sopCategory": "Chức năng quản lý danh mục",
      "description": "",
      "inputs": [
        "Loại/nhóm hành vi vi phạm, mức độ vi phạm, hình thức kỷ luật tương ứng (khiển trách, cảnh cáo, hạ bậc lương, cách chức, sa thải), thời hạn hiệu lực kỷ luật."
      ],
      "outputs": [
        "Danh mục dùng khi lập hồ sơ kỷ luật (CD-15)."
      ],
      "rules": [
        "Mỗi nhóm hành vi vi phạm được gợi ý sẵn hình thức kỷ luật phù hợp mức độ theo quy định nội bộ và Bộ luật Lao động, nhưng người dùng có thẩm quyền vẫn có thể chọn hình thức khác kèm giải trình."
      ],
      "steps": [
        {
          "stepCode": "MD-10",
          "title": "Danh mục Kỷ luật",
          "actor": "HR Admin",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Mỗi nhóm hành vi vi phạm được gợi ý sẵn hình thức kỷ luật phù hợp mức độ theo quy định nội bộ và Bộ luật Lao động, nhưng người dùng có thẩm quyền vẫn có thể chọn hình thức khác kèm giải trình.",
          "fieldsChecklist": [],
          "sourceRow": 18
        }
      ]
    }
  ],
  "MODULE-MD": [
    {
      "sopCode": "MD-CAT-01",
      "sopTitle": "Tỉnh/Thành phố",
      "sopCategory": "Danh mục dùng chung",
      "description": "Danh sách tỉnh, thành phố thuộc Việt Nam.\n\nCác trường dữ liệu khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.01",
          "title": "Tỉnh/Thành phố",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Danh sách tỉnh, thành phố thuộc Việt Nam.\n\nCác trường dữ liệu khai báo gồm:",
          "fieldsChecklist": [
            "Mã Tỉnh/Thành phố",
            "Mã Tỉnh/Thành phố theo BHXH",
            "Mã Tỉnh/Thành phố theo cơ quan Thuế",
            "Tên Tỉnh/Thành phố (tiếng Việt)",
            "Tên Tỉnh/Thành phố (Tiếng Anh)"
          ],
          "sourceRow": 2
        }
      ]
    },
    {
      "sopCode": "MD-CAT-02",
      "sopTitle": "Quận/Huyện",
      "sopCategory": "Danh mục dùng chung",
      "description": "Danh sách Quận/Huyện đi theo tỉnh thành thuộc Việt Nam\n\nCác trường dữ liệu khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.02",
          "title": "Quận/Huyện",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Danh sách Quận/Huyện đi theo tỉnh thành thuộc Việt Nam\n\nCác trường dữ liệu khai báo gồm:",
          "fieldsChecklist": [
            "Mã Quận/Huyện",
            "Tên Quận/Huyện (tiếng Việt)",
            "Tên Quận/Huyện (tiếng Anh)",
            "Tỉnh/Thành phố"
          ],
          "sourceRow": 3
        }
      ]
    },
    {
      "sopCode": "MD-CAT-03",
      "sopTitle": "Phường/Xã",
      "sopCategory": "Danh mục dùng chung",
      "description": "Danh sách phường xã đi theo quận huyện thuộc Việt Nam.\n\nCác trường dữ liệu khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.03",
          "title": "Phường/Xã",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Danh sách phường xã đi theo quận huyện thuộc Việt Nam.\n\nCác trường dữ liệu khai báo gồm:",
          "fieldsChecklist": [
            "Mã Phường/Xã",
            "Tên Phường/Xã (tiếng Việt)",
            "Tên Phường/Xã (tiếng Anh)",
            "Tỉnh/Thành phố",
            "Quận/Huyện"
          ],
          "sourceRow": 4
        }
      ]
    },
    {
      "sopCode": "MD-CAT-04",
      "sopTitle": "Dân tộc",
      "sopCategory": "Danh mục dùng chung",
      "description": "Toàn bộ dân tộc trên lãnh thổ Việt Nam\n\nCác trường dữ liệu khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.04",
          "title": "Dân tộc",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Toàn bộ dân tộc trên lãnh thổ Việt Nam\n\nCác trường dữ liệu khai báo gồm:",
          "fieldsChecklist": [
            "Mã dân tộc",
            "Tên dân tộc",
            "Giá trị mặc định (check mode, dùng load default khi nhập profile nhân viên)"
          ],
          "sourceRow": 5
        }
      ]
    },
    {
      "sopCode": "MD-CAT-05",
      "sopTitle": "Tôn giáo",
      "sopCategory": "Danh mục dùng chung",
      "description": "Danh sách tôn giáo\n\nCác trường dữ liệu khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.05",
          "title": "Tôn giáo",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Danh sách tôn giáo\n\nCác trường dữ liệu khai báo gồm:",
          "fieldsChecklist": [
            "Mã tôn giáo",
            "Tên tôn giáo",
            "Giá trị mặc định (check mode, dùng load default khi nhập profile nhân viên)"
          ],
          "sourceRow": 6
        }
      ]
    },
    {
      "sopCode": "MD-CAT-06",
      "sopTitle": "Quốc tịch",
      "sopCategory": "Danh mục dùng chung",
      "description": "Mặc định là Việt Nam (có thể chọn quốc tịch khác)\n\nCác trường dữ liệu khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.06",
          "title": "Quốc tịch",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Mặc định là Việt Nam (có thể chọn quốc tịch khác)\n\nCác trường dữ liệu khai báo gồm:",
          "fieldsChecklist": [
            "Mã Quốc gia",
            "Tên Quốc gia",
            "Giá trị mặc định (check mode, dùng load default khi nhập profile nhân viên)"
          ],
          "sourceRow": 7
        }
      ]
    },
    {
      "sopCode": "MD-CAT-07",
      "sopTitle": "Tiền tệ",
      "sopCategory": "Danh mục dùng chung",
      "description": "Danh mục các loại tiền.\n\nCác trường dữ liệu khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.07",
          "title": "Tiền tệ",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Danh mục các loại tiền.\n\nCác trường dữ liệu khai báo gồm:",
          "fieldsChecklist": [
            "Mã tiền tệ",
            "Tên tiền tệ",
            "Số thập phận quy định",
            "Giá trị mặc định (check mode, dùng load default khi nhập profile nhân viên)"
          ],
          "sourceRow": 8
        }
      ]
    },
    {
      "sopCode": "MD-CAT-08",
      "sopTitle": "Trình độ văn hóa",
      "sopCategory": "Danh mục dùng chung",
      "description": "Trình độ từ 1/12 đến 12/12\n\nCác trường thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.08",
          "title": "Trình độ văn hóa",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Trình độ từ 1/12 đến 12/12\n\nCác trường thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã trình độ văn hoá",
            "Tên trình độ văn hoá"
          ],
          "sourceRow": 9
        }
      ]
    },
    {
      "sopCode": "MD-CAT-09",
      "sopTitle": "Trình độ học vấn",
      "sopCategory": "Danh mục dùng chung",
      "description": "Trình độ từ Tiểu học/Trung học cơ sở/Trung học phổ thông/Trung cấp/Cao đẵng/Đại học/Thạc sĩ/Tiến sĩ/Phó Giá sư/Giáo sư\n\nCác trường thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.09",
          "title": "Trình độ học vấn",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Trình độ từ Tiểu học/Trung học cơ sở/Trung học phổ thông/Trung cấp/Cao đẵng/Đại học/Thạc sĩ/Tiến sĩ/Phó Giá sư/Giáo sư\n\nCác trường thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã trình độ học vấn",
            "Tên trình độ học vấn"
          ],
          "sourceRow": 10
        }
      ]
    },
    {
      "sopCode": "MD-CAT-10",
      "sopTitle": "Loại quan hệ",
      "sopCategory": "Danh mục dùng chung",
      "description": "Theo danh sách mối quan hệ giữa các thành viên trong gia đình với nhân viên.\n\nCác loại quan hệ gồm:\n\nCác trường dữ liệu khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.10",
          "title": "Loại quan hệ",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Theo danh sách mối quan hệ giữa các thành viên trong gia đình với nhân viên.\n\nCác loại quan hệ gồm:\n\nCác trường dữ liệu khai báo gồm:",
          "fieldsChecklist": [
            "Con",
            "Ba",
            "Mẹ",
            "Vợ",
            "Chồng",
            "Con rễ",
            "Con dâu",
            "Mợ",
            "Cậu",
            "Bác",
            "Thím",
            "Chú",
            "Dì",
            "Cô",
            "Bà nội",
            "Bà ngoại",
            "Ông nội",
            "Ông ngoại",
            "Cháu",
            "Chị",
            "Anh",
            "Em",
            "Ba chồng",
            "Mẹ chồng",
            "Ba vợ",
            "Mẹ vợ",
            "Mã quan hệ",
            "Loại quan hệ",
            "Số thứ tự hiển thị"
          ],
          "sourceRow": 11
        }
      ]
    },
    {
      "sopCode": "MD-CAT-11",
      "sopTitle": "Cấp độ tin học",
      "sopCategory": "Danh mục dùng chung",
      "description": "Danh mục phân cấp trình độ tin học (Cao cấp/Trung cấp/Sơ cấp)\n\nThông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.11",
          "title": "Cấp độ tin học",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Danh mục phân cấp trình độ tin học (Cao cấp/Trung cấp/Sơ cấp)\n\nThông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã cấp độ tin học",
            "Tên cấp độ tin học"
          ],
          "sourceRow": 12
        }
      ]
    },
    {
      "sopCode": "MD-CAT-12",
      "sopTitle": "Trình độ tin học",
      "sopCategory": "Danh mục dùng chung",
      "description": "Danh mục trình độ tin học (Tin học A, Tin học B,…)\n\nThông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.12",
          "title": "Trình độ tin học",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Danh mục trình độ tin học (Tin học A, Tin học B,…)\n\nThông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã trình độ tin học",
            "Tên trình độ tin học"
          ],
          "sourceRow": 13
        }
      ]
    },
    {
      "sopCode": "MD-CAT-13",
      "sopTitle": "Cấp bậc kỹ năng ngoại ngữ",
      "sopCategory": "Danh mục dùng chung",
      "description": "Danh mục phân cấp trình độ ngoại ngữ (Starer/ Pre-Intermediate/ Intermediate/ Advance)\n\nThông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.13",
          "title": "Cấp bậc kỹ năng ngoại ngữ",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Danh mục phân cấp trình độ ngoại ngữ (Starer/ Pre-Intermediate/ Intermediate/ Advance)\n\nThông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã cấp bậc ngoại ngữ",
            "Tên cấp bậc ngoại ngữ"
          ],
          "sourceRow": 14
        }
      ]
    },
    {
      "sopCode": "MD-CAT-14",
      "sopTitle": "Trình độ ngoại ngữ",
      "sopCategory": "Danh mục dùng chung",
      "description": "Danh mục trình độ ngoại ngữ\n\nThông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.14",
          "title": "Trình độ ngoại ngữ",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Danh mục trình độ ngoại ngữ\n\nThông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã kỹ năng (Nghe/Nói/Đọc/Viết)",
            "Tên kỹ năng",
            "Cấp bậc kỹ năng"
          ],
          "sourceRow": 15
        }
      ]
    },
    {
      "sopCode": "MD-CAT-15",
      "sopTitle": "Giới tính",
      "sopCategory": "Danh mục dùng chung",
      "description": "Dữ liệu ngầm, gồm:",
      "steps": [
        {
          "stepCode": "MD.15",
          "title": "Giới tính",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Dữ liệu ngầm, gồm:",
          "fieldsChecklist": [
            "Nam",
            "Nữ",
            "Khác"
          ],
          "sourceRow": 16
        }
      ]
    },
    {
      "sopCode": "MD-CAT-16",
      "sopTitle": "Tình trạng hôn nhân",
      "sopCategory": "Danh mục dùng chung",
      "description": "Theo danh sách quy định hiện hành",
      "steps": [
        {
          "stepCode": "MD.16",
          "title": "Tình trạng hôn nhân",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Theo danh sách quy định hiện hành",
          "fieldsChecklist": [],
          "sourceRow": 17
        }
      ]
    },
    {
      "sopCode": "MD-CAT-17",
      "sopTitle": "Hình thức làm việc",
      "sopCategory": "Danh mục dùng chung",
      "description": "Dữ liệu ngầm, gồm:",
      "steps": [
        {
          "stepCode": "MD.17",
          "title": "Hình thức làm việc",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "A",
          "sourceTypeCode": "A",
          "description": "Dữ liệu ngầm, gồm:",
          "fieldsChecklist": [
            "Thời vụ",
            "Chính thức",
            "Thủ việc"
          ],
          "sourceRow": 18
        }
      ]
    },
    {
      "sopCode": "MD-CAT-18",
      "sopTitle": "Loại nghỉ việc",
      "sopCategory": "Danh mục dùng chung",
      "description": "Loại nghỉ việc gồm các dạng sau:\n\nLoại nghỉ việc sử dụng khi nhân viên đăng ký nghỉ việc trên portal hoặc HRM cập nhật kết quả nghỉ việc sau khi thực hiện phỏng vấn nghỉ việc (exit interview).\n\nCác thông tin khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.18",
          "title": "Loại nghỉ việc",
          "actor": "",
          "location": "",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Loại nghỉ việc gồm các dạng sau:\n\nLoại nghỉ việc sử dụng khi nhân viên đăng ký nghỉ việc trên portal hoặc HRM cập nhật kết quả nghỉ việc sau khi thực hiện phỏng vấn nghỉ việc (exit interview).\n\nCác thông tin khai báo gồm:",
          "fieldsChecklist": [
            "Có cơ hội nghề nghiệp khác",
            "Vì các lý do chủ quan",
            "Do chế độ chính sách phúc lợi",
            "Không thích ứng với môi trường làm việc",
            "Áp lực và mệt mỏi trong công việc",
            "Các vấn đề liên quan đến những mối quan hệ trong công việc",
            "Mã loại nghỉ việc",
            "Tên loại nghỉ việc",
            "Nhóm nghỉ việc (Mất/nghỉ hưu/Nghỉ viêc là dữ liệu ngầm)"
          ],
          "sourceRow": 19
        }
      ]
    },
    {
      "sopCode": "MD-CAT-19",
      "sopTitle": "Lý do nghỉ việc",
      "sopCategory": "Danh mục dùng chung",
      "description": "Theo danh sách cung cấp của khách hàng\n\nThông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.19",
          "title": "Lý do nghỉ việc",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Theo danh sách cung cấp của khách hàng\n\nThông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã lý do nghỉ việc",
            "Tên lý do nghỉ việc (tiếng Việt)",
            "Tên lý do nghỉ việc (tiếng Anh)",
            "Loại nghỉ việc (đổ nguồn từ danh mục Loại nghỉ việc)"
          ],
          "sourceRow": 20
        }
      ]
    },
    {
      "sopCode": "MD-CAT-20",
      "sopTitle": "Loại hợp đồng",
      "sopCategory": "Danh mục dùng chung",
      "description": "Theo danh sách cung cấp của khách hàng (Hợp đồng thử việc/Hợp đồng xác định thời hạn 12 tháng/….)\n\nThông tin khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.20",
          "title": "Loại hợp đồng",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Theo danh sách cung cấp của khách hàng (Hợp đồng thử việc/Hợp đồng xác định thời hạn 12 tháng/….)\n\nThông tin khai báo gồm:",
          "fieldsChecklist": [
            "Mã loại hợp đồng lao động",
            "Tên loại hợp đồng lao động",
            "Tên loại hợp đồng theo Luật",
            "Nhóm hợp đồng (Học việc/Thử việc/Xác định thời hạn/Không xác định thời hạn/Cộng tác viên; là dữ liệu ngầm)",
            "Thời hạn hợp đồng (giá trị tự nhập, là số ngày của hợp đồng. Lưu ý: Với hợp đồng thử việc/học việc thì nhập số ngày; với hợp đồng có xác định thời hạn thì nhập số tháng; hợp đồng cộng tác viên không phải nhập thông tin này)",
            "Ngày kết thúc hợp đồng (check mode Theo đúng thời hạn hợp đồng hoặc Vào đầu tháng sau liền kề của ngày kết thúc hợp đồng)",
            "Loại hợp đồng ký tiếp (drop down; dùng để gợi ý khi thực hiện nghiệp vụ tái lý hợp đồng)",
            "Mẫu báo cáo hợp đồng (đính kèm file word; dùng làm default khi in hợp đồng)",
            "Thời gian báo trước của hợp đồng (30 ngày nếu là hợp đồng có xác định thời hạn và 45 ngày nếu là hợp đồng không xác định thời hạn)",
            "Là hợp đồng tham giam bảo hiểm (check mode; giúp cảnh báo danh sách nhân viên mới tham gia bảo hiểm dụa trên loại hợp đồng này)",
            "Loại phụ lục hợp đồng liên đới (drop down từ Danh mục Loại phụ lục)",
            "Chu kỳ cảnh báo hợp đồng đến hạn (cảnh báo hằng ngày/cảnh báo cách ngày/cảnh báo vào đầu của ngày hết hạn hợp đồng)"
          ],
          "sourceRow": 21
        }
      ]
    },
    {
      "sopCode": "MD-CAT-21",
      "sopTitle": "Loại phụ lục hợp đồng",
      "sopCategory": "Danh mục dùng chung",
      "description": "Các loại phụ lục gồm:\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.21",
          "title": "Loại phụ lục hợp đồng",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Các loại phụ lục gồm:\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Phụ lục gia hạn hợp đồng",
            "Phụ lục điều chỉnh thu nhập",
            "Phụ lục điều chỉnh chức danh",
            "Phụ lục điều chỉnh lương và chức danh",
            "Phụ lục điều chỉnh địa điểm làm việc",
            "Mã loại phụ lục",
            "Tên loại phụ lục",
            "Tên loại phụ lục theo Luật",
            "Mẫu báo cáo Phụ lục (đính kèm file word; dùng làm default khi in phụ lục hợp đồng)"
          ],
          "sourceRow": 22
        }
      ]
    },
    {
      "sopCode": "MD-CAT-22",
      "sopTitle": "Danh sách loại nghỉ",
      "sopCategory": "Danh mục dùng chung",
      "description": "Theo danh sách cung cấp của khách hàng\n\nCác thông tin khai báo gồm:\n\nMục đích khống chế số ngày nghỉ phép theo từng loại nghỉ. Ví dụ: Phép Bản thân cưới, check mode “Theo năm” nghĩa là năm đó chỉ được sử dụng tối đa 3 ngày phép cưới theo định mức của loại nghỉ này.\n\nMục đích giảm thao tác của người dùng khi đăng ký nghỉ phép)",
      "steps": [
        {
          "stepCode": "MD.22",
          "title": "Danh sách loại nghỉ",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Theo danh sách cung cấp của khách hàng\n\nCác thông tin khai báo gồm:\n\nMục đích khống chế số ngày nghỉ phép theo từng loại nghỉ. Ví dụ: Phép Bản thân cưới, check mode “Theo năm” nghĩa là năm đó chỉ được sử dụng tối đa 3 ngày phép cưới theo định mức của loại nghỉ này.\n\nMục đích giảm thao tác của người dùng khi đăng ký nghỉ phép)",
          "fieldsChecklist": [
            "Mã loại ngày nghỉ",
            "Tên loại ngày nghỉ",
            "Định mức nghỉ/năm (theo quy định hiện hành hoặc một giá trị tự nhập, trong đó:",
            "Bản thân kết hôn: 03 ngày",
            "Con kết hôn: 01 ngày",
            "Nghỉ tang (Bố/Mẹ/Bố vợ/Mẹ vợ/Bố chồng/Mẹ chồng/Vợ/Chồng/Con: 03 ngày",
            "Hiển thị trên portal (check mode; dùng để xác định có hiển thị trên portal cho nhân viên đăng ký hay không)",
            "Không đăng ký nghỉ trong thời gian thử việc (check mode; dùng giới hạn loại nghỉ đăng ký với nhân viên thử việc)",
            "Là loại nghỉ có chứng từ y tế (check mode; dùng để kết chuyển sang phân hệ Bảo hiểm, giảm thao tác nhập 2 lần cho ngươi dùng)",
            "Công ty thanh toán lương (check mode; dùng để xác định loại nghỉ này được công ty thanh toán tiền lương)",
            "Loại lương công ty dùng để thanh toán (drop down theo Lương cơ bản hoặc Lương gross)",
            "Chi phí BHXH trả (check mode; dùng để xác định loại nghỉ này được BHXH thanh toán và công ty không thanh toán cho loại nghỉ này)",
            "Chứng từ cần nộp khi đăng ký nghỉ (drop down từ Danh mục Chứng từ nghỉ phép)",
            "Số phép được nghỉ tối đa (check mode, theo:",
            "Trong tháng.",
            "Trong năm",
            "Theo từng lần nghỉ",
            "Trật tự giải trừ phép (thiết lập mức độ ưu tiên khi giải trừ phép, gồm:",
            "Phép đăng ký (có định mức nghỉ)",
            "Phép bù",
            "Phép năm",
            "Phép thâm niên",
            "Phép nghỉ không lương",
            "Cấp duyệt phép (định nghĩa số ngày nghỉ phép cùng với số cấp duyệt tương ứng. Ví dụ: nghỉ phép Năm < 3 ngày thì qua 1 cấp duyệt; nghỉ phép năm >= 3 ngày thì qua 2 cấp duyệt)"
          ],
          "sourceRow": 23
        }
      ]
    },
    {
      "sopCode": "MD-CAT-23",
      "sopTitle": "Đối tượng phép",
      "sopCategory": "Danh mục dùng chung",
      "description": "Định nghĩa phép năm/phép thâm niên/phép bù và chính sách/điều kiện hưởng đi theo 03 loại phép trên theo từng đối tượng.\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.23",
          "title": "Đối tượng phép",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C/M",
          "description": "Định nghĩa phép năm/phép thâm niên/phép bù và chính sách/điều kiện hưởng đi theo 03 loại phép trên theo từng đối tượng.\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã đối tượng phép",
            "Tên đối tượng phép",
            "Phép năm định mức (12/14/16 hoặc một giá trị khác)",
            "Chu kỳ phép (từ dd/mm đến dd/mm)",
            "Niên độ phép (từ mm/yyyy đến mm/yyyy)",
            "Thời điểm tính phép năm (check mode theo:",
            "Ngày vào làm",
            "Ngày kết thúc hợp đồng thử việc",
            "Sau n ngày tính từ ngày vào",
            "Thời điểm hưởng phép năm (check mode theo:",
            "Ngày vào làm",
            "Ngày kết thúc hợp đồng thử việc",
            "Sau n ngày tính từ ngày vào",
            "Phép năm hưởng ở tháng đầu tiên vào làm hoặc tháng đi làm lại sau nghỉ việc riêng/nghỉ chế độ (check mode theo:",
            "Vào làm trước ngày a: hưởng 1 ngày",
            "Vào làm từ ngày a đến trước ngày b: hưởng 0.5 ngày",
            "Vào làm từ ngày b đến ngày cuối tháng: hưởng 0 ngày",
            "Phép năm bị trừ ở tháng nghỉ việc (check mode theo:",
            "Ngày nghỉ việc trước ngày a: trừ 1 ngày",
            "Ngày nghỉ việc từ ngày a đến trước ngày b: trừ 0.5 ngày",
            "Ngày nghỉ việc từ sau ngày b: trừ 0 ngày",
            "Điều kiện tính phép năm thâm niên, định nghĩa dạng lưới theo:",
            "Từ 0 đến dưới x năm: 0 ngày phép thâm niên",
            "Từ x năm đến dưới y năm: 1 ngày phép thâm niên",
            "…",
            "Thời điểm hưởng phép thâm niên (check mode theo:",
            "Năm (ví dụ tròn 5 năm tính theo năm)",
            "Tháng (ví dụ tròn 5 năm tính theo tháng)",
            "Xử lý phép tồn (check mode theo:",
            "Chuyển hết tồn sang năm, đến tháng x (xét đến ngày cuối cùng của tháng x)",
            "Chuyển hết sang lương vào cuối niên độ phép",
            "Chuyển x% tồn sang lương và phần tồn còn lại sang năm sau, đến tháng x (xét đến ngày cuối cùng của tháng x)",
            "Huỷ",
            "Công thức điều chỉnh Phép năm khi thay đổi đối tượng phép (check một trong hai mode sau:",
            "Tính theo đối tượng phép năm mới trên số tháng còn lại của niên độ phép (ví dụ: chuyển đối tượng phép từ 12 sang 14 từ ngày 1/7 thì tính bình quân phép năm 1 tháng của đối tượng 14 và * 6 tháng còn lại của niên độ phép, không trừ hoặc không cộng số phép đã nghỉ dư hoặc chưa nghỉ theo đối tượng 12)",
            "Tính theo đối tượng phép năm mới nhưng có cấn trừ với đối tượng phép năm cũ (ví dụ: chuyển đối tượng phép từ 12 sang 14 từ ngày 1/7 nhưng trước đó chưa nghỉ ngày nào theo đối tượng phép 12 thì vẫn còn tồn 6 phép năm và ở đối tượng phép mới thì tính bình quân phép năm 1 tháng của đối tượng 14 và * 6 tháng còn lại của niên độ phép phép năm theo đối tượng phép mới = Tồn theo đối tượng phép năm cũ + phép năm theo đối tượng mới)",
            "Thời hạn sử dụng phép bù (thiết lập theo tháng, so với thời gian phát sinh. Ví dụ: hiệu lực 2 tháng, sau 2 tháng sẽ huỷ)"
          ],
          "sourceRow": 24
        }
      ]
    },
    {
      "sopCode": "MD-CAT-24",
      "sopTitle": "Đối tượng công",
      "sopCategory": "Danh mục dùng chung",
      "description": "Đối tượng công dùng thiết lập chính sách công theo từng nhóm đối tượng\n\nThông tin cần khai báo gồm:\n\nLưu ý về trường dữ liệu này: Có một số công ty co chu kỳ công từ đầu tháng đến cuối tháng nhưng khoảng ngày 26 là chốt công của tháng để tính và trả lương. Khi đó, các ngày chưa phát sinh công làm việc (từ ngày chốt công đến cuối chu kỳ công) được xem là công ứng và sẽ phải được cấn trừ ở kỳ lương tiếp theo.",
      "steps": [
        {
          "stepCode": "MD.24",
          "title": "Đối tượng công",
          "actor": "",
          "location": "Phân hệ Chấm công",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C/M",
          "description": "Đối tượng công dùng thiết lập chính sách công theo từng nhóm đối tượng\n\nThông tin cần khai báo gồm:\n\nLưu ý về trường dữ liệu này: Có một số công ty co chu kỳ công từ đầu tháng đến cuối tháng nhưng khoảng ngày 26 là chốt công của tháng để tính và trả lương. Khi đó, các ngày chưa phát sinh công làm việc (từ ngày chốt công đến cuối chu kỳ công) được xem là công ứng và sẽ phải được cấn trừ ở kỳ lương tiếp theo.",
          "fieldsChecklist": [
            "Chu kỳ công: từ dd/mm đến dd/mm. Chu kỳ công này trùng với chu kỳ lương tháng của nhân viên",
            "Hình thức chấm công (check mode theo:",
            "Kiểm tra quyét vào/ra và tính trễ/sớm",
            "Kiểm tra vào/ra nhưng không xét trễ/sớm",
            "Không kiểm tra quét vào/ra",
            "Dựa theo lịch đi ca",
            "Phòng ban áp dụng",
            "Kỳ công ứng lương (check mode)",
            "Ngày công chuẩn (check mode theo:",
            "Công chuẩn động (= Ngày thực tế trong tháng – Ngày off của tháng)",
            "Công chuẩn tĩnh (= giá trị nhập vào)",
            "Thời gian kết công (check mode theo:",
            "Hằng tháng",
            "Hằng tuần (chọn chu kỳ từ Thứ… đến Thứ…)",
            "Nữa tháng (chọn chu kỳ từ Ngày… đến Ngày….)",
            "Ca làm việc mặc định (chọn ca theo các ngày trong tuần, gồm:",
            "Thứ 2: Ca…",
            "Thứ 3: Ca…",
            "Thứ 4: Ca…",
            "Thứ 5: Ca…",
            "Thứ 6: Ca…",
            "Thứ 7: Ca…",
            "Chủ nhật: Ca…",
            "Được đăng ký tăng ca vào ngày nghỉ (check mode Có hoặc Không)"
          ],
          "sourceRow": 25
        }
      ]
    },
    {
      "sopCode": "MD-CAT-25",
      "sopTitle": "Đối tượng lương",
      "sopCategory": "Danh mục dùng chung",
      "description": "Dùng để thiết lập chính sách lương theo từng nhóm đối tượng.\n\nThông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.25",
          "title": "Đối tượng lương",
          "actor": "",
          "location": "Profile",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C/M",
          "description": "Dùng để thiết lập chính sách lương theo từng nhóm đối tượng.\n\nThông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã đối tượng lương (khai báo)",
            "Tên đối tượng lương (khai báo)",
            "Chu kỳ công (khai báo, từ dd/mm/yyyy đến dd/mm/yyyy)",
            "Chu kỳ lương (mặc định trùng với chu kỳ công)",
            "Hình thức tính lương (check chọn, hoặc Lương thời gian hoặc Lương khoán)",
            "Phương thức thanh toán (check chọn theo:",
            "Tiền mặt",
            "Ngân hàng",
            "Bộ các khoản thu nhập theo đối tượng lương, chi tiết theo:",
            "Mã khoản thu nhập",
            "Tên khoản thu nhập",
            "Công thức tính của từng khoản thu nhập"
          ],
          "sourceRow": 26
        }
      ]
    },
    {
      "sopCode": "MD-CAT-26",
      "sopTitle": "Đối tượng bảo hiểm",
      "sopCategory": "Danh mục dùng chung",
      "description": "Dùng để thiết lập tỷ lệ nộp, mức nộp của các đối tượng khác nhau\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.26",
          "title": "Đối tượng bảo hiểm",
          "actor": "",
          "location": "Hồ sơ bảo hiểm",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C/M",
          "description": "Dùng để thiết lập tỷ lệ nộp, mức nộp của các đối tượng khác nhau\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã đối tượng bảo hiểm (khai báo)",
            "Tên đối tượng bảo hiểm (khai báo)",
            "Mức lương tham gia bảo hiểm (thiết lập theo mức lương và các khoản phụ cấp chỉ định)",
            "Đơn vị tiền tệ (VND hoặc khác; nếu là khác thì chọn)",
            "Tỷ giá (nếu đơn vị tiền tệ là Khác. Dạng lưới để khai báo tỷ giá – theo cơ quan bảo hiểm, 6 tháng thay đổi 1 lần)",
            "Tỷ lệ BHXH NSDLD đóng (khai báo %)",
            "Tỷ lệ BHXH NLD đóng (khai báo %)",
            "Tỷ lệ BHYT NSDLD đóng (khai báo %)",
            "Tỷ lệ BHYT NLD đóng (khai báo %)",
            "Tỷ lệ BHTN NSDLD đóng (khai báo %)",
            "Tỷ lệ BHTN NLD đóng (khai báo %)",
            "Tỷ lệ BHTNLD-BNN NSDLD đóng (khai báo %)",
            "Tỷ lệ BHTNLD-BNN NLD đóng (khai báo %)"
          ],
          "sourceRow": 27
        }
      ]
    },
    {
      "sopCode": "MD-CAT-27",
      "sopTitle": "Danh sách ca làm việc",
      "sopCategory": "Danh mục dùng chung",
      "description": "Theo danh sách cung cấp của khách hàng\n\nThông tin cần khai báo mỗi ca làm việc gồm:",
      "steps": [
        {
          "stepCode": "MD.27",
          "title": "Danh sách ca làm việc",
          "actor": "",
          "location": "Phân hệ Chấm công",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C/M",
          "description": "Theo danh sách cung cấp của khách hàng\n\nThông tin cần khai báo mỗi ca làm việc gồm:",
          "fieldsChecklist": [
            "Mã ca làm việc",
            "Tên ca làm việc",
            "Ca linh hoạt (check mode)",
            "Giờ công ca chính (8h/10h/12h hoặc một giá trị tự nhập), chỉ dùng khi check mode “Ca linh hoạt”. Khi đó, giờ vào (linh hoạt) + Giờ công ca chính = Giờ ra",
            "Biên độ ca làm việc từ hh:mm đến hh:mm",
            "Giờ bắt đầu ca: hh:mm",
            "Giờ bắt đầu ca (tính vi phạm đi trễ): hh:mm",
            "Giờ kết thúc ca: hh:mm",
            "Giờ kết thúc ca (tính vi phạm về sớm): hh:mm",
            "Thời gian nghỉ giữa ca lần 1: từ hh:mm đến hh:mm",
            "Thời gian nghỉ giữa ca lần 2: từ hh:mm đến hh:mm",
            "Có ăn cơm (check mode để xác định ca này có tổ chức ăn ca)",
            "Giờ vào bắt đầu tính OT: hh:mm",
            "Giờ ra bắt đầu tính OT: hh:mm",
            "Thời gian làm đêm (từ 22:00 đến 06:00)",
            "Số giờ nghỉ của ca, theo:",
            "Toàn ca: “x” giờ",
            "Nửa ca đầu: “y” giờ",
            "Nửa ca sau: “x” – “y”",
            "Thời gian nghỉ giữa ca tính như đi làm (*): từ hh:ss đến hh:ss (các doanh nghiệp trong thời gian nghỉ giữa ca nhưng điều động nhân viên đi làm có tính tăng ca cho thời gian này)",
            "Phòng ban áp dụng (*)",
            "Thiết lập chính sách giờ OT (**)của ca:",
            "Loại OT (drop down theo Loại tăng ca)",
            "Giờ OT tối thiểu (nhập giá trị)",
            "Có làm tròn giờ OT (check mode)",
            "Block làm tròn giờ OT (giá trị tự nhập)",
            "Phòng ban áp dụng chính sách giờ OT (**)"
          ],
          "sourceRow": 28
        }
      ]
    },
    {
      "sopCode": "MD-CAT-28",
      "sopTitle": "Danh mục loại tăng ca",
      "sopCategory": "Danh mục dùng chung",
      "description": "Theo danh sách cung cấp của khách hàng\n\nDanh mục loại tăng ca này được gán theo từng Loại ca làm việc.\n\nCác loại tăng ca gồm:\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.28",
          "title": "Danh mục loại tăng ca",
          "actor": "",
          "location": "Phân hệ Chấm công",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Theo danh sách cung cấp của khách hàng\n\nDanh mục loại tăng ca này được gán theo từng Loại ca làm việc.\n\nCác loại tăng ca gồm:\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Ngày bình thường làm thêm ban ngày (tính OT 150%)",
            "Ngày bình thường làm thêm ban đêm nhưng chưa làm thêm ban ngày (tính OT 200%)",
            "Ngày bình thường làm thêm ban đêm nhưng trước đó đã làm thêm ban ngày (tính OT 210%)",
            "Ngày nghỉ làm thêm ban ngày (tính OT 200%)",
            "Ngày nghỉ làm thêm ban đêm nhưng chưa làm thêm ban ngày (tính OT 270%)",
            "Ngày nghỉ làm thêm ban đêm nhưng trước đó đã làm thêm ban ngày (tính OT 270%)",
            "Ngày lễ, tết làm thêm ban ngày (tính OT 300%)",
            "Ngày lễ, tết làm thêm ban đêm nhưng chưa làm thêm ban ngày (tính OT 390%)",
            "Ngày lễ, tết làm thêm ban đêm nhưng trước đó đã làm thêm ban ngày (tính OT 390%)",
            "Mã loại tăng ca",
            "Tên loại tăng ca",
            "Hệ số tính OT (theo quy định ở trên)",
            "Hệ số quy đổi nhỉ bù (tương đương Hệ số tính OT)",
            "Tỷ lệ trả tiền (nhập tỷ lệ)",
            "Tỷ lệ nghỉ bù (= 100% - Tỷ lệ trả tiền)"
          ],
          "sourceRow": 29
        }
      ]
    },
    {
      "sopCode": "MD-CAT-29",
      "sopTitle": "Danh mục loại kỷ luật",
      "sopCategory": "Danh mục dùng chung",
      "description": "Theo danh sách cung cấp của khách hàng",
      "steps": [
        {
          "stepCode": "MD.29",
          "title": "Danh mục loại kỷ luật",
          "actor": "",
          "location": "Phân hệ Nhân sự",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Theo danh sách cung cấp của khách hàng",
          "fieldsChecklist": [],
          "sourceRow": 30
        }
      ]
    },
    {
      "sopCode": "MD-CAT-30",
      "sopTitle": "Danh mục thang bảng lương (P1 của 3P)",
      "sopCategory": "Danh mục dùng chung",
      "description": "Bộ thang bảng lương được xây dựng theo:\n\nThông tin cần cập nhật gồm:",
      "steps": [
        {
          "stepCode": "MD.30",
          "title": "Danh mục thang bảng lương (P1 của 3P)",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Bộ thang bảng lương được xây dựng theo:\n\nThông tin cần cập nhật gồm:",
          "fieldsChecklist": [
            "Chức danh công việc (Job title) và",
            "Cấp bậc (Level của Job grade)",
            "Mã ngạch lương",
            "Tên ngạch lương",
            "Chức danh (hoặc nhóm chức danh)",
            "Dãy cấp bậc",
            "Mức lương giao giữa Chức danh (hoặc nhóm chức danh) với một cấp bậc"
          ],
          "sourceRow": 31
        }
      ]
    },
    {
      "sopCode": "MD-CAT-31",
      "sopTitle": "Danh mục Nhóm phụ cấp",
      "sopCategory": "Danh mục dùng chung",
      "description": "Là một nhóm các khoản phụ cấp được gắn kèm vào một Chức vụ. Khi nhân viên được gắn chức vụ thì mặc định được hưởng các khoản phụ cấp này.\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.31",
          "title": "Danh mục Nhóm phụ cấp",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Là một nhóm các khoản phụ cấp được gắn kèm vào một Chức vụ. Khi nhân viên được gắn chức vụ thì mặc định được hưởng các khoản phụ cấp này.\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã nhóm phụ cấp",
            "Tên nhóm phụ cấp",
            "Loại phụ cấp 1 (drop down từ danh mục Loại phụ cấp)",
            "Giá trị hưởng của Loại phụ cấp 1",
            "Loại tiền (VND hoặc khác)",
            "Loại phụ cấp 2 (drop down từ danh mục Loại phụ cấp)",
            "Giá trị hưởng của Loại phụ cấp 2",
            "Loại tiền (VND hoặc khác)",
            "…",
            "Loại phụ cấp 20 (drop down từ danh mục Loại phụ cấp)",
            "Giá trị hưởng của Loại phụ cấp 20",
            "Loại tiền (VND hoặc khác)"
          ],
          "sourceRow": 32
        }
      ]
    },
    {
      "sopCode": "MD-CAT-32",
      "sopTitle": "Danh mục chức danh",
      "sopCategory": "Danh mục dùng chung",
      "description": "Các thông tin cần cập nhật gồm:",
      "steps": [
        {
          "stepCode": "MD.32",
          "title": "Danh mục chức danh",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Các thông tin cần cập nhật gồm:",
          "fieldsChecklist": [
            "Mã chức danh",
            "Tên chức danh (tiếng Việt)",
            "Tên chức danh (tiếng Anh)",
            "Chức vụ liên đới (drop down từ Danh mục Chức vụ)",
            "Phòng ban (drop down từ org chart; mục đích xác định cụ thể chức danh đi theo phòng ban)",
            "Cost center",
            "Hình thức lao động (Gián tiếp hoặc Trực tiếp)",
            "Mô tả công việc gồm:",
            "Vai trò",
            "Nhiệm vụ/Trách nhiệm",
            "Quyền hạn",
            "Tiêu chuẩn công việc (số hoá các tiêu chí job specification để phục vụ cho Tuyển dụng và Talent, gồm:",
            "Tiêu chuẩn học vấn",
            "Tiêu chuẩn về kinh nghiệm/chuyên môn",
            "Tiêu chuẩn về kỹ năng làm việc",
            "Tiêu chuẩn về ngoại ngữ",
            "Tiêu chuẩn về tin học",
            "Tiêu chuẩn khác)",
            "Số vòng phỏng vấn tối đa (nhập tay, mục đích xác định số vòng mà vị trí này tham gia phỏng vấn ở phân hệ Tuyển dụng)"
          ],
          "sourceRow": 33
        }
      ]
    },
    {
      "sopCode": "MD-CAT-33",
      "sopTitle": "Danh mục Chức vụ",
      "sopCategory": "Danh mục dùng chung",
      "description": "Chức vụ được hiểu là chức danh kèm chuyên môn.\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.33",
          "title": "Danh mục Chức vụ",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C",
          "description": "Chức vụ được hiểu là chức danh kèm chuyên môn.\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã chức vụ",
            "Tên chức vụ (tiếng Việt)",
            "Tên chức vụ (tiếng Anh)",
            "Phòng ban (theo org chart; mục đích xác định chức vụ của phòng ban nào)",
            "Chức vụ quản lý trực tiếp (load từ danh mục Chức vụ)",
            "Chức vụ được quản lý trực tiếp (load từ danh mục Chức vụ)",
            "Cấp bậc (Level theo job grade)",
            "Đối tượng phép",
            "Đối tượng công",
            "Chức vụ duyệt cấp 1 (Là chức vụ duyệt cho các quy trình duyêt không theo reporting line. Trường hợp đi theo reporting line thì ô này để trống không được điền)",
            "Chức vụ duyệt cấp 2 (Là chức vụ duyệt cho các quy trình duyêt không theo reporting line. Trường hợp đi theo reporting line thì ô này để trống không được điền)",
            "Chức vụ duyệt cấp 3 (Là chức vụ duyệt cho các quy trình duyêt không theo reporting line. Trường hợp đi theo reporting line thì ô này để trống không được điền)",
            "Chức vụ duyệt cấp 4 (Là chức vụ duyệt cho các quy trình duyêt không theo reporting line. Trường hợp đi theo reporting line thì ô này để trống không được điền)",
            "Số ngày thử việc (khai báo dạng số)",
            "Đối tượng lương",
            "Tiêu chuẩn công việc (load default từ Danh mục Chức danh sang)",
            "Bộ năng lực (nhóm theo 3 dạng chính gồm:",
            "Năng lực cốt lõi (core)",
            "Năng lực lãnh đạo (leader ship)",
            "Năng lực hành vi (behavior)",
            "Bộ tiêu chí đánh giá công việc",
            "Khoá đào tạo bắt buộc và khuyến nghị",
            "Bộ định mức trang thiết bị",
            "Task list công việc các bộ phận cần chuẩn bị cho vị trí này khi nhận việc (dạng lưới, chi tiết theo từng bộ phận)",
            "Task list vị trí này cần chuẩn bị khi nhận việc (dạng lưới, chi tiết các task)",
            "Số vòng phỏng vấn tối đa (kê thừa từ Danh mục Chức danh)"
          ],
          "sourceRow": 34
        }
      ]
    },
    {
      "sopCode": "MD-CAT-34",
      "sopTitle": "Danh sách các ngày nghỉ lễ",
      "sopCategory": "Danh mục dùng chung",
      "description": "Là nơi định nghĩa danh sách các ngày nghỉ trong năm, áp dụng cho toàn bộ nhân viên và ngày nghỉ này được Công ty thanh toán lương.\n\nCác ngày nghỉ này có thể trùng nhau ở một số công ty trong cùng một group\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.34",
          "title": "Danh sách các ngày nghỉ lễ",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C/M",
          "description": "Là nơi định nghĩa danh sách các ngày nghỉ trong năm, áp dụng cho toàn bộ nhân viên và ngày nghỉ này được Công ty thanh toán lương.\n\nCác ngày nghỉ này có thể trùng nhau ở một số công ty trong cùng một group\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Danh sách công ty áp dụng (drop down chọn Công ty)",
            "Loại ngày nghỉ (drop down chọn theo:",
            "Ngày nghỉ của Công ty (ví dụ: sinh nhật Công ty)",
            "Ngày nghỉ theo Luật (ví dụ: các ngày nghỉ như 30/4, 1/5, …)",
            "Ngày nghỉ khác (Ví dụ: Noel công ty cho nhân viên nghỉ ½ ngày)",
            "Chu kỳ phát sinh loại nghỉ (drop down chọn theo:",
            "Tháng",
            "Năm",
            "Tuần",
            "Ngày)",
            "Ngày nghỉ: chọn ngày cụ thể từ calendar đổ xuống"
          ],
          "sourceRow": 35
        }
      ]
    },
    {
      "sopCode": "MD-CAT-35",
      "sopTitle": "Danh sách lý do đi sớm về muộn",
      "sopCategory": "Danh mục dùng chung",
      "description": "Là các lý do đi sớm về muộn hoặc về sớm vào muộn\n\nDùng để nhân viên chọn khi đăng ký trễ/sớm trên portal\n\nDùng để HRM phân tích các lý do phát sinh trong ngày/trong tháng hoặc trong một vùng thời gian (Báo cáo BI)\n\nCác thông tin cần khai báo:",
      "steps": [
        {
          "stepCode": "MD.35",
          "title": "Danh sách lý do đi sớm về muộn",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C/M",
          "description": "Là các lý do đi sớm về muộn hoặc về sớm vào muộn\n\nDùng để nhân viên chọn khi đăng ký trễ/sớm trên portal\n\nDùng để HRM phân tích các lý do phát sinh trong ngày/trong tháng hoặc trong một vùng thời gian (Báo cáo BI)\n\nCác thông tin cần khai báo:",
          "fieldsChecklist": [
            "Mã lý do",
            "Tên lý do (tiếng Việt)",
            "Tên lý do (tiếng Anh)"
          ],
          "sourceRow": 36
        }
      ]
    },
    {
      "sopCode": "MD-CAT-36",
      "sopTitle": "Danh sách lý do không quẹt thẻ chấm công",
      "sopCategory": "Danh mục dùng chung",
      "description": "Là các lý do giải trình cho việc không chấm công (bằng vân tay/thẻ từ/nhận dạng khuôn mặt/GPS)\n\nDùng để nhân viên giải trình khi đăng ký bổ sung dữ liệu on/out trên portal\n\nDùng để HRM phân tích các lý do không quẹt thẻ phát sinh trong ngày/tháng hoặc trong một vùng thời gian (Báo cáo BI)\n\nCác thông tin cần khai báo:",
      "steps": [
        {
          "stepCode": "MD.36",
          "title": "Danh sách lý do không quẹt thẻ chấm công",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C/M",
          "description": "Là các lý do giải trình cho việc không chấm công (bằng vân tay/thẻ từ/nhận dạng khuôn mặt/GPS)\n\nDùng để nhân viên giải trình khi đăng ký bổ sung dữ liệu on/out trên portal\n\nDùng để HRM phân tích các lý do không quẹt thẻ phát sinh trong ngày/tháng hoặc trong một vùng thời gian (Báo cáo BI)\n\nCác thông tin cần khai báo:",
          "fieldsChecklist": [
            "Mã lý do",
            "Lý do không quẹt thẻ (tiếng Việt)",
            "Lý do không quẹt thẻ (tiếng Anh)",
            "Số lần cho phép tối đa trong 1 tháng (giá trị tự nhập vào). Đây là số lần cho phép đi trễ hoặc về sớm trong một tháng, áp dụng cho toàn bộ nhân viên"
          ],
          "sourceRow": 37
        }
      ]
    },
    {
      "sopCode": "MD-CAT-37",
      "sopTitle": "Vùng làm việc",
      "sopCategory": "Danh mục dùng chung",
      "description": "Xác định vùng (theo Nghị định 90/2019/NĐ-CP hiện hành) làm cơ sở xác định mức lương làm cơ sở tham gia bảo hiểm.\n\nHiện có 04 vùng theo quy định của nhà nước, gồm:\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.37",
          "title": "Vùng làm việc",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C/M",
          "description": "Xác định vùng (theo Nghị định 90/2019/NĐ-CP hiện hành) làm cơ sở xác định mức lương làm cơ sở tham gia bảo hiểm.\n\nHiện có 04 vùng theo quy định của nhà nước, gồm:\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Vùng I",
            "Vùng II",
            "Vùng III",
            "Vùng IV",
            "Mã vùng",
            "Tên vùng"
          ],
          "sourceRow": 38
        }
      ]
    },
    {
      "sopCode": "MD-CAT-38",
      "sopTitle": "Danh sách địa điểm làm việc",
      "sopCategory": "Danh mục dùng chung",
      "description": "Là các địa điểm làm việc cố định của nhân viên trong công ty nhưng ngoài địa điểm Văn phòng chính.\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.38",
          "title": "Danh sách địa điểm làm việc",
          "actor": "",
          "location": "",
          "timing": "",
          "typeCode": "C",
          "sourceTypeCode": "C/M",
          "description": "Là các địa điểm làm việc cố định của nhân viên trong công ty nhưng ngoài địa điểm Văn phòng chính.\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã địa điểm làm việc",
            "Tên địa điểm làm việc",
            "Khu vực làm việc (drop down từ Vùng làm việc)",
            "Tỉnh/Thành phố",
            "Quận/Huyện",
            "Phường/Xã",
            "Địa chỉ"
          ],
          "sourceRow": 39
        }
      ]
    },
    {
      "sopCode": "MD-CAT-39",
      "sopTitle": "Danh sách hình thức kỷ luật",
      "sopCategory": "Danh mục dùng chung",
      "description": "Là các hình thức kỷ luật của Công ty áp dụng với người lao động.\n\nCác hình thức theo quy định của Luật gồm:\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.39",
          "title": "Danh sách hình thức kỷ luật",
          "actor": "",
          "location": "",
          "timing": "",
          "typeCode": "",
          "sourceTypeCode": "",
          "description": "Là các hình thức kỷ luật của Công ty áp dụng với người lao động.\n\nCác hình thức theo quy định của Luật gồm:\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Khiển trách miệng",
            "Khiển trách bằng biên bản",
            "Kéo dài thời hạn nâng lương",
            "Chuyển công việc khác có mức lương thấp hơn",
            "Cách chức khỏi chức vụ hiện tại",
            "Sa thải",
            "Mã hình thức kỷ luật",
            "Tên hình thức kỷ luật",
            "Cảnh báo số lần kỷ luật theo tháng (là giá trị tự khai báo vào. Sử dụng giá trị này để cảnh báo theo số lần phát sinh. Ví dụ nhập ở đây là 3, có nghĩa là trong tháng, nhân viên vi phạm đến lần thứ 3 là phải được cảnh báo)",
            "Cảnh báo số lần kỷ luật theo năm (là giá trị tự khai báo vào. Sử dụng giá trị này để cảnh báo theo số lần phát sinh. Ví dụ nhập ở đây là 5, có nghĩa là trong năm, nhân viên vi phạm đến lần thứ 5 là phải được cảnh báo)",
            "Thêm vào danh sách đen (check mode, dùng để xác định khi nhân viên vi phạm có hình thức kỷ luật này sẽ auto thêm vào danh sách đen, là thông tin sàng lọc của Phân hệ Tuyển dụng",
            "Số tháng bị kỷ luật (thường áp dụng cho Điều chỉnh lương định kỳ. Với Hình thức kỷ luật là Kéo dài thời hạn nâng lương thì cần nhập vào giá trị này và xuất cảnh báo, là số tháng bị kéo dài thời hạn nâng lương định kỳ)",
            "Áp dụng cho chế độ thai sản (check mode, để xác định hình thức kỷ luật này có áp dụng cho nhân viên trong thời gian thai sản nuôi con nhỏ không)"
          ],
          "sourceRow": 40
        }
      ]
    },
    {
      "sopCode": "MD-CAT-40",
      "sopTitle": "Danh sách hành vi kỷ luật",
      "sopCategory": "Danh mục dùng chung",
      "description": "Là danh sách các hành vi vi phạm của nhân viên phát sinh trong công ty (ví dụ: Gây rối trật tự tại nơi làm việc hoặc Sử dụng chất kích thích tại nơi làm việc,…)\n\nCác thông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.40",
          "title": "Danh sách hành vi kỷ luật",
          "actor": "",
          "location": "",
          "timing": "",
          "typeCode": "N",
          "sourceTypeCode": "N",
          "description": "Là danh sách các hành vi vi phạm của nhân viên phát sinh trong công ty (ví dụ: Gây rối trật tự tại nơi làm việc hoặc Sử dụng chất kích thích tại nơi làm việc,…)\n\nCác thông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã lý do kỷ luật",
            "Tên lý do kỷ luật"
          ],
          "sourceRow": 41
        }
      ]
    },
    {
      "sopCode": "MD-CAT-41",
      "sopTitle": "Món ăn",
      "sopCategory": "Danh mục dùng chung",
      "description": "Danh sách các món ăn mà nhà ăn phục vụ nhân viên.\n\nThông tin cần khai báo gồm:",
      "steps": [
        {
          "stepCode": "MD.41",
          "title": "Món ăn",
          "actor": "",
          "location": "Chấm công",
          "timing": "",
          "typeCode": "M",
          "sourceTypeCode": "N/M",
          "description": "Danh sách các món ăn mà nhà ăn phục vụ nhân viên.\n\nThông tin cần khai báo gồm:",
          "fieldsChecklist": [
            "Mã món ăn",
            "Tên món ăn",
            "Đơn giá món ăn",
            "Thời gian áp dụng (check mode theo:",
            "Ngày (liên tục hoặc cách ngày)",
            "Tuần (liên tục hoặc các tuần)"
          ],
          "sourceRow": 42
        }
      ]
    },
    {
      "sopCode": "MD-CAT-42",
      "sopTitle": "Danh mục về cơ cấu tổ chức",
      "sopCategory": "Danh mục dùng chung",
      "description": "Là nới định nghĩa org chart của tổ chức\n\nTổ chức có thể xem là Tập đoàn/Công ty/Ngành/….(Legal Entity, Business Unit, Division, Department, Team, Group)\n\nCác trường thông tin cần khai báo trên màn hình danh mục cơ cấu tổ chức gồm:\n\n(Ví dụ:\n\nTổng Công ty A (level 1) có level 2 là Công ty TNHH A1 và Văn phòng Đại diện A2. Trong đó A2 in báo biểu thì lấy theo tên của A, còn A1 in báo biểu lấy theo tên của A1)",
      "steps": [
        {
          "stepCode": "MD.42",
          "title": "Danh mục về cơ cấu tổ chức",
          "actor": "",
          "location": "Toàn bộ",
          "timing": "",
          "typeCode": "M",
          "sourceTypeCode": "N/M",
          "description": "Là nới định nghĩa org chart của tổ chức\n\nTổ chức có thể xem là Tập đoàn/Công ty/Ngành/….(Legal Entity, Business Unit, Division, Department, Team, Group)\n\nCác trường thông tin cần khai báo trên màn hình danh mục cơ cấu tổ chức gồm:\n\n(Ví dụ:\n\nTổng Công ty A (level 1) có level 2 là Công ty TNHH A1 và Văn phòng Đại diện A2. Trong đó A2 in báo biểu thì lấy theo tên của A, còn A1 in báo biểu lấy theo tên của A1)",
          "fieldsChecklist": [
            "Mã cấp độ level",
            "Tên cấp độ level",
            "Level quản lý",
            "Tiêu đề báo cáo theo (check mode theo “Level quản lý”, trong đó:",
            "Nếu check thì sub report lấy theo level quản lý",
            "Nếu không check thi sub report lấy theo level đang khai báo"
          ],
          "sourceRow": 43
        }
      ]
    },
    {
      "sopCode": "MD-CAT-43",
      "sopTitle": "Chế độ trợ cấp bảo hiểm",
      "sopCategory": "Danh mục dùng chung",
      "description": "Là chế độ hưởng (định mức ngày nghỉ hưởng và mức lương tính hưởng) mà người lao động có khi nghỉ Ốm đau (bản thân ốm ngắn ngày hoặc ốm dài ngày), Con ốm, Khám thai, Thai sản nuôi con nhỏ, Sảy thai,…\n\nCác thông tin cần khai báo gồm:\n\nVí dụ:\n\nVới chế độ trợ cấp bảo hiểm nghỉ ốm ngắn ngày:\n\n+ Trong điều kiện làm việc bình thường:\n\n+ Trong điều kiện làm việc nặng nhọc độc hại:",
      "steps": [
        {
          "stepCode": "MD.43",
          "title": "Chế độ trợ cấp bảo hiểm",
          "actor": "",
          "location": "Bảo hiểm",
          "timing": "",
          "typeCode": "M",
          "sourceTypeCode": "N/M",
          "description": "Là chế độ hưởng (định mức ngày nghỉ hưởng và mức lương tính hưởng) mà người lao động có khi nghỉ Ốm đau (bản thân ốm ngắn ngày hoặc ốm dài ngày), Con ốm, Khám thai, Thai sản nuôi con nhỏ, Sảy thai,…\n\nCác thông tin cần khai báo gồm:\n\nVí dụ:\n\nVới chế độ trợ cấp bảo hiểm nghỉ ốm ngắn ngày:\n\n+ Trong điều kiện làm việc bình thường:\n\n+ Trong điều kiện làm việc nặng nhọc độc hại:",
          "fieldsChecklist": [
            "Mã chế độ trợ cấp bảo hiểm",
            "Tên chế độ trợ cấp bảo hiểm",
            "Định mức ngày nghỉ hưởng (thiết lập lưới khai báo)",
            "30 ngày/năm nếu thâm niên tham gia bảo hiểm < 15 năm",
            "40 ngày/năm nếu thâm niên tham gia bảo hiểm >= 15 năm và < 30 năm",
            "60 ngày/năm nếu thâm niên tham gia bảo hiểm >= 30 năm",
            "40 ngày/năm nếu thâm niên tham gia bảo hiểm < 15 năm",
            "50 ngày/năm nếu thâm niên tham gia bảo hiểm >= 15 năm và < 30 năm",
            "70 ngày/năm nếu thâm niên tham gia bảo hiểm >= 30 năm",
            "Ngày công chuẩn (default = 24 nhưng có thể điều chỉnh nếu luật Bảo hiểm có thay đổi)",
            "Mức lương làm cơ sở tính hưởng (check mode theo:",
            "Mức lương trung bình của 06 tháng gần nhất (nếu không có, lấy mức lương của tháng gần nhất)",
            "Mức lương của tháng gần nhất",
            "Ngày tính hưởng (check mode, hoặc:",
            "Theo ngày làm việc (ví dụ: Nghỉ ốm đau ngắn ngày, nghỉ con ốm chỉ tính theo ngày làm việc, nếu ngày nghỉ này trùng với ngày nghỉ hàng tuần, nghỉ lễ, nghỉ tết thì loại trừ các ngày này ra và không được nghỉ bù để tính hưởng)",
            "Theo ngày phát sinh (ví dụ: Nghỉ ốm đau dài ngày, nghĩ dưỡng sức được tính hưởng trợ cấp cả những ngày nghỉ hàng tuần, ngày lễ, ngày tế)"
          ],
          "sourceRow": 44
        }
      ]
    },
    {
      "sopCode": "MD-CAT-44",
      "sopTitle": "Đối tượng thuế TNCN",
      "sopCategory": "Danh mục dùng chung",
      "description": "Dùng xác định nhân viên thuộc hình thức chịu thuế TNCN nào.\n\nHiện có 03 hình thức chịu thuế TNCN, gồm:\n\nCác thông tin cần khai báo khi tạo đối tượng thuế TNCN:",
      "steps": [
        {
          "stepCode": "MD.44",
          "title": "Đối tượng thuế TNCN",
          "actor": "",
          "location": "Lương",
          "timing": "",
          "typeCode": "M",
          "sourceTypeCode": "N/M",
          "description": "Dùng xác định nhân viên thuộc hình thức chịu thuế TNCN nào.\n\nHiện có 03 hình thức chịu thuế TNCN, gồm:\n\nCác thông tin cần khai báo khi tạo đối tượng thuế TNCN:",
          "fieldsChecklist": [
            "Đối tượng chịu thuế TNCN 10% (đối tượng áp dụng biểu thuế toàn phần, áp dụng đối với nhân viên ký hợp đồng lao động thời vụ, nhân viên trong thời gian thử việc, Cộng tác viên)",
            "Đối tượng chịu thuế TNCN 20% (đối tượng áp dụng biểu thuế toàn phần, áp dụng với cá nhân không cư trú, thường là người nước ngoài)",
            "Đối tượng chịu thuế TNCN luỹ tiến (thường là nhân viên có hợp đồng chính thức, được áp dụng giảm trừ bản thân và giảm trừ phụ thuộc)",
            "Mã đối tượng thuế TNCN (khai báo)",
            "Tên đối tượng thuế TNCN (khai báo)",
            "Mức giảm trừ bản thân (giá trị khai báo, hiện tại là 11tr)",
            "Mức giảm trừ phụ thuộc (giá trị khai báo, hiện tại là 4tr4)",
            "Hình thức làm việc (drop down từ Danh mục Hình thức làm việc)",
            "Mẫu kê khai tạm nộp thuế (drop down chọn:",
            "Mẫu 05-1: dành cho đối tượng thuế luỹ tiến, hoặc",
            "Mẫu 05-2: dành cho đối tượng biểu thuế toàn phần)"
          ],
          "sourceRow": 45
        }
      ]
    }
  ]
}
