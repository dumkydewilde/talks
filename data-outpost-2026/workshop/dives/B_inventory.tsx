import { useSQLQuery, useDiveState } from "@motherduck/react-sql-query";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

// Exercise B solution Dive: one row per table, with evidence and a first-pass bucket.
// Data: the DuckGen warehouse-lineage share (release 20261103-bae5bc27-s-r1).
export const REQUIRED_DATABASES = [
  {
    type: "share",
    path: "md:_share/dg_devtools_duckoffee_warehouse_lineage_s_bae5bc27_r1/dbcfb372-fef8-4d92-b997-26254d727cd0",
    alias: "devtools_duckoffee_warehouse_lineage",
  },
];

const T = (name: string) => `"devtools_duckoffee_warehouse_lineage"."main"."${name}"`;

const COLORS = {
  void: "#0B0C0E", panel: "#15171B", panel2: "#1E2127", hairline: "#2A2E36",
  ink: "#F3EEE1", muted: "#9AA0A8", faint: "#5C636D",
  signal: "#FF4B2B", beacon: "#F6B21B", scout: "#2F7DB5", relay: "#3FD07F",
} as const;
const FONTS = {
  display: `"VT323", "Martian Mono", ui-monospace, "Cascadia Mono", Menlo, Consolas, monospace`,
  mono: `"Martian Mono", ui-monospace, "Cascadia Mono", Menlo, Consolas, monospace`,
} as const;

const BUCKETS = ["rebuild", "copy", "query in place", "leave behind"] as const;
const BUCKET_COLOR: Record<string, string> = {
  rebuild: COLORS.scout, copy: COLORS.beacon, "query in place": COLORS.relay, "leave behind": COLORS.signal,
};

const N = (v: unknown): number => (v == null ? 0 : Number(v));
const rowsOf = (q: { data?: unknown }) => (Array.isArray(q.data) ? (q.data as Record<string, unknown>[]) : []);

