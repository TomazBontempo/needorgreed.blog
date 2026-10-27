-- Contador de views das reviews: um número por review, nada sobre quem viu.
-- As três línguas somam no mesmo slug.
CREATE TABLE IF NOT EXISTS views (
  slug  TEXT PRIMARY KEY,
  total INTEGER NOT NULL DEFAULT 0
);
