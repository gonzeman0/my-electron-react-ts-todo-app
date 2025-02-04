// .d.ts file is for defining global types

// Interface for a possible TodoItem.
// Keyword 'type' is utilized, as this is not meant to be extended.
// Can be utilized by the front-end.
// NOTE: maybe utilize? Still not sure.
type TodoItemData = {
    completed: boolean,
    title: string,
    description: string,
}

type UserData = {
    items: TodoItem[];
}

type RequestResponse = {
    success: boolean;
    message: string;
    data: TodoItem[];
}

// Inteface of a concrete TodoItem. 
interface TodoItem {
    readonly id: number,
    completed: boolean,
    title: string,
    description: string,
}

// For request events.
type RequestEventPayloadMapping = {
    'dialog:open-file': Promise<string>;
    'app:fetch-user-data': Promise<UserData>;
    'app:create-item': Promise<RequestResponse>;
    'app:complete-item': Promise<RequestResponse>;
    'app:delete-item': Promise<RequestResponse>;

}

// Fire events are "forgotten". Return type void
type FireEvent =
    'test:ping' |
    'set-title';

// For both request and fire events.
// Enforces type safety by defining expected parameters.
type EventArgumentMapping = {
    'dialog:open-file': undefined;
    'set-title': {
        title: string
    };
    'test:ping': undefined;
    'app:fetch-user-data': undefined;
    'app:create-item': TodoItemData;
    'app:complete-item': {
        id: number;
    };
    'app:delete-item': {
        id: number;
    };
}

interface Window {
    electron: {
        setTitle: (title: string) => void;
        openFile: () => Promise<String>;
        testPing: () => void;
        fetchUserData: () => Promise<UserData>;
        createItem: (item: TodoItemData) => Promise<RequestResponse>;
        completeItem: (id: number) => Promise<RequestResponse>;
        deleteItem: (id: number) => Promise<RequestResponse>;
    }
}
