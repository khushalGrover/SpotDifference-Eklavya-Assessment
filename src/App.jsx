import { useState } from 'react'
import './App.css'
import { Button } from "@/components/ui/button"

function App() {
  const [count, setCount] = useState(0)

  return (
    <h1 className="text-3xl font-bold underline text-center mt-10">
      HELLO VITE + REACT + TAILWIND CSS
      <Button>Click me</Button>
    </h1>
  )
}

export default App
