<script lang="ts">
	const {
		status,
		clear_save
	}: {
		status: "loading" | "loaded" | "error"
		clear_save: () => void
	} = $props()
</script>

{#if status === "loading"}
	<div
		class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-base-100 bg-opacity-95 p-1 text-center"
	>
		<div class="bg-base-100 p-1 text-7xl">Loading save...</div>
		<div class="w-96 max-w-full bg-base-100 p-1">
			It shouldn't take more than 1 second to load save, if it does then it's likely that Link have
			updated the save format. Press the button below to clear the save
		</div>
		<button class="btn btn-error" onclick={clear_save}>Clear save</button>
	</div>
{:else if status === "error"}
	<div
		class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-base-100 bg-opacity-95 p-1 text-center"
	>
		<div class="bg-base-100 p-1 text-7xl text-error">Loading save failed!</div>
		<div class="w-96 max-w-full bg-base-100 p-1">
			It's likely that Link have updated the save format. Press the button below to clear the save
		</div>
		<button class="btn btn-error" onclick={clear_save}>Clear save</button>
	</div>
{/if}
