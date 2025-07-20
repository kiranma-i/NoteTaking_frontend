import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './Context/ContextProvider';
import Home from './pages/Home';
import HomeBefore from './pages/HomeBefore';
import Important from './pages/Important';
import Labels from './pages/Labels';
import Login from './pages/Login';
import Remainders from './pages/Remainders';
import Signup from './pages/Signup';
import Trash from './pages/Trash';

const App = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <HomeBefore />} />
        <Route path="/register" element={user ? <Home /> : <Signup />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/reminders" element={<Remainders />} />
        <Route path="/labels" element={<Labels />} />
        <Route path="/important" element={user ? <Important /> : <Login />} />
        <Route path="/trash" element={user ? <Trash /> : <Login />} />

      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
