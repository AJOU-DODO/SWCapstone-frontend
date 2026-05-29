//신고된 둥지 관리 테이블
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ReportedNestList } from '@/types/indexAdmin';

interface TableProps {
  reports: ReportedNestList[];
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow 
              key={report.nestId} 
              onClick={(e) => {
                  e.stopPropagation();
                  onRowClick(report.nestId);
                }}
              className="border-[#54513E]/50">
                <TableCell>{report.authorNickname}</TableCell>
                <TableCell className="max-w-[150px] truncate">{report.content}</TableCell>
                <TableCell>{new Date(report.firstReportedAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(report.lastReportedAt).toLocaleDateString()}</TableCell>
                <TableCell>{report.reportCount}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}