import {LocalStore} from "../../utils/LocalStore";
import {BUGS} from "./TodoBugs";

export default class TodoService {
    static instance;

    static getDefaultInstance(token) {
        if (!this.instance) {
            this.instance = new TodoService()
        }
        if (!token) {
            let profile = LocalStore.getInstance().read('todo_session');
            if (profile)
                token = profile;
        }

        this.instance.setToken(token);

        return this.instance
    }

    token;

    setToken(token) {
        this.token = token;
    }

    async login(username, password) {
        const users = [
            { username: 'demo', password: 'password', avatar: ''},
            { username: 'demo2', password: 'passcode', avatar: ''},
        ];

        const WRONG_RESPONSE = {
            status: 400,
            body: {
                error_message: 'Username và mật khẩu không đúng'
            }
        };

        let user = users.find(user=> user.username === username);

        if (!user) {
            return WRONG_RESPONSE;
        }

        if (BUGS.ONLY_CHECK_PASSWORD_LENGTH) {
            if (user.password.length !== password.length) {
                return WRONG_RESPONSE;
            }
        }
        else {
            if (user.password !== password) {
                return WRONG_RESPONSE;
            }
        }

        return {
            status: 200,
            body: user
        }
    }

    async getTasks() {
        let username = this.token.username;
        let key;
        if (BUGS.SAME_TODO_LIST) {
            key = 'td_username'
        }
        else {
            key = `td_${username}.tasks`
        }

        let data = LocalStore.getInstance().read(key);

        if (!data) {
            data = [
                {id: 'zero',title: 'Ngủ dậy', due_date: new Date(2021,7,1), is_done: false, finished_date: null},
                {id: 'a',title: 'Đi chợ', due_date: new Date(), is_done: true, finished_date: new Date()},
                {id: 'b',title: 'Nấu cơm', due_date: new Date(), is_done: false, finished_date: null},
                {id: 'c',title: 'Rửa bát', due_date: new Date(), is_done: false, finished_date: null}
            ];
            LocalStore.getInstance().save(key, data)
        }

        return {
            status: 200,
            body: data
        };
    }

    async saveAllTasks(data) {
        let username = this.token.username;
        let key;
        if (BUGS.SAME_TODO_LIST) {
            key = 'td_username'
        }
        else {
            key = `td_${username}.tasks`
        }

        LocalStore.getInstance().save(key, data)
    }
}