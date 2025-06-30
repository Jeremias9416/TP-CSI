import { auth } from "@/auth";
import { getAllBlog } from "@/components/blog/actions/blog-action";
import FormNewBlog from "@/components/blog/components/FormNewBlog";
import TableBlogs from "@/components/blog/components/TableBlogs";
import { title } from "@/components/primitives";
import { redirect } from "next/navigation";

export default async function BlogPage() {

  const blogs = await getAllBlog();
  const session = await auth();
  if(!session){
    redirect('/login')
  }
  console.log(blogs)
  return (
    <div>
      
      <TableBlogs blogs={blogs} />
    </div>
  );
}