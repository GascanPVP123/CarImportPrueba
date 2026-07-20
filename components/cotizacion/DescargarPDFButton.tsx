"use client";

import { CotizacionPDFProps } from "@/types/cotizacion";

interface DescargarPDFButtonProps {
  cotizacionId: number;
  cliente: CotizacionPDFProps["cliente"];
  cabecera: CotizacionPDFProps["cabecera"];
  items: CotizacionPDFProps["items"];
  fechaEmision: string;
  horaEmision: string;
  fileName: string;
}

export function DescargarPDFButton({
  cotizacionId,
  cliente,
  cabecera,
  items,
  fechaEmision,
  horaEmision,
  fileName,
}: DescargarPDFButtonProps) {
  const handleClick = async () => {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: CotizacionPDF } = await import("@/components/cotizacion/CotizacionPDF");

      const blob = await pdf(
        CotizacionPDF({
          id: cotizacionId,
          cliente,
          cabecera,
          items,
          fechaEmision,
          horaEmision,
        })
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      document.body.appendChild(link);
      link.download = fileName;
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error al generar el PDF");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition shadow-sm"
    >
      📥 Descargar PDF Oficial
    </button>
  );
}