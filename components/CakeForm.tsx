'use client';

// Este es un Componente de Cliente, solo se encarga de mostrar el formulario.

// Definimos un tipo para los datos de la torta que recibirá el formulario
type CakeData = {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  ingredients?: string | null;
  instructions?: string | null;
  imageUrl?: string | null;
} | null;

export default function CakeForm({
  action,
  cake,
}: {
  action: (formData: FormData) => void;
  cake?: CakeData;
}) {
  return (
    <form action={action}>
      {cake && <input type="hidden" name="id" value={cake.id} />}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nombre de la Torta</label>
        <input type="text" name="name" className="form-control" defaultValue={cake?.name ?? ''} required />
      </div>
      <div className="mb-3">
        <label htmlFor="price" className="form-label">Precio</label>
        <input type="number" name="price" step="0.01" className="form-control" defaultValue={cake?.price} required />
      </div>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">Imagen {cake ? '(Opcional, solo si quieres cambiarla)' : ''}</label>
        <input type="file" name="image" className="form-control" accept="image/*" />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Descripción Corta</label>
        <input type="text" name="description" className="form-control" defaultValue={cake?.description ?? ''} />
      </div>
      <div className="mb-3">
        <label htmlFor="ingredients" className="form-label">Ingredientes (puedes usar varias líneas)</label>
        <textarea name="ingredients" className="form-control" rows={3} defaultValue={cake?.ingredients ?? ''}></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="instructions" className="form-label">Instrucciones</label>
        <textarea name="instructions" className="form-control" rows={5} defaultValue={cake?.instructions ?? ''}></textarea>
      </div>
      <button type="submit" className="btn btn-primary">
        {cake ? 'Actualizar Receta' : 'Guardar Nueva Receta'}
      </button>
    </form>
  );
}