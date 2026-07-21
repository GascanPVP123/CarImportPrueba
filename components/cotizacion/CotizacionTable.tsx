"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CotizacionItem, TipoPrecio } from "@/types/cotizacion";

interface CotizacionTableProps {
  items: CotizacionItem[];
  onCambiarTipoPrecio?: (index: number, nuevoTipo: TipoPrecio) => void;
  onCambiarPrecioManual?: (index: number, nuevoPrecio: number) => void;
}

export function CotizacionTable({
  items,
  onCambiarTipoPrecio,
  onCambiarPrecioManual,
}: CotizacionTableProps) {
  return (
    <div className="border border-[#E5E7EB] rounded-none overflow-hidden">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="bg-[#E5E7EB] hover:bg-[#E5E7EB] border-b border-[#E5E7EB]">
            <TableHead className="w-[40px] text-center font-bold text-gray-600 py-1.5">
              ITEM
            </TableHead>
            <TableHead className="w-[90px] font-bold text-gray-600 py-1.5">
              CÓDIGO
            </TableHead>
            <TableHead className="w-[50px] text-center font-bold text-gray-600 py-1.5">
              CANT.
            </TableHead>
            <TableHead className="w-[50px] text-center font-bold text-gray-600 py-1.5">
              UNID
            </TableHead>
            <TableHead className="font-bold text-gray-600 py-1.5">
              DESCRIPCIÓN
            </TableHead>
            <TableHead className="w-[140px] text-right font-bold text-gray-600 py-1.5">
              P. VENTA
            </TableHead>
            <TableHead className="w-[90px] text-right font-bold text-gray-600 py-1.5">
              IMPORTE
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                No hay productos en esta cotización
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => {
              const numeroItem = index + 1;

              return (
                <TableRow
                  key={item.productoId || index}
                  className="border-b border-[#E5E7EB] hover:bg-gray-50/50"
                >
                  <TableCell className="text-center font-mono text-gray-600 py-2">
                    {numeroItem}
                  </TableCell>
                  <TableCell className="font-mono text-gray-700 py-2">
                    {item.codigo}
                  </TableCell>
                  <TableCell className="text-center text-gray-700 py-2">
                    {item.cantidad}
                  </TableCell>
                  <TableCell className="text-center text-gray-500 py-2">
                    {item.unidad}
                  </TableCell>
                  <TableCell className="text-gray-800 py-2">
                    {item.descripcion}
                  </TableCell>

                  {/* Selector e Input con callback defensivo */}
                  <TableCell className="text-right py-2 min-w-[140px]">
                    <div className="flex flex-col gap-1 items-end">
                      {onCambiarTipoPrecio ? (
                        <select
                          value={item.tipoPrecio || "MENOR"}
                          onChange={(e) =>
                            onCambiarTipoPrecio(index, e.target.value as TipoPrecio)
                          }
                          className="text-[11px] border rounded px-1 py-0.5 bg-background text-foreground focus:outline-none"
                        >
                          <option value="MENOR">
                            P. Menor (S/ {(item.precioMenor || item.precioVenta).toFixed(2)})
                          </option>
                          <option value="MAYOR">
                            P. Mayor (S/ {(item.precioMayor || item.precioVenta).toFixed(2)})
                          </option>
                          <option value="LIBRE">✏️ Oferta Libre</option>
                        </select>
                      ) : null}

                      {item.tipoPrecio === "LIBRE" && onCambiarPrecioManual ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">S/</span>
                          <input
                            type="number"
                            step="0.01"
                            value={item.precioVenta}
                            onChange={(e) =>
                              onCambiarPrecioManual(
                                index,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-20 text-right text-xs font-mono font-semibold border rounded px-1 py-0.5 bg-amber-50 focus:bg-white"
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-gray-700 font-medium">
                          S/ {item.precioVenta.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right font-mono font-semibold text-gray-900 py-2">
                    S/ {item.importe.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}