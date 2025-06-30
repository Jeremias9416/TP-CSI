'use client';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button} from "@heroui/react";

import { IBlog } from "../interfaces/blog-data";
import Swal from "sweetalert2";
import { deleteBlog } from "../actions/blog-action";
import FormNewBlog from "./FormNewBlog";
import { useState } from "react";
import { useSession } from "next-auth/react";
interface props {
    blogs: IBlog[]
}
const TableBlogs = ({blogs}:props) => {
    const { data: session } = useSession();
    const [blog, setBlog] = useState<IBlog | null>(null);
    const handleDelete = async (id:string) => {
        try {
            await deleteBlog(id);

            Swal.fire('Entrada eliminada','','success')
        } catch (error) {
            console.error(error);
            Swal.fire('Hubo un error', '','error')
        }
    }
    const handleEdit = (item:IBlog) => {
        setBlog(item)
    }
    console.log(blog)
    return (
        <section className="flex flex-col  gap-2 w-full">
          <div>
            <p>Nombre: {session?.user?.name}</p>
          </div>
            <div>
            <Button className="mr-auto" color="primary" onPress={()=> setBlog(null)}>Nueva entrada</Button>
            </div>
        <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Titulo</TableColumn>
        <TableColumn>Contenido</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {blogs.map(blog => (
            <TableRow key={blog.id}>
          <TableCell>{blog.title}</TableCell>
          <TableCell>{blog.content}</TableCell>
          <TableCell>
            <div className="flex gap-2 justify-start">
            <Button onPress={()=> handleEdit(blog)}>Editar</Button>
            <Button color="danger" onPress={() => handleDelete(blog.id ?? '')}>Eliminar</Button>
            </div>
          </TableCell>
        </TableRow>
        ))}
        
        
      </TableBody>
    </Table>
    <FormNewBlog blog={blog as any} setBlog={setBlog}/>
    </section>
    )
}

export default TableBlogs