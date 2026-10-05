INSERT INTO site_content (key, value) VALUES
    ('welcome', '<p>I''m Felipe Coletti, a developer who builds things for the web. This is where I share my work and write about what I learn.</p>');

INSERT INTO tags (name, slug) VALUES
    ('Go', 'go'),
    ('Web Components', 'web-components');

INSERT INTO posts (title, slug, content, is_published, published_at) VALUES
    ('Leaving React behind', 'leaving-react', '<p>Why I moved to Web Components.</p>', true, now()),
    ('A Go backend', 'go-backend', '<p>Gin + GORM + Postgres.</p>', true, now() - interval '10 days'),
    ('Draft', 'draft', '<p>Should not appear.</p>', false, NULL);

INSERT INTO works (title, content, is_published, published_at) VALUES
    ('Portfolio', '<p>This website.</p>', true, now()),
    ('Website API', '<p>The Go backend behind this website.</p>', true, now() - interval '30 days');

INSERT INTO posts_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p JOIN tags t ON
    (p.slug = 'leaving-react' AND t.slug = 'web-components') OR
    (p.slug = 'go-backend' AND t.slug = 'go');

INSERT INTO works_tags (work_id, tag_id)
SELECT w.id, t.id FROM works w JOIN tags t ON
    (w.title = 'Portfolio' AND t.slug = 'web-components') OR
    (w.title = 'Website API' AND t.slug = 'go');
