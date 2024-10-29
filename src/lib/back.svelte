<script lang="ts">
	const {
		shallow = false,
		href = "",
		style = ""
	}: {
		shallow?: boolean
		href?: string
		style?: string
	} = $props()
</script>

{#if shallow}
	<button class="btn btn-primary size-12 p-0 {style}" onclick={() => history.back()}>
		{@render chevron_left()}
	</button>
{:else if href}
	<a {href} class="link link-primary size-12 {style}">
		{@render chevron_left()}
	</a>
{:else}
	<div class="size-12"></div>
{/if}

{#snippet chevron_left()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-12"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
	</svg>
{/snippet}