function OffRegister({ children, size = 44 }: { children: string; size?: number }) {
  const layers = [
    { color: COLORS.signal, dx: -3, dy: 2 },
    { color: COLORS.scout, dx: 3, dy: -2 },
    { color: COLORS.ink, dx: 0, dy: 0 },
  ];
  return (
    <span style={{ position: "relative", display: "inline-block", fontFamily: FONTS.display, fontSize: size, lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.03em" }}>
      <span style={{ visibility: "hidden", whiteSpace: "pre" }}>{children}</span>
      {layers.map((l, i) => (
        <span key={i} aria-hidden={i < layers.length - 1} style={{ position: "absolute", left: l.dx, top: l.dy, color: l.color, whiteSpace: "pre", mixBlendMode: "screen" }}>
          {children}
        </span>
      ))}
    </span>
  );
}

function Label({ children }: { children: string }) {
  return (
    <div style={{ fontFamily: FONTS.mono, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 11, color: COLORS.muted }}>
      // {children}
    </div>
  );
}

function Skeleton({ h }: { h: number }) {
  return <div className="animate-pulse rounded" style={{ height: h, background: COLORS.panel }} />;
}

function Alert({ error }: { error: unknown }) {
  return <p role="alert" style={{ color: COLORS.signal, fontSize: 12 }}>⚠️ lost contact: {String(error)}</p>;
}

function Pill({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: string; color?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: FONTS.mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
        padding: "5px 10px", borderRadius: 4, cursor: "pointer",
        border: `1px solid ${active ? (color ?? COLORS.signal) : COLORS.hairline}`,
        background: active ? (color ?? COLORS.signal) : COLORS.panel2,
        color: active ? COLORS.void : COLORS.ink,
      }}
    >
      {children}
    </button>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: "6px 8px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.muted, background: COLORS.panel, fontWeight: 400, position: "sticky", top: 0 };
const td: React.CSSProperties = { padding: "5px 8px", fontSize: 12, borderTop: `1px solid ${COLORS.hairline}`, whiteSpace: "nowrap" };
const num: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const axisTick = { fill: COLORS.muted, fontFamily: FONTS.mono, fontSize: 11 };
const tooltipStyle = { background: COLORS.panel, border: `1px solid ${COLORS.hairline}`, borderRadius: 4, fontFamily: FONTS.mono, fontSize: 12, color: COLORS.ink };

type Row = {
  fqn: string; owner: string; gb: number; credits: number; consumerReads: number; dbtReads: number;
  readers: number; lastRead: string; bucket: string; reason: string; orphan: boolean;
};

export default function ExerciseBDive() {
  const [bucket, setBucket] = useDiveState<string>("bucket", "all");
  const [sort, setSort] = useDiveState<string>("sort", "credits");

  // B3: the inventory. Same heuristic as workshop/solutions.sql, plus a one-line reason.
  const inventory = useSQLQuery(`
    WITH r AS (
      SELECT unnest(json_extract_string(base_objects_accessed, '$[*].objectId'))::INTEGER AS table_id, user_name, query_start_time
      FROM ${T("access_history")}),
    reads AS (
      SELECT table_id,
        count(*) FILTER (WHERE user_name <> 'DBT_SVC') AS consumer_reads,
        count(*) FILTER (WHERE user_name = 'DBT_SVC') AS dbt_reads,
        count(DISTINCT user_name) FILTER (WHERE user_name <> 'DBT_SVC') AS readers,
        max(query_start_time) FILTER (WHERE user_name <> 'DBT_SVC') AS last_consumer_read
      FROM r GROUP BY 1),
    w AS (
      SELECT unnest(json_extract_string(objects_modified, '$[*].objectId'))::INTEGER AS table_id, query_id
      FROM ${T("access_history")}),
    builds AS (
      SELECT w.table_id, sum(m.credits_used_compute::DECIMAL(18, 6)) AS build_credits
      FROM w JOIN ${T("query_metering_history")} m USING (query_id) GROUP BY 1),
    inv AS (
      SELECT t.table_catalog || '.' || t.table_schema || '.' || t.table_name AS fqn, t.table_owner,
        (t.bytes / 1e9)::DOUBLE AS gb, t.deleted < TIMESTAMP '9999-01-01' AS dropped,
        coalesce(r.consumer_reads, 0) AS consumer_reads, coalesce(r.dbt_reads, 0) AS dbt_reads, coalesce(r.readers, 0) AS readers,
        coalesce(strftime(r.last_consumer_read, '%Y-%m-%d'), '') AS last_consumer_read,
        coalesce(b.build_credits, 0)::DOUBLE AS build_credits
      FROM ${T("account_tables")} t LEFT JOIN reads r USING (table_id) LEFT JOIN builds b USING (table_id))
    SELECT *,
      CASE
        WHEN dropped THEN 'leave behind'
        WHEN table_owner = 'LOOKER_ROLE' THEN 'leave behind'
        WHEN table_owner = 'LOADER' AND consumer_reads = 0 AND dbt_reads = 0 THEN 'leave behind'
        WHEN fqn LIKE 'MARTS.%' AND consumer_reads = 0 THEN 'leave behind'
        WHEN build_credits > 100 THEN 'copy'
        ELSE 'rebuild'
      END AS bucket,
      CASE
        WHEN dropped THEN 'dropped 2026-02-16, still queried: repoint readers first'
        WHEN table_owner = 'LOOKER_ROLE' THEN 'Looker PDT: Looker rebuilds it on the new connection'
        WHEN table_owner = 'LOADER' AND consumer_reads = 0 AND dbt_reads = 0 THEN 'loaded, never read'
        WHEN fqn LIKE 'MARTS.%' AND consumer_reads = 0 THEN 'built every night, read by nobody'
        WHEN build_credits > 100 THEN 'huge and expensive: copy history once, continue incrementally'
        WHEN table_owner = 'LOADER' THEN 'raw: re-sync with the loader (if the source keeps history)'
        ELSE 'dbt model: rebuild from its parents'
      END AS reason
    FROM inv
  `);

  const rows: Row[] = rowsOf(inventory).map((r) => ({
    fqn: String(r.fqn), owner: String(r.table_owner), gb: N(r.gb), credits: N(r.build_credits),
    consumerReads: N(r.consumer_reads), dbtReads: N(r.dbt_reads), readers: N(r.readers),
    lastRead: String(r.last_consumer_read ?? ""), bucket: String(r.bucket), reason: String(r.reason),
    orphan: N(r.build_credits) > 0 && N(r.consumer_reads) === 0 && N(r.dbt_reads) === 0,
  }));

  const perBucket = BUCKETS.map((b) => {
    const rs = rows.filter((r) => r.bucket === b);
    return { bucket: b, tables: rs.length, gb: rs.reduce((s, r) => s + r.gb, 0), credits: rs.reduce((s, r) => s + r.credits, 0) };
  });
  const orphans = rows.filter((r) => r.orphan);

  const filtered = rows
    .filter((r) => (bucket === "all" ? true : bucket === "orphans" ? r.orphan : r.bucket === bucket))
    .sort((a, b) => (sort === "gb" ? b.gb - a.gb : sort === "reads" ? b.consumerReads - a.consumerReads : sort === "name" ? a.fqn.localeCompare(b.fqn) : b.credits - a.credits));

  const loading = inventory.isLoading;

  return (
    <main className="p-6" style={{ background: COLORS.void, color: COLORS.ink, fontFamily: FONTS.mono, minHeight: "100%" }}>
      <Label>exercise b · inventory</Label>
      <div className="mt-2 mb-2"><OffRegister size={44}>Everything Duckoffee owns</OffRegister></div>
      <p className="text-sm" style={{ color: COLORS.muted }}>
        one row per table · reads from access_history, build cost from query_metering_history · a first pass, not the final call
      </p>

      <div className="grid grid-cols-4 gap-8 mt-6">
        {perBucket.map((b) => (
          <div key={b.bucket}>
            {loading ? (
              <div className="animate-pulse rounded" style={{ height: 44, width: 72, background: COLORS.panel }} />
            ) : (
              <p style={{ fontFamily: FONTS.display, fontSize: 48, lineHeight: 1, color: b.tables ? BUCKET_COLOR[b.bucket] : COLORS.faint }}>{b.tables}</p>
            )}
            <div className="mt-2"><Label>{b.bucket}</Label></div>
            <p style={{ fontSize: 11, color: COLORS.faint, marginTop: 4 }}>
              {loading ? "triangulating…" : b.tables ? `${b.gb.toFixed(1)} GB · ${b.credits.toFixed(0)} credits` : "nothing in object storage yet"}
            </p>
          </div>
        ))}
      </div>
      {inventory.isError && <Alert error={inventory.error} />}

      <section className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <Label>supply line · build credits per bucket</Label>
          <div className="mt-2">
            {loading ? <Skeleton h={180} /> : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={perBucket} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.hairline} horizontal={false} />
                  <XAxis type="number" tick={axisTick} axisLine={{ stroke: COLORS.hairline }} tickLine={false} />
                  <YAxis type="category" dataKey="bucket" tick={axisTick} axisLine={false} tickLine={false} width={104} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: COLORS.panel2 }} formatter={(v: number) => [`${v.toFixed(1)} credits`, "build cost"]} />
                  <Bar dataKey="credits">{perBucket.map((b) => <Cell key={b.bucket} fill={BUCKET_COLOR[b.bucket]} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div>
          <Label>range · storage per bucket</Label>
          <div className="mt-2">
            {loading ? <Skeleton h={180} /> : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={perBucket} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.hairline} horizontal={false} />
                  <XAxis type="number" tick={axisTick} axisLine={{ stroke: COLORS.hairline }} tickLine={false} />
                  <YAxis type="category" dataKey="bucket" tick={axisTick} axisLine={false} tickLine={false} width={104} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: COLORS.panel2 }} formatter={(v: number) => [`${v.toFixed(1)} GB`, "storage"]} />
                  <Bar dataKey="gb">{perBucket.map((b) => <Cell key={b.bucket} fill={BUCKET_COLOR[b.bucket]} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {!loading && orphans.length > 0 && (
        <div className="mt-6" style={{ background: COLORS.panel, border: `1px solid ${COLORS.hairline}`, borderTop: `2px solid ${COLORS.signal}`, borderRadius: 4, padding: 12 }}>
          <Label>dark zone · costs credits, read by nobody</Label>
          <p style={{ fontSize: 12, marginTop: 6 }}>
            ⚠️ {orphans.length} tables cost {orphans.reduce((s, r) => s + r.credits, 0).toFixed(1)} credits to build and have no reader at all, not even dbt:{" "}
            <span style={{ color: COLORS.muted }}>{orphans.map((r) => r.fqn.split(".").pop()).join(", ")}</span>
          </p>
        </div>
      )}

      <section className="mt-8">
        <Label>field notes · the inventory</Label>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Pill active={bucket === "all"} onClick={() => setBucket("all")}>{`all ${rows.length || ""}`}</Pill>
          {BUCKETS.map((b) => (
            <Pill key={b} active={bucket === b} color={BUCKET_COLOR[b]} onClick={() => setBucket(b)}>{b}</Pill>
          ))}
          <Pill active={bucket === "orphans"} onClick={() => setBucket("orphans")}>no readers</Pill>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: COLORS.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>sort</span>
          {[["credits", "credits"], ["gb", "size"], ["reads", "reads"], ["name", "name"]].map(([k, l]) => (
            <Pill key={k} active={sort === k} color={COLORS.ink} onClick={() => setSort(k)}>{l}</Pill>
          ))}
        </div>
        <div className="mt-3" style={{ maxHeight: 380, overflowY: "auto", border: `1px solid ${COLORS.hairline}`, borderRadius: 4 }}>
          {loading ? <div className="p-3"><Skeleton h={300} /></div> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>table</th><th style={th}>bucket</th>
                  <th style={{ ...th, textAlign: "right" }}>gb</th><th style={{ ...th, textAlign: "right" }}>credits</th>
                  <th style={{ ...th, textAlign: "right" }}>reads</th><th style={th}>last read</th><th style={th}>why</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td style={{ ...td, color: COLORS.faint }} colSpan={7}>no signal yet · beyond the mapped edge</td></tr>
                )}
                {filtered.map((r, i) => (
                  <tr key={r.fqn} style={{ background: i % 2 ? COLORS.panel2 : "transparent", boxShadow: r.orphan ? `inset 3px 0 0 ${COLORS.signal}` : undefined }}>
                    <td style={td} title={`owner ${r.owner} · ${r.readers} readers · ${r.dbtReads.toLocaleString()} dbt reads`}>{r.fqn}</td>
                    <td style={{ ...td, color: BUCKET_COLOR[r.bucket] }}>{r.bucket}</td>
                    <td style={num}>{r.gb.toFixed(1)}</td>
                    <td style={num}>{r.credits.toFixed(1)}</td>
                    <td style={num}>{r.consumerReads.toLocaleString()}</td>
                    <td style={{ ...td, color: COLORS.muted }}>{r.lastRead || "never"}</td>
                    <td style={{ ...td, color: COLORS.muted, whiteSpace: "normal", minWidth: 220 }}>{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mt-8">
        <Label>dispatch · ask a human</Label>
        <ol className="mt-2" style={{ fontSize: 12, color: COLORS.ink, lineHeight: 1.6 }}>
          {[
            "RAW_* tables: can the loader re-sync full history? If the source only keeps recent data, copy instead of rebuild.",
            "RAW_POS.PUBLIC.TICKETS held POS history before 2026-01-12. It's dropped: is that history needed, and does it live anywhere else?",
            "Nothing lives in object storage yet, so query in place is empty. That's a finding too.",
            "FCT_TICKET_LINES: fix the is_incremental filter before you port it, or you move the bug with it.",
          ].map((q, i) => (
            <li key={i} className="flex gap-3">
              <span style={{ fontFamily: FONTS.display, fontSize: 18, color: COLORS.beacon }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-8" style={{ fontSize: 10, letterSpacing: "0.14em", color: COLORS.faint, textTransform: "uppercase" }}>
        data outpost 2026 · moving your warehouse · for builders at the forefront of ai + data
      </p>
    </main>
  );
}
