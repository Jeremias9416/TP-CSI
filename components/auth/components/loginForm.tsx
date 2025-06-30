"use client";

import React ,{useState} from "react";
import {Button, Input, Divider, ResizablePanel} from "@heroui/react";
import {AnimatePresence, m, domAnimation, LazyMotion} from "framer-motion";
import {Icon} from "@iconify/react";
import Link  from 'next/link';
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
export default function LoginForm() {
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [isPassVisible, setIsPassVisible] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router  = useRouter();
  async function signInSocial(social: string){
    try{
      await signIn(social, { callbackUrl:'/'})
     } catch(error){
       console.log(error)
     }
     

 }
  const variants = {
    visible: {opacity: 1, y: 0},
    hidden: {opacity: 0, y: 10},
  };

  const orDivider = (
    <div className="flex items-center gap-4 py-2">
      <Divider className="flex-1" />
      <p className="shrink-0 text-tiny text-default-500">O</p>
      <Divider className="flex-1" />
    </div>
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .max(100, "Has superado la cantidad de caracteres")

        .required("Ingrese su email"),
      password: Yup.string()
        .min(6, "El nombre debe de tener al menos 3 caracteres")
        .max(100, "Has superado la cantidad de caracteres")
        .required("Ingrese la contraseña"),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;
      setLoading(true);
      try {
        /*  const loginData = await signIn("credentials", {
           email,
           password,
           redirect: false,
           callbackUrl: "/",
         }) */
        await signIn('credentials', {...values, callbackUrl:'/dashboard'} )
        console.log(values)


      } catch (error) {

        Swal.fire("Hubo un error", `${error}`, "error");
        console.log(error);
        router.push("/");

      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <ResizablePanel>
          <h1 className="mb-4 text-xl text-center font-medium text-default-foreground">Ingresar al sistema</h1>
          <AnimatePresence initial={false} mode="popLayout">
            <LazyMotion features={domAnimation}>
              {isFormVisible ? (
                <>
                  <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className="flex flex-col gap-y-3">
                  <Input
                    autoFocus
                    label="Usuario"
                    name="email"
                    type="text"
                    variant="bordered"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  <Input label="Password" 
                  name="password" 
                  type={isPassVisible ? "text" :"password" }
                  variant="bordered"
                  value={formik.values.password} 
                  onChange={formik.handleChange}
                  endContent={
                    isPassVisible ?  <FaEye onClick={(e) => {e.preventDefault(); setIsPassVisible(!isPassVisible)}} className="dark:text-white cursor-pointer"/> : <FaEyeSlash onClick={(e) => {e.preventDefault(); setIsPassVisible(!isPassVisible)}} className="dark:text-white cursor-pointer"/> 
                  }
                  />
                  <Button  color="primary" type="submit">
                    Ingresar
                  </Button>
                  </form>
                  {orDivider}
                  <Button
                    fullWidth
                    startContent={
                      <Icon
                        className="text-default-500"
                        icon="solar:arrow-left-linear"
                        width={18}
                      />
                    }
                    variant="flat"
                    onPress={() => setIsFormVisible(false)}
                  >
                   Otras opciones de ingreso
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    fullWidth
                    color="primary"
                    startContent={
                      <Icon className="pointer-events-none text-2xl" icon="solar:letter-bold" />
                    }
                    type="button"
                    onPress={() => setIsFormVisible(true)}
                  >
                    Continuar con cuenta
                  </Button>
                  {orDivider}
                  <m.div
                    animate="visible"
                    className="flex flex-col gap-y-2"
                    exit="hidden"
                    initial="hidden"
                    variants={variants}
                  >
                    <div className="flex flex-col gap-2">
                      <Button
                        fullWidth
                        
                        startContent={<Icon icon="logos:google-icon" width={24} />}
                        variant="flat"
                        onPress={() => signInSocial('google')}
                      >
                        Ingresar con Google
                      </Button>
                      
                    </div>
                    
                  </m.div>
                </>
              )}
            </LazyMotion>
          </AnimatePresence>
        </ResizablePanel>
      </div>
    </div>
  );
}