import React, { useMemo } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ItemCotizacion {
  codigoSku: string;
  nombre: string;
  cantidad: number;
  precioVenta: number;
  unidadMedida?: string;
}

interface PDFProps {
  cotizacionId: number;
  clienteNombre: string;
  clienteDocumento?: string;
  horaEmision: string;
  items: ItemCotizacion[];
  totalNeto: number;
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    color: "#334155",
    fontFamily: "Helvetica",
    position: "relative",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#10b981",
    paddingBottom: 12,
    marginBottom: 15,
  },
  brandSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
  brandTextContainer: {
    flexDirection: "column",
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  brandSubtitle: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 1,
  },
  docTitleContainer: {
    textAlign: "right",
    justifyContent: "center",
  },
  docTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10b981",
  },
  docId: {
    fontSize: 9,
    color: "#475569",
    fontWeight: "bold",
    marginTop: 2,
  },

  clientTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    marginBottom: 15,
  },
  clientTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  clientTableCellLabel: {
    width: 110,
    backgroundColor: "#f8fafc",
    padding: 6,
    fontWeight: "bold",
    color: "#475569",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
  },
  clientTableCellValue: {
    flex: 1,
    padding: 6,
    color: "#1f2937",
  },
  lastRow: {
    borderBottomWidth: 0,
  },

  table: {
    marginBottom: 15,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
    alignItems: "center",
  },
  // Nueva distribución: 15% SKU | 40% Descripción | 12% Medida | 8% Cant | 12% P. Unit | 13% Importe
  colSku: { width: "15%", paddingLeft: 6, fontSize: 8 },
  colDesc: { width: "40%", fontSize: 9 },
  colMedida: { width: "12%", textAlign: "center", fontSize: 9 },
  colCant: { width: "8%", textAlign: "center", fontSize: 9 },
  colPrecio: { width: "12%", textAlign: "right", fontSize: 9 },
  colImporte: { width: "13%", textAlign: "right", paddingRight: 6, fontSize: 9 },
  headerText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#475569",
    textTransform: "uppercase",
  },

  fixedBottomSection: {
    position: "absolute",
    bottom: 50,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  notesBox: {
    width: "50%",
    fontSize: 8,
    color: "#64748b",
  },
  noteLine: {
    marginBottom: 2,
  },
  noteTitle: {
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 4,
  },
  totalBox: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    backgroundColor: "#f8fafc",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0f172a",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  totalLabel: {
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 9,
  },
  totalAmount: {
    fontWeight: "bold",
    color: "#10b981",
    fontSize: 10,
    textAlign: "right",
  },

  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
});

// ---------------------------------------------------------------------------
// Subcomponentes
// ---------------------------------------------------------------------------

const Header: React.FC<{ cotizacionId: number }> = ({ cotizacionId }) => (
  <View style={styles.headerContainer}>
    <View style={styles.brandSection}>
      <Image src="/images/logo_empresa.jpg" style={styles.logo} />
      <View style={styles.brandTextContainer}>
        <Text style={styles.brandTitle}>CAR IMPORT RAMOS & HUAMAN S.A.C.</Text>
        <Text style={styles.brandSubtitle}>
          Venta de Autopartes y Repuestos de Importación
        </Text>
        <Text style={styles.brandSubtitle}>
          RUC: 10737387572 | Av Gerardo Unger 4485, Independencia
        </Text>
      </View>
    </View>
    <View style={styles.docTitleContainer}>
      <Text style={styles.docTitle}>COTIZACIÓN OFICIAL</Text>
      <Text style={styles.docId}>Nro: #000{cotizacionId}</Text>
    </View>
  </View>
);

const ClientInfo: React.FC<{
  clienteNombre: string;
  clienteDocumento?: string;
  horaEmision: string;
}> = ({ clienteNombre, clienteDocumento, horaEmision }) => (
  <View style={styles.clientTable}>
    <View style={styles.clientTableRow}>
      <Text style={styles.clientTableCellLabel}>Cliente / Razón Social</Text>
      <Text style={styles.clientTableCellValue}>{clienteNombre}</Text>
    </View>
    <View style={[styles.clientTableRow, styles.lastRow]}>
      <Text style={styles.clientTableCellLabel}>RUC / DNI Cliente</Text>
      <Text style={styles.clientTableCellValue}>
        {clienteDocumento || "N/A"}
      </Text>
      <Text style={[styles.clientTableCellLabel, { borderLeftWidth: 1 }]}>
        Fecha y Hora
      </Text>
      <Text style={styles.clientTableCellValue}>
        {new Date().toLocaleDateString()} - {horaEmision || "18:00"}
      </Text>
    </View>
  </View>
);

const ItemsTable: React.FC<{ items: ItemCotizacion[] }> = ({ items }) => {
  const rows = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        importe: item.precioVenta * item.cantidad,
      })),
    [items]
  );

  return (
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.colSku, styles.headerText]}>Código SKU</Text>
        <Text style={[styles.colDesc, styles.headerText]}>Descripción</Text>
        <Text style={[styles.colMedida, styles.headerText]}>Medida</Text>
        <Text style={[styles.colCant, styles.headerText]}>Cant.</Text>
        <Text style={[styles.colPrecio, styles.headerText]}>P. Unit</Text>
        <Text style={[styles.colImporte, styles.headerText]}>Importe</Text>
      </View>

      {rows.map((row, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.colSku}>{row.codigoSku || "N/A"}</Text>
          <Text style={styles.colDesc}>{row.nombre}</Text>
          <Text style={styles.colMedida}>{row.unidadMedida || "unid"}</Text>
          <Text style={styles.colCant}>{row.cantidad}</Text>
          <Text style={styles.colPrecio}>
            S/. {row.precioVenta.toFixed(2)}
          </Text>
          <Text style={styles.colImporte}>
            S/. {row.importe.toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const TotalSection: React.FC<{ total: number }> = ({ total }) => (
  <View style={styles.fixedBottomSection} fixed>
    <View style={styles.notesBox}>
      <Text style={styles.noteTitle}>Términos y Condiciones:</Text>
      <Text style={styles.noteLine}>
        1. Los precios ya incluyen todos los descuentos aplicables.
      </Text>
      <Text style={styles.noteLine}>2. Tipo de Moneda: Soles (S/.).</Text>
      <Text style={styles.noteLine}>
        3. Oferta válida por 7 días calendario.
      </Text>
      <Text style={styles.noteLine}>
        4. Despacho inmediato tras verificar el abono en cuenta.
      </Text>
    </View>

    <View style={styles.totalBox}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>
          S/. {total?.toFixed(2) ?? "0.00"}
        </Text>
      </View>
    </View>
  </View>
);

const Footer: React.FC = () => (
  <Text style={styles.footer} fixed>
    CarImport System - Reporte Oficial de Cotización 
  </Text>
);

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const CotizacionPDF: React.FC<PDFProps> = ({
  cotizacionId,
  clienteNombre,
  clienteDocumento,
  horaEmision,
  items,
  totalNeto,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header cotizacionId={cotizacionId} />
      <ClientInfo
        clienteNombre={clienteNombre}
        clienteDocumento={clienteDocumento}
        horaEmision={horaEmision}
      />
      <ItemsTable items={items} />
      <TotalSection total={totalNeto} />
      <Footer />
    </Page>
  </Document>
);

export default CotizacionPDF;