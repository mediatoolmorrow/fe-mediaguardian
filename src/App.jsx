import React from 'react'
import {Router, Routes, Route, BrowserRouter} from 'react-router-dom'
import Homepage from './page/Homepage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Homepage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
