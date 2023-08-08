import React, { useEffect, useReducer, useRef } from 'react'
import uuid from 'react-uuid';
import {AiOutlineEdit} from "react-icons/ai"
import {RiDeleteBin5Line} from "react-icons/ri"
import "./index.css"

export default function Todolist() {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { tasksList: [], task: "", onUpdate: {status: false, id: ""}, errorMsg: false }
  );
  const {task, tasksList, onUpdate, errorMsg} = state;
  const inputFieldRef = useRef(null);

  useEffect(() => {
    const taskListStoredData = JSON.parse(localStorage.getItem('taskListData'));
    if(taskListStoredData === null) {
      localStorage.setItem('taskListData', [])
    }else if(taskListStoredData.length > 0) {
      setState({tasksList: taskListStoredData})
    } 
  }, [])

  useEffect(() => {
    localStorage.setItem('taskListData', JSON.stringify(tasksList))
  }, [tasksList])


  const onChangeINputField = (event) => {
    setState({task: event.target.value})
  }

  const handleAddTask = (event) => {
    event.preventDefault();

    if(task === ""){
      setState({errorMsg: true});
    }else if(onUpdate.status === false) {
      setState({task: "", tasksList: [...tasksList, {id: uuid(), task}], errorMsg: false})
    }else {
      const updatedTasksList = tasksList.map(each => {
        if(each.id === onUpdate.id) {
          return (
           {...each, task}
          )
        }
        return each
      })
      setState({task: "", tasksList: updatedTasksList, onUpdate: {status: false, id:""}, errorMsg: false})
    }
  }

  const onClickEdit = id => {
    inputFieldRef.current.focus();
    tasksList.map(each => {
      if(each.id === id) {
        setState({task:each.task, onUpdate: {status: true, id: id}});
      }
    })
  }

  const onClickDelete = id => {
    const updatedTaskList = tasksList.filter(each => each.id !== id);
    setState({tasksList: updatedTaskList})
  }

  const onRenderTasks = () => {
    if(tasksList.length !== 0) {
      return (
        tasksList.map(each => [
          <li className='flex justify-between items-center bg-[#ebf2f3] w-[300px] px-3 py-1 border-l-4 border-slate-500 rounded border border-sky-500 m-2' key={each.id}>
            <h1>{each.task}</h1>
            <div className='flex justify-center items-center'>
              <AiOutlineEdit onClick={() => onClickEdit(each.id)} className='mx-1' />
              <RiDeleteBin5Line onClick={() => onClickDelete(each.id)} className='mx-1' />
            </div>
          </li>
        ])
      )
    }else {
      return (
        <h1 className='font-bold'>No tasks Available</h1>
      )
    }
  }

  let buttonText = onUpdate.status ? "Update Task" : "Add Task";

  return (
    <section className='max-w-[1200px] p-2 m-auto shadow-xl min-h-screen'>
        <h1 className='font-medium text-center text-3xl underline decoration-wavy mb-5'>TodoList</h1>
        <form onSubmit={handleAddTask} className='flex justify-center items-start flex-wrap mb-5'>
          <div className='flex flex-col mb-3'>
            <input ref={inputFieldRef} onChange={onChangeINputField} value={task} className="w-[300px] placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md py-2 pl-5 pr-3 mr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter your task..." type="text" name="task"/>
            {errorMsg && <p className='text-xs text-red-600'>Please Enter Some Text....</p>}
          </div>
          <button type='submit' className="bg-slate-500 text-white px-3 py-1 mx-2 font-bold rounded-md">{buttonText}</button>
        </form>
        <div className='my-2'>
          <ul className='flex flex-wrap justify-center '>
          {onRenderTasks()}
          </ul>
        </div>
    </section>
  )
}