import './App.css';
import Routes_ from './routes/Routes';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <>
    <AuthProvider>
        <Routes_ />            
    </AuthProvider>
    </>
  )
}

export default App;
