"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { DocumentProps } from "@react-pdf/renderer";

interface DescargarPDFButtonProps {
  documento: React.ReactElement<DocumentProps>;
  nombreArchivo?: string;
  fileName?: string; // Para mantener compatibilidad con usos anteriores
  className?: string;
  children?: React.ReactNode;
}

export default function DescargarPDFButton({
  documento,
  nombreArchivo,
  fileName,
  className,
  children,
}: DescargarPDFButtonProps) {
  const [generando, setGenerando] = useState(false);

  const finalFileName = nombreArchivo || fileName || "documento.pdf";

  const handleClick = async () => {
    try {
      setGenerando(true);

      // Carga dinámica de @react-pdf/renderer solo en el cliente
      const { pdf } = await import("@react-pdf/renderer");

      // Generamos el blob del documento recibido
      const blob = await pdf(documento).toBlob();

      // Forzamos la descarga en el navegador
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al generar el PDF:", err);
      alert("Error al generar el documento PDF");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={generando}
      className={className}
    >
      {generando ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {children || "PDF"}
    </Button>
  );
}