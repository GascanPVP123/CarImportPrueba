import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

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
    gap: 10,
  },
  logo: {
    width: 45,
    height: 45,
    objectFit: "contain",
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
  
  // 📊 TABLA SUPERIOR CORREGIDA CON MEDIDAS FIJAS
  clientTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    marginBottom: 15,
    overflow: "hidden",
  },
  clientTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  clientTableCellLabel: {
    width: 110, // Ancho fijo en puntos de PDF, suficiente para "Cliente / Razón Social" sin cortarse
    backgroundColor: "#f8fafc",
    padding: 6,
    fontWeight: "bold",
    color: "#475569",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
  },
  clientTableCellValue: {
    flex: 1, // Ocupa todo el espacio restante de la fila
    padding: 6,
    color: "#1f2937",
  },

  // 🛒 TABLA DE ITEMS
  table: {
    width: "auto",
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
  
  colSku: { width: "15%", paddingLeft: 6 },
  colDesc: { width: "35%" },
  colMedida: { width: "10%", textAlign: "center" },
  colCant: { width: "8%", textAlign: "center" },
  colPrecio: { width: "11%", textAlign: "right" },
  colDescPorcentaje: { width: "9%", textAlign: "center" },
  colTotal: { width: "12%", textAlign: "right", paddingRight: 6 },
  
  headerText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#475569",
    textTransform: "uppercase",
  },

  // 💰 SECCIÓN INFERIOR FIJA (REEMPLAZADOS TODOS LOS DIVS POR VIEWS)
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
    gap: 2,
  },
  totalFinancialBox: {
    width: "40%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    backgroundColor: "#f8fafc",
    overflow: "hidden",
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  financialLabel: {
    color: "#475569",
  },
  financialAmount: {
    textAlign: "right",
    color: "#1f2937",
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
  }
});

interface PDFProps {
  cotizacionId: number;
  clienteNombre: string;
  clienteDocumento?: string;
  horaEmision: string;
  items: Array<{
    codigoSku: string;
    nombre: string;
    cantidad: number;
    precioVenta: number;
    unidadMedida?: string;
    descuentoPorcentaje: number;
  }>;
  totalBruto: number;
  totalDescuento: number;
  totalNeto: number;
}

export default function CotizacionPDF({ cotizacionId, clienteNombre, clienteDocumento, horaEmision, items, totalBruto, totalDescuento, totalNeto }: PDFProps) {
  const subtotalNeto = totalNeto / 1.18;
  const igvNeto = totalNeto - subtotalNeto;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <View style={styles.brandSection}>
            <Image src="/images/logo.png" style={styles.logo} />
            <View style={styles.brandTextContainer}>
              <Text style={styles.brandTitle}>CAR IMPORT RAMOS & HUAMAN S.A.C.</Text>
              <Text style={styles.brandSubtitle}>Venta de Autopartes y Repuestos de Importación</Text>
              <Text style={styles.brandSubtitle}>RUC: 20123456789 | Ate, Lima, Perú</Text>
            </View>
          </View>
          <View style={styles.docTitleContainer}>
            <Text style={styles.docTitle}>COTIZACIÓN OFICIAL</Text>
            <Text style={styles.docId}>Nro: #000{cotizacionId}</Text>
          </View>
        </View>

        {/* 📊 TABLA SUPERIOR ACTUALIZADA */}
        <View style={styles.clientTable}>
          <View style={styles.clientTableRow}>
            <Text style={styles.clientTableCellLabel}>Cliente / Razón Social</Text>
            <Text style={styles.clientTableCellValue}>{clienteNombre}</Text>
          </View>
          <View style={[styles.clientTableRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.clientTableCellLabel}>RUC / DNI Cliente</Text>
            <Text style={styles.clientTableCellValue}>{clienteDocumento || "N/A"}</Text>
            <Text style={[styles.clientTableCellLabel, { borderLeftWidth: 1 }]}>Fecha y Hora</Text>
            <Text style={styles.clientTableCellValue}>
              {new Date().toLocaleDateString()} - {horaEmision || "18:00"}
            </Text>
          </View>
        </View>

        {/* 🛒 TABLA DE ITEMS */}
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colSku, styles.headerText]}>Código SKU</Text>
            <Text style={[styles.colDesc, styles.headerText]}>Descripción del Repuesto</Text>
            <Text style={[styles.colMedida, styles.headerText]}>Medida</Text>
            <Text style={[styles.colCant, styles.headerText]}>Cant.</Text>
            <Text style={[styles.colPrecio, styles.headerText]}>P. Unit</Text>
            <Text style={[styles.colDescPorcentaje, styles.headerText]}>Desc.</Text>
            <Text style={[styles.colTotal, styles.headerText]}>Subtotal</Text>
          </View>

          {items.map((item, index) => {
            const subtotalItem = item.precioVenta * item.cantidad;
            const ahorroItem = subtotalItem * (item.descuentoPorcentaje / 100);
            const totalItemFinal = subtotalItem - ahorroItem;

            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.colSku, { fontSize: 8 }]}>{item.codigoSku || "N/A"}</Text>
                <Text style={styles.colDesc}>{item.nombre}</Text>
                <Text style={styles.colMedida}>{item.unidadMedida || "unid"}</Text>
                <Text style={styles.colCant}>{item.cantidad}</Text>
                <Text style={styles.colPrecio}>S/. {item.precioVenta.toFixed(2)}</Text>
                <Text style={styles.colDescPorcentaje}>{item.descuentoPorcentaje || 0}%</Text>
                <Text style={styles.colTotal}>S/. {totalItemFinal.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        {/* 💰 SECCIÓN INFERIOR COMPLETA (CORREGIDA AL 100% PARA LA LIBRERÍA) */}
        <View style={styles.fixedBottomSection} fixed>
          <View style={styles.notesBox}>
            <Text style={{ fontWeight: "bold", color: "#475569", marginBottom: 2 }}>Términos y Condiciones:</Text>
            <Text>1. Los precios ya incluyen el descuento por mayor e IGV (18%).</Text>
            <Text>2. Tipo de Moneda: Soles (S/.).</Text>
            <Text>3. Oferta válida por 7 días calendario.</Text>
            <Text>4. Despacho inmediato tras verificar el abono en cuenta.</Text>
          </View>
          
          <View style={styles.totalFinancialBox}>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Total Bruto:</Text>
              <Text style={styles.financialAmount}>S/. {totalBruto ? totalBruto.toFixed(2) : "0.00"}</Text>
            </View>
            <View style={styles.financialRow}>
              <Text style={[styles.financialLabel, { color: "#dc2626" }]}>Descuento:</Text>
              <Text style={[styles.financialAmount, { color: "#dc2626" }]}>
                - S/. {totalDescuento ? totalDescuento.toFixed(2) : "0.00"}
              </Text>
            </View>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Subtotal Neto:</Text>
              <Text style={styles.financialAmount}>S/. {subtotalNeto ? subtotalNeto.toFixed(2) : "0.00"}</Text>
            </View>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>IGV (18%):</Text>
              <Text style={styles.financialAmount}>S/. {igvNeto ? igvNeto.toFixed(2) : "0.00"}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Neto:</Text>
              <Text style={styles.totalAmount}>S/. {totalNeto ? totalNeto.toFixed(2) : "0.00"}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          CarImport System - Reporte Oficial de Cotización Corporativa.
        </Text>
      </Page>
    </Document>
  );
}