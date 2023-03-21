import React, { useEffect } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import {
  BrowserRouter, Route, Routes,
} from 'react-router-dom';
import Library from './views/Library';
import Login from './views/Login';
import Register from './views/Register';
import Reader from './views/Reader';
import ReaderHTML from './views/ReaderHTML';
import PrivateRoutes from './utils/PrivateRoutes';
import { openSocket } from './socket';

toastr.options = {
  progressBar: true,
  maxOpened: 5,
  newestOnTop: true,
  preventDuplicates: true,
  positionClass: 'toast-top-right',
  hideMethod: 'slideUp',
  closeMethod: 'slideUp',
};

function App() {
  useEffect(() => {
    openSocket();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/registreren" element={<Register />} />
        {/* Protected Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/ebook/:id" element={<Reader />} />
          {/* <Route path="/bibliotheek" element={<Library />} /> */}
          <Route path="/" element={<Library />} />
          <Route path="/readerhtml/:id" element={<ReaderHTML />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
