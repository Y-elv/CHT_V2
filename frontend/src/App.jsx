
import Homepage from './pages/Homepage';
import './App.css'
import { Route, Routes } from "react-router-dom";
import Chatpages from './pages/Chatpages';

function App() {


  return (
    <div
     
    >
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chatpages />} />
      </Routes>
    </div>
  );
}

export default App
