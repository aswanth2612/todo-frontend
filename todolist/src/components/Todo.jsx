import React from 'react'
import {useState, useEffect } from 'react'

const Todo = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todo, setTodo] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(-1);

// edit state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:3000"

  const handleSubmit = () => {
    setError("")
    //check inputs
    if (title.trim() !== '' && description.trim() !== '') {
      fetch(apiUrl+"/todo", {
        method: "POST",
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({title, description})
      }).then((res) => {
        if (res.ok) {
          //add item
          setTodo([...todo, {title, description}])
          setTitle("")
          setDescription("")
          setMessage("Item Added Sucessfully")
          setTimeout(() =>{
            setMessage("");
          },3000)
        }else {
          //set error
          setError("Unable to create Todo ITem")
        }
      }).catch(() =>{
        setError("Unable to create Todo ITem")
      })
    }
  }

  useEffect(() => {
    getItems()
  }, [])

  const getItems = () => {
    fetch(apiUrl+"/todo")
    .then((res) => res.json())
    .then((res) => {
      setTodo(res)
    })
  }

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description)
  }

  const handleUpdate = () => {
    setError("")
    //check inputs
    if (editTitle.trim() !== '' && editDescription.trim() !== '') {
      fetch(apiUrl+"/todo/"+editId, {
        method: "PUT",
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({title: editTitle, description: editDescription})
      }).then((res) => {
        if (res.ok) {
          //update item
          const updatedTodo = todo.map((item) => {
            if (item._id == editTitle) {
              item.title = editTitle;
              item.description = editDescription;
            }
            return item;
          })


          setTodo(updatedTodo)
          setEditTitle("")
          setEditDescription("")
          setMessage("Item Updated Sucessfully")
          setTimeout(() =>{
            setMessage("");
          },3000)

          setEditId(-1)

        }else {
          //set error
          setError("Unable to create Todo ITem")
        }
      }).catch(() =>{
        setError("Unable to create Todo ITem")
      })
    }
  }

  const handleEditCancel = () => {
    setEditId(-1)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure want to Delete?')) {
      fetch(apiUrl+'/todo/'+id, {
        method: "DELETE"
      })
      .then(() => {
        const updatedTodo = todo.filter((item) => item._id !== id)
        setTodo(updatedTodo)
      })
    }

  }


  return (
    <>
    <div className="row  display-flex  p-3 bg-success text-light">
      <h1>ToDo list with MERN Stack</h1>
    </div>
    <div className="row">
       <h3>Add Item</h3>
       {message && <p className=" text-success">{message}</p>}
       <div className="form-group d-flex gap-2">
          <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" />
          <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" />
          <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
       <h3>Tasks</h3>
       <div className="col-md-6">
        <ul className="list-group" >
          {
            todo.map((item) => <li key={item._id} className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
            <div className="d-flex flex-column me-2">
              {
                editId == -1 || editId !== item._id ? <>
                    <span className="fw-bold">{item.title}</span>
                    <span >{item.description}</span>
                </> : <> 
                <div className="form-group d-flex gap-2">
                 <input type="text" placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" />
                 <input type="text" placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" />
                </div>
                </>
              }
            
            </div>
            <div className="d-flex gap-2">
              { editId == -1 || editId !== item._id ? <button className="btn btn-warning" onClick={() =>handleEdit(item)}>Edit</button>: <button onClick={handleUpdate}>Update</button>}
              { editId == -1 ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>:
              <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button> }
            </div>
         </li>
         )
          }
          
       </ul>
       </div>
       
    </div>
    
    </>
  )
}

export default Todo
