import AppRouter from './AppRouter';
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
      <AppRouter />
    </>
  );
}

export default App;
