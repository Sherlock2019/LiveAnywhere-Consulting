import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="Relocate Anywhere Network home">
      <svg className="brand__mark" viewBox="0 0 74 34" aria-hidden="true">
        <path d="M10 23C24 3 43 4 63 15" className="brand__route" />
        <path d="m35 9 9 2.8-6.2 6.5.2-4.3-3-5Z" className="brand__plane" />
        <path d="M10 8a7 7 0 0 0-7 7c0 5.6 7 13 7 13s7-7.4 7-13a7 7 0 0 0-7-7Zm0 9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" className="brand__pin brand__pin--start" />
        <path d="M64 3a7 7 0 0 0-7 7c0 5.6 7 13 7 13s7-7.4 7-13a7 7 0 0 0-7-7Zm0 9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" className="brand__pin brand__pin--end" />
      </svg>
      <span className="brand__copy">
        <strong>RAN</strong>
        {!compact ? <span>Relocate Anywhere Network</span> : null}
      </span>
    </Link>
  );
}
