import { GoodPoint } from '../../goodPoint.type';
import { StudentRow } from './StudentRow.interface';

export interface GoodPointRow extends StudentRow {
    goodPoint: GoodPoint[];
}
