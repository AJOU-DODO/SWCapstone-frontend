import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 데이터는 변경될 수 있음
export interface Nest {
  id: string;
  creatorNickname: string;
  content: string;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  reportCount: number;
}

export default function NestTable({ nests }: { nests: Nest[] }) {
  return (
    <div className="border border-t-[#54513E] border-x-0 border-b-[#54513E]/50 [&_th]:text-center [&_td]:text-center">
      <Table>
        <TableHeader>
          <TableRow className="border-[#54513E] hover:bg-transparent">
            <TableHead>작성자</TableHead>
            <TableHead>본문 내용</TableHead>
            <TableHead>작성 날짜</TableHead>
            <TableHead>좋아요 수</TableHead>
            <TableHead>댓글 수 </TableHead>
            <TableHead>신고 수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nests.map((nest) => (
            <TableRow key={nest.id} className="border-[#54513E]/50">
              <TableCell className="font-medium">{nest.id}</TableCell>
              <TableCell>{nest.creatorNickname}</TableCell>
              <TableCell>{nest.content}</TableCell>
              <TableCell>{nest.createdAt}</TableCell>
              <TableCell>{nest.likeCount}</TableCell>
              <TableCell>{nest.replyCount}</TableCell>
              <TableCell>{nest.reportCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}