export const chunk = <T>(array: T[], size = 5): T[][] => {
	const chunked = [];

	for (let i = 0; i < array.length; i += size) {
		chunked.push(array.slice(i, i + size));
	}

	return chunked;
};

export const secondsToReadable = (input: number): string => {
	const date = new Date(input * 1000);
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();
	const seconds = date.getSeconds();

	return (
		hours.toString().padStart(2, '0') +
		':' +
		minutes.toString().padStart(2, '0') +
		':' +
		seconds.toString().padStart(2, '0')
	);
};

export const capitalize = (input: string): string => input.replace(/^\w/, (c) => c.toUpperCase());
