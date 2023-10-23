export default class UserDto {
    id;
    name;
    login;
    email;
    password;
    is_admin;

    constructor({ id, name, login, email, password, is_admin }) {
        this.id = id;
        this.name = name;
        this.login = login;
        this.email = email;
        this.password = password;
        this.is_admin = is_admin;
    }
};