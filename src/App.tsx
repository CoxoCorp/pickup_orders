import './App.css'
import {Suspense, useEffect, useState} from "react";
import {LinkStoreType, ModeType, workerType} from "src/enteties/worker";
import {ErrorBlock, ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock.tsx";

import {loadData} from "src/shared/lib/loadData.ts";
import AuthForm from "src/widgets/AuthForm/AuthForm.tsx";
import {WorkTable} from "src/widgets/WorkTable";
import {OrderType} from "src/enteties/order";
import {CheckForm} from "src/widgets/checkForm/CheckForm.tsx";
import {Loader} from "src/widgets/Loader/Loader.tsx";
import {ModeForm} from "src/widgets/ModeForm";
import StoreForm from "src/widgets/StoreForm/ui/StoreForm.tsx";

interface initUserRequest {
  user: workerType
}

function App() {
  const [worker, setWorker] = useState<workerType | undefined>(undefined);
  const [error, setError] = useState<ErrorType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<OrderType | undefined>(undefined);
  const setMode = (mode: ModeType | undefined) =>{
    setWorker((currentWorker: workerType | undefined)=>{
      if (currentWorker) {
        return {...currentWorker, mode: mode}
      } else {
        return undefined;
      }

    }
    )
  }
  const setStore = (store: LinkStoreType | undefined)=>{
    if (store) {
      setWorker((currentWorker: workerType | undefined) => {
            if (currentWorker) {
              return {...currentWorker, linkStore: store}
            } else {
              return undefined;
            }

          }
      )
    }
  }
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
  if (!worker?.mode) return <Suspense fallback={<Loader/>}><ModeForm setMode={setMode}/></Suspense>
  if (worker.mode==='coxo' && !worker?.linkStore) return <Suspense fallback={<Loader/>}><StoreForm allStores={worker.allShops} setStore={setStore} /></Suspense>
  if (!order) return (
      <WorkTable
          worker={worker}
          changeWorkerMode={()=>setMode(undefined)}
          setOrder={setOrder}
          logout={()=>setWorker(undefined)}
      />
  )
  return <CheckForm order={order} cancelFun={()=>setOrder(undefined)}/>
}

export default App
