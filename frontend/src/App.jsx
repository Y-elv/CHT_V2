
import Homepage from './pages/Homepage';
import './App.css'
import { Route, Routes } from "react-router-dom";
import Chatpages from './pages/Chatpages';

function App() {


  return (
    <Routes>
      <Route path="/"element ={<Homepage/>} />
      <Route path="/chats"element ={<Chatpages/>} />
    </Routes>
  );
}

export default App
