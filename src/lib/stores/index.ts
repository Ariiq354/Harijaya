import { writable } from 'svelte/store';

export const sidebarOpen = writable(true);

export const testTags = writable([{ id: 1, name: 'test' }]);
