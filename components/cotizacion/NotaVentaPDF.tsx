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

const styles = StyleSheet.create({
  page: { padding: 25, paddingBottom: 50, fontSize: 8, fontFamily: "Helvetica", color: COLORS.textDark, backgroundColor: COLORS.white },
  headerContainer: { flexDirection: "row", borderWidth: 1, borderColor: COLORS.primary, borderRadius: 4, overflow: "hidden", marginBottom: 10 },
  logoSection: { width: 60, padding: 8, justifyContent: "center", alignItems: "center", borderRightWidth: 1, borderRightColor: COLORS.border },
  logo: { width: 40, height: 40, borderRadius: 4 },
  empresaSection: { flex: 1, padding: 8, justifyContent: "center" },
  empresaNombre: { fontSize: 12, fontWeight: "bold", color: COLORS.primary },
  empresaRuc: { fontSize: 7, color: COLORS.textMedium, marginTop: 2 },
  empresaDireccion: { fontSize: 6.5, color: COLORS.textLight, marginTop: 1 },
  empresaContacto: { fontSize: 6.5, color: COLORS.textLight, marginTop: 1 },
  empresaEmail: { fontSize: 6.5, color: COLORS.textLight, marginTop: 1 },
  docSection: { width: 105, padding: 8, justifyContent: "center", alignItems: "center", borderLeftWidth: 1, borderLeftColor: COLORS.border, backgroundColor: COLORS.totalBg },
  docLabel: { fontSize: 8, fontWeight: "bold", color: COLORS.totalText, textTransform: "uppercase" },
  docNumero: { fontSize: 13, fontWeight: "bold", color: COLORS.totalText, marginTop: 2 },
  docFecha: { fontSize: 6, color: COLORS.totalText, marginTop: 2 },
  clienteContainer: { flexDirection: "row", marginBottom: 10, gap: 6 },
  clienteBox: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, overflow: "hidden" },
  clienteHeader: { backgroundColor: COLORS.primary, paddingVertical: 4, paddingLeft: 10 },
  clienteHeaderText: { fontSize: 8, fontWeight: "bold", color: COLORS.white, textTransform: "uppercase" },
  clienteBody: { padding: 6 },
  clienteField: { flexDirection: "row", marginBottom: 2 },
  clienteFieldLabel: { width: 55, fontSize: 7, fontWeight: "bold", color: COLORS.textMedium },
  clienteFieldValue: { flex: 1, fontSize: 7, color: COLORS.textDark },
  infoBox: { width: 190, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, overflow: "hidden" },
  infoHeader: { backgroundColor: COLORS.primary, paddingVertical: 4, paddingLeft: 10 },
  infoHeaderText: { fontSize: 8, fontWeight: "bold", color: COLORS.white, textTransform: "uppercase" },
  infoBody: { padding: 6 },
  infoField: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  infoFieldLabel: { fontSize: 7, fontWeight: "bold", color: COLORS.textMedium },
  infoFieldValue: { fontSize: 7, color: COLORS.textDark },
  tableContainer: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, overflow: "hidden", marginBottom: 10 },
  tableHeader: { flexDirection: "row", backgroundColor: COLORS.primary },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableRowAlternate: { backgroundColor: COLORS.headerBg },
  colItem: { width: 28, textAlign: "center", paddingVertical: 10, fontSize: 7, color: COLORS.white, fontWeight: "bold" },
  colCodigo: { width: 55, textAlign: "center", paddingVertical: 10, fontSize: 7, color: COLORS.white, fontWeight: "bold" },
  colDesc: { flex: 1, paddingLeft: 5, paddingVertical: 10, fontSize: 7, color: COLORS.white, fontWeight: "bold" },
  colCant: { width: 35, textAlign: "center", paddingVertical: 10, fontSize: 7, color: COLORS.white, fontWeight: "bold" },
  colUnid: { width: 35, textAlign: "center", paddingVertical: 10, fontSize: 7, color: COLORS.white, fontWeight: "bold" },
  colPrecio: { width: 55, textAlign: "right", paddingRight: 5, paddingVertical: 10, fontSize: 7, color: COLORS.white, fontWeight: "bold" },
  colImporte: { width: 60, textAlign: "right", paddingRight: 5, paddingVertical: 10, fontSize: 7, color: COLORS.white, fontWeight: "bold" },
  cellItem: { width: 28, textAlign: "center", paddingVertical: 10, fontSize: 7, color: COLORS.textMedium },
  cellCodigo: { width: 55, textAlign: "center", paddingVertical: 10, fontSize: 7, color: COLORS.textDark },
  cellDesc: { flex: 1, paddingLeft: 5, paddingVertical: 10, fontSize: 7, color: COLORS.textDark },
  cellCant: { width: 35, textAlign: "center", paddingVertical: 10, fontSize: 7, color: COLORS.textDark },
  cellUnid: { width: 35, textAlign: "center", paddingVertical: 10, fontSize: 7, color: COLORS.textMedium },
  cellPrecio: { width: 55, textAlign: "right", paddingRight: 5, paddingVertical: 10, fontSize: 7, color: COLORS.textDark },
  cellImporte: { width: 60, textAlign: "right", paddingRight: 5, paddingVertical: 10, fontSize: 7, fontWeight: "bold", color: COLORS.textDark },
  observacionesSection: { padding: 8, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, marginBottom: 8 },
  observacionesTitulo: { fontSize: 8, fontWeight: "bold", color: COLORS.primary, marginBottom: 4, textTransform: "uppercase" },
  observacionLine: { fontSize: 7, color: COLORS.textMedium, marginBottom: 2, paddingLeft: 6 },
  bottomRow: { flexDirection: "row", borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, overflow: "hidden" },
  cuentasSection: { flex: 1, padding: 8, borderRightWidth: 1, borderRightColor: COLORS.border },
  cuentasTitulo: { fontSize: 8, fontWeight: "bold", color: COLORS.primary, marginBottom: 4, textTransform: "uppercase" },
  cuentaLine: { fontSize: 7, color: COLORS.textDark, marginBottom: 2, paddingLeft: 4 },
  cuentaTitular: { fontSize: 6.5, color: COLORS.textLight, marginTop: 6, paddingLeft: 4 },
  qrSection: { width: 120, padding: 8, justifyContent: "center", alignItems: "center", borderRightWidth: 1, borderRightColor: COLORS.border },
  qrImage: { width: 55, height: 55, marginBottom: 4 },
  qrNumero: { fontSize: 8, fontWeight: "bold", color: COLORS.textDark, textAlign: "center" },
  qrNombre: { fontSize: 7, color: COLORS.textMedium, textAlign: "center", marginTop: 2 },
  totalSection: { width: 150, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.totalBg, padding: 8 },
  totalLabel: { fontSize: 8, fontWeight: "bold", color: COLORS.totalText, textTransform: "uppercase", marginBottom: 6 },
  totalValue: { fontSize: 17, fontWeight: "bold", color: COLORS.totalText },
  footerFixed: { position: "absolute", bottom: 15, left: 25, right: 25, textAlign: "center", borderTopWidth: 1, borderTopColor: COLORS.primary, paddingTop: 6 },
  footerText: { fontSize: 6, color: COLORS.textLight, textAlign: "center", marginBottom: 1 },
});

