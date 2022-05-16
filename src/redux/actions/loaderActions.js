import * as types from '../types';
import { action } from '../../utils/helpers';

export const loading = (show) => action(types.LOADER, show);
export const categoryLoader = (show) => action(types.CATEGORY_LOADER, show);
