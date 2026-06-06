import { redirect } from "next/navigation";

export default function Page() {
  redirect("/admin/users");

  return null;
}