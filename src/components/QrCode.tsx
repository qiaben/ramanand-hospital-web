import QRCode from "qrcode";

/** A QR code drawn as inline SVG at build time, so it needs no image file and stays sharp when printed. */
export default async function QrCode({ url, label, className = "" }: { url: string; label: string; className?: string }) {
  const svg = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0a2a5e", light: "#ffffff" } });
  return <div role="img" aria-label={label} className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
