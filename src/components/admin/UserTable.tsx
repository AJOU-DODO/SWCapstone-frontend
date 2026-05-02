import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 데이터는 변경될 수 있음
interface User {
  id: number;
  nickname: string;
  email: string;
  role: "USER" | "ADMIN" | "ADVERTISER";
  status: "AVTIVE" | "BANNED";
  createdAt: string;
  numNest: number;
  numReply: number;
}

export default function UserTable({ users }: { users: User[] }) {
  return (
    <div className="border border-t-[#54513E] border-x-0 border-b-[#54513E]/50 [&_th]:text-center [&_td]:text-center">
      <Table>
        <TableHeader>
          <TableRow className="border-[#54513E] hover:bg-transparent">
            <TableHead>ID</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>유저유형</TableHead>
            <TableHead>제제여부</TableHead>
            <TableHead>가입날짜</TableHead>
            <TableHead>게시글수</TableHead>
            <TableHead>답글수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-[#54513E]/50">
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.nickname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>{user.numNest}</TableCell>
              <TableCell>{user.numReply}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}