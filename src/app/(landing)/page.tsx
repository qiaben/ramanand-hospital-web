import Link from "next/link";
import Image from "next/image";

/**
 * "/" on a static host cannot redirect on the server, so this page sends visitors to the Hindi site
 * if their browser language is Hindi, and to the English site otherwise. Both links work without JavaScript.
 */
export default function RootRedirect() {
  const script = `var l=(navigator.language||'en').toLowerCase().indexOf('hi')===0?'hi':'en';location.replace('/'+l+'/');`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en/" />
      </noscript>
      <div className="text-center">
        <Image src="/logo.png" alt="Ramanand Hospital" width={160} height={160} className="mx-auto h-40 w-40" priority />
        <h1 className="mt-4 text-3xl text-blue-900">Ramanand Hospital</h1>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/en/" className="btn btn-blue">English</Link>
          <Link href="/hi/" className="btn btn-outline">हिंदी</Link>
        </div>
      </div>
    </>
  );
}
