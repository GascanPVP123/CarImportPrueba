import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import { CotizacionPDFProps } from "@/types/cotizacion";

// ============================================================
// PALETA DE COLORES
// ============================================================
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

// ============================================================
// PAGINACIÓN
// ============================================================
const FIRST_PAGE_ITEMS = 15;
const NEXT_PAGE_ITEMS = 24;

// ============================================================
// ESTILOS
// ============================================================
const styles = StyleSheet.create({
  page: {
    padding: 25,
    paddingBottom: 50,
    fontSize: 7.5,
    fontFamily: "Helvetica",
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
  },
  pageWithAbsolute: {
    padding: 25,
    paddingBottom: 50,
    fontSize: 7.5,
    fontFamily: "Helvetica",
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
    position: "relative",
  },

  // HEADER
  headerContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  logoSection: {
    width: 60,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  empresaSection: {
    flex: 1,
    padding: 6,
    justifyContent: "center",
  },
  empresaNombre: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  empresaRuc: {
    fontSize: 6.5,
    color: COLORS.textMedium,
    marginTop: 1,
  },
  empresaDireccion: {
    fontSize: 6,
    color: COLORS.textLight,
    marginTop: 1,
  },
  empresaContacto: {
    fontSize: 6,
    color: COLORS.textLight,
    marginTop: 1,
  },
  empresaEmail: {
    fontSize: 6,
    color: COLORS.textLight,
    marginTop: 1,
  },
  cotizacionSection: {
    width: 95,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    backgroundColor: COLORS.headerBg,
  },
  cotizacionLabel: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: COLORS.textMedium,
    textTransform: "uppercase",
  },
  cotizacionNumero: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 1,
  },
  cotizacionFecha: {
    fontSize: 5.5,
    color: COLORS.textLight,
    marginTop: 1,
  },

  // CLIENTE
  clienteContainer: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 6,
  },
  clienteBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  clienteHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 3,
    paddingLeft: 8,
  },
  clienteHeaderText: {
    fontSize: 7,
    fontWeight: "bold",
    color: COLORS.white,
    textTransform: "uppercase",
  },
  clienteBody: {
    padding: 5,
  },
  clienteField: {
    flexDirection: "row",
    marginBottom: 1.5,
  },
  clienteFieldLabel: {
    width: 52,
    fontSize: 6,
    fontWeight: "bold",
    color: COLORS.textMedium,
  },
  clienteFieldValue: {
    flex: 1,
    fontSize: 6,
    color: COLORS.textDark,
  },
  infoBox: {
    width: 180,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  infoHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 3,
    paddingLeft: 8,
  },
  infoHeaderText: {
    fontSize: 7,
    fontWeight: "bold",
    color: COLORS.white,
    textTransform: "uppercase",
  },
  infoBody: {
    padding: 5,
  },
  infoField: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1.5,
  },
  infoFieldLabel: {
    fontSize: 6,
    fontWeight: "bold",
    color: COLORS.textMedium,
  },
  infoFieldValue: {
    fontSize: 6,
    color: COLORS.textDark,
  },

  // TABLA
  tableContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRowAlternate: {
    backgroundColor: COLORS.headerBg,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  colItem: {
    width: 25,
    textAlign: "center",
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.white,
    fontWeight: "bold",
  },
  colCodigo: {
    width: 50,
    textAlign: "center",
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.white,
    fontWeight: "bold",
  },
  colDesc: {
    flex: 1,
    paddingLeft: 4,
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.white,
    fontWeight: "bold",
  },
  colCant: {
    width: 30,
    textAlign: "center",
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.white,
    fontWeight: "bold",
  },
  colUnid: {
    width: 30,
    textAlign: "center",
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.white,
    fontWeight: "bold",
  },
  colPrecio: {
    width: 50,
    textAlign: "right",
    paddingRight: 4,
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.white,
    fontWeight: "bold",
  },
  colImporte: {
    width: 55,
    textAlign: "right",
    paddingRight: 4,
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.white,
    fontWeight: "bold",
  },
  cellItem: {
    width: 25,
    textAlign: "center",
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.textMedium,
  },
  cellCodigo: {
    width: 50,
    textAlign: "center",
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.textDark,
  },
  cellDesc: {
    flex: 1,
    paddingLeft: 4,
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.textDark,
  },
  cellCant: {
    width: 30,
    textAlign: "center",
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.textDark,
  },
  cellUnid: {
    width: 30,
    textAlign: "center",
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.textMedium,
  },
  cellPrecio: {
    width: 50,
    textAlign: "right",
    paddingRight: 4,
    paddingVertical: 3,
    fontSize: 6,
    color: COLORS.textDark,
  },
  cellImporte: {
    width: 55,
    textAlign: "right",
    paddingRight: 4,
    paddingVertical: 3,
    fontSize: 6,
    fontWeight: "bold",
    color: COLORS.textDark,
  },

  // OBSERVACIONES
  observacionesSection: {
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginBottom: 6,
  },
  observacionesTitulo: {
    fontSize: 7,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  observacionLine: {
    fontSize: 6,
    color: COLORS.textMedium,
    marginBottom: 1.5,
    paddingLeft: 6,
  },

  // CUENTAS + QR + TOTAL
  bottomRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  cuentasSection: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  cuentasTitulo: {
    fontSize: 7,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  cuentaLine: {
    fontSize: 6,
    color: COLORS.textDark,
    marginBottom: 1.5,
    paddingLeft: 4,
  },
  cuentaTitular: {
    fontSize: 5.5,
    color: COLORS.textLight,
    marginTop: 4,
    paddingLeft: 4,
  },
  qrSection: {
    width: 110,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  qrImage: {
    width: 50,
    height: 50,
    marginBottom: 3,
  },
  qrNumero: {
    fontSize: 7,
    fontWeight: "bold",
    color: COLORS.textDark,
    textAlign: "center",
  },
  qrNombre: {
    fontSize: 6,
    color: COLORS.textMedium,
    textAlign: "center",
    marginTop: 1,
  },
  totalSection: {
    width: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.totalBg,
    padding: 6,
  },
  totalLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: COLORS.totalText,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.totalText,
  },

  // BLOQUE INFERIOR ABSOLUTO
  bottomAbsolute: {
    position: "absolute",
    bottom: 50,
    left: 25,
    right: 25,
  },

  // FOOTER
  footerFixed: {
    position: "absolute",
    bottom: 15,
    left: 25,
    right: 25,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    paddingTop: 5,
  },
  footerText: {
    fontSize: 5.5,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 1,
  },
});

// ============================================================
// SUBCOMPONENTES
// ============================================================

const Header: React.FC<{
  id: number;
  fechaEmision: string;
  horaEmision: string;
}> = ({ id, fechaEmision, horaEmision }) => (
  <View style={styles.headerContainer}>
    <View style={styles.logoSection}>
      <Image src="/images/logo_empresa.jpg" style={styles.logo} />
    </View>
    <View style={styles.empresaSection}>
      <Text style={styles.empresaNombre}>
        CAR IMPORT RAMOS & HUAMAN S.A.C.
      </Text>
      <Text style={styles.empresaRuc}>RUC 10737387572</Text>
      <Text style={styles.empresaDireccion}>
        Av. Gerardo Unger 4485 Int. 16 - C.C. El Metropolitano - Lima
      </Text>
      <Text style={styles.empresaContacto}>
        Tel: 977 182 320
      </Text>
    </View>
    <View style={styles.cotizacionSection}>
      <Text style={styles.cotizacionLabel}>Cotización</Text>
      <Text style={styles.cotizacionNumero}>N° 000{id}</Text>
      <Text style={styles.cotizacionFecha}>
        {fechaEmision} - {horaEmision}
      </Text>
    </View>
  </View>
);

const FooterFixed: React.FC = () => (
  <View style={styles.footerFixed} fixed>
    <Text style={styles.footerText}>Gracias por confiar en nosotros.</Text>
    <Text style={styles.footerText}>
      Esta cotización no constituye comprobante de pago.
    </Text>
  </View>
);

const ClienteSection: React.FC<{
  cliente: CotizacionPDFProps["cliente"];
  cabecera: CotizacionPDFProps["cabecera"];
}> = ({ cliente, cabecera }) => (
  <View style={styles.clienteContainer}>
    <View style={styles.clienteBox}>
      <View style={styles.clienteHeader}>
        <Text style={styles.clienteHeaderText}>Datos del Cliente</Text>
      </View>
      <View style={styles.clienteBody}>
        <View style={styles.clienteField}>
          <Text style={styles.clienteFieldLabel}>Cliente:</Text>
          <Text style={styles.clienteFieldValue}>{cliente.nombre}</Text>
        </View>
        <View style={styles.clienteField}>
          <Text style={styles.clienteFieldLabel}>RUC/DNI:</Text>
          <Text style={styles.clienteFieldValue}>{cliente.ruc}</Text>
        </View>
        <View style={styles.clienteField}>
          <Text style={styles.clienteFieldLabel}>Dirección:</Text>
          <Text style={styles.clienteFieldValue}>{cliente.direccion}</Text>
        </View>
        <View style={styles.clienteField}>
          <Text style={styles.clienteFieldLabel}>Teléfono:</Text>
          <Text style={styles.clienteFieldValue}>{cliente.telefono}</Text>
        </View>
      </View>
    </View>
    <View style={styles.infoBox}>
      <View style={styles.infoHeader}>
        <Text style={styles.infoHeaderText}>Información</Text>
      </View>
      <View style={styles.infoBody}>
        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>Fecha:</Text>
          <Text style={styles.infoFieldValue}>{cabecera.fechaEmision}</Text>
        </View>
        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>Moneda:</Text>
          <Text style={styles.infoFieldValue}>{cabecera.moneda}</Text>
        </View>
        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>Condición:</Text>
          <Text style={styles.infoFieldValue}>{cabecera.condicionPago}</Text>
        </View>
        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>Vigencia:</Text>
          <Text style={[styles.infoFieldValue, { color: COLORS.success, fontWeight: "bold" }]}>
            Válido 7 días
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const ProductosTable: React.FC<{
  items: CotizacionPDFProps["items"];
}> = ({ items }) => (
  <View style={styles.tableContainer}>
    <View style={styles.tableHeader}>
      <Text style={styles.colItem}>ITEM</Text>
      <Text style={styles.colCodigo}>CÓDIGO</Text>
      <Text style={styles.colDesc}>DESCRIPCIÓN</Text>
      <Text style={styles.colCant}>CANT</Text>
      <Text style={styles.colUnid}>UND</Text>
      <Text style={styles.colPrecio}>P. UNIT</Text>
      <Text style={styles.colImporte}>IMPORTE</Text>
    </View>
    {items.map((item, index) => (
      <View
        key={item.item}
        style={[
          styles.tableRow,
          index % 2 === 1 ? styles.tableRowAlternate : {},
          index === items.length - 1 ? styles.tableRowLast : {},
        ]}
        wrap={false}
      >
        <Text style={styles.cellItem}>{item.item}</Text>
        <Text style={styles.cellCodigo}>{item.codigo}</Text>
        <Text style={styles.cellDesc}>{item.descripcion}</Text>
        <Text style={styles.cellCant}>{item.cantidad}</Text>
        <Text style={styles.cellUnid}>{item.unidad}</Text>
        <Text style={styles.cellPrecio}>{item.precioVenta.toFixed(2)}</Text>
        <Text style={styles.cellImporte}>{item.importe.toFixed(2)}</Text>
      </View>
    ))}
  </View>
);

const Observaciones: React.FC = () => (
  <View style={styles.observacionesSection}>
    <Text style={styles.observacionesTitulo}>Observaciones</Text>
    <Text style={styles.observacionLine}>
      • Productos sujetos a disponibilidad de stock.
    </Text>
    <Text style={styles.observacionLine}>
      • Precios incluyen IGV.
    </Text>
    <Text style={styles.observacionLine}>
      • Despacho inmediato previa confirmación de pago.
    </Text>
    <Text style={styles.observacionLine}>
      • Cotización válida por 7 días.
    </Text>
  </View>
);

const BottomSection: React.FC<{
  total: number;
}> = ({ total }) => (
  <View style={styles.bottomRow}>
    <View style={styles.cuentasSection}>
      <Text style={styles.cuentasTitulo}>Cuentas Bancarias</Text>
      <Text style={styles.cuentaLine}>BCP Soles: 191-01945499-0-48</Text>
      <Text style={styles.cuentaLine}>CCI: 002-191-10194549904851</Text>
      <Text style={styles.cuentaTitular}>
        Titular: CAR IMPORT RAMOS & HUAMAN S.A.C.
      </Text>
    </View>
    <View style={styles.qrSection}>
      <Image src="/images/yape.png" style={styles.qrImage} />
      <Text style={styles.qrNumero}>977 182 320</Text>
      <Text style={styles.qrNombre}>Yino Jauregui</Text>
    </View>
    <View style={styles.totalSection}>
      <Text style={styles.totalLabel}>Total</Text>
      <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
    </View>
  </View>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export function CotizacionPDF({
  id,
  cliente,
  cabecera,
  items,
  fechaEmision,
  horaEmision,
}: CotizacionPDFProps) {
  const total = items.reduce((sum, item) => sum + item.importe, 0);

  const isSinglePage = items.length <= FIRST_PAGE_ITEMS;

  if (isSinglePage) {
    return (
      <Document>
        <Page size="A4" style={styles.pageWithAbsolute}>
          <Header id={id} fechaEmision={fechaEmision} horaEmision={horaEmision} />
          <ClienteSection cliente={cliente} cabecera={cabecera} />
          <ProductosTable items={items.slice(0, FIRST_PAGE_ITEMS)} />
          <View style={styles.bottomAbsolute} fixed>
            <Observaciones />
            <BottomSection total={total} />
          </View>
          <FooterFixed />
        </Page>
      </Document>
    );
  }

  const pages: Array<typeof items> = [];
  pages.push(items.slice(0, FIRST_PAGE_ITEMS));
  let index = FIRST_PAGE_ITEMS;
  while (index < items.length) {
    pages.push(items.slice(index, index + NEXT_PAGE_ITEMS));
    index += NEXT_PAGE_ITEMS;
  }

  return (
    <Document>
      {pages.map((pageItems, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <Page key={pageIndex} size="A4" style={styles.page}>
            <Header id={id} fechaEmision={fechaEmision} horaEmision={horaEmision} />
            {isFirstPage && <ClienteSection cliente={cliente} cabecera={cabecera} />}
            <ProductosTable items={pageItems} />
            {isLastPage && (
              <>
                <Observaciones />
                <BottomSection total={total} />
              </>
            )}
            <FooterFixed />
          </Page>
        );
      })}
    </Document>
  );
}