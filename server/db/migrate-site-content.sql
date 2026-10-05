BEGIN;

CREATE TABLE IF NOT EXISTS site_content (
    key        TEXT PRIMARY KEY CHECK (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    value      TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO site_content (key, value) VALUES
    ('welcome', '<p>I''m Felipe Coletti, a developer who builds things for the web. This is where I share my work and write about what I learn.</p>')
ON CONFLICT (key) DO NOTHING;

COMMIT;
