//신고된 둥지 관리 테이블
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 데이터는 변경될 수 있음
export interface Report {
  id: string;
  creatorNickname: string;
  content: string;
  createdAt: string;
  latestReportDate: string;
  reportCount: number;
  reportReason: string;
}

interface TableProps {
  reports: Report[];
  onRowClick: (id: string | number) => void;
}

export default function ReportNestTable({ reports, onRowClick }: TableProps) {
  return (
    <div className="border border-t-[#54513E] border-x-0 border-b-[#54513E]/50 [&_th]:text-center [&_td]:text-center">
      <Table>
        <TableHeader>
          <TableRow className="border-[#54513E] hover:bg-transparent">
            <TableHead>작성자</TableHead>
            <TableHead>본문 내용</TableHead>
            <TableHead>최초 신고일</TableHead>
            <TableHead>최근 신고일</TableHead>
            <TableHead>신고 수</TableHead>
            <TableHead>신고 사유</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow 
              key={report.id} 
              onClick={(e) => {
                  e.stopPropagation();
                  onRowClick(report.id);
                }}
              className="border-[#54513E]/50">
                <TableCell>{report.creatorNickname}</TableCell>
                <TableCell className="max-w-[150px] truncate">{report.content}</TableCell>
                <TableCell>{report.createdAt}</TableCell>
                <TableCell>{report.latestReportDate}</TableCell>
                <TableCell>{report.reportCount}</TableCell>
                <TableCell>{report.reportReason}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}