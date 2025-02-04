import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import { isDev, ipcHandle, ipcOn } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import Mediator from './Mediator.js';

const mediator = new Mediator();

app.whenReady().then(() => {
    ipcHandle('dialog:open-file', handleFileOpen);
    ipcOn('set-title', handleSetTitle);
    ipcOn('test:ping', () => console.log("Ping received from renderer."));
    ipcHandle('app:fetch-user-data', handleFetchUserData);
    ipcHandle('app:create-item', handleCreateItem);
    ipcHandle('app:complete-item', handleCompleteItem)
    ipcHandle('app:delete-item', handleDeleteItem)
    createWindow();
})

async function handleCompleteItem(e: Electron.IpcMainInvokeEvent, args: { id: number }): Promise<RequestResponse> {
    e.sender;
    return mediator.completeItem(args.id);
}

async function handleDeleteItem(e: Electron.IpcMainInvokeEvent, args: { id: number }): Promise<RequestResponse> {
    e.sender; // ignore
    return mediator.deleteItem(args.id);
}

async function handleCreateItem(e: Electron.IpcMainInvokeEvent, item: TodoItemData): Promise<RequestResponse> {
    e.sender; // ignore
    // console.log("IN HANDLE_CREATE_ITEM() IN MAIN.TS");
    // console.log(item.title);
    // console.log(item.description);
    // console.log("----------------------------------");
    return mediator.createItem(item);
}

async function handleFetchUserData(): Promise<UserData> {
    return mediator.getUserData();
}

function handleSetTitle (event: Electron.IpcMainEvent, args: { title: string }) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    if (win !== null) {
        win.setTitle(args.title);
        console.log(`Set window title to ${args.title}!`);
    } else {
        console.log("Failed to set window title.");
    }
}

async function handleFileOpen (): Promise<string> {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    return filePaths[0]
  }
  throw new Error("Something went wrong!");
}

function createWindow (): void {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath()
        },
    });
    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123')
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    }
}