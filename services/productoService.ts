const API_URL = "http://127.0.0.1:8080/api/productos";

export interface Producto {
  id?: number;
  codigoSku: string;
  nombre: string;
  imagenUrl: string | null;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  proveedor: any | null;
  createdAt?: string;
}

export const productoService = {
  listar: async (): Promise<Producto[]> => {
    const response = await fetch(API_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error("Error al obtener productos");
    return response.json();
  },
  
  eliminar: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Error al eliminar producto");
  },

  // 🔥 AGREGA ESTE NUEVO MÉTODO AQUÍ:
  listarStockBajo: async (): Promise<Producto[]> => {
    const response = await fetch(`${API_URL}/stock-bajo`, { cache: 'no-store' });
    if (!response.ok) throw new Error("Error al obtener productos con stock bajo");
    return response.json();
  },  

  guardar: async (producto: Producto): Promise<Producto> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      const msgError = await response.text();
      throw new Error(msgError || "Error al registrar el nuevo producto.");
    }

    return response.json();
  },

  actualizar: async (id: number, producto: Producto): Promise<Producto> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT", // O POST dependiendo de cómo esté anotado en tu java (@PutMapping)
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      const msgError = await response.text();
      throw new Error(msgError || "Error al actualizar la autoparte.");
    }

    return response.json();
  }
};