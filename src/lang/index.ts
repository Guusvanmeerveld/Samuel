import Language from '@models/lang';

import * as Logger from '@utils/logger';

import { LANGUAGE } from '@src/config';
import en from '@src/lang/en';

const languages = new Map<string, Language>();

languages.set('en', en);

const language = languages.get(LANGUAGE.toLowerCase());

if (!language) {
	Logger.error(en.language.notFound(LANGUAGE));
	process.exit();
}

export default language!;
