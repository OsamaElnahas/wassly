import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "@fontsource/open-sans"; 
import router from "./components/Router/Router";
import './App.css'
import Layout from './components/layout/Layout'
import { RouterProvider } from 'react-router-dom';
const queryClient = new QueryClient();


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
         <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
         </QueryClientProvider>

    </>
  )
}

export default App
