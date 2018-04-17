import { BaseEntity, User } from './../../shared';

export class Inventory implements BaseEntity {
    constructor(
        public id?: number,
        public ingredient_name?: string,
        public quantity?: number,
        public user?: User,
        public category?: BaseEntity,
    ) {
    }
}
