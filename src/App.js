import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'popper.js';
import 'jquery';
import './Components/css/qa.css';
import axios from 'axios';

import Header from './Components/Header';
import Footer from './Components/Footer';
import AllTodos from './Components/AllTodos';
import AddEditTodo from './Components/AddEditTodo';
import Modal from './Components/utils/Modal';
import NotFound from './Components/utils/NotFound';

const TODOSURL = `http://localhost:4000/todos`;

function App() {
  const [todos, setTodos] = useState({});
  // const [todoToEdit, setTodoToEdit] = useState(null);
  const [getError, setGetError] = useState(``);
  const [postError, setPostError] = useState(``);
  const [putError, setPutError] = useState(``);

  useEffect(() => {
    const getData = async () => {
      setTodos(await getTodos());
    }
    getData();
  }, []);

  const getTodos = async () => {
    try {
      const res = await axios.get(TODOSURL);
      return res.data.length ? ({ todos: res.data }) : ({ error: `There are no todos stored` });
    }
    catch (e) {
      setGetError(`Data not available from server: ${e.message}`)
      return ({ error: `Data not available from server: ${e.message}` });
    }
  };

  const submitTodo = async todo => {
    setPostError(``);
    try {
      await axios.post(TODOSURL, todo);
    } catch (e) {
      setPostError(`There was a problem adding the todo: ${e.message}`);
    } finally {
      setTodos(await getTodos());
    }
  }

  // const selectTodo = todo => {
  //   setTodoToEdit(todo);
  // }

  const updateTodo = async todo => {
    setPutError(``);
    try {
      await axios.put(`${TODOSURL}/${todo._id}`, todo);
    } catch (e) {
      setPutError(`There was a problem updating the todo: ${e.message}`);
    } finally {
      // setTodoToEdit(null);
      setTodos(await getTodos());
    }
  };

  return (
    <Router>
      {getError && <Modal handleClose={() => setGetError(``)} message={getError} />}
      {putError && <Modal handleClose={() => setPutError(``)} message={putError} />}
      {postError && <Modal handleClose={() => setPostError(``)} message={postError} />}
      <div className="container">
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<AllTodos data={todos} />}>
              {/* <AllTodos data={todos} selectTodo={selectTodo}  />*/} 
            </Route>
            <Route path="/add" element={<AddEditTodo submitAction={submitTodo} />}>
            </Route>
            <Route path="/edit/:_id"element={<AddEditTodo submitAction={updateTodo} data={todos} />}>
            </Route>
            <Route element={<NotFound />}>
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
