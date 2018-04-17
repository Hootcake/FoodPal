import { BaseEntity, User } from './../../shared';

export class Shopping_List implements BaseEntity {
    constructor(
        public id?: number,
        public items?: string,
        public notes?: string,
        public user?: User,
    ) {
    }
}
