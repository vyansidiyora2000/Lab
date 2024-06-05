import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TodoForm.css'; // Import CSS file

const TodoForm = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [todos, setTodos] = useState([]);
  const [editText, setEditText] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [img, setImg] = useState();

  useEffect(() => {
    // Fetch todos when component mounts
    fetchTodos();
  }, []); // Empty dependency array ensures this effect runs only once

  const fetchTodos = async () => {
    try {
      const response = await axios.get('https://mwngry6756.execute-api.us-east-1.amazonaws.com/dev/getlist');
      setTodos(JSON.parse(response.data.body));
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const formData = new FormData();
      formData.append('text', text);
      if (img) {
        formData.append('imageBase64', await convertImageToBase64(img));
      }
      await axios.post('https://mwngry6756.execute-api.us-east-1.amazonaws.com/dev/create', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Reset form after successful submission
      setText('');
      setImage(null);
      setImg(null);

      // Fetch updated todos after adding a new todo
      fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      await axios.delete(`https://mwngry6756.execute-api.us-east-1.amazonaws.com/dev/delete?todoId=${todoId}`);

      // Fetch updated todos after deleting a todo
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEdit = async (todoId) => {
    try {
      setEditMode(todoId);
      const todo = todos.find(todo => todo.todoId === todoId);
      setEditText(todo.text);
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.post(`https://mwngry6756.execute-api.us-east-1.amazonaws.com/dev/edit`, {
        todoId: editMode,
        text: editText
      });

      // Fetch updated todos after editing
      fetchTodos();
      setEditMode(null);
      setEditText('');
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleImage = (e) => {
    setImg(e.target.files[0]);
  };

  const convertImageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(image);
    });
  };

  return (
    <div className="todo-container">
      <div className="todo-content">
    <div className="todo-form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter todo text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="todo-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="todo-file-input"
        />
        <button type="submit" className="todo-submit-button">Add Todo</button>
      </form>
      <div className="todo-list-container">
        <h2>Todo List</h2>
        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li key={index} className="todo-item">
              {editMode === todo.todoId ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="todo-edit-textarea"
                />
              ) : (
                <span>{todo.text}</span>
              )}
              {todo.imageKey && (
                <img src={`https://todo0506.s3.amazonaws.com/${todo.imageKey}`} alt="Todo Image" className="todo-image" />
              )}
              <button onClick={() => handleDelete(todo.todoId)} className="todo-delete-button">Delete</button>
              {editMode === todo.todoId ? (
                <button onClick={handleSaveEdit} className="todo-save-button">Save</button>
              ) : (
                <button onClick={() => handleEdit(todo.todoId)} className="todo-edit-button">Edit</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
    </div>
  );
};

export default TodoForm;
