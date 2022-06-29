import AppBar from "../components/appbar";
import {useRouter} from "next/router"
import { useEffect,useState } from "react";
import { ethers } from "ethers";
import { abi } from "../constants/abi";
import OrderService from "../services/order"

import Payment from "../components/order/payment";
const Order = ({ query }) => {
  const router = useRouter()

  const [orderData,setOrderData] = useState({
    _id:"",
    product:"",
    email:"",
    isPaid:false
  })

  async function getOrder() {
    if (typeof window.ethereum !== "undefined") {
      const contractAddress = "0xe92807bF78323d96Bf91D68353C79A3fA33bA3A9";
      const contract = new ethers.Contract(contractAddress, abi);
      try {
        const result = await contract.getOrder(query.id);
        console.log(result)
        if(result){
          setOrderData({...orderData,isPaid:result})
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }
  useEffect(()=>{
    if(!query.id){
      router.push("/")
    }else{
      OrderService.get(query.id)
      .then(res=>{
        if(res.data){
          setOrderData(res.data)
          getOrder()
        }
        else{
          router.push("/")
        }
      },[])
      .catch((err)=>{
        alert("Error")
        router.push("/")
      })
    }
  },[])

 

  if(orderData.isPaid){
    return(<div>
      <AppBar />
      <div>
        Paid
      </div>
    </div>)
  }
  return (
    <>
      <AppBar />
      <Payment setOrderData={setOrderData} query={query} />
      
    </>
  );
};

Order.getInitialProps = ({ query }) => {
  return { query };
};

export default Order;