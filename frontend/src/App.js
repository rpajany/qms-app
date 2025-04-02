// import { Header, Footer } from './components';

import { AllRoutes } from './routes/AllRoutes';
import { ToastContainer } from 'react-toastify';
import './App.css';


function App() {
  return (
    <div className="">
      <ToastContainer position='top-right' autoClose={2000} closeOnClick />
      {/* <Header /> */}
      {/* <Audit /> */}
      <AllRoutes />
      {/* <Footer /> */}
    </div>
  );
}

export default App;
