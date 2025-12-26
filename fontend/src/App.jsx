
import { Routes, Route } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import './text.css'
import { Toaster } from 'react-hot-toast'
import { Navigate } from 'react-router'
import useAuthUser from './hooks/useAuthUser.js'
import Login from './pages/Login.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
const App = () => {

  const {isLoading,authUser}=useAuthUser();

  const isAuthenticated=Boolean(authUser);

  if(isLoading){
    return <div className='h-screen bg-apricot'>Loading...</div>
  }
  return (
   <div>

    <Routes>
      <Route path='/' element={isAuthenticated ? <HomePage /> : <Navigate to='/login' />} />
      <Route path='/signup' element={isAuthenticated ? <Navigate to='/' /> : <SignUpPage />} />
      <Route path='/login' element={isAuthenticated ? <Navigate to='/' /> : <Login />} />
    </Routes>
    
    <Toaster />

   </div>
  )
}

export default App