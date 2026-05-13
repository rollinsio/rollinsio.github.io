tailwind.config = {
    theme: {
        extend: {
            colors: {
                bg:      'var(--bg)',
                surface: 'var(--surface)',
                border:  'var(--rule)',
                rule:    'var(--rule)',
                fg:      'var(--fg)',
                head:    'var(--head)',
                muted:   'var(--muted)',
                dim:     'var(--dim)',
                accent:  'var(--accent)',
                accent2: 'var(--accent2)',
            },
            fontFamily: {
                sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
                mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
            },
            maxWidth: {
                prose: '38rem',
            },
        }
    }
};
