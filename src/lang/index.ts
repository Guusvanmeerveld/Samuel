import Language from '@models/lang';

import * as Logger from '@global/utils/logger';

import { LANGUAGE } from '@src/config';
import en from '@src/lang/en';
import nl from '@src/lang/nl';

const languages = new Map<string, Language>();

languages.set('en', en);
languages.set('nl', nl);

const language = languages.get(LANGUAGE.toLowerCase());

if (!language) {
	Logger.error(en.language?.notFound(LANGUAGE));
	process.exit();
}

export default language!;
