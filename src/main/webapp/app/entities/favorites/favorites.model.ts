import { BaseEntity, User } from './../../shared';

export class Favorites implements BaseEntity {
    constructor(
        public id?: number,
        public recipe_title?: string,
        public cuisine?: string,
        public ingredients?: string,
        public source_URL?: string,
        public user?: User,
    ) {
    }
}
