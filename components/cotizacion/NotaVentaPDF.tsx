import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const COLORS = {
  primary: "#1e3a5f",
  headerBg: "#f1f5f9",
  border: "#cbd5e1",
  textDark: "#1e293b",
  textMedium: "#475569",
  textLight: "#94a3b8",
  white: "#ffffff",
  totalBg: "#1e3a5f",
  totalText: "#ffffff",
  success: "#059669",
};

const FIRST_PAGE_ITEMS = 30;
const NEXT_PAGE_ITEMS = 35;

const styles = StyleSheet.create({
  page: { padding: 25, paddingBottom: 50, fontSize: 7.5, fontFamily: "Helvetica", color: COLORS.textDark, backgroundColor: COLORS.white },
  headerContainer: { flexDirection: "row", borderWidth: 1, borderColor: COLORS.primary, borderRadius: 4, overflow: "hidden", marginBottom: 8 },
  logoSection: { width: 60, padding: 6, justifyContent: "center", alignItems: "center", borderRightWidth: 1, borderRightColor: COLORS.border },
  logo: { width: 40, height: 40, borderRadius: 4 },
  empresaSection: { flex: 1, padding: 6, justifyContent: "center" },
  empresaNombre: { fontSize: 11, fontWeight: "bold", color: COLORS.primary },
  empresaRuc: { fontSize: 6.5, color: COLORS.textMedium, marginTop: 1 },
  empresaDireccion: { fontSize: 6, color: COLORS.textLight, marginTop: 1 },
  empresaContacto: { fontSize: 6, color: COLORS.textLight, marginTop: 1 },
  docSection: { width: 100, padding: 6, justifyContent: "center", alignItems: "center", borderLeftWidth: 1, borderLeftColor: COLORS.border, backgroundColor: COLORS.totalBg },
  docLabel: { fontSize: 7, fontWeight: "bold", color: COLORS.totalText, textTransform: "uppercase" },
  docNumero: { fontSize: 12, fontWeight: "bold", color: COLORS.totalText, marginTop: 1 },
  docFecha: { fontSize: 5.5, color: COLORS.totalText, marginTop: 1 },
  clienteContainer: { flexDirection: "row", marginBottom: 8, gap: 6 },
  clienteBox: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, overflow: "hidden" },
  clienteHeader: { backgroundColor: COLORS.primary, paddingVertical: 3, paddingLeft: 8 },
  clienteHeaderText: { fontSize: 7, fontWeight: "bold", color: COLORS.white, textTransform: "uppercase" },
  clienteBody: { padding: 5 },
  clienteField: { flexDirection: "row", marginBottom: 1.5 },
  clienteFieldLabel: { width: 52, fontSize: 6, fontWeight: "bold", color: COLORS.textMedium },
  clienteFieldValue: { flex: 1, fontSize: 6, color: COLORS.textDark },
  tableContainer: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, overflow: "hidden", marginBottom: 8 },
  tableHeader: { flexDirection: "row", backgroundColor: COLORS.primary },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: COLORS.border },
  colItem: { width: 25, textAlign: "center", paddingVertical: 3, fontSize: 6, color: COLORS.white, fontWeight: "bold" },
  colCodigo: { width: 50, textAlign: "center", paddingVertical: 3, fontSize: 6, color: COLORS.white, fontWeight: "bold" },
  colDesc: { flex: 1, paddingLeft: 4, paddingVertical: 3, fontSize: 6, color: COLORS.white, fontWeight: "bold" },
  colCant: { width: 30, textAlign: "center", paddingVertical: 3, fontSize: 6, color: COLORS.white, fontWeight: "bold" },
  colUnid: { width: 30, textAlign: "center", paddingVertical: 3, fontSize: 6, color: COLORS.white, fontWeight: "bold" },
  colPrecio: { width: 50, textAlign: "right", paddingRight: 4, paddingVertical: 3, fontSize: 6, color: COLORS.white, fontWeight: "bold" },
  colImporte: { width: 55, textAlign: "right", paddingRight: 4, paddingVertical: 3, fontSize: 6, color: COLORS.white, fontWeight: "bold" },
  cellItem: { width: 25, textAlign: "center", paddingVertical: 3, fontSize: 6, color: COLORS.textMedium },
  cellCodigo: { width: 50, textAlign: "center", paddingVertical: 3, fontSize: 6, color: COLORS.textDark },
  cellDesc: { flex: 1, paddingLeft: 4, paddingVertical: 3, fontSize: 6, color: COLORS.textDark },
  cellCant: { width: 30, textAlign: "center", paddingVertical: 3, fontSize: 6, color: COLORS.textDark },
  cellUnid: { width: 30, textAlign: "center", paddingVertical: 3, fontSize: 6, color: COLORS.textMedium },
  cellPrecio: { width: 50, textAlign: "right", paddingRight: 4, paddingVertical: 3, fontSize: 6, color: COLORS.textDark },
  cellImporte: { width: 55, textAlign: "right", paddingRight: 4, paddingVertical: 3, fontSize: 6, fontWeight: "bold", color: COLORS.textDark },
  observacionesSection: { padding: 6, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, marginBottom: 6 },
  observacionesTitulo: { fontSize: 7, fontWeight: "bold", color: COLORS.primary, marginBottom: 3, textTransform: "uppercase" },
  observacionLine: { fontSize: 6, color: COLORS.textMedium, marginBottom: 1.5, paddingLeft: 6 },
  bottomRow: { flexDirection: "row", borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, overflow: "hidden" },
  cuentasSection: { flex: 1, padding: 6, borderRightWidth: 1, borderRightColor: COLORS.border },
  cuentasTitulo: { fontSize: 7, fontWeight: "bold", color: COLORS.primary, marginBottom: 3, textTransform: "uppercase" },
  cuentaLine: { fontSize: 6, color: COLORS.textDark, marginBottom: 1.5, paddingLeft: 4 },
  totalSection: { width: 140, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.totalBg, padding: 6 },
  totalLabel: { fontSize: 7, fontWeight: "bold", color: COLORS.totalText, textTransform: "uppercase", marginBottom: 4 },
  totalValue: { fontSize: 15, fontWeight: "bold", color: COLORS.totalText },
  footerFixed: { position: "absolute", bottom: 15, left: 25, right: 25, textAlign: "center", borderTopWidth: 1, borderTopColor: COLORS.primary, paddingTop: 5 },
  footerText: { fontSize: 5.5, color: COLORS.textLight, textAlign: "center", marginBottom: 1 },
});

