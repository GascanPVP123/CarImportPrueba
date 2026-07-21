"use client";

import React, { useEffect, useState } from "react";
import { notaVentaService } from "@/services/notaVentaService";
import { NotaVentaHistorial, DetalleNotaVenta } from "@/types/notaVenta";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Trash2, RefreshCw } from "lucide-react";
import DescargarPDFButton from "@/components/cotizacion/DescargarPDFButton";
import NotaVentaPDF from "@/components/cotizacion/NotaVentaPDF";

// 🛡️ Extraedores de información exhaustivos (Revisan todas las claves posibles del Backend)
// 🛡️ Extraedores de información con soporte dinámico para DNI y Razón Social

const getNumeroDoc = (n: NotaVentaHistorial) =>
  n.numeroDocumento || n.numero || (n.id ? `NV-000${n.id}` : "—");

const getClienteNombre = (n: NotaVentaHistorial) => {
  const cli = n.cliente as (typeof n.cliente & { razonSocial?: string }) | undefined;
  return n.clienteNombre || cli?.nombre || cli?.razonSocial || "Cliente General";
};

const getClienteDocumento = (n: NotaVentaHistorial) => {
  // Realizamos un cast genérico a objeto para leer cualquier clave devuelta por la API
  const obj = n as unknown as Record<string, unknown>;
  const cli = (n.cliente || {}) as Record<string, unknown>;

  return String(
    // 1. Campos directos en el objeto 'NotaVenta'
    n.clienteDocumento ||
    obj.documentoCliente ||
    obj.numDocumento ||
    obj.dniCliente ||
    obj.rucCliente ||
    
    // 2. Campos dentro del objeto anidado 'cliente'
    n.cliente?.numeroDocumento ||
    n.cliente?.ruc ||
    cli.dni ||
    cli.numDocumento ||
    cli.documento ||
    ""
  );
};

const getDetalleSku = (d: DetalleNotaVenta) =>
  d.sku || d.codigo || d.producto?.codigoSku || "—";

const getDetalleDescripcion = (d: DetalleNotaVenta) =>
  d.descripcion || d.producto?.nombre || "—";

const getDetalleImporte = (d: DetalleNotaVenta) =>
  d.subtotal ?? d.importe ?? (d.precioUnitario * d.cantidad);

