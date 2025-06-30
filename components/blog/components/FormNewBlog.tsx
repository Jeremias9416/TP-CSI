'use client';

import { useFormik } from "formik";
import * as Yup from "yup";
import { createBlog, updateBlog } from "../actions/blog-action";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Swal from "sweetalert2";
import { IBlog } from "../interfaces/blog-data";
import { useEffect, useMemo } from "react";
import InputImage from "./InputImage";
interface props {
    blog: IBlog | null,
    setBlog: any
}
const FormNewBlog = ({blog, setBlog}:props) => {

    console.log("form", blog)
const formik = useFormik({
    initialValues: blog ? {...blog} :
        {title: '',
        content:'',
        image:'',

    }, 
    validationSchema: Yup.object().shape({
        title: Yup.string().required("Campo obligatorio"),
        content: Yup.string().required("Campo obligatorio"),
        image: Yup.string().required("Campo obligatorio"),
       
      }),
      onSubmit: async (values) => {
        try {
            if(blog){
                await updateBlog(values);
                setBlog(null)
                Swal.fire('Entrada editada','Fue exitosa','success');
            }else{
                await createBlog(values);
                Swal.fire('Nueva entrada','Fue exitosa','success');
            }
             
            
            formik.resetForm();
        } catch (error) {
            console.error(error)
            Swal.fire('Hubo un error',`${error}`,'error');
        }
      }
})

useMemo(() => {
    if (blog) {
      formik.setValues(blog)
    } else{
        formik.resetForm()
    }
  }, [blog]);

    return(
        <Card className="min-w-md flex flex-col p-4 border rounded-md gap-4">
        <CardHeader>{blog ? 'Editar' : 'Nuevo'} Blog</CardHeader>
        <CardBody>

        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className="w-full flex flex-col gap-4 ">

            <Input 
             isRequired
             placeholder="Ingrese un título"
             name='title' 
             id='title' 
             label='Título' 
             value={formik.values.title} 
             onChange={formik.handleChange}
                />
                <Textarea 
             isRequired
             placeholder="Ingrese un contenido"
             name='content' 
             id='content' 
             label='Contenido' 
             value={formik.values.content} 
             onChange={formik.handleChange}
                />
                <div className="flex justify-between gap-4 items-center">
                 <InputImage values={formik.values.image} onChange={(e:string) => formik.setFieldValue('image',e)} />
                </div>

                <Button type="submit">Guardar</Button>
        </form>
        </CardBody>
        </Card>
    )
}

export default FormNewBlog;