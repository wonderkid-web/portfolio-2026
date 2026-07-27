<script lang="ts">
	type Project = {
		name: string;
		link: string;
		description: string;
		label?: string;
	};

	/*
	 * Add or edit projects here. Every item automatically becomes a Work card.
	 * The website is shown inside the card when the destination allows iframe previews.
	 */

const projects: Project[] = [
	{
		name: 'Patch Notes',
		link: 'https://patch-notes.mahkotagroup.com',
		description: 'Internal dashboard for tracking application update history and Discord intake.',
		label: 'Documentation'
	},
	{
		name: 'Limit Me',
		link: 'https://limitme.fun',
		description: 'Mobile-first personal finance app for daily budget limits, transactions, and savings goals.',
		label: 'Web app'
	},
	{
		name: 'Dashboard Mahkota Group',
		link: 'https://dashboard.mahkotagroup.com',
		description: 'Internal operational monitoring dashboard with inspection reports (LHP) and Odoo integration.',
		label: 'Analytics'
	},
	{
		name: 'Datek MIS',
		link: 'https://datek.mahkotagroup.com',
		description: 'MIS platform for managing employee data, inventory, service records, location tracking, and reports.',
		label: 'Portal'
	}
];

	const expertise = [
		{
			name: 'Business Workflows',
			description: 'Process mapping & practical automation',
			mark: '01'
		},
		{ name: 'Full-stack Apps', description: 'Next.js, React, Odoo & Ascend', mark: '02' },
		{ name: 'Product Delivery', description: 'Requirements, testing & implementation', mark: '03' }
	];

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
		<div class="greeting">Good afternoon!<i></i></div>
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
		<p class="section-label"><span class="screen-icon">▣</span> WORK</p>
		<div class="project-grid">
			{#each projects as project, index}
				<article class="project-card">
					<div class="website-preview" aria-hidden="true">
						{#if project.link}
							<iframe src={project.link} title={`${project.name} preview`} loading="lazy"></iframe>
						{:else}
							<div class="project-watermark">{project.name.slice(0, 1)}</div>
						{/if}
						<div class="preview-wash"></div>
					</div>
					<div class="project-content">
						<div class="project-meta">
							<span>{project.label ?? 'Project'}</span>
							<span>0{index + 1}</span>
						</div>
						<h2>{project.name}</h2>
						<p>{project.description}</p>
						{#if project.link}
							<a href={project.link} target="_blank" rel="noreferrer">
								View more <span>↗</span>
							</a>
						{:else}
							<div class="project-link-placeholder">Add project link <span>↗</span></div>
						{/if}
					</div>
				</article>
			{/each}
		</div>

		<div class="privacy-note">
			<span class="privacy-badge">NDA</span>
			<div>
				<strong>There’s more behind the scenes.</strong>
				<p>
					Some applications and internal systems can’t be shown publicly because client privacy
					always comes first.
				</p>
			</div>
		</div>
	</section>

	<footer class="footer grid-cell" id="contact">
		<p>
			Have an interesting, useful or ambitious idea you’d like some help building?
			<a href="https://wa.me/6283191319297" target="_blank" rel="noreferrer">Let’s talk.</a>
		</p>
		<span>2026 © Wahyu</span>
	</footer>
</main>
