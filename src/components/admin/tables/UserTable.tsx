import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { User } from '@/types/indexAdmin';

export default function UserTable({ users, onRowClick }: { users: User[]; onRowClick: (user: User) => void; }) {
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
            <TableRow 
            onClick={() => onRowClick(user)}
            key={user.id} className="border-[#54513E]/50">
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.nickname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.isSanctioned ? 'O' : 'X' }</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{user.nestCount}</TableCell>
              <TableCell>{user.commentCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}