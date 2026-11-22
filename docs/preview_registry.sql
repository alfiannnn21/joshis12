CREATE TABLE IF NOT EXISTS joshis12_preview_variants (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(64) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  theme VARCHAR(100) NOT NULL,
  preview_url VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_preview_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO joshis12_preview_variants
  (slug, display_name, theme, preview_url, file_path)
VALUES
  ('kafe-minimal', 'Kafe Minimal', 'Warm editorial minimal', '/kafe-minimal/', 'docs/kafe-minimal/index.html'),
  ('botanic-fresh', 'Botanic Fresh', 'Organic botanical green', '/botanic-fresh/', 'docs/botanic-fresh/index.html'),
  ('retro-pop', 'Retro Pop', 'Yellow and orange retro poster', '/retro-pop/', 'docs/retro-pop/index.html'),
  ('porto-mono', 'Porto Mono', 'Monochrome monographic', '/porto-mono/', 'docs/porto-mono/index.html'),
  ('evening-wine', 'Evening Wine', 'Dark burgundy evening', '/evening-wine/', 'docs/evening-wine/index.html')
ON DUPLICATE KEY UPDATE
  display_name = VALUES(display_name),
  theme = VALUES(theme),
  preview_url = VALUES(preview_url),
  file_path = VALUES(file_path),
  is_active = 1;
