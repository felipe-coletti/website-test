CREATE TABLE tags (
    id   SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE TABLE posts (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    slug         TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    content      TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ
);

CREATE FUNCTION generate_work_slug() RETURNS TEXT AS $$
DECLARE
    alphabet CONSTANT TEXT := '0123456789abcdefghijklmnopqrstuvwxyz';
    candidate TEXT;
BEGIN
    LOOP
        candidate := '';

        FOR i IN 1..6 LOOP
            candidate := candidate || substr(alphabet, 1 + floor(random() * 36)::INT, 1);
        END LOOP;

        EXIT WHEN NOT EXISTS (SELECT 1 FROM works WHERE slug = candidate);
    END LOOP;

    RETURN candidate;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE TABLE works (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    slug         TEXT UNIQUE NOT NULL DEFAULT generate_work_slug() CHECK (slug ~ '^[0-9a-z]{6}$'),
    content      TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ
);

CREATE TABLE posts_tags (
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id  INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE works_tags (
    work_id INT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    tag_id  INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (work_id, tag_id)
);

CREATE TABLE site_content (
    key        TEXT PRIMARY KEY CHECK (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    value      TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE about (
    id         INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    title      TEXT NOT NULL,
    content    TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE contact_links (
    id       SERIAL PRIMARY KEY,
    type     TEXT NOT NULL CHECK (type ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    label    TEXT NOT NULL,
    url      TEXT NOT NULL CHECK (url ~ '^(mailto:|https://)'),
    position INT NOT NULL DEFAULT 0
);
