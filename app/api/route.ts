import { getAllBlog } from "@/components/blog/actions/blog-action";

export async function GET() {
  const data = await getAllBlog();

  return Response.json(data);
}