export default function HistorialPedidosPage() {
  const [notas, setNotas] = useState<NotaVentaHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [notaSeleccionada, setNotaSeleccionada] = useState<NotaVentaHistorial | null>(null);

  const cargarHistorial = async () => {
    try {
      const data = await notaVentaService.obtenerHistorial();
      setNotas(data || []);
    } catch (error) {
      console.error("Error al cargar el historial de ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const ejecutarCarga = async () => {
        try {
        const data = await notaVentaService.obtenerHistorial();
        if (!ignore) {
            console.log("🔍 ESTRUCTURA EXACTA DEL BACKEND:", data[0]); // 👈 MIRA ESTO EN LA CONSOLA (F12)
            setNotas(data || []);
        }
        } catch (error) {
        console.error("Error al cargar el historial de ventas:", error);
        } finally {
        setLoading(false);
        }
    };

    ejecutarCarga();

    return () => {
        ignore = true;
    };
    }, []);

  const handleRecargar = () => {
    setLoading(true);
    cargarHistorial();
  };

  const handleAnularNotaVenta = async (id: number, numeroDoc: string) => {
    const confirmacion = confirm(
      `¿Estás seguro de que deseas anular la Nota de Venta "${numeroDoc}"?\nEsta acción devolverá el stock correspondiente a los productos.`
    );

    if (!confirmacion) return;

    try {
      await notaVentaService.anular(id);
      setNotas((prev) =>
        prev.map((nota) =>
          nota.id === id ? { ...nota, estado: "ANULADA" } : nota
        )
      );
      alert(`La Nota de Venta ${numeroDoc} ha sido anulada con éxito.`);
    } catch (error) {
      console.error("Error al anular nota de venta:", error);
      alert("Ocurrió un error al intentar anular la nota de venta.");
    }
  };

  const notasFiltradas = notas.filter((n) => {
    const query = busqueda.toLowerCase().trim();
    const numeroDoc = getNumeroDoc(n).toLowerCase();
    const clienteNombre = getClienteNombre(n).toLowerCase();
    const clienteDoc = getClienteDocumento(n).toLowerCase();

    return (
      numeroDoc.includes(query) ||
      clienteNombre.includes(query) ||
      clienteDoc.includes(query)
    );
  });

  const formatearFecha = (fechaRaw: string) => {
    if (!fechaRaw) return "—";
    try {
      const strFecha =
        typeof fechaRaw === "string" && !fechaRaw.includes("T")
          ? `${fechaRaw}T00:00:00`
          : fechaRaw;

      const fecha = new Date(strFecha);
      if (isNaN(fecha.getTime())) return String(fechaRaw);

      return fecha.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return String(fechaRaw);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Historial de Notas de Venta
          </h1>
          <p className="text-sm text-muted-foreground">
            Consulta todas las ventas emitidas, anula comprobantes y revisa el desglose de productos.
          </p>
        </div>
      </div>

      {/* Buscador y Recarga */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por N° doc, cliente o RUC/DNI..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRecargar}
          className="self-start sm:self-auto"
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5" /> Recargar
        </Button>
      </div>

      {/* Tabla de Resultados */}
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Documento</TableHead>
              <TableHead>Fecha / Hora</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>RUC / DNI</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Cargando historial de ventas...
                </TableCell>
              </TableRow>
            ) : notasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No se encontraron notas de venta registradas.
                </TableCell>
              </TableRow>
            ) : (
              notasFiltradas.map((nota) => {
                const numDoc = getNumeroDoc(nota);
                const nombreCli = getClienteNombre(nota);
                const docCli = getClienteDocumento(nota);
                const estadoDoc = nota.estado || "EMITIDA";
                const esAnulada = estadoDoc === "ANULADA";

                return (
                  <TableRow
                    key={nota.id}
                    className={esAnulada ? "bg-destructive/5 opacity-75" : ""}
                  >
                    <TableCell className="font-medium text-primary">
                      {numDoc}
                    </TableCell>
                    <TableCell>
                      {formatearFecha(nota.fechaEmision)}
                    </TableCell>
                    <TableCell>{nombreCli}</TableCell>
                    <TableCell>{docCli}</TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        esAnulada ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      S/ {nota.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={esAnulada ? "destructive" : "default"}>
                        {estadoDoc}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setNotaSeleccionada(nota)}
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <DescargarPDFButton
                        documento={<NotaVentaPDF datos={nota} />}
                        nombreArchivo={`NotaVenta_${numDoc}.pdf`}
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={esAnulada}
                        onClick={() => handleAnularNotaVenta(nota.id, numDoc)}
                        title={esAnulada ? "Nota ya anulada" : "Anular nota de venta"}
                        className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🟢 MODAL REFACTORIZADO CON ALTURA CONTROLADA Y SCROLL INTERNO */}
      <Dialog open={!!notaSeleccionada} onOpenChange={() => setNotaSeleccionada(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden p-6">
          <DialogHeader className="shrink-0 pb-2">
            <DialogTitle className="text-xl font-bold">
              Detalle de Nota de Venta: {notaSeleccionada ? getNumeroDoc(notaSeleccionada) : ""}
            </DialogTitle>
          </DialogHeader>

          {notaSeleccionada && (
            <div className="flex flex-col flex-1 overflow-hidden space-y-4">
              
              {/* Información del Cliente */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/40 p-3 rounded-lg shrink-0">
                <div>
                  <span className="font-semibold block text-xs text-muted-foreground">CLIENTE</span>
                  {getClienteNombre(notaSeleccionada)}
                </div>
                <div>
                  <span className="font-semibold block text-xs text-muted-foreground">DOCUMENTO (RUC / DNI)</span>
                  {getClienteDocumento(notaSeleccionada)}
                </div>
              </div>

              {/* 🟢 Tabla con Scroll Automático Interno */}
              <div className="flex-1 overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>SKU / Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-center">Cant.</TableHead>
                      <TableHead className="text-right">P. Unit.</TableHead>
                      <TableHead className="text-right">Importe</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(notaSeleccionada.detalles || []).map((det, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs">{getDetalleSku(det)}</TableCell>
                        <TableCell>{getDetalleDescripcion(det)}</TableCell>
                        <TableCell className="text-center">{det.cantidad}</TableCell>
                        <TableCell className="text-right">S/ {det.precioUnitario.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          S/ {getDetalleImporte(det).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pie de Modal con Total Fijo */}
              <div className="flex justify-between items-center border-t pt-3 shrink-0">
                <span className="text-xs text-muted-foreground font-medium">
                  Total de ítems: {(notaSeleccionada.detalles || []).length}
                </span>
                <span className="text-lg font-bold text-primary">
                  TOTAL: S/ {notaSeleccionada.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}