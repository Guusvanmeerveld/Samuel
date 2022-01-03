import { Duration } from 'luxon';

export const chunk = <T>(array: T[], size = 5): T[][] => {
	const chunked = [];

	for (let i = 0; i < array.length; i += size) {
		chunked.push(array.slice(i, i + size));
	}

	return chunked;
};

export const secondsToReadable = (input: number): string =>
	Duration.fromMillis(input * 1000).toFormat('hh:mm:ss');

export const abbreviateNumber = (value: number): string => {
	const suffixes = ['', 'K', 'M', 'B', 'T'];

	let suffixNum = 0;

	while (value >= 1000) {
		value /= 1000;
		suffixNum++;
	}

	value = parseInt(value.toPrecision(3));

	return `${value}${suffixes[suffixNum]}`;
};

export const capitalize = (input: string): string => input.replace(/^\w/, (c) => c.toUpperCase());
