import * as si from 'simple-icons';
import { writeFileSync } from 'node:fs';
const all = Object.values(si).filter((i) => i && i.slug);
const map = {
	SvelteKit: 'svelte',
	Bun: 'bun',
	'Node.js': 'nodedotjs',
	Prisma: 'prisma',
	PostgreSQL: 'postgresql',
	'Discord.js': 'discorddotjs',
	'Next.js': 'nextdotjs',
	'React Query': 'reactquery',
	MySQL: 'mysql',
	Cheerio: 'cheerio',
	Odoo: 'odoo',
	Python: 'python',
	FastAPI: 'fastapi',
	Grafana: 'grafana',
	Prometheus: 'prometheus',
	'Uptime Kuma': 'uptimekuma'
};
const lines = [];
for (const [label, slug] of Object.entries(map)) {
	const icon = all.find((i) => i.slug === slug);
	if (!icon) throw new Error('missing ' + slug);
	lines.push(
		`\t${JSON.stringify(label)}: { path: ${JSON.stringify(icon.path)}, hex: ${JSON.stringify('#' + icon.hex)} }`
	);
}
const out = `/*
 * Brand glyphs for the tech chips in the Work section.
 * Paths are 24x24 viewBox outlines with official brand colors, lifted from simple-icons
 * (CC0); regenerate with
 * scripts/generate-tech-icons.mjs after adding a technology to a project's stack.
 * A technology with no entry here falls back to a monogram chip.
 */
export type TechIcon = { path: string; hex: string };

export const techIcons: Record<string, TechIcon> = {
${lines.join(',\n')}
};
`;
writeFileSync('src/lib/tech-icons.ts', out);
console.log('wrote', Object.keys(map).length);
