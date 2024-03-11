import './App.css'
import {useEffect, useState} from "react";
import {workerType} from "src/enteties/worker";
import {ErrorBlock, ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock.tsx";
import {CircularProgress} from "@mui/material";

import {loadData} from "src/shared/lib/loadData.ts";
import AuthForm from "src/widgets/AuthForm/AuthForm.tsx";
import {WorkTable} from "src/widgets/WorkTable";
import {OrderType} from "src/enteties/order";
import {CheckForm} from "src/widgets/checkForm/CheckForm.tsx";
import {Loader} from "src/widgets/Loader/Loader.tsx";

interface initUserRequest {
  user: workerType
}

function App() {
  const [worker, setWorker] = useState<workerType | undefined>(undefined);
  const [error, setError] = useState<ErrorType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<OrderType | undefined>(undefined);

  useEffect(() => {
    loadData<initUserRequest>("user/initUser.php").then(res=>{
      if (res.status==='ok') {
        if (res.data?.user)
          setWorker(res.data?.user)
      }
      setIsLoading(false);
    });


  }, []);

  if (error) return <ErrorBlock error={error}/>
  if (isLoading) return <Loader />
  if (!worker) return <AuthForm setWorker={setWorker}/>
  if (order) return <CheckForm order={order} cancelFun={()=>setOrder(undefined)}/>
  return (
      <WorkTable setOrder={setOrder} logout={()=>setWorker(undefined)}/>
  )
}

export default App
