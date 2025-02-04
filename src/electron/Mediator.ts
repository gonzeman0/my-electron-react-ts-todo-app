import { app } from "electron";
import * as fs from "fs";
import * as path from "path";
import TodoList from "./TodoList.js";

export default class Mediator {
    static readonly USER_DATA_PATH: string = app.getPath("userData");
    static readonly TODOS_DIR_PATH: string = path.join(Mediator.USER_DATA_PATH, "todos");
    private static readonly TODO_LIST: TodoList = new TodoList();
    static FIRST_LOAD: boolean = true;

    async getUserData(): Promise<UserData> {
        if (Mediator.FIRST_LOAD) {
            this.read().then(data => {
                for (let item of data.items) {
                    Mediator.TODO_LIST.addItem(item.completed, item.title, item.description);
                }
            });
            Mediator.FIRST_LOAD = false;
        }
        return {
            items: Mediator.TODO_LIST.items,
        }
    }

    async completeItem(id: number): Promise<RequestResponse> {
        const myRequestResponse = Mediator.TODO_LIST.completeItem(id);
        await this.write();
        return myRequestResponse;
    }

    async deleteItem(id: number): Promise<RequestResponse> {
        const myRequestResponse = Mediator.TODO_LIST.removeItem(id);
        await this.write();
        return myRequestResponse;
    }

    async createItem(item: TodoItemData): Promise<RequestResponse> {
        // console.log("IN CREATEITEM() BEFORE ADDING ITEM IN MEDIATOR.TS");
        // console.log(item.title);
        // console.log(item.description);
        // console.log("----------------------------------");
        const myRequestResponse = Mediator.TODO_LIST.addItem(item.completed, item.title, item.description);
        // console.log("IN CREATEITEM() AFTER ADDING ITEM IN MEDIATOR.TS");
        // console.log(myRequestResponse);
        // console.log("----------------------------------");
        await this.write();
        return myRequestResponse;
    }

    async read(): Promise<UserData> {
        let data: UserData;
        if (fs.existsSync(Mediator.TODOS_DIR_PATH)) {
            data = JSON.parse(fs.readFileSync(Mediator.TODOS_DIR_PATH, "utf-8"));
        } else {
            data = {items: []};
            fs.writeFileSync(Mediator.TODOS_DIR_PATH, JSON.stringify(data));
        }
        return data;
    }

    async write(): Promise<boolean> {
        if (!fs.existsSync(Mediator.TODOS_DIR_PATH)) {
            await this.read(); // creates file if it doesn't exist.
        }
        fs.writeFileSync(
            Mediator.TODOS_DIR_PATH,
            JSON.stringify(await this.getUserData())
        );
        return true;
    }
}