interface NotaVentaPDFProps {
  id: number;
  cliente: { nombre: string; ruc: string; direccion: string; telefono: string };
  items: Array<{ item: number; codigo: string; cantidad: number; unidad: string; descripcion: string; precioVenta: number; importe: number }>;
  fechaEmision: string;
  horaEmision: string;
  totalNeto: number;
}

export default function NotaVentaPDF({ id, cliente, items, fechaEmision, horaEmision, totalNeto }: NotaVentaPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}><Image src="/images/logo_empresa.jpg" style={styles.logo} /></View>
          <View style={styles.empresaSection}>
            <Text style={styles.empresaNombre}>CAR IMPORT RAMOS & HUAMAN S.A.C.</Text>
            <Text style={styles.empresaRuc}>RUC 20123456789</Text>
            <Text style={styles.empresaDireccion}>Av. Gerardo Unger 4485 Int. 16 - Lima</Text>
            <Text style={styles.empresaContacto}>Tel: 977 182 320</Text>
            <Text style={styles.empresaEmail}>ventas@carimport.com</Text>
          </View>
          <View style={styles.docSection}>
            <Text style={styles.docLabel}>NOTA DE VENTA</Text>
            <Text style={styles.docNumero}>NV-000{id}</Text>
            <Text style={styles.docFecha}>{fechaEmision} - {horaEmision}</Text>
          </View>
        </View>

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
          <View style={styles.infoBox}>
            <View style={styles.infoHeader}><Text style={styles.infoHeaderText}>Información</Text></View>
            <View style={styles.infoBody}>
              <View style={styles.infoField}><Text style={styles.infoFieldLabel}>Fecha:</Text><Text style={styles.infoFieldValue}>{fechaEmision}</Text></View>
              <View style={styles.infoField}><Text style={styles.infoFieldLabel}>Moneda:</Text><Text style={styles.infoFieldValue}>SOLES</Text></View>
              <View style={styles.infoField}><Text style={styles.infoFieldLabel}>Condición:</Text><Text style={styles.infoFieldValue}>CONTADO</Text></View>
              <View style={styles.infoField}><Text style={styles.infoFieldLabel}>Vigencia:</Text><Text style={[styles.infoFieldValue, { color: COLORS.success, fontWeight: "bold" }]}>Inmediata</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.colItem}>ITEM</Text><Text style={styles.colCodigo}>CÓDIGO</Text><Text style={styles.colDesc}>DESCRIPCIÓN</Text>
            <Text style={styles.colCant}>CANT</Text><Text style={styles.colUnid}>UND</Text><Text style={styles.colPrecio}>P.UNIT</Text><Text style={styles.colImporte}>IMPORTE</Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlternate : {}]} wrap={false}>
              <Text style={styles.cellItem}>{item.item}</Text><Text style={styles.cellCodigo}>{item.codigo}</Text><Text style={styles.cellDesc}>{item.descripcion}</Text>
              <Text style={styles.cellCant}>{item.cantidad}</Text><Text style={styles.cellUnid}>{item.unidad}</Text><Text style={styles.cellPrecio}>{item.precioVenta.toFixed(2)}</Text><Text style={styles.cellImporte}>{item.importe.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.observacionesSection}>
          <Text style={styles.observacionesTitulo}>Observaciones</Text>
          <Text style={styles.observacionLine}>• Precios incluyen IGV.</Text>
          <Text style={styles.observacionLine}>• Productos sujetos a disponibilidad de stock.</Text>
          <Text style={styles.observacionLine}>• Documento válido como comprobante de pago.</Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.cuentasSection}>
            <Text style={styles.cuentasTitulo}>Cuentas Bancarias</Text>
            <Text style={styles.cuentaLine}>BCP Soles: 191-01945499-0-48</Text>
            <Text style={styles.cuentaLine}>CCI: 002-191-10194549904851</Text>
            <Text style={styles.cuentaTitular}>Titular: CAR IMPORT RAMOS & HUAMAN S.A.C.</Text>
          </View>
          <View style={styles.qrSection}>
            <Image src="/images/yape.png" style={styles.qrImage} />
            <Text style={styles.qrNumero}>977 182 320</Text>
            <Text style={styles.qrNombre}>Yino Jauregui</Text>
          </View>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>S/ {totalNeto.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.footerFixed} fixed>
          <Text style={styles.footerText}>Gracias por su compra.</Text>
          <Text style={styles.footerText}>Documento válido como comprobante de pago.</Text>
        </View>
      </Page>
    </Document>
  );
}