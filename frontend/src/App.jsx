import React, { useEffect } from 'react'
import Navbar from './components/Navbar';
import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage, SignUpPage, LoginPage, ProfilePage, SettingsPage } from './pages/index'
import { useAuthStore } from './store/useAuthStore.js';
import { LoaderCircle } from 'lucide-react'

function App() {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if(isCheckingAuth && !authUser) return (
		<div className='flex items-center justify-center h-screen'>
			<LoaderCircle className='size-10 animate-spin' />
		</div>
	)

	return (
		<div>
			<Navbar />
			<Routes>
				<Route path='/' element={ authUser ? <HomePage /> : <Navigate to='/login' /> } />
				<Route path='/signup' element={ !authUser ? <SignUpPage /> : <Navigate to='/' /> } />
				<Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to='/' /> } />
				<Route path='/settings' element={<SettingsPage />} />
				<Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to='/login' /> } />
			</Routes>
		</div>
	)
}

export default App;