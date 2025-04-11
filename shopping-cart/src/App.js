import './App.css';
import React,{useState,useEffect} from 'react'

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;


function App() {
const [cart,setCart] = useState([]);
const [subtotal,setSubtotal] = useState(0);

useEffect(()=>{
  const newSubtotal = cart.reduce((acc,item)=>acc + item.price * item.quantity,0);
  setSubtotal(newSubtotal)

  const hasGift = cart.some(item=>item.id === FREE_GIFT.id)

  if(newSubtotal >= THRESHOLD && !hasGift){
    setCart(prev => [...prev,{...FREE_GIFT,quantity:1}]);
  }else if(newSubtotal < THRESHOLD && hasGift){
    setCart(prev=>prev.filter(item=>item.id !== FREE_GIFT.id))
  }

  console.log('neww',newSubtotal)
},[cart])


const addToCart = (product) =>{
  console.log('cart hit')

  setCart(prev=>{
    const exists = prev.find(item=>item.id === product.id);

    if(exists){
      return prev.map(item=>item.id === product.id ? {...item,quantity:item.quantity+1}: item)
    }else{
      return[...prev,{...product,quantity:1}]
    }
  })
}

const increment = (id) =>{
  setCart(prev=>prev.map(item=>item.id === id ? {...item,quantity:item.quantity+1}: item))
}

const decrement = (id) =>{
  setCart(prev=>{
    const item = prev.find(i=>i.id===id);
    if(item.quantity===1){
      if(item.id===FREE_GIFT.id) return prev;
      return prev.filter(i=>i.id !==id)
    }
    return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);

  })
}

const remaining = Math.max(0, THRESHOLD - subtotal);
  return (
    <div className="container">
      <h2>Shopping Cart</h2>
      <h3>Products</h3>
      <div className="products">
        {PRODUCTS.map(p=>(
          <div key={p.id} className="product">
            <p>{p.name}<br/>₹{p.price}</p>
            <button onClick={()=>addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h3>Cart Summary</h3>
        <div className="cart-summary">
          <div className="subtotal-row">
            <span>Subtotal:</span>
            <span className="subtotal-amount">₹{subtotal}</span>
          </div>
          <hr></hr>
          {subtotal >= THRESHOLD ? (
            <p className="gift-msg">You got a FREE Wireless Mouse!</p>
          ):(
            <div className="progress-wrapper">
          <p>Add ₹{remaining} more to get a FREE Wireless Mouse!</p>
          <div className="progress-bar">
            <div className="progress" style={{width:`${(subtotal / THRESHOLD) * 100}%`}}></div>
          </div>
            </div>

          )}
        </div>
        <div className="cart-items">
          {cart.length===0 ? (
            <p className="empty">Your cart is empty<br/> <small>Add some products to see them here!</small></p>
          ):(
            <>
            <div>
              <h3 className="cart-items-header">Cart items</h3>
            </div>
            {cart.map(item=>(
              <div key={item.id} className="cart-item">
                <p>{item.name}<br/>₹{item.price}x{item.quantity}=₹{item.price*item.quantity}</p>
                {item.id!==FREE_GIFT.id &&(
                  <div className="qty-buttons">
                    <button className="qty-btn decrement" onClick={()=> decrement(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn increment" onClick={()=> increment(item.id)}>+</button>
                    </div>
                )}
              {item.id=== FREE_GIFT.id && <span className="gift-label">FREE GIFT</span>}
              </div>
            ))}
            </>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;
