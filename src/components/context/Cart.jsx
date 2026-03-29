import { createContext, useEffect, useState } from "react";
import { adminToken, apiUrl } from "../common/http";

export const CartContext = createContext();
export const CartProvider  = ({children}) =>{
    const [cartData,setCartData] = useState(JSON.parse(localStorage.getItem('cart')) || [])
    const [shippingCost,setShippingCost] = useState(0);

   const addToCart = (product, size = null) => {
    let UpdatedCart = [...cartData];

    // 1. Find the index of the item that matches both ID AND SIZE
    const existingIndex = UpdatedCart.findIndex(item => 
        item.product_id === product.id && item.size === size
    );

    if (existingIndex > -1) {
        // 2. If it exists, update only that specific item's quantity
        UpdatedCart[existingIndex] = {
            ...UpdatedCart[existingIndex],
            qty: UpdatedCart[existingIndex].qty + 1
        };
    } else {
        // 3. If it doesn't exist, push a new unique entry
        UpdatedCart.push({
            id: `${product.id}-${size}-${Date.now()}`, // Using Date.now() is safer than Math.random
            product_id: product.id,
            size: size,
            title: product.title,
            price: product.price,
            qty: 1,
            image_url: product.image_url
        });
    }

    setCartData(UpdatedCart);
    localStorage.setItem('cart', JSON.stringify(UpdatedCart));
};
    const updateItem = (itemId,newQty)=>{
        let UpdateData = [...cartData];
        UpdateData = UpdateData.map(item=>(
            item.id == itemId ? {...item,qty:newQty}:item
        ))
           setCartData(UpdateData)
        localStorage.setItem('cart',JSON.stringify(UpdateData))
    }
    const clearCart = () => {
    setCartData([]); // Set state to empty array
    localStorage.removeItem('cart'); // Remove from storage
};
      const shipping = () =>{
            let shipping_Cost = 0;
            cartData.map(item =>(
                shipping_Cost += item.qty * shippingCost
            ))
            return shipping_Cost;
        }
     const SubTotal = () =>{
            let subTotal = 0;
            cartData.map(item =>(
                subTotal += item.qty * item.price
            ))
            return subTotal;
        }
        const GrandTotal =() =>{
            return shipping() + SubTotal();
        }
        const deleteItem = (ItemId) =>{
            const UpdatedItems  = cartData.filter(item=>(item.id != ItemId ))
            setCartData(UpdatedItems)
            localStorage.setItem('cart',JSON.stringify(UpdatedItems))
        }
       const getQty = () => {
            return cartData.reduce((total, item) => total + parseInt(item.qty || 0), 0);
        };
        useEffect(()=>{
            fetch(`${apiUrl}/get-shipping-front`,{
                        'method':'GET',
                        'headers':{
                            'Content-Type':'application/json',
                            'Accept':'application/json',
                            'Authorization':`Bearer ${adminToken()}`
                        },
                           
                        }).then(res =>res.json())
                        .then(result => {
                        if(result.status == 200){
                            
                            setShippingCost(result.data.amount);
                        }
                        else
                            console.log("something went wrong!");
               }) 
        })
    return (
        <CartContext.Provider value={{addToCart,cartData,shipping,SubTotal,GrandTotal,updateItem,deleteItem,getQty,clearCart}}>
            {children}
        </CartContext.Provider>
    )
}