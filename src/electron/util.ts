import { ipcMain } from "electron";

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function ipcHandle<Key extends keyof RequestEventPayloadMapping>(
    key: Key,
    handler: (event: Electron.IpcMainInvokeEvent, args: EventArgumentMapping[Key]) => RequestEventPayloadMapping[Key]
) {
    ipcMain.handle(key, handler);
}

export function ipcOn<Key extends FireEvent>(
    key: Key,
    handler: (event: Electron.IpcMainEvent, args: EventArgumentMapping[Key]) => void
) {
    ipcMain.on(key, handler);
}