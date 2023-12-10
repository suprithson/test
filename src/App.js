import AppNav from "./AppNav";
import Provider from "./config/Provider"
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Provider>
      <AppNav />
      <Toaster 
        position='top-right'
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          }
        }}
      />
    </Provider>
  );
}

export default App;
