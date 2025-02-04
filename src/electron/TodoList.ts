export default class TodoList {
    private readonly todos: ConcreteTodoItem[] = [] // might be better to switch to a HashMap

    /**
     * Returns shallow copy.
     */
    get items(): TodoItem[] {
        const result: TodoItem[] = []
        for (let todo of this.todos) {
            result.push({
                id: todo.id,
                completed: todo.completed,
                title: todo.title,
                description: todo.description
            })
        }
        return result;
    }

    addItem(completed: boolean, title: string, description: string): RequestResponse {
        let item: ConcreteTodoItem;

        // console.log("INSIDE ADDITEM() BEFORE CREATING ITEM IN TODOLIST.TS");
        // console.log(title);
        // console.log(description);
        // console.log("----------------------------------");

        try {
            item = new ConcreteTodoItem(completed, title, description);
        } catch (e) {
            console.log("ERROR IN TODOITEM() IN TODOLIST.TS");
            let message: string;
            if (e instanceof Error) {
                message = e.message;
            } else {
                message = "Unknown error: " + e;
            }
            return {
                success: false,
                message: message,
                data: []
            }
        }
        
        // console.log("INSIDE ADDITEM() AFTER CREATING ITEM IN TODOLIST.TS");
        // console.log(item)
        // console.log("----------------------------------");
        this.todos.push(item);

        return {
            success: true,
            message: `Added item #${item.id} to the list.`,
            data: []
        }
    }

    removeItem(id: number): RequestResponse {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
            return {
                success: true,
                message: `Removed item #${id} from list.`,
                data: []
            }
        } 
        return {
            success: false,
            message: `Item #${id} does not exist.`,
            data: []
        }
    }

    completeItem(id: number): RequestResponse {
        const index = this.todos.findIndex(todo => todo.id === id)
        if (index !== -1) {
            const item = this.todos[index];
            item.completed = !item.completed;
            return {
                success: true,
                message: `Removed item #${id} from list.`,
                data: []
            }
        } 
        return {
            success: false,
            message: `Item #${id} does not exist.`,
            data: []
        }
    }

}

export class ConcreteTodoItem implements TodoItem {
    static NUM_ITEMS: number = 0;
    readonly id: number;
    private _completed: boolean;
    private _title: string;
    private _description: string;

    constructor(
        completed: boolean,
        title: string,
        description: string
    ) {
        // console.log("IN CONSTRUCTOR OF CONCRETETODOITEM IN TODOLIST.JS");
        // console.log(title);
        // console.log(description);
        // console.log("----------------------------------");
        this.id = ++ConcreteTodoItem.NUM_ITEMS;
        this._completed = completed;
        this._title = title;
        this._description = description;
        
    }

    get title(): string {
        return this._title;
    }

    set title(title: string) {
        // TODO: perform checks
        this._title = title;
    }

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        // TODO: perform checks
        this._description = description;
    }

    get completed(): boolean {
        return this._completed;
    }

    set completed(completed: boolean) {
        this._completed = completed;
    }

    toJSON(): TodoItem {
        // console.log("INSIDE TOJSON() IN TODOLIST.TS");
        // console.log({
        //     id: this.id,
        //     completed: this._completed,
        //     title: this._title,
        //     description: this._description
        // });
        // console.log("----------------------------------");
        return {
            id: this.id,
            completed: this._completed,
            title: this._title,
            description: this._description
        }
    }
}