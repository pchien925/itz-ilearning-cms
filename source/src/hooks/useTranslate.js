import { translateKeys } from '@itz/react-utils';
import { useIntl } from 'react-intl';

export default function useTranslate() {
    const intl = useIntl();
    return Object.assign(intl, { formatKeys: (message, keys = []) => translateKeys(intl, message, keys) });
}
