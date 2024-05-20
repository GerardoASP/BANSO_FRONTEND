import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import ProfilePage from './components/Profile/Profile';
import ListUserPage from './pages/ListUserPage/ListUserPage';
import ListProjectPage from './pages/ListProjectPage/ListProjectPage';
import RegisterForm from './components/RegisterForm/RegisterForm';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterProject from './components/RegisterProject/RegisterProject'
import UpdateProjectForm from './components/UpdateProjectForm/UpdateProjectForm';
import UpdateUserForm from './components/UpdateUserForm/UpdateUserForm';
import Dashboard from './pages/DashBoardPage/DashBoardPage';
import ProjectFilter from './components/ProjectFilter/ProjectFilter';
import VerifyComponent from './components/VerifyComponent/VerifyComponent';
import RegisterPublication from './components/RegisterPublication/RegisterPublication';
import ListMyProjects from './pages/ListMyProjects/ListMyProjects';
import UpdatePublication from './components/UpdatePublication/UpdatePublication';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />}/>
          <Route path="/profile" element={<ProfilePage />}/>
          <Route path="/users" element={<ListUserPage />}/>
          <Route path="/projects" element={<ListProjectPage />}/>
          <Route path="/myprojects" element={<ListMyProjects />}/>
          <Route path="/register" element={<RegisterForm />}/>
          <Route path="/login" element={<LoginForm />}/>
          <Route path="/register-project" element={<RegisterProject />}/>
          <Route path="/update-project" element={<UpdateProjectForm />}/>
          <Route path="/update-publication" element={<UpdatePublication />}/>
          <Route path="/update-profile" element={<UpdateUserForm />}/>
          <Route path="/filter-project" element={<ProjectFilter />}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/verify-component' element={<VerifyComponent/>}/>
          <Route path='/register-publication' element={<RegisterPublication/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
