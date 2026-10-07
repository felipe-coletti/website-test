BEGIN;

CREATE TABLE IF NOT EXISTS about (
    id         INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    title      TEXT NOT NULL,
    content    TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_links (
    id       SERIAL PRIMARY KEY,
    type     TEXT NOT NULL CHECK (type ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    label    TEXT NOT NULL,
    url      TEXT NOT NULL CHECK (url ~ '^(mailto:|https://)'),
    position INT NOT NULL DEFAULT 0
);

INSERT INTO about (title) VALUES ('About')
ON CONFLICT (id) DO NOTHING;

COMMIT;
