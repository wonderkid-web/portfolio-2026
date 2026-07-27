# Wahyu Portfolio

Portfolio satu halaman berbasis SvelteKit.

## Menambahkan project

Edit array `projects` di `src/routes/+page.svelte`:

```ts
{
	name: 'Nama project',
	link: 'https://website-project.com',
	description: 'Deskripsi singkat project.',
	label: 'Web app'
}
```

Link yang mendukung `iframe` akan tampil sebagai preview di dalam card. Website yang memblokir
`iframe` tetap dapat dibuka melalui tombol **View more**.

## Menjalankan dengan Docker

```sh
docker build -t wahyu-portfolio .
docker run --rm -p 3013:3013 wahyu-portfolio
```

Buka [http://localhost:3013](http://localhost:3013).

## Development

```sh
bun install
bun run dev -- --port 3013
```
