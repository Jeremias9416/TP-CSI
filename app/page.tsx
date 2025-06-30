import { auth } from "@/auth";
import { getAllBlog } from "@/components/blog/actions/blog-action";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Image from "next/image";

export default async function Home() {
  const blogs = await getAllBlog();
  const session = await auth();
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center">
        <h1>Nuestros blogs</h1>
        <div>
          <p>Nombre:</p>
          {session?.user?.name}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          {blogs.map((blog) => (
            <Card key={blog.id} className="w-full">
              <CardHeader>
                <div className="h-[200px] w-full relative top-0 left-0">
                  <Image src={blog.image} alt={blog.image} fill className="" />
                </div>
              </CardHeader>
              <CardBody>
                <div>
                  <h2 className="text-2xl mb-4">{blog.title}</h2>
                  <p>{blog.content}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
