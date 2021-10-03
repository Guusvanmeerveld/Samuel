export const chunk = <T>(array: T[], size = 5): T[][] => {
	const chunked = [];

	for (let i = 0; i < array.length; i += size) {
		chunked.push(array.slice(i, i + size));
	}

	return chunked;
};
