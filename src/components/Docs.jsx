import { useEffect, useState } from "react";
import "../styles/Docs.css";

// ---------------------------------------------------------------------------
// Daftar section untuk sidebar navigasi + scrollspy sederhana (highlight
// section yang sedang terlihat berdasarkan IntersectionObserver).
// ---------------------------------------------------------------------------
const SECTIONS = [
  { id: "overview", label: "1. API Overview" },
  { id: "quick-start", label: "2. Quick Start" },
  { id: "rate-limit", label: "3. Rate Limit" },
  { id: "response-standard", label: "4. Response Standard" },
  { id: "status-handling", label: "5. HTTP Status & Rate Limit Handling" },
  { id: "whitelist", label: "Aturan Whitelist" },
  { id: "unban", label: "Unban" },
];

function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

function CodeBlock({ children, label }) {
  return (
    <div className="docs__code">
      {label && <span className="docs__code-label">{label}</span>}
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function StatusTable() {
  const rows = [
    ["200", "Request berhasil"],
    ["400", "Bad Request"],
    ["404", "Resource/endpoint tidak ditemukan"],
    ["405", "HTTP method tidak diizinkan"],
    ["429", "Rate limit terlampaui"],
    ["500", "Internal Server Error"],
    ["502", "Provider gagal diakses"],
    ["503", "Service tidak tersedia"],
  ];

  return (
    <table className="docs__table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Keterangan</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([code, desc]) => (
          <tr key={code}>
            <td>
              <code>{code}</code>
            </td>
            <td>{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function WarningTable() {
  const rows = [
    ["Peringatan 1", "Suspend IP 15 menit"],
    ["Peringatan 2", "Suspend IP 30 menit"],
    ["Peringatan 3", "Permanent ban"],
  ];

  return (
    <table className="docs__table">
      <thead>
        <tr>
          <th>Pelanggaran</th>
          <th>Tindakan</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([violation, action]) => (
          <tr key={violation}>
            <td>{violation}</td>
            <td>{action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EscalationFlow() {
  const steps = [
    "Terlalu banyak request",
    "Warning #1",
    "Suspend 15 menit",
    "Melanggar lagi",
    "Warning #2",
    "Suspend 30 menit",
    "Melanggar lagi",
    "Warning #3",
    "Permanent Ban",
  ];

  return (
    <ol
      className="docs__flow"
      aria-label="Alur eskalasi pelanggaran rate limit"
    >
      {steps.map((step, index) => (
        <li className="docs__flow-step" key={index}>
          <span className="docs__flow-dot" aria-hidden="true" />
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function WhitelistFlow() {
  return (
    <div className="docs__whitelist-flow">
      <div className="docs__whitelist-row docs__whitelist-row--top">
        <div className="docs__whitelist-box docs__whitelist-box--muted">
          Normal User
        </div>
        <div className="docs__whitelist-box docs__whitelist-box--muted">
          Whitelisted
        </div>
      </div>

      <div className="docs__whitelist-arrow" aria-hidden="true" />

      <div className="docs__whitelist-box docs__whitelist-box--center">
        Security Check
      </div>

      <div className="docs__whitelist-arrow" aria-hidden="true" />

      <div className="docs__whitelist-row">
        <div className="docs__whitelist-box docs__whitelist-box--ok">
          <strong>Normal</strong>
          <span>Rate limit applies</span>
        </div>
        <div className="docs__whitelist-box docs__whitelist-box--danger">
          <strong>Violation</strong>
          <span>Direct ban + remove whitelist</span>
        </div>
      </div>
    </div>
  );
}

export default function Docs() {
  const activeId = useScrollSpy(SECTIONS.map((s) => s.id));

  return (
    <section className="docs" aria-labelledby="docs-heading">
      <div className="docs__container">
        <aside className="docs__sidebar" aria-label="Navigasi dokumentasi">
          <p className="docs__sidebar-title">SENP4II Docs</p>

          <nav>
            <ul className="docs__nav">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={
                      "docs__nav-link" +
                      (activeId === section.id ? " docs__nav-link--active" : "")
                    }
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="docs__content">
          <header className="docs__header">
            <h1 id="docs-heading" className="docs__title">
              SENP4II API Documentation
            </h1>
            <p className="docs__lead">
              Dokumentasi lengkap untuk mengakses SENP4II Public REST API — base
              URL, format response, rate limit, dan kebijakan keamanan.
            </p>
          </header>

          {/* 1. API Overview */}
          <section id="overview" className="docs__section">
            <h2 className="docs__section-title">1. API Overview</h2>
            <ul className="docs__meta-list">
              <li>
                <span className="docs__meta-label">Nama</span>
                <span>SENP4II API</span>
              </li>
              <li>
                <span className="docs__meta-label">Base URL</span>
                <code>https://api.senplay.web.id</code>
              </li>
              <li>
                <span className="docs__meta-label">Format</span>
                <span>JSON</span>
              </li>
              <li>
                <span className="docs__meta-label">HTTP Method</span>
                <span>GET only</span>
              </li>
            </ul>
            <p>
              Request dengan method selain <code>GET</code> akan ditolak. API
              ini ditujukan sebagai Public REST API untuk data dari provider
              yang tersedia di SENP4II. Setiap response mengikuti standard
              response SENP4II.
            </p>
          </section>

          {/* 2. Quick Start */}
          <section id="quick-start" className="docs__section">
            <h2 className="docs__section-title">2. Quick Start</h2>
            <p>
              Developer cukup melakukan HTTP <code>GET</code> ke endpoint yang
              tersedia. Contoh:
            </p>
            <CodeBlock label="Request">
              {"GET https://api.senplay.web.id/api/quotes"}
            </CodeBlock>
            <p>Response menggunakan format:</p>
            <CodeBlock label="Response">
              {`{
  "status": "success",
  "creator": "SENP4II",
  "statusCode": 200,
  "statusMessage": "OK",
  "message": "",
  "ok": true,
  "data": {}
}`}
            </CodeBlock>
            <p>
              Tidak diperlukan method <code>POST</code>, <code>PUT</code>,{" "}
              <code>PATCH</code>, atau <code>DELETE</code> untuk endpoint
              publik.
            </p>
          </section>

          {/* 3. Rate Limit */}
          <section id="rate-limit" className="docs__section">
            <h2 className="docs__section-title">3. Rate Limit</h2>
            <p>Default rate limit per IP:</p>
            <ul className="docs__list">
              <li>3 requests / detik</li>
              <li>30 requests / menit</li>
            </ul>
            <p>
              Kedua batas berlaku secara bersamaan. Jika pengguna melebihi salah
              satu batas tersebut, sistem akan menganggapnya sebagai pelanggaran
              rate limit.
            </p>

            <h3 className="docs__subsection-title">Sistem Peringatan</h3>
            <WarningTable />

            <h3 className="docs__subsection-title">Alur Eskalasi</h3>
            <EscalationFlow />
          </section>

          {/* 4. Response Standard */}
          <section id="response-standard" className="docs__section">
            <h2 className="docs__section-title">4. Response Standard</h2>

            <h3 className="docs__subsection-title">Success</h3>
            <CodeBlock>
              {`{
  "status": "success",
  "creator": "SENP4II",
  "statusCode": 200,
  "statusMessage": "OK",
  "message": "",
  "ok": true,
  "data": {}
}`}
            </CodeBlock>

            <h3 className="docs__subsection-title">Error</h3>
            <CodeBlock>
              {`{
  "status": "error",
  "creator": "SENP4II",
  "statusCode": 404,
  "statusMessage": "Not Found",
  "message": "Resource not found",
  "ok": false,
  "data": null
}`}
            </CodeBlock>

            <h3 className="docs__subsection-title">HTTP Status</h3>
            <StatusTable />
          </section>

          {/* 5. HTTP Status & Rate Limit Handling */}
          <section id="status-handling" className="docs__section">
            <h2 className="docs__section-title">
              5. HTTP Status &amp; Rate Limit Handling
            </h2>
            <p>
              Untuk rate limit, response menggunakan{" "}
              <code>429 Too Many Requests</code>. Contohnya:
            </p>
            <CodeBlock>
              {`{
  "status": "error",
  "creator": "SENP4II",
  "statusCode": 429,
  "statusMessage": "Too Many Requests",
  "message": "Rate limit exceeded",
  "ok": false,
  "data": {
    "retryAfter": 60
  }
}`}
            </CodeBlock>
            <p className="docs__note">
              <code>retryAfter</code> disesuaikan dengan mekanisme rate limiter
              yang berjalan di server.
            </p>
          </section>

          {/* Aturan Whitelist */}
          <section id="whitelist" className="docs__section">
            <h2 className="docs__section-title">Aturan Whitelist</h2>
            <p>
              Bagian ini dipisahkan dari bagian rate limit di atas karena
              sifatnya adalah <em>security policy</em>, bukan rate limit biasa.
            </p>
            <p>
              Pengguna dapat menghubungi administrator SENP4II untuk mengajukan
              whitelist apabila membutuhkan akses dengan rate limit yang lebih
              tinggi atau pengecualian rate limit. Namun:
            </p>
            <ul className="docs__list">
              <li>
                Whitelist hanya memberikan pengecualian terhadap rate limit.
                Whitelist <strong>tidak</strong> memberikan pengecualian
                terhadap security policy.
              </li>
              <li>
                IP yang sudah di-whitelist tetap dapat dikenakan permanent ban
                langsung apabila melakukan aktivitas yang dianggap sebagai
                eksploitasi atau ancaman terhadap API/infrastruktur.
              </li>
            </ul>

            <h3 className="docs__subsection-title">Contoh Pelanggaran</h3>
            <ul className="docs__list docs__list--danger">
              <li>
                Mencoba mengakses <code>.env</code>
              </li>
              <li>
                Mencoba mengakses <code>config.js</code>
              </li>
              <li>Mencoba mengakses file konfigurasi/internal</li>
              <li>Directory traversal</li>
              <li>File disclosure</li>
              <li>Exploit endpoint</li>
              <li>Security bypass</li>
              <li>Probing/scanning yang abusive</li>
              <li>Mencoba mengakses resource internal</li>
              <li>Aktivitas lain yang bertujuan mengeksploitasi API/server</li>
            </ul>

            <h3 className="docs__subsection-title">Flow</h3>
            <WhitelistFlow />
          </section>

          {/* Unban */}
          <section id="unban" className="docs__section">
            <h2 className="docs__section-title">Unban</h2>
            <p>
              Jika IP terkena permanent ban, pengguna dapat menghubungi
              administrator SENP4II untuk mengajukan permintaan unban.
              Administrator berhak menerima atau menolak permintaan tersebut
              berdasarkan riwayat aktivitas IP.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
