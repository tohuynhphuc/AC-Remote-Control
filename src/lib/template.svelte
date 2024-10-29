<script lang="ts">
	import { untrack } from "svelte"
	import { themeChange as theme_change } from "theme-change"
	import Back from "./back.svelte"

	const {
		name = "",
		version = "",
		href = "",
		shallow = false
	}: {
		name?: string
		version?: string
		href?: string
		shallow?: boolean
	} = $props()

	let lts = $state.raw(
		shuffle([
			"Long Term Support",
			"Link Tulin Sidon",
			"Lê Tuấn Savior",
			"Lời Tòa Soạn",
			"Lời Tâm Sự",
			"Lập Trình Svelte"
		])
	)

	let index = $state(-1)

	$effect(() => untrack(() => theme_change(false)))

	function change_lts() {
		index += 1

		if (index < lts.length) return

		index = -1
		lts = shuffle(lts)
	}

	function shuffle<T>(array: T[]): T[] {
		let currentIndex = array.length

		// While there remain elements to shuffle...
		while (currentIndex !== 0) {
			// Pick a remaining element...
			const randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex--

			// And swap it with the current element.
			;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
		}
		return array
	}
</script>

<div class="m-1 flex flex-col items-center justify-center gap-1">
	<div class="flex w-full items-center justify-between">
		<Back {shallow} {href}></Back>
		<button class="flex flex-col items-center" onclick={change_lts}>
			<span class="text-2xl font-bold text-primary">Link</span>
			<div class="flex flex-row items-center justify-center {index === -1 ? '' : 'gap-1'}">
				<span class="text-xs text-accent">{lts[index % lts.length] ?? "LTS"}</span>
				<span class="text-xs text-secondary">20050703</span>
			</div>
		</button>
		<img class="size-12" src="/favicon-48x48.png" alt="" />
	</div>

	<div class="flex flex-row items-center justify-center gap-2">
		<label for="theme">Theme</label>
		<select id="theme" class="select select-primary select-xs" data-choose-theme>
			<option value="">System</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	</div>

	{#if name}<div class="text-2xl font-bold">{name}</div>{/if}
	{#if version}<div>{version}</div>{/if}
</div>
