import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import App from './App.jsx'
import Homepage from './components/landingPage/Homepage.jsx'
import Signup from './components/login/Signup.jsx'
import Login from './components/login/login.jsx'
import CustomNavbar from './components/Navbar.jsx'
import Footer from './components/footer.jsx'
import Compblog from './components/blogs/Compblog.jsx'
import Blogpage from './components/landingPage/Blogpage.jsx'
import CreateBlog from './components/CRUD/CreateBlog.jsx'
import EditBlog from './components/CRUD/EditBlog.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from './context/ProtectedRoute.jsx'
import { FlashProvider } from "./context/FlashContext.jsx";
import {Dashboard} from "./components/DashBoard/Dashboard.jsx"
import AuthorProfile from './components/profiles/AuthorProfile.jsx'
import LegalPage from './components/legal/LegalPage.jsx'
createRoot(document.getElementById('root')).render(
  <FlashProvider>
    <BrowserRouter>
    <AuthProvider>
    <CustomNavbar/>
      <Routes>
            <Route path='/' element={<Homepage/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/privacy' element={<LegalPage type="privacy"/>}></Route>
            <Route path='/terms' element={<LegalPage type="terms"/>}></Route>
            <Route path='/profile/:username' element={<AuthorProfile/>}></Route>
            <Route path='/blogs' element={<Blogpage/>}></Route>
            <Route path='/blog/:slug' element={<Compblog/>}></Route>
            <Route path='/blogs/:id' element={<Compblog/>}></Route>

            <Route path='/create' element={ <ProtectedRoute><CreateBlog/></ProtectedRoute> }></Route>
            <Route path='/edit/:id' element={<EditBlog/>}></Route>
            <Route path='/users/:username/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
            <Route path="*" element={<h2 className='mt-5 p-5 fs-2 text-center'>Page Not Found</h2>} />
      </Routes>
      <Footer />
      </AuthProvider>
    </BrowserRouter>
    </FlashProvider>
)
