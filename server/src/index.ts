import * as redis from './redis';

const main = async () => {
	await redis.connect();
};

main();