interface NotaVentaPDFProps {
  id: number;
  cliente: { nombre: string; ruc: string; direccion: string; telefono: string };
  items: Array<{ item: number; codigo: string; cantidad: number; unidad: string; descripcion: string; precioVenta: number; importe: number }>;
  fechaEmision: string;
  horaEmision: string;
  totalNeto: number;
}

export function NotaVentaPDF({ id, cliente, items, fechaEmision, horaEmision, totalNeto }: NotaVentaPDFProps) {
  const pages: Array<typeof items> = [];
  pages.push(items.slice(0, FIRST_PAGE_ITEMS));
  let index = FIRST_PAGE_ITEMS;
  while (index < items.length) {
    pages.push(items.slice(index, index + NEXT_PAGE_ITEMS));
    index += NEXT_PAGE_ITEMS;
  }
  if (pages.length === 0) pages.push([]);

  return (
    <Document>
      {pages.map((pageItems, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <Page key={pageIndex} size="A4" style={styles.page}>
            {/* Encabezado */}
            <View style={styles.headerContainer}>
              <View style={styles.logoSection}><Image src="/images/logo_empresa.jpg" style={styles.logo} /></View>
              <View style={styles.empresaSection}>
                <Text style={styles.empresaNombre}>CAR IMPORT RAMOS & HUAMAN S.A.C.</Text>
                <Text style={styles.empresaRuc}>RUC 20123456789</Text>
                <Text style={styles.empresaDireccion}>Av. Gerardo Unger 4485 Int. 16 - Lima</Text>
                <Text style={styles.empresaContacto}>Tel: 977 182 320 | ventas@carimport.com</Text>
              </View>
              <View style={styles.docSection}>
                <Text style={styles.docLabel}>NOTA DE VENTA</Text>
                <Text style={styles.docNumero}>NV-000{id}</Text>
                <Text style={styles.docFecha}>{fechaEmision} - {horaEmision}</Text>
              </View>
            </View>

            {/* Datos del cliente (solo primera página) */}
            {isFirstPage && (
              <View style={styles.clienteContainer}>
                <View style={styles.clienteBox}>
                  <View style={styles.clienteHeader}><Text style={styles.clienteHeaderText}>Datos del Cliente</Text></View>
                  <View style={styles.clienteBody}>
                    <View style={styles.clienteField}><Text style={styles.clienteFieldLabel}>Cliente:</Text><Text style={styles.clienteFieldValue}>{cliente.nombre}</Text></View>
                    <View style={styles.clienteField}><Text style={styles.clienteFieldLabel}>RUC/DNI:</Text><Text style={styles.clienteFieldValue}>{cliente.ruc}</Text></View>
                    <View style={styles.clienteField}><Text style={styles.clienteFieldLabel}>Dirección:</Text><Text style={styles.clienteFieldValue}>{cliente.direccion}</Text></View>
                    <View style={styles.clienteField}><Text style={styles.clienteFieldLabel}>Teléfono:</Text><Text style={styles.clienteFieldValue}>{cliente.telefono}</Text></View>
                  </View>
                </View>
              </View>
            )}

            {/* Tabla */}
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.colItem}>ITEM</Text><Text style={styles.colCodigo}>CÓDIGO</Text><Text style={styles.colDesc}>DESCRIPCIÓN</Text>
                <Text style={styles.colCant}>CANT</Text><Text style={styles.colUnid}>UND</Text><Text style={styles.colPrecio}>P.UNIT</Text><Text style={styles.colImporte}>IMPORTE</Text>
              </View>
              {pageItems.map((item, i) => (
                <View key={i} style={styles.tableRow} wrap={false}>
                  <Text style={styles.cellItem}>{item.item}</Text><Text style={styles.cellCodigo}>{item.codigo}</Text><Text style={styles.cellDesc}>{item.descripcion}</Text>
                  <Text style={styles.cellCant}>{item.cantidad}</Text><Text style={styles.cellUnid}>{item.unidad}</Text><Text style={styles.cellPrecio}>{item.precioVenta.toFixed(2)}</Text><Text style={styles.cellImporte}>{item.importe.toFixed(2)}</Text>
                </View>
              ))}
            </View>

            {/* Solo en la última página: Observaciones + Cuentas + Total */}
            {isLastPage && (
              <>
                <View style={styles.observacionesSection}>
                  <Text style={styles.observacionesTitulo}>Observaciones</Text>
                  <Text style={styles.observacionLine}>• Precios incluyen IGV.</Text>
                  <Text style={styles.observacionLine}>• Productos sujetos a disponibilidad de stock.</Text>
                </View>
                <View style={styles.bottomRow}>
                  <View style={styles.cuentasSection}>
                    <Text style={styles.cuentasTitulo}>Cuentas Bancarias</Text>
                    <Text style={styles.cuentaLine}>BCP Soles: 191-01945499-0-48</Text>
                    <Text style={styles.cuentaLine}>CCI: 002-191-10194549904851</Text>
                    <Text style={styles.cuentaLine}>Yape: 977 182 320</Text>
                  </View>
                  <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>S/ {totalNeto.toFixed(2)}</Text>
                  </View>
                </View>
              </>
            )}

            {/* Footer en todas las páginas */}
            <View style={styles.footerFixed} fixed>
              <Text style={styles.footerText}>Gracias por su compra.</Text>
              <Text style={styles.footerText}>Documento válido como comprobante de pago.</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}