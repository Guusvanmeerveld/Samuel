import Language from '@models/lang';

import { LANGUAGE } from '@global/config';
import en from '@global/lang/en';
import nl from '@global/lang/nl';
import * as Logger from '@global/utils/logger';

const languages = new Map<string, Language>();

languages.set('en', en);
languages.set('nl', nl);

const language = languages.get(LANGUAGE.toLowerCase());

if (!language) {
	Logger.error(en.language?.notFound(LANGUAGE));
	process.exit();
}

export default language!;
