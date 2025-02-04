import './App.css'
import "./index.css";
import { useState, useEffect } from "react";

function App() {

  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    window.electron.fetchUserData()
      .then(result => {
        setTimeout(() => setUserData(result), 1000);
      });
  }, []);

  function handleOnCreate(item: TodoItemData) {
    window.electron.createItem(item)
      .then(result => {
        if (!result.success) {
          alert("Invalid item: " + result.message);
          return;
        };
        window.electron.fetchUserData()
          .then(result => setUserData(result));
      });
  }

  function handleOnComplete(id: number) {
    window.electron.completeItem(id)
    .then(result => {
      if (!result.success) {
        alert("Unable to perform action: " + result.message);
        return;
      };
      window.electron.fetchUserData()
        .then(result => setUserData(result));
    })
  }

  function handleOnDelete(id: number) {
    window.electron.deleteItem(id)
      .then(result => {
        if (!result.success) {
          alert("Unable to perform action: " + result.message);
          return;
        };
        window.electron.fetchUserData()
          .then(result => setUserData(result));
      });
  }

  return (
    <>
      <div id="app-container">
        <h1 id="title">Today's Tasks</h1>
        <div id="task-card-container"> 
          {userData === null ? <p>Loading...</p> : <TaskCards items={userData.items} onComplete={handleOnComplete} onDelete={handleOnDelete}/>}
        </div>
        <AddTaskButtonPopup buttonLabel='Add Task' onCreate={handleOnCreate}/>
        <p id="footer">
          This My Demo App
        </p>
      </div>
    </>
  )
}

function TaskCards(props: {items: TodoItem[], onComplete: (id: number) => void, onDelete: (id: number) => void }): JSX.Element {
  
  const unfinishedItems: TodoItem[] = [];
  const completedItems: TodoItem[] = [];
  for (let item of props.items) {
    if (item.completed) {
      completedItems.push(item);
    } else {
      unfinishedItems.push(item);
    }
  }

  console.log(props.items);
  if (props.items.length === 0) {
    return (
      <>
      <p>You're all done! Create a new task by clicking 'Add Task' below.</p>
      </>
    )
  }
  return (
    <>
      {unfinishedItems.map((item) => (
        <TaskCard item={item} onComplete={props.onComplete} onDelete={props.onDelete}/>
      ))}
      {completedItems.map((item) => (
        <TaskCard item={item} onComplete={props.onComplete} onDelete={props.onDelete}/>
      ))}
    </>
  )
}

function TaskCard(props: {item: TodoItem, onComplete: (id: number) => void, onDelete: (id: number) => void}): JSX.Element {
  return (
    <div className={"task-card " + (props.item.completed ? "completed" : "")}>
      <button onClick={() => props.onComplete(props.item.id)}>Complete</button>
      <div>
        <h3 className="task-title">{props.item.title}</h3>
        <p>{props.item.description}</p>
      </div>
      <button onClick={() => props.onDelete(props.item.id)}>Delete</button>
    </div>
  )
}

function AddTaskButtonPopup(props: {buttonLabel: string, onCreate: (data: TodoItemData) => void}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // prevent page reload
    props.onCreate({
      completed: false,
      title: title,
      description: description
    });
    setTitle("");
    setDescription("");
    setIsOpen(false);
  }

  return (
    <div>
      {/* Button to open the popup */}
      <button onClick={() => setIsOpen(true)}>{props.buttonLabel}</button>

      {/* Popup Window */}
      {!isOpen ? <></> : (
        <div className="popup-overlay">
          <form onSubmit={handleSubmit}>
            <div className='popup-add-task'>
              <div className='popup-header'>
                <h4 className="popup-title">Create New Item</h4>
                <button className='btn-exit' onClick={() => setIsOpen(false)}>✖</button>
              </div>
              
              <label>Title:</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required/>
              <label>Description:</label>
              <textarea className="add-task-description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
              <button 
                  type="submit" 
                  onClick={() => {
                    setTitle(title.trim());
                    setDescription(description.trim());
                  }} 
              >Create!</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
