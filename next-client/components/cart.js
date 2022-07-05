import React from "react";
import { Button, Container, TextField, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import OrderService from "../services/order";
import { clear,remove } from "../reducers/cart";
import { useState } from "react";
import styles from "../styles/cart.module.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Slide from "@mui/material/Slide";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Cart() {
  const cart = useSelector((state) => state.cart.value);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const router = useRouter();

  const pay = () => {
    if (email) {
      OrderService.create({ products: cart.products, email })
        .then((res) => {
          router.push("/order?id=" + res.data._id);
        })
        .catch((err) => {
          alert("Error");
        });
    }
  };

  const clearCart = () => {
    dispatch(clear());
  };

  const Remove = (id,price)=>{
    dispatch(remove({product:id,price}));
  }

  return (
    <div>
      {!show && (
        <div className={styles.cartBtn} onClick={() => setShow(true)}>
          <ShoppingCartIcon />
          {cart.products.length !== 0 && <span>{cart.products.length}</span>}
        </div>
      )}
      {show && (
        <div className={styles.cartScreen} onClick={() => setShow(false)}></div>
      )}
      <Slide direction="left" in={show}>
        <div className={styles.cart} onClick={() => console.log("hi")}>
          <IconButton
            aria-label="close"
            color="warning"
            className={styles.close}
            onClick={() => setShow(false)}
          >
            <ClearIcon />
          </IconButton>
          <h1>Cart</h1>
          <div className={styles.items}>
            {cart.products.map((it) => (
              <div className={styles.item} key={it.id}>
                <img src="https://picsum.photos/200" alt="item" />
                <span>{it.data.name}</span>
                <span>{it.data.price} BNB</span>
                <span>{it.quantity}</span>
                {it.quantity === 1 ? <IconButton
                  aria-label="delete"
                  onClick={()=>Remove(it.productId,it.data.price)}
                >
                  <DeleteIcon />
                </IconButton> : <IconButton
                  aria-label="delete"
                  onClick={()=>Remove(it.productId,it.data.price)}
                >
                  <RemoveIcon />
                </IconButton>}
              </div>
            ))}
          </div>
          <div>
            <h4 className={styles.price}>Price: {cart.price.toFixed(5)} BNB</h4>
            <Button
              className={styles.buyBtn}
              color="success"
              variant="contained"
              onClick={clearCart}
            >
              Buy
            </Button>
          </div>
        </div>
      </Slide>
    </div>
  );
}
