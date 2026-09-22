-- データAPIへ公開しない検証関数。入力から動的SQLは生成しない。
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create function private.valid_profile(value jsonb, expected text[])
returns boolean language sql immutable strict set search_path = '' as $$
  select jsonb_typeof(value) = 'object'
    and value ?& expected and (value - expected) = '{}'::jsonb
    and not exists (
      select 1 from jsonb_each(case when jsonb_typeof(value) = 'object' then value else '{}'::jsonb end) p
      where jsonb_typeof(p.value) <> 'number'
        or p.value::text !~ '^(100|[1-9]?[0-9])$'
    );
$$;
revoke all on function private.valid_profile(jsonb, text[]) from public, anon, authenticated;
grant execute on function private.valid_profile(jsonb, text[]) to service_role;

create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  quiz_version text not null check (quiz_version = '1.0'),
  answers jsonb not null check (
    jsonb_typeof(answers) = 'object'
    and answers ?& array['q01','q02','q03','q04','q05','q06','q07','q08','q09','q10','q11','q12','q13','q14','q15','q16']
    and (answers - array['q01','q02','q03','q04','q05','q06','q07','q08','q09','q10','q11','q12','q13','q14','q15','q16']) = '{}'::jsonb
    and not jsonb_path_exists(answers, 'strict $.* ? (@.type() != "string" || (@ != "a" && @ != "b" && @ != "c" && @ != "d"))')
  ),
  axis_scores jsonb not null check (private.valid_profile(axis_scores, array['planning','caution','social','cooperation','sensitivity','freedom','objectivity'])),
  type_scores jsonb not null check (private.valid_profile(type_scores, array['A','B','O','AB'])),
  primary_type text not null check (primary_type in ('A','B','O','AB')),
  secondary_type text not null check (secondary_type in ('A','B','O','AB') and secondary_type <> primary_type),
  subtype text not null check (subtype in ('A1','A2','A3','B1','B2','B3','O1','O2','O3','AB1','AB2','AB3') and subtype in (primary_type || '1',primary_type || '2',primary_type || '3')),
  actual_type text not null check (actual_type in ('A','B','O','AB','unknown')),
  is_match boolean,
  score_gap integer not null check (score_gap between 0 and 100),
  is_tie boolean not null,
  is_close boolean not null,
  created_at timestamptz not null default now(),
  check (is_match is not distinct from case when actual_type = 'unknown' then null else primary_type = actual_type end),
  check (score_gap = (type_scores ->> primary_type)::integer - (type_scores ->> secondary_type)::integer),
  check (is_tie = (score_gap = 0)),
  check (is_close = (score_gap < 2))
);
alter table public.quiz_results enable row level security;
-- ブラウザ用ポリシーは作らず、RLSとGRANTの両方で拒否する。
revoke all on table public.quiz_results from public, anon, authenticated, service_role;
grant insert on table public.quiz_results to service_role;
create index quiz_results_created_at_idx on public.quiz_results(created_at);
comment on table public.quiz_results is '匿名診断のみ。IP、Cookie、端末ID等を追加しない。';
