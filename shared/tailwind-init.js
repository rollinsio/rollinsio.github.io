tailwind.config = {
    theme: {
        extend: {
            colors: {
                bg:      '#0a0a0a',
                surface: '#121212',
                border:  '#1f1f1f',
                fg:      '#ededed',
                muted:   '#888888',
                dim:     '#5a5a5a',
                accent:  '#ff7a18',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
            },
            maxWidth: {
                prose: '38rem',
            },
        }
    }
};
