export const links = {
  slides: 'https://dumkydewilde.github.io/talks/data-outpost-2026/',
  workshop: 'https://github.com/dumkydewilde/talks/tree/main/data-outpost-2026/workshop',
  generator: 'https://github.com/dumkydewilde/talks/blob/main/data-outpost-2026/workshop/generate.sql',
  docs: 'https://motherduck.com/docs/key-tasks/data-warehousing/migrating-your-data-warehouse/',
  snowflake: 'https://motherduck.com/docs/key-tasks/data-warehousing/migrating-your-data-warehouse/migrating-from-snowflake/',
  bigquery: 'https://motherduck.com/docs/key-tasks/data-warehousing/migrating-your-data-warehouse/migrating-from-bigquery/',
  redshift: 'https://motherduck.com/docs/key-tasks/data-warehousing/migrating-your-data-warehouse/migrating-from-redshift/',
  assessment: 'https://github.com/motherduckdb/md-migration-assessment',
  snowflakeIngest: 'https://motherduck.com/cookbook/flight-snowflake-ingest/',
  bigqueryIngest: 'https://motherduck.com/cookbook/flight-bigquery-ingest/',
  s3Ingest: 'https://motherduck.com/cookbook/flight-scheduled-s3-ingest/',
  terraform: 'https://motherduck.com/integrations/dev-tools/terraform/',
  queryTags: 'https://www.dumky.net/posts/optimizing-snowflake-costs-with-dbt-query-tags/',
  a16z: 'https://a16z.com/emerging-architectures-for-modern-data-infrastructure/',
  duckgen: 'https://motherduck.com/duckgen',
  angellist: 'https://devin.ai/customers/angellist',
}

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
