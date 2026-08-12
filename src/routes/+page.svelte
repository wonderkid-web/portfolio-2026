<script lang="ts">
	import { techIcons } from '$lib/tech-icons';

	type Project = {
		name: string;
		/* Omitted for work with nothing public to link to. */
		link?: string;
		description: string;
		/* Phrases from the description to highlight — the figures that carry the claim. */
		highlight?: string[];
		stack: string[];
		label?: string;
		/* Set when the destination blocks iframe embedding or sits behind auth. */
		internal?: boolean;
	};

	/*
	 * Add or edit projects here. Every item automatically becomes a Work card.
	 * The website is shown inside the card when the destination allows iframe previews.
	 * Descriptions lead with what changed, not what the app contains.
	 */

	const projects: Project[] = [
		{
			name: 'Budget Usage Converter',
			link: 'https://budget-tools.mahkotagroup.com',
			description:
				'Preparing an Odoo Budget Usage import used to run three to four months. Multi-sheet Excel now converts in a single pass, with every cost center and COA validated against Odoo before the ZIP is written.',
			highlight: ['three to four months'],
			stack: ['Python', 'FastAPI', 'openpyxl', 'PostgreSQL'],
			label: 'Automation'
		},
		{
			name: 'Datek MIS',
			link: 'https://datek.my.id',
			description:
				'650 assets — NUCs, PCs, laptops, printers, CCTV — had no asset management at all. They now sit in one platform alongside employee records, data center inventory, and master data.',
			highlight: ['650 assets'],
			stack: ['Next.js', 'Bun', 'Prisma', 'MySQL'],
			label: 'Portal'
		},
		{
			name: 'Datek Agent Coworker',
			description:
				'A Node.js agent that reads each machine’s real hardware — RAM, CPU, free disk — every three minutes, and heartbeats whether someone is actually using it. The monthly audit went from a week of walking desk to desk to 10–15 minutes, measured from the hardware instead of a clipboard.',
			highlight: ['a week', '10–15 minutes'],
			stack: ['Node.js'],
			label: 'Agent',
			internal: true
		},
		{
			name: 'HCM Tools',
			link: 'https://hcm-tools.mahkotagroup.com',
			description:
				'Attendance recaps for payroll took 60 to 180 minutes per period. The Excel now builds itself from Odoo overtime and leave data — what is left is a copy-paste.',
			highlight: ['60 to 180 minutes'],
			stack: ['SvelteKit', 'Bun', 'Python', 'openpyxl'],
			label: 'Automation'
		},
		{
			name: 'Dashboard Mahkota Group',
			link: 'https://dashboard.mahkotagroup.com',
			description:
				'Operational reporting meant pulling Odoo data by hand, remapping it, then rebuilding every chart. Odoo now feeds the dashboard and Power BI directly, so a change upstream shows up on its own — next to live CCTV over HLS and LHP inspection reports.',
			stack: ['Next.js', 'Bun', 'Prisma', 'PostgreSQL', 'Power BI'],
			label: 'Analytics'
		},
		{
			name: 'OMO Report Monitor',
			link: 'https://omo.mahkotagroup.com',
			description:
				'Odoo Monitoring Observer snapshots Odoo every six hours, so accounting can diff a COA between any two dates. Working out which account actually moved used to take hours of manual comparison.',
			highlight: ['every six hours'],
			stack: ['SvelteKit', 'Elysia', 'Prisma', 'PostgreSQL', 'Cheerio'],
			label: 'Monitoring'
		},
		{
			name: 'Patch Notes',
			link: 'https://patch-notes.mahkotagroup.com',
			description:
				'Every Odoo change used to be written up by hand. A Discord bot now captures updates as they are discussed and files them itself, so the release history stays current without anyone maintaining it.',
			stack: ['SvelteKit', 'Bun', 'Prisma', 'PostgreSQL', 'Discord.js'],
			label: 'Documentation'
		},
		{
			name: 'Daily Ticket Tracker',
			link: 'https://dtt.mahkotagroup.com',
			description:
				'Odoo will not tell you which approver is holding up an AR helpdesk ticket, so I built the view it was missing. Tracing one used to cost 15 to 45 minutes; now helpdesk reads it off a list.',
			highlight: ['15 to 45 minutes'],
			stack: ['SvelteKit', 'Bun', 'Prisma', 'PostgreSQL', 'Odoo'],
			label: 'Internal tool',
			internal: true
		},
		{
			name: 'Limit Me',
			link: 'https://limitme.fun',
			description:
				'Spending notes scattered across apps and paper, pulled into one place and categorised. Set a budget and a period, and it works out the daily limit that tells you when to stop.',
			stack: ['Next.js', 'NextAuth', 'Prisma', 'PostgreSQL', 'React Query'],
			label: 'Web app'
		},
		{
			name: 'Monitoring Stack',
			link: 'https://monitoring-mis.mahkotagroup.com',
			description:
				'Checking server health meant SSHing in and reading terminals one box at a time. Metrics, logs, uptime, and container telemetry now land in a single Grafana view.',
			stack: ['Grafana', 'Prometheus', 'Loki', 'Alloy', 'Uptime Kuma', 'cAdvisor'],
			label: 'Infrastructure',
			internal: true
		}
	];

	/*
	 * Split a description around its highlighted phrases so they can be wrapped in
	 * <mark>. Done as text nodes rather than {@html} so descriptions stay plain data.
	 */
	function markedParts(project: Project) {
		const phrases = project.highlight ?? [];
		if (!phrases.length) return [{ text: project.description, marked: false }];

		const escaped = phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
		return project.description
			.split(new RegExp(`(${escaped.join('|')})`, 'g'))
			.filter((part) => part !== '')
			.map((part) => ({ text: part, marked: phrases.includes(part) }));
	}

	const expertise = [
		{
			name: 'Business Workflows',
			description: 'Process mapping & practical automation',
			mark: '01'
		},
		{ name: 'Full-stack Apps', description: 'Next.js, React, Odoo & Ascend', mark: '02' },
		{ name: 'Product Delivery', description: 'Requirements, testing & implementation', mark: '03' }
	];

	/*
	 * Work carousel. The list is rendered twice so the track can loop forever:
	 * once the first copy has scrolled past, we jump back by exactly its width,
	 * which lands on an identical frame and reads as continuous motion.
	 */
	const loopedProjects = [...projects, ...projects];
	const AUTO_SCROLL_PX_PER_SECOND = 34;

	let track: HTMLDivElement | undefined = $state();
	let paused = $state(false);

	function loopWidth() {
		return track ? track.scrollWidth / 2 : 0;
	}

	function wrap() {
		if (!track) return;
		const half = loopWidth();
		if (track.scrollLeft >= half) track.scrollLeft -= half;
	}

	function slide(direction: 1 | -1) {
		if (!track) return;
		const card = track.querySelector('.project-card');
		const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
		const step = card ? card.getBoundingClientRect().width + gap : track.clientWidth;

		/* Browsers clamp scrollLeft at 0, so stepping back off the start has to
		   jump forward into the second copy first rather than wrap afterwards. */
		if (direction === -1 && track.scrollLeft < step) track.scrollLeft += loopWidth();

		track.scrollLeft += step * direction;
		wrap();
	}

	$effect(() => {
		if (!track) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		let frame = 0;
		let previous = 0;

		const tick = (now: number) => {
			frame = requestAnimationFrame(tick);
			const elapsed = previous ? now - previous : 0;
			previous = now;
			if (paused || reduced.matches || !track) return;
			/* Drive it by elapsed time so the speed is the same on any refresh rate. */
			track.scrollLeft += (AUTO_SCROLL_PX_PER_SECOND * elapsed) / 1000;
			wrap();
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});

	/*
	 * Time-of-day greeting. `until` is the exclusive end hour, so the first entry
	 * whose bound the current hour falls under wins; the last covers the rest of
	 * the evening and rolls into the small hours via the leading night entry.
	 */
	const greetings = [
		{ until: 5, text: 'Working late?', emoji: '🌙', tone: 'night' },
		{ until: 11, text: 'Good morning!', emoji: '🌅', tone: 'morning' },
		{ until: 17, text: 'Good afternoon!', emoji: '☀️', tone: 'afternoon' },
		{ until: 21, text: 'Good evening!', emoji: '🌆', tone: 'evening' },
		{ until: 24, text: 'Working late?', emoji: '🌙', tone: 'night' }
	];

	function greetingAt(date: Date) {
		const hour = date.getHours();
		return greetings.find((entry) => hour < entry.until) ?? greetings[2];
	}

	/* Server-rendered from the server's clock, then corrected to the visitor's on mount. */
	let greeting = $state(greetingAt(new Date()));

	$effect(() => {
		const update = () => (greeting = greetingAt(new Date()));
		update();
		const timer = setInterval(update, 60_000);
		return () => clearInterval(timer);
	});

	const socials = [
		{ label: 'Instagram', short: 'ig', link: 'https://www.instagram.com/_wahyur21/' },
		{ label: 'LinkedIn', short: 'in', link: 'https://www.linkedin.com/in/wonderrrkid/' },
		{ label: 'GitHub', short: 'gh', link: 'https://github.com/wonderkid-web' },
		{ label: 'WhatsApp', short: 'wa', link: 'https://wa.me/6283191319297' }
	];
</script>

<svelte:head>
	<title>Wahyu — Web Development Professional</title>
	<meta
		name="description"
		content="Wahyu is a web development professional building practical digital workflows and applications."
	/>
</svelte:head>

<main class="page-shell">
	<section class="hero grid-cell">
		<h1>Wahyu<span>.</span></h1>
		<div class="greeting" data-tone={greeting.tone}>
			{greeting.text}
			<span class="greeting-emoji" aria-hidden="true">{greeting.emoji}</span>
			<i></i>
		</div>
	</section>

	<aside class="favorite grid-cell">
		<p class="eyebrow right">CURRENTLY FOCUSED</p>
		<div class="favorite-content">
			<div>
				<strong>Useful systems</strong>
				<span>Built for real work</span>
			</div>
			<img class="favorite-orb" src="/wahyu-mark.png" alt="Wahyu monogram" />
		</div>
	</aside>

	<section class="about grid-cell">
		<div>
			<h2>About me</h2>
			<p>
				I’m a web development professional who turns operational needs into practical digital
				workflows.
			</p>
			<p>
				I map processes, coordinate teams, and build dependable applications with
				<a href="#work">modern tools</a>—from requirements through delivery.
			</p>
			<div class="signature" aria-label="Wahyu">Wahyu</div>
		</div>

		<div class="social-block">
			<p class="eyebrow right">FIND ME AT</p>
			<div class="socials">
				{#each socials as social}
					<a
						href={social.link}
						target="_blank"
						rel="noreferrer"
						aria-label={social.label}
						title={social.label}>{social.short}</a
					>
				{/each}
			</div>
		</div>
	</section>

	<figure class="portrait grid-cell">
		<img src="/wahyu-profile.png" alt="Wahyu speaking at an event" />
		<figcaption><span class="photo-icon">▧</span> WAHYU.JPG</figcaption>
	</figure>

	<aside class="expertise grid-cell">
		<p class="section-label"><span class="flask">♟</span> EXPERTISE</p>
		<div class="expertise-list">
			{#each expertise as item}
				<article>
					<div>
						<h3>{item.name}</h3>
						<p>{item.description}</p>
					</div>
					<span>{item.mark}</span>
				</article>
			{/each}
		</div>
	</aside>

	<section class="companies grid-cell">
		<b><h3>Companies<br />I’ve worked with</h3></b>
		<div class="company-logos">
			<img src="/mahkota-group.png" alt="PT Mahkota Group Tbk" />
			<img src="/kitakale.png" alt="Kitakale" />
		</div>
	</section>

	<section class="resume grid-cell">
		<div class="resume-content">
			<p class="section-label"><span class="resume-icon">▤</span> CURRICULUM VITAE</p>
			<h2>Want the full story?</h2>
			<p>Download my CV for a closer look at my experience, skills, and professional journey.</p>
			<a href="/Wahyu-CV-July-2026.pdf" download="Wahyu-CV-July-2026.pdf">
				Download CV <span>↓</span>
			</a>
		</div>
	</section>

	<section class="work grid-cell" id="work">
		<div class="work-header">
			<p class="section-label"><span class="screen-icon">▣</span> WORK</p>
			<div class="carousel-nav">
				<button type="button" onclick={() => slide(-1)} aria-label="Previous projects">←</button>
				<button type="button" onclick={() => slide(1)} aria-label="Next projects">→</button>
			</div>
		</div>
		<!-- A scrollable region needs to be keyboard focusable so it can be scrolled without a mouse. -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			class="project-grid"
			bind:this={track}
			onmouseenter={() => (paused = true)}
			onmouseleave={() => (paused = false)}
			onfocusin={() => (paused = true)}
			onfocusout={() => (paused = false)}
			ontouchstart={() => (paused = true)}
			role="region"
			aria-label="Selected projects"
			tabindex="0"
		>
			{#each loopedProjects as project, index}
				<article class="project-card">
					<div class="website-preview" aria-hidden="true">
						{#if project.link && !project.internal}
							<!-- The embedded page is decoration only: allow it to render, nothing else. -->
							<iframe
								src={project.link}
								title={`${project.name} preview`}
								loading="lazy"
								sandbox="allow-scripts allow-same-origin"
								tabindex="-1"
							></iframe>
						{:else}
							<div class="project-watermark">{project.name.slice(0, 1)}</div>
						{/if}
						<div class="preview-wash"></div>
					</div>
					<div class="project-content">
						<div class="project-meta">
							<span>
								{project.label ?? 'Project'}
								{#if project.internal}<i class="internal-badge">Internal</i>{/if}
							</span>
							<span>{((index % projects.length) + 1).toString().padStart(2, '0')}</span>
						</div>
						<h2>{project.name}</h2>
						<!-- prettier-ignore -->
						<p>{#each markedParts(project) as part}{#if part.marked}<mark>{part.text}</mark>{:else}{part.text}{/if}{/each}</p>
						<ul class="project-stack">
							{#each project.stack as tech}
								<li>
									{#if techIcons[tech]}
										<svg viewBox="0 0 24 24" aria-hidden="true" style:fill={techIcons[tech].hex}>
											<path d={techIcons[tech].path} />
										</svg>
									{:else}
										<i class="tech-monogram" aria-hidden="true">{tech.slice(0, 1)}</i>
									{/if}
									{tech}
								</li>
							{/each}
						</ul>
						{#if project.link}
							<a href={project.link} target="_blank" rel="noreferrer">
								View more <span>↗</span>
							</a>
						{:else}
							<div class="project-link-placeholder">Runs on internal machines</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>

		<aside class="privacy-note">
			<span class="privacy-badge">NDA</span>
			<div class="privacy-copy">
				<strong>The strongest work is the part I can’t link to.</strong>
				<p>
					Most of this runs inside company infrastructure — asset registers, approval chains,
					finance pipelines. Links and screenshots stop at the login page. The architecture and the
					decisions behind them, I’m glad to walk through.
				</p>
				<a href="https://wa.me/6283191319297" target="_blank" rel="noreferrer">
					Ask for a walkthrough <span>↗</span>
				</a>
			</div>
			<div class="privacy-redaction" aria-hidden="true">
				<i></i><i></i><i></i><i></i><i></i>
			</div>
		</aside>
	</section>

	<footer class="footer grid-cell" id="contact">
		<p>
			Have an interesting, useful or ambitious idea you’d like some help building?
			<a href="https://wa.me/6283191319297" target="_blank" rel="noreferrer">Let’s talk.</a>
		</p>
		<span>2026 © Wahyu</span>
	</footer>
</main>
