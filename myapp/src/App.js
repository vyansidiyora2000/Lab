
import './App.css';
import TodoForm from './Components/TodoForm';
import { Route , Routes,BrowserRouter } from 'react-router-dom';





function App() {
  return (
   <BrowserRouter>
      <Routes>
      <Route  path="/" Component={TodoForm} />

      </Routes>
   </BrowserRouter>
   
  );
}

export default App;
