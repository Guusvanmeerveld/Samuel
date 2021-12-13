import kleur from 'kleur';

const main = (loggable: unknown): void => {
	const date = new Date().toLocaleDateString();
	const time = new Date().toLocaleTimeString();

	process.stdout.write(kleur.gray(`[${date} - ${time}] `) + loggable + '\n');
};

export const log = (loggable: unknown): void => {
	main(kleur.green('[INFO] ') + loggable);
};

export const error = (loggable: unknown): void => {
	main(kleur.red('[ERROR] ') + loggable);
};

export const warn = (loggable: unknown): void => {
	main(kleur.yellow('[WARN] ') + loggable);
};
