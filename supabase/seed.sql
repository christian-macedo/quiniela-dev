-- Example seed data for World Cup 2026

-- Insert sample teams (FIFA World Cup 2026 participants - examples)
INSERT INTO teams (name, short_name, country_code) VALUES
  ('Argentina', 'ARG', 'AR'),
  ('Brazil', 'BRA', 'BR'),
  ('France', 'FRA', 'FR'),
  ('Germany', 'GER', 'DE'),
  ('Spain', 'ESP', 'ES'),
  ('England', 'ENG', 'GB'),
  ('Netherlands', 'NED', 'NL'),
  ('Portugal', 'POR', 'PT'),
  ('Belgium', 'BEL', 'BE'),
  ('Italy', 'ITA', 'IT'),
  ('Uruguay', 'URU', 'UY'),
  ('Croatia', 'CRO', 'HR'),
  ('Mexico', 'MEX', 'MX'),
  ('United States', 'USA', 'US'),
  ('Canada', 'CAN', 'CA'),
  ('Japan', 'JPN', 'JP'),
  ('South Korea', 'KOR', 'KR'),
  ('Australia', 'AUS', 'AU'),
  ('Morocco', 'MAR', 'MA'),
  ('Senegal', 'SEN', 'SN'),
  ('Ghana', 'GHA', 'GH'),
  ('Nigeria', 'NGA', 'NG'),
  ('Ecuador', 'ECU', 'EC'),
  ('Colombia', 'COL', 'CO'),
  ('Switzerland', 'SUI', 'CH'),
  ('Denmark', 'DEN', 'DK'),
  ('Poland', 'POL', 'PL'),
  ('Serbia', 'SRB', 'RS'),
  ('Wales', 'WAL', 'GB'),
  ('Saudi Arabia', 'KSA', 'SA'),
  ('Iran', 'IRN', 'IR'),
  ('Cameroon', 'CMR', 'CM');

-- Insert World Cup 2026 tournament
INSERT INTO tournaments (name, sport, start_date, end_date, status, scoring_rules)
VALUES (
  'FIFA World Cup 2026',
  'soccer',
  '2026-06-11',
  '2026-07-19',
  'upcoming',
  '{"exact_score": 10, "correct_winner_and_diff": 7, "correct_winner": 5}'::jsonb
);

-- Link teams to tournament (get tournament_id first)
WITH tournament AS (
  SELECT id FROM tournaments WHERE name = 'FIFA World Cup 2026'
)
INSERT INTO tournament_teams (tournament_id, team_id)
SELECT tournament.id, teams.id
FROM tournament, teams;

-- Insert some example matches for Group Stage
WITH
  tournament AS (SELECT id FROM tournaments WHERE name = 'FIFA World Cup 2026'),
  arg AS (SELECT id FROM teams WHERE short_name = 'ARG'),
  mex AS (SELECT id FROM teams WHERE short_name = 'MEX'),
  bra AS (SELECT id FROM teams WHERE short_name = 'BRA'),
  ger AS (SELECT id FROM teams WHERE short_name = 'GER'),
  fra AS (SELECT id FROM teams WHERE short_name = 'FRA'),
  eng AS (SELECT id FROM teams WHERE short_name = 'ENG'),
  esp AS (SELECT id FROM teams WHERE short_name = 'ESP'),
  ned AS (SELECT id FROM teams WHERE short_name = 'NED')
INSERT INTO matches (tournament_id, home_team_id, away_team_id, match_date, round, status)
VALUES
  ((SELECT id FROM tournament), (SELECT id FROM arg), (SELECT id FROM mex), '2026-06-11 16:00:00+00', 'Group Stage - Group A', 'scheduled'),
  ((SELECT id FROM tournament), (SELECT id FROM bra), (SELECT id FROM ger), '2026-06-12 19:00:00+00', 'Group Stage - Group B', 'scheduled'),
  ((SELECT id FROM tournament), (SELECT id FROM fra), (SELECT id FROM eng), '2026-06-13 16:00:00+00', 'Group Stage - Group C', 'scheduled'),
  ((SELECT id FROM tournament), (SELECT id FROM esp), (SELECT id FROM ned), '2026-06-14 19:00:00+00', 'Group Stage - Group D', 'scheduled');
