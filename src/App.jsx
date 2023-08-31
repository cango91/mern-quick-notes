import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import AuthPage from './pages/AuthPage/AuthPage';
import NotesPage from './pages/NotesPage/NotesPage';
import { getUser } from './utilities/users-service';
import './App.css';

export default function App() {
  const [user, setUser] = useState(getUser());
  return (
    <div className="App">
      {
        user ?
          <>
            <NavBar user={user} setUser={setUser} />
            <Routes>
              <Route path='/notes' element={<NotesPage />} />
              <Route path='/' element={<NotesPage />} />
            </Routes>
          </>
          :
          <AuthPage setUser={setUser} />
      }
    </div>
  );
}
