import { supabase } from '../shared/supabase.js';
const $=id=>document.getElementById(id); let all=[];
const money=n=>'Rs. '+Number(n||0).toLocaleString('en-PK');
async function start(){
 if(!supabase){$('loginView').innerHTML+='<p class="danger">Connect Supabase first in shared/supabase.js.</p>';return}
 const {data:{session}}=await supabase.auth.getSession();show(session);
 supabase.auth.onAuthStateChange((_e,s)=>show(s));
}
function show(session){$('loginView').classList.toggle('hidden',!!session);$('dashboard').classList.toggle('hidden',!session);if(session)load()}
$('loginForm').onsubmit=async e=>{e.preventDefault();$('loginError').textContent='';const {error}=await supabase.auth.signInWithPassword({email:$('email').value,password:$('password').value});if(error)$('loginError').textContent=error.message};
$('logout').onclick=()=>supabase.auth.signOut();
async function load(){const {data,error}=await supabase.from('orders').select('*, order_items(*)').order('created_at',{ascending:false});if(error){$('orders').innerHTML='<p class="danger">'+error.message+'</p>';return}all=data||[];render()}
function render(){const f=$('statusFilter').value;const list=f==='All'?all:all.filter(x=>x.status===f);$('totalOrders').textContent=all.length;$('pending').textContent=all.filter(x=>x.status==='Pending').length;$('confirmed').textContent=all.filter(x=>x.status==='Confirmed').length;$('delivered').textContent=all.filter(x=>x.status==='Delivered').length;$('orders').innerHTML=list.length?list.map(o=>`<div class="order"><div class="order-head"><div><b>${o.order_number}</b><div class="muted">${o.created_at?new Date(o.created_at).toLocaleString():''}</div></div><span class="badge">${o.status}</span></div><div class="items">${(o.order_items||[]).map(i=>`${i.product_name} · Size ${i.size||'S'} × ${i.quantity} — ${money(i.unit_price*i.quantity)}`).join('<br>')}</div><p><b>${o.customer_name}</b> · ${o.phone} · ${o.city}<br><span class="muted">${o.address}</span></p><p><b>${money(o.total)}</b> · ${o.payment_method}</p><select onchange="updateStatus('${o.id}',this.value)"><option ${o.status==='Pending'?'selected':''}>Pending</option><option ${o.status==='Confirmed'?'selected':''}>Confirmed</option><option ${o.status==='Shipped'?'selected':''}>Shipped</option><option ${o.status==='Delivered'?'selected':''}>Delivered</option><option ${o.status==='Cancelled'?'selected':''}>Cancelled</option></select></div>`).join(''):'<p class="muted">No orders found.</p>'}
window.updateStatus=async(id,status)=>{const {error}=await supabase.from('orders').update({status}).eq('id',id);if(error)alert(error.message);else load()};$('statusFilter').onchange=render;$('refresh').onclick=load;start();
