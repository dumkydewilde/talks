import { useSQLQuery } from "@motherduck/react-sql-query";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";

// Exercise A solution Dive: what does Duckoffee's warehouse do all day?
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

const N = (v: unknown): number => (v == null ? 0 : Number(v));
const rowsOf = (q: { data?: unknown }) => (Array.isArray(q.data) ? (q.data as Record<string, unknown>[]) : []);
const hhmm = (h: number) => {
  const m = Math.round(h * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

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

function Section({ n, label, title, children }: { n: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <Label>{label}</Label>
      <div className="flex items-baseline gap-3 mt-1 mb-3">
        <span style={{ fontFamily: FONTS.display, fontSize: 28, color: COLORS.beacon, lineHeight: 1 }}>{n}</span>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 28, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Skeleton({ h }: { h: number }) {
  return <div className="animate-pulse rounded" style={{ height: h, background: COLORS.panel }} />;
}

function Alert({ error }: { error: unknown }) {
  return <p role="alert" style={{ color: COLORS.signal, fontSize: 12 }}>⚠️ lost contact: {String(error)}</p>;
}

function Kpi({ loading, value, label, hero, note }: { loading: boolean; value: string; label: string; hero?: boolean; note?: string }) {
  return (
    <div>
      {loading ? (
        <div className="animate-pulse rounded" style={{ height: 44, width: 96, background: COLORS.panel }} />
      ) : (
        <p style={{ fontFamily: FONTS.display, fontSize: 48, lineHeight: 1, color: hero ? COLORS.signal : COLORS.ink }}>{value}</p>
      )}
      <div className="mt-2"><Label>{label}</Label></div>
      {note && <p style={{ fontSize: 11, color: COLORS.faint, marginTop: 4 }}>{note}</p>}
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: "6px 8px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.muted, background: COLORS.panel, fontWeight: 400 };
const td: React.CSSProperties = { padding: "6px 8px", fontSize: 12, borderTop: `1px solid ${COLORS.hairline}` };
const num: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const panel: React.CSSProperties = { background: COLORS.panel, border: `1px solid ${COLORS.hairline}`, borderTop: `2px solid ${COLORS.signal}`, borderRadius: 4 };
const axisTick = { fill: COLORS.muted, fontFamily: FONTS.mono, fontSize: 11 };

export default function ExerciseADive() {
  // KPI: nightly completion before/after the break, and stale morning reads since.
  const kpis = useSQLQuery(`
    WITH inv AS (
      SELECT run_started_at, (epoch(run_completed_at) - epoch(run_completed_at::DATE)) / 3600 AS done_hour
      FROM ${T("dbt_invocations")}),
    reads AS (
      SELECT (q.start_time < i.run_completed_at)::INTEGER AS stale
      FROM ${T("query_history")} q JOIN ${T("dbt_invocations")} i ON i.run_started_at::DATE = q.start_time::DATE
      WHERE q.query_tag = 'franchisee_morning_sales' AND q.start_time >= TIMESTAMP '2026-02-02'
        AND strftime(q.start_time, '%H:%M') >= '06:30' AND strftime(q.start_time, '%H:%M') < '08:00')
    SELECT
      (SELECT avg(done_hour) FROM inv WHERE run_started_at < TIMESTAMP '2026-02-02') AS done_before,
      (SELECT avg(done_hour) FROM inv WHERE run_started_at >= TIMESTAMP '2026-02-02') AS done_after,
      (SELECT 100.0 * avg(stale) FROM reads) AS stale_pct
  `);

  // A1: nightly build completion per week, with the share of stale morning-dashboard reads.
  const weekly = useSQLQuery(`
    WITH wk AS (
      SELECT date_trunc('week', run_started_at)::DATE AS week,
        avg(epoch(run_completed_at) - epoch(run_completed_at::DATE)) / 3600 AS done_hour
      FROM ${T("dbt_invocations")} GROUP BY 1),
    st AS (
      SELECT date_trunc('week', q.start_time)::DATE AS week, 100.0 * avg((q.start_time < i.run_completed_at)::INTEGER) AS stale_pct
      FROM ${T("query_history")} q JOIN ${T("dbt_invocations")} i ON i.run_started_at::DATE = q.start_time::DATE
      WHERE q.query_tag = 'franchisee_morning_sales'
        AND strftime(q.start_time, '%H:%M') >= '06:30' AND strftime(q.start_time, '%H:%M') < '08:00'
      GROUP BY 1)
    SELECT strftime(week, '%Y-%m-%d') AS week, done_hour, coalesce(stale_pct, 0) AS stale_pct
    FROM wk LEFT JOIN st USING (week) ORDER BY week
  `);

  // A1 culprit: fct_ticket_lines minutes and rows per run, before and after.
  const culprit = useSQLQuery(`
    SELECT CASE WHEN execute_started_at < TIMESTAMP '2026-02-02' THEN 'before 2026-02-02' ELSE 'since 2026-02-02' END AS period,
      avg(execution_time) / 60 AS minutes, avg(rows_affected) / 1e6 AS million_rows
    FROM ${T("dbt_run_results")} WHERE name = 'fct_ticket_lines' GROUP BY 1 ORDER BY 1
  `);

  // A2: observed reads (since 2026-01-01) that dbt models or exposures do not declare.
  const gaps = useSQLQuery(`
    WITH a AS (
      SELECT query_id, unnest(json_extract_string(base_objects_accessed, '$[*].objectId'))::INTEGER AS table_id
      FROM ${T("access_history")} WHERE query_start_time >= TIMESTAMP '2026-01-01'),
    o AS (
      SELECT table_id, table_catalog || '.' || table_schema || '.' || table_name AS object_name, replace(comment, 'dbt node ', '') AS node_uid
      FROM ${T("account_tables")}),
    obs AS (
      SELECT 'dbt model' AS reader_type, d.name AS reader, o.object_name, d.depends_on_nodes LIKE '%"' || o.node_uid || '"%' AS declared, count(*) AS reads
      FROM a JOIN ${T("dbt_run_results")} r USING (query_id) JOIN ${T("dbt_models")} d USING (unique_id) JOIN o USING (table_id)
      WHERE o.object_name <> d.database_name || '.' || d.schema_name || '.' || upper(d.name) GROUP BY ALL
      UNION ALL
      SELECT CASE q.user_name WHEN 'LOOKER_SVC' THEN 'looker' WHEN 'BI_TOOL_B_SVC' THEN 'bi tool b' ELSE 'data app' END,
        q.query_tag, o.object_name, coalesce(e.depends_on_nodes LIKE '%"' || o.node_uid || '"%', false), count(*)
      FROM a JOIN ${T("query_history")} q USING (query_id) JOIN o USING (table_id) LEFT JOIN ${T("dbt_exposures")} e ON e.name = q.query_tag
      WHERE q.user_name IN ('LOOKER_SVC', 'BI_TOOL_B_SVC', 'DATA_APP_SVC') GROUP BY ALL)
    SELECT reader_type, reader, object_name, reads FROM obs WHERE NOT declared ORDER BY reads DESC, reader, object_name
  `);

  // A3a: marts nobody but dbt has read since 2026-01-01, with their share of TRANSFORM_WH credits.
  const marts = useSQLQuery(`
    WITH reads AS (
      SELECT DISTINCT unnest(json_extract_string(base_objects_accessed, '$[*].objectId'))::INTEGER AS table_id
      FROM ${T("access_history")} WHERE user_name <> 'DBT_SVC' AND query_start_time >= TIMESTAMP '2026-01-01'),
    m AS (
      SELECT d.unique_id, t.table_schema || '.' || t.table_name AS mart, t.table_id IN (SELECT table_id FROM reads) AS read_outside_dbt
      FROM ${T("dbt_models")} d JOIN ${T("account_tables")} t ON t.comment = 'dbt node ' || d.unique_id WHERE d.database_name = 'MARTS'),
    cost AS (
      SELECT r.unique_id, sum(mh.credits_used_compute::DECIMAL(18, 6)) AS credits
      FROM ${T("dbt_run_results")} r JOIN ${T("query_metering_history")} mh USING (query_id)
      WHERE mh.start_time >= TIMESTAMP '2026-01-01' GROUP BY 1),
    tot AS (
      SELECT sum(credits_used_compute::DECIMAL(18, 6)) AS credits FROM ${T("query_metering_history")}
      WHERE warehouse_name = 'TRANSFORM_WH' AND start_time >= TIMESTAMP '2026-01-01')
    SELECT mart, read_outside_dbt, c.credits::DOUBLE AS build_credits, (100 * c.credits / tot.credits)::DOUBLE AS pct
    FROM m JOIN cost c USING (unique_id) CROSS JOIN tot ORDER BY read_outside_dbt, build_credits DESC
  `);

  // A3b: queries that fail because they read a table that no longer exists.
  const failures = useSQLQuery(`
    SELECT query_tag, error_code, any_value(error_message) AS error_message, count(*) AS failed,
      strftime(min(start_time), '%Y-%m-%d') AS first_failure
    FROM ${T("query_history")} WHERE execution_status <> 'SUCCESS' GROUP BY ALL ORDER BY failed DESC
  `);

  const k = rowsOf(kpis)[0] ?? {};
  const weeks = rowsOf(weekly).map((r) => ({ week: String(r.week), done: N(r.done_hour), stale: N(r.stale_pct) }));
  const gapRows = rowsOf(gaps);
  const martRows = rowsOf(marts);
  const dead = martRows.filter((r) => !r.read_outside_dbt);
  const deadCredits = dead.reduce((s, r) => s + N(r.build_credits), 0);
  const deadPct = dead.reduce((s, r) => s + N(r.pct), 0);
  const failRows = rowsOf(failures);
  const failTotal = failRows.reduce((s, r) => s + N(r.failed), 0);

  return (
    <main className="p-6" style={{ background: COLORS.void, color: COLORS.ink, fontFamily: FONTS.mono, minHeight: "100%" }}>
      <Label>exercise a · field notes</Label>
      <div className="mt-2 mb-2"><OffRegister size={44}>What the warehouse does all day</OffRegister></div>
      <p className="text-sm" style={{ color: COLORS.muted }}>
        duckoffee's snowflake + dbt diary, 2025-09-01 → 2026-03-31 · access_history, query_history, dbt artifacts
      </p>

      <div className="grid grid-cols-4 gap-8 mt-6">
        <Kpi loading={kpis.isLoading} hero value={hhmm(N(k.done_after))} label="nightly build lands" note={`was ${hhmm(N(k.done_before))} until 2026-02-02`} />
        <Kpi loading={kpis.isLoading} value={`${N(k.stale_pct).toFixed(0)}%`} label="stale morning reads" note="franchisee dashboard, 06:30–08:00" />
        <Kpi loading={gaps.isLoading} value={String(gapRows.length)} label="undeclared reads" note="observed, not in dbt" />
        <Kpi loading={marts.isLoading} value={`${dead.length}/${martRows.length}`} label="marts off the map" note={`${deadCredits.toFixed(1)} credits · ${deadPct.toFixed(1)}% of transform_wh`} />
      </div>
      {kpis.isError && <Alert error={kpis.error} />}

      <Section n="01" label="signal · loading patterns" title="The nightly build slipped past breakfast">
        {weekly.isLoading ? <Skeleton h={240} /> : weekly.isError ? <Alert error={weekly.error} /> : (
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={weeks} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.hairline} vertical={false} />
              <XAxis dataKey="week" tick={axisTick} axisLine={{ stroke: COLORS.hairline }} tickLine={false} tickFormatter={(w: string) => w.slice(0, 7)} minTickGap={40} />
              <YAxis yAxisId="t" domain={[4, 9]} ticks={[4, 5, 6, 7, 8, 9]} tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: number) => hhmm(v)} width={48} />
              <YAxis yAxisId="p" orientation="right" domain={[0, 100]} tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} width={40} />
              <Tooltip
                contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.hairline}`, borderRadius: 4, fontFamily: FONTS.mono, fontSize: 12, color: COLORS.ink }}
                labelStyle={{ color: COLORS.muted }} cursor={{ fill: COLORS.panel2 }}
                formatter={(v: number, name: string) => (name === "done" ? [hhmm(v), "build done (avg)"] : [`${v.toFixed(1)}%`, "stale morning reads"])}
              />
              <Bar yAxisId="p" dataKey="stale" fill={COLORS.beacon} fillOpacity={0.45} />
              <ReferenceLine yAxisId="t" y={6.5} stroke={COLORS.ink} strokeDasharray="4 4" label={{ value: "06:30 · franchisees open the dashboard", position: "insideTopLeft", fill: COLORS.ink, fontSize: 11, fontFamily: FONTS.mono }} />
              <Line yAxisId="t" type="linear" dataKey="done" stroke={COLORS.signal} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
        <div className="flex gap-6 mt-2" style={{ fontSize: 11, color: COLORS.muted }}>
          <span><span style={{ color: COLORS.signal }}>━</span> nightly dbt build done (weekly avg)</span>
          <span><span style={{ color: COLORS.beacon }}>■</span> % of morning reads before the build finished</span>
        </div>
        <div className="mt-4" style={{ ...panel, padding: 12 }}>
          <Label>suspect · fct_ticket_lines</Label>
          {culprit.isLoading ? <Skeleton h={40} /> : culprit.isError ? <Alert error={culprit.error} /> : (
            <div className="grid grid-cols-2 gap-6 mt-2">
              {rowsOf(culprit).map((r) => (
                <div key={String(r.period)}>
                  <p style={{ fontSize: 11, color: COLORS.muted }}>{String(r.period)}</p>
                  <p style={{ fontFamily: FONTS.display, fontSize: 30, lineHeight: 1.1 }}>
                    {N(r.minutes).toFixed(0)} min · {N(r.million_rows).toFixed(1)}M rows/run
                  </p>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: 11, color: COLORS.faint, marginTop: 8 }}>
            is_incremental filter broke: every night is a full rebuild, while full_refresh stays false.
          </p>
        </div>
      </Section>

      <Section n="02" label="recon · lineage" title="Reads nobody declared">
        <p className="mb-3" style={{ fontSize: 12, color: COLORS.muted }}>
          observed in access_history since 2026-01-01, missing from dbt_models.depends_on_nodes or dbt_exposures.
        </p>
        {gaps.isLoading ? <Skeleton h={200} /> : gaps.isError ? <Alert error={gaps.error} /> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={th}>reader</th><th style={th}>reads table</th><th style={{ ...th, textAlign: "right" }}>reads</th></tr></thead>
            <tbody>
              {gapRows.map((r, i) => (
                <tr key={i} style={{ background: i % 2 ? COLORS.panel2 : "transparent" }}>
                  <td style={td}><span style={{ color: COLORS.faint }}>{String(r.reader_type)} · </span>{String(r.reader)}</td>
                  <td style={{ ...td, color: String(r.object_name).startsWith("RAW_POS.PUBLIC.TICKETS") ? COLORS.signal : COLORS.ink }}>{String(r.object_name)}</td>
                  <td style={num}>{N(r.reads).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section n="03" label="dark zone · dead ends" title="Built for nobody, read but gone">
        <div className="grid grid-cols-2 gap-6">
          <div style={{ ...panel, padding: 12 }}>
            <Label>marts with no reads outside dbt</Label>
            {marts.isLoading ? <Skeleton h={160} /> : marts.isError ? <Alert error={marts.error} /> : (
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
                <thead><tr><th style={th}>mart</th><th style={{ ...th, textAlign: "right" }}>credits</th><th style={{ ...th, textAlign: "right" }}>% wh</th></tr></thead>
                <tbody>
                  {dead.map((r) => (
                    <tr key={String(r.mart)}>
                      <td style={td}>{String(r.mart)}</td>
                      <td style={num}>{N(r.build_credits).toFixed(2)}</td>
                      <td style={num}>{N(r.pct).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ ...td, color: COLORS.signal }}>total · don't move these</td>
                    <td style={{ ...num, color: COLORS.signal }}>{deadCredits.toFixed(2)}</td>
                    <td style={{ ...num, color: COLORS.signal }}>{deadPct.toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          <div style={{ ...panel, padding: 12 }}>
            <Label>queries hitting a dropped table</Label>
            {failures.isLoading ? <Skeleton h={160} /> : failures.isError ? <Alert error={failures.error} /> : (
              <>
                <p style={{ fontFamily: FONTS.display, fontSize: 48, lineHeight: 1, color: COLORS.signal, marginTop: 8 }}>{failTotal.toLocaleString()}</p>
                <p style={{ fontSize: 11, color: COLORS.muted }}>failed queries · lost contact</p>
                {failRows.map((r) => (
                  <div key={String(r.query_tag)} className="mt-3" style={{ borderTop: `1px solid ${COLORS.hairline}`, paddingTop: 8 }}>
                    <p style={{ fontSize: 12 }}>⚠️ {String(r.query_tag)} <span style={{ color: COLORS.muted }}>· {N(r.failed).toLocaleString()} since {String(r.first_failure)}</span></p>
                    <p style={{ fontSize: 11, color: COLORS.faint }}>{String(r.error_code)} · {String(r.error_message)}</p>
                  </div>
                ))}
                <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>RAW_POS.PUBLIC.TICKETS: replaced by RAW_POS_V2 on 2026-01-12, dropped 2026-02-16.</p>
              </>
            )}
          </div>
        </div>
      </Section>

      <p className="mt-8" style={{ fontSize: 10, letterSpacing: "0.14em", color: COLORS.faint, textTransform: "uppercase" }}>
        data outpost 2026 · moving your warehouse · for builders at the forefront of ai + data
      </p>
    </main>
  );
}
