export default class TokenDto {
    id;
    user_id;
    expired;

    constructor({ id, user_id, expired }) {
        this.id = id;
        this.user_id = user_id;
        this.expired = expired;
    }
};