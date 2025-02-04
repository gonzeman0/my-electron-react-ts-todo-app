const electron = require('electron')


electron.contextBridge.exposeInMainWorld("electron", {
    setTitle: (title) => ipcSend('set-title', { 'title': title }), // From Electron docs, for testing.
    openFile: () => ipcInvoke('dialog:open-file', {}),
    testPing: () => ipcSend('test:ping', {}),
    fetchUserData: () => ipcInvoke('app:fetch-user-data', {}),
    createItem: (item: TodoItemData) => ipcInvoke('app:create-item', item),
    completeItem: (id: number) => ipcInvoke('app:complete-item', {id: id}),
    deleteItem: (id: number) => ipcInvoke('app:delete-item', {id: id})
} satisfies Window["electron"]);


function ipcSend<Key extends FireEvent>(
    key: Key,
    args: EventArgumentMapping[Key] extends undefined ? {} : EventArgumentMapping[Key]
) {
    return electron.ipcRenderer.send(key, args);
}

function ipcInvoke<Key extends keyof RequestEventPayloadMapping>(
    key: Key,
    args: EventArgumentMapping[Key] extends undefined ? {} : EventArgumentMapping[Key]
) {
    return electron.ipcRenderer.invoke(key, args)
}