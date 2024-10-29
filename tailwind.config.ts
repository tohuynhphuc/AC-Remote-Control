import daisyui from "daisyui"
import { dark, light } from "daisyui/src/theming/themes"
import type { Config } from "tailwindcss"
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: { extend: {} },
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				light: {
					...light,
					primary: "#37AAD9",
					secondary: "#EEA231",
					accent: "#52FD64"
				},
				dark: {
					...dark,
					primary: "#37AAD9",
					secondary: "#EEA231",
					accent: "#52FD64",
					"base-content": "#FFF"
				}
			}
		]
	}
} satisfies Config
