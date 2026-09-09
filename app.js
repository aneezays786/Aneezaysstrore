import { supabase } from './shared/supabase.js';

const products=[
{id:1,name:'Noor Lawn Set',category:'Casual',price:4290,desc:'A soft everyday two-piece with an effortless silhouette.'},
{id:2,name:'Mehfil Embroidered',category:'Fancy',price:8990,desc:'Delicate detailing designed for evenings and celebrations.'},
{id:3,name:'Rang-e-Bahar',category:'Traditional',price:7490,desc:'A graceful Pakistani-inspired ensemble with timeless charm.'},
{id:4,name:'Rosé Co-ord',category:'Casual',price:5190,desc:'Minimal, polished and easy to style throughout the day.'},
{id:5,name:'Zarqa Festive',category:'Fancy',price:10990,desc:'Statement festive wear with elegant traditional details.'},
{id:6,name:'Ivory Kurta',category:'Traditional',price:3990,desc:'A classic ivory kurta made for simple, beautiful days.'},
{id:7,name:'Sahar Set',category:'Casual',price:4590,desc:'Relaxed tailoring with a refined feminine finish.'},
{id:8,name:'Gulabo Luxe',category:'Fancy',price:9490,desc:'A romantic festive look for your special moments.'},
{id:9,name:'Signature Formal',category:'Fancy',price:150000,desc:'Your featured Aneezay’s statement piece.',image:'./assets/product-150k.jpg'}
];
let cart=load('aneezaysCart',[]), filter='All', selectedSize='S';
const $=id=>document.getElementById(id);
const money=n=>'Rs. '+Number(n||0).toLocaleString('en-PK');
function load(k,f){try{const x=JSON.parse(localStorage.getItem(k)||'null');return x??f}catch{return f}}
function save(){localStorage.setItem('aneezaysCart',JSON.stringify(cart));}
function total(){return cart.reduce((s,x)=>s+(Number(x.price)||0)*(Number(x.qty)||0),0)}
function renderProducts(){
 const list=filter==='All'?products:products.filter(p=>p.category===filter);
 $('products').innerHTML=list.map(p=>`<article class="product" data-id="${p.id}">
  <div class="product-img" ${p.image?`style="background-image:url('${p.image}');background-size:cover;background-position:center"`:''}>
   <button class="heart" aria-label="Wishlist">♡</button>${p.id<4?'<span class="tag">NEW</span>':''}
  </div><div class="product-info"><h3>${p.name}</h3><p>${p.category}</p><span class="price">${money(p.price)}</span></div>
 </article>`).join('');
 document.querySelectorAll('.product').forEach(el=>el.addEventListener('click',e=>{if(e.target.closest('.heart')){e.stopPropagation();e.target.textContent=e.target.textContent==='♡'?'♥':'♡';return}openProduct(Number(el.dataset.id))}));
}
function renderCart(){
 $('cartCount').textContent=cart.reduce((s,x)=>s+Number(x.qty||0),0);
 $('cartItems').innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div class="mini-img" ${x.image?`style="background-image:url('${x.image}');background-size:cover;background-position:center"`:''}></div><div class="cart-main"><h4>${x.name}</h4><small>Size ${x.size||'S'} · ${money(x.price)}</small><div class="qty"><button data-q="-" data-id="${x.id}">−</button><span>${x.qty}</span><button data-q="+" data-id="${x.id}">+</button><button class="remove" data-remove="${x.id}">Remove</button></div></div><b>${money(x.price*x.qty)}</b></div>`).join(''):'<p class="empty-bag">Your bag is waiting for something beautiful. ♡</p>';
 $('cartTotal').textContent=money(total());save();
 document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.id),b.dataset.q));
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==Number(b.dataset.remove));renderCart()});
}
function changeQty(id,dir){const x=cart.find(i=>i.id===id);if(!x)return;x.qty += dir==='+'?1:-1;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);renderCart()}
window.openProduct=id=>{const p=products.find(x=>x.id===id);selectedSize='S';$('modalContent').innerHTML=`<div class="modal-grid"><div class="modal-img" ${p.image?`style="background-image:url('${p.image}');background-size:cover;background-position:center"`:''}></div><div class="modal-copy"><p class="eyebrow">${p.category}</p><h2>${p.name}</h2><h3 class="modal-price">${money(p.price)}</h3><p>${p.desc}</p><p class="size-label">Choose size</p><div class="size-list">${['S','M','L','XL'].map(s=>`<button class="size ${s==='S'?'selected':''}" data-size="${s}">${s}</button>`).join('')}</div><button class="primary-btn full" id="modalAdd">Add to bag</button></div></div>`;$('productModal').classList.add('show');$('overlay').classList.add('show');document.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{selectedSize=b.dataset.size;document.querySelectorAll('[data-size]').forEach(x=>x.classList.toggle('selected',x===b))});$('modalAdd').onclick=()=>{addCart(p.id,selectedSize);closeModal();}};
window.closeModal=()=>{$('productModal').classList.remove('show');$('overlay').classList.remove('show')};
const openCart=()=>{$('cartDrawer').classList.add('open');$('overlay').classList.add('show')};
const closeCart=()=>{$('cartDrawer').classList.remove('open');$('overlay').classList.remove('show')};
function addCart(id,size='S'){const p=products.find(x=>x.id===id);if(!p)return;const old=cart.find(x=>x.id===id&&x.size===size);if(old)old.qty++;else cart.push({...p,size,qty:1});renderCart();openCart()}
async function placeOrder(e){
 e.preventDefault();if(!cart.length)return alert('Your bag is empty.');
 const orderNumber='ANZ-'+Math.floor(100000+Math.random()*900000);
 const payload={order_number:orderNumber,customer_name:$('customerName').value.trim(),phone:$('customerPhone').value.trim(),city:$('customerCity').value.trim(),address:$('customerAddress').value.trim(),payment_method:$('paymentMethod').value,items:cart.map(x=>({product_id:x.id,quantity:x.qty,size:x.size}))};
 let saved=false;
 if(supabase){try{const {data,error}=await supabase.rpc('place_order',{p_order_number:payload.order_number,p_customer_name:payload.customer_name,p_phone:payload.phone,p_city:payload.city,p_address:payload.address,p_payment_method:payload.payment_method,p_items:payload.items});if(error)throw error;saved=!!data}catch(err){console.error(err)}}
 if(!saved){const local=load('aneezaysOrders',[]);local.unshift({...payload,total:total(),status:'Pending',created_at:new Date().toISOString()});localStorage.setItem('aneezaysOrders',JSON.stringify(local));}
 cart=[];renderCart();$('checkoutForm').reset();$('checkoutModal').classList.remove('show');closeCart();renderOrders();
 $('successText').textContent=saved?'Your order has been sent to Aneezay’s owner dashboard.':'Demo order saved on this device. Connect Supabase to send it to the owner dashboard.';$('successOrder').textContent=orderNumber;$('successModal').classList.add('show');
}
function renderOrders(){const o=load('aneezaysOrders',[]);$('myOrders').innerHTML=o.length?o.slice(0,5).map(x=>`<div class="order-card"><b>${x.order_number}</b><span>${x.status}</span><p>${money(x.total||0)} · ${x.payment_method}</p></div>`).join(''):'<p class="muted-small">Your placed orders will appear here.</p>'}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===filter));renderProducts();document.querySelector('#shop').scrollIntoView({behavior:'smooth'})}));
$('cartBtn').onclick=openCart;$('closeCart').onclick=closeCart;$('closeModal').onclick=closeModal;$('overlay').onclick=()=>{closeCart();closeModal()};$('checkoutBtn').onclick=()=>{if(!cart.length)return alert('Your bag is empty.');$('checkoutTotal').textContent=money(total());$('checkoutModal').classList.add('show')};$('closeCheckout').onclick=()=>$('checkoutModal').classList.remove('show');$('checkoutForm').addEventListener('submit',placeOrder);$('closeSuccess').onclick=()=>$('successModal').classList.remove('show');$('searchBtn').onclick=()=>{const q=prompt("Search Aneezay's collection");if(q){const f=products.filter(p=>(p.name+' '+p.category).toLowerCase().includes(q.toLowerCase()));alert(f.length?f.map(p=>p.name+' — '+money(p.price)).join('\n'):'No pieces found.')}};
renderProducts();renderCart();renderOrders();
