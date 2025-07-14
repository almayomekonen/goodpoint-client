import * as yup from 'yup';

import { EMAIL_REGX, FIRST_LAST_NAME_REGEX } from '../../../admin/common/consts/regexes';

export const NAME_SCHEMA = yup
    .string()
    .trim()
    .matches(new RegExp(FIRST_LAST_NAME_REGEX, 'i'), 'errors.nameMustNotIncludeSpecialChars||')
    .required();

export const EMAIL_SCHEMA = yup.string().trim().matches(EMAIL_REGX, 'errors.emailFormat||');
