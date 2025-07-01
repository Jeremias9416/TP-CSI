// lib/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import prisma from './prisma';
import { v2 as cloudinary } from 'cloudinary';

// --- Función para subir la imagen ---
async function uploadImage(file: File) {
  const fileBuffer = await file.arrayBuffer();
  var mime = file.type;
  var encoding = 'base64';
  var base64Data = Buffer.from(fileBuffer).toString('base64');
  var fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

  const result = await cloudinary.uploader.upload(fileUri, {
    folder: 'tortas_panaderia',
  });

  return result.secure_url;
}


// --- OBTENER UNA SOLA TORTA POR ID ---
export async function getCakeById(id: string) {
  return await prisma.cake.findUnique({ where: { id } });
}

// --- OBTENER TODAS LAS TORTAS ---
// 👇 Esta es la función que te está faltando.
export async function getCakes() {
  return await prisma.cake.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// --- CREAR UNA TORTA ---
export async function createCake(formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const description = formData.get('description') as string;
  const ingredients = formData.get('ingredients') as string;
  const instructions = formData.get('instructions') as string;
  const imageFile = formData.get('image') as File;

  let imageUrl = '';
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  }

  await prisma.cake.create({
    data: { name, price, description, ingredients, instructions, imageUrl },
  });

  revalidatePath('/admin');
}

// --- EDITAR UNA TORTA ---
export async function updateCake(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const description = formData.get('description') as string;
  const ingredients = formData.get('ingredients') as string;
  const instructions = formData.get('instructions') as string;
  const imageFile = formData.get('image') as File;

  let imageUrl: string | undefined = undefined;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  }

  await prisma.cake.update({
    where: { id },
    data: {
      name,
      price,
      description,
      ingredients,
      instructions,
      ...(imageUrl && { imageUrl }),
    },
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/edit/${id}`);
}


// --- BORRAR UNA TORTA ---
export async function deleteCake(formData: FormData) {
  const id = formData.get('id') as string;
  await prisma.cake.delete({ where: { id } });
  revalidatePath('/admin');
}