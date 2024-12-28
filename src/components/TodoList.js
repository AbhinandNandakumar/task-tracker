import React, { useState,useEffect } from 'react'

import Todo from './Todo';
const TodoList = () => {

  const [todosList, setTodosList] = useState([]);
 const [add,setAdd] = useState(false);
 const [title,setTitle] = useState("");

 const [checkedTodos, setCheckedTodos] = useState([]);


//  const todolist = todos.map(todo => (
// <Todo id = {todo.id} text={todo.text}/>
//   ));

useEffect(() => {
  const checkedIds = todosList.filter((todo) => todo.check).map((todo) => todo);
  console.log(checkedIds)
  setCheckedTodos(checkedIds);
  fetch('http://localhost:5000/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({todos: checkedIds})
  })
}, [todosList]);

useEffect(() => {
  const fetchTodos = async () => {
     try {
        const response = await fetch("http://localhost:5000/todos");
        const data = await response.json();
        setTodosList(data); // Update state with fetched data
     } catch (error) {
        console.error("Error fetching todos:", error);
     }
  };

  fetchTodos();
}, []);

  const handleAdd = () => {
    setAdd(prev => !prev);
    
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    setTodosList(prev =>[ 
      ...prev,{ id: prev.length + 2, text: title,check:false }
    ])
    console.log(title)
    fetch("http://localhost:5000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: title, id: todosList.length + 2}),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add todo");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from server:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setTitle("")
    setAdd(false)
 }  
 const handleChecked = (id) =>{
    setTodosList(prev => {
      return prev.map((todo)=>{
          return todo.id === id ? {...todo,check:!todo.check} : todo
      })
    })
 }
 const handleYes = (id) => {
  // Optimistically update the state before the server call
  setTodosList((prev) => prev.filter((todo) => todo.id !== id));

  fetch(`http://localhost:5000/delete/${id}`, {
     method: "DELETE",
  })
     .then((response) => {
        if (!response.ok) {
           throw new Error("Failed to delete todo");
        }
        return response.json();
     })
     .then((data) => {
        console.log("Todo deleted successfully:", data);
     })
     .catch((error) => {
        console.error("Error deleting todo:", error);
        // Optionally, revert the state if the server call fails
        setTodosList((prev) => [...prev, todosList.find((todo) => todo.id === id)]);
     });
};

 const handleNo = (id) => {
  setCheckedTodos(prev => prev.filter(todo => todo.id !== id))
  setTodosList(prev => {
      return prev.map((todo)=>{
          return todo.id === id ? {...todo,check:!todo.check} : todo
      })
    })
 }


  return (
    <div className=' mt-5 w-full h-full flex flex-col justify-center items-center todo'>
      <h1 className=' mt-5 mb-5 text-2xl'>TODOLIST</h1>
      <ul className='  bg-slate-500 flex justify-center align-middle flex-col pt-12 pb-12 w-1/3 rounded-lg relative'>
      {todosList.map(todo => (
          <Todo key={todo.id} id={todo.id} todo={todo} text={todo.text} check={todo.check} todos={todosList} setTodos={setTodosList} update={handleChecked}/>
          
        ))}
        <div className='flex justify-center'>
        <button className='  m-3 w-1/12 rounded-md  bg-slate-800 h-10 todo text-2xl text-blue-300' onClick={handleAdd}>+</button>
        </div>
        {add && (<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/6 h-4/6 todo bg-slate-400 rounded-md text-black flex justify-center items-center p-4'>
        <div className=' bg-red-600  absolute pl-3 pr-2  top-1 right-1 text-white cursor-pointer rounded-sm ' onClick={() => {setAdd(false)}}>X</div>
          <form onSubmit={handleSubmit} className='flex flex-col' >
            <input type="text" placeholder='Enter the Todo' className=' block rounded h-8 p-3 m-2  todo' 
            onChange={(e) => {
                setTitle(e.target.value)
            }}required></input>
            <button type="submit" className='  m-3 p-2 rounded-md bg-slate-700  todo text-white' >ADD</button>
          </form>
        </div>)}
        {checkedTodos.length > 0 && <div className='mt-1 text-center  text-slate-800'>Swipe down to see the completed work</div>}
        {checkedTodos.length > 0 && (
          <div className='  m-5 p-3 rounded text-center '>
            {checkedTodos.map((todo) => (
              <div className=''>
                <div className='m-5 bg-slate-600 rounded-md p-2'><p key={todo.id}>Is it true that u have finished <span className=' decoration-5 text-slate-900'>"{todo.text}"</span> work ???</p>
                <button className='todo bg-slate-800 pl-2 pr-2 rounded m-3' onClick={()=> handleYes(todo.id)}>Yes</button>
                <button className='todo bg-slate-800 pl-2 pr-2 rounded' onClick={() => handleNo(todo.id)}>No</button>
                </div>
                </div>
              
            ))}
          </div>
        )}
        
      </ul>
   </div>
  )
}

export default TodoList
