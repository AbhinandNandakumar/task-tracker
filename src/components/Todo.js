import React from 'react'
import '../components/styles/Todo.css'


const Todo = (props) => {
  const handleCheck = (e) => {
      props.setTodos((prevTodos) => {
        const newTodos = prevTodos.map((todo) => {
          if (todo.id === props.todo.id) {
            return { ...todo, check: !todo.check };
          }
          return todo;
        });
        return newTodos;
      });
      console.log(props.todos)
       
    };
    
 
 
  return (
    <div className='flex justify-center'>
      <li className='  w-1/2 text-blue-300 m-3 flex justify-between p-3 rounded-lg bg-slate-800 todo' key={props.id}>{props.text} <input className='ml-3'
          type="checkbox"
          checked={props.check}
          onChange={()=> props.update(props.id) }
        /> </li>
    </div>
  )
  }

export default Todo