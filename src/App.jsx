import AppRouter from './AppRouter';
import Navbar from './components/Navbar/Navbar';
import './App.css'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react';

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <AppRouter />
    </>
  );
}

export default App;
