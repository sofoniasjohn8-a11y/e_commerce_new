import { createContext, useState } from "react";

export const CartContext = createContext();
export const CartProvider  = ({children}) =>{
    const [cartData,setCartData] = useState(JSON.parse(localStorage.getItem('cart')) || [])

    const addToCart = (product,size=null)=>{
        let UpdatedCart = [...cartData];

        if(cartData.length == 0){
            UpdatedCart.push({
                id:`${product.id}-${Math.floor(Math.random(10000000))}`,
                product_id:product.id,
                size:size,
                title:product.title,
                price:product.price,
                qty:1,
                image_url:product.image_url
            })
        }
        if(size != null){
            const isProductExists = UpdatedCart.find(item => (item.product_id == product.id && item.size == size))
            if(isProductExists){
                UpdatedCart = UpdatedCart.map(item => (item.product_id == product.id && item.size == size)?
            {...item,qty:item.qty + 1}:
             item)
            }
            else{
                UpdatedCart.push({
                id:`${product.id}-${Math.floor(Math.random(10000000))}`,
                product_id:product.id,
                size:size,
                title:product.title,
                price:product.price,
                qty:1,
                image_url:product.image_url
            })
            }
        }
        else{
             const isProductExists = UpdatedCart.find(item => (item.product_id == product.id))
            if(isProductExists){
                UpdatedCart = UpdatedCart.map(item => (item.product_id == product.id )?
            {...item,qty:item.qty + 1}:
             item)
            }
            else{
                UpdatedCart.push({
                id:`${product.id}-${Math.floor(Math.random(10000000))}`,
                product_id:product.id,
                size:size,
                title:product.title,
                price:product.price,
                qty:1,
                image_url:product.image_url
            })
            }
        }
      
       

        setCartData(UpdatedCart)
        localStorage.setItem('cart',JSON.stringify(UpdatedCart))
    }
      const shipping = () =>{
            return 5;
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
    return (
        <CartContext.Provider value={{addToCart,cartData,shipping,SubTotal,GrandTotal}}>
            {children}
        </CartContext.Provider>
    )
}