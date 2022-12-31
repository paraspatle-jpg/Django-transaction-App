import { useEffect, useState } from "react";
import "./App.css";
import { AllUsers } from "./components/Allusers";
import { Friends } from "./components/Friends";
import { Login } from "./components/Login";
import { Navbars } from "./components/Navbars";
import { TransactionHistory } from "./components/TransactionHistory";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("auth")));
  const [change, setChange] = useState(0)
  const [toggle, setToggle] = useState();
  useEffect(() => {
    setToggle(<Login setToggle={setToggle} setUser2={setUser} />);
  }, []);
  if (user === null) return toggle;
  return (
    <div className="App">
      <Navbars setUser={setUser}/>
      <TransactionHistory user={user} change={change} setChange={setChange}/>
      <AllUsers user={user} change={change} setChange={setChange}/>
      <Friends user={user} change={change} setChange={setChange}/>
    </div>
  );
}

export default App;
