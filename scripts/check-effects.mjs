import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [sakura, ambient, layout] = await Promise.all([
	readFile(
		new URL("../src/components/features/SakuraEffect.astro", import.meta.url),
		"utf8",
	),
	readFile(
		new URL("../src/components/features/AmbientEffects.astro", import.meta.url),
		"utf8",
	),
	readFile(new URL("../src/layouts/Layout.astro", import.meta.url), "utf8"),
]);

assert.doesNotMatch(sakura, /window\.sakuraManager\s*=\s*null/);
assert.match(sakura, /if \(!window\.sakuraToggleHandler\)/);
assert.match(layout, /<AmbientEffects \/>/);
assert.match(ambient, /prefers-reduced-motion: reduce/);
assert.doesNotMatch(ambient, /addEventListener\(['"]scroll/);

for (const effect of [
	"star-layer",
	"meteor",
	"snowflake",
	"cursor-trail-particle",
	"click-ripple",
]) {
	assert.match(ambient, new RegExp(effect));
}

console.log("Effects regression check passed.");
