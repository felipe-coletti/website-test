-- Conteúdo das páginas About e Contact.
-- Edite os valores marcados com TODO e rode inteiro (pgAdmin: Query Tool → F5).
-- Pode ser rodado várias vezes: sempre substitui o about e a lista de links.

BEGIN;

-- About: uma linha só (id = 1). O content é HTML.
INSERT INTO about (id, title, content, updated_at) VALUES (
    1,
    'About',
    -- TODO: seu texto
    '<p>Primeiro parágrafo.</p>
<p>Segundo parágrafo.</p>',
    now()
)
ON CONFLICT (id) DO UPDATE SET
    title      = EXCLUDED.title,
    content    = EXCLUDED.content,
    updated_at = EXCLUDED.updated_at;

-- Contact: a lista é recriada do zero.
-- url: só mailto: ou https://. type: minúsculas, números e hífens. position: ordem na página.
DELETE FROM contact_links;

INSERT INTO contact_links (type, label, url, position) VALUES
    ('email',    'Email',    'mailto:seu@email.com',                   1), -- TODO
    ('github',   'GitHub',   'https://github.com/felipe-coletti',      2),
    ('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/seu-perfil', 3); -- TODO

COMMIT;
