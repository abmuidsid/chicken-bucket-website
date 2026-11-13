(()=>{
const KEY='cb_cart';
const $=(s,r=document)=>r.querySelector(s);
const fmt=n=>'PKR '+Number(n).toLocaleString('en-US');
const load=()=>{try{const c=JSON.parse(localStorage.getItem(KEY));return Array.isArray(c)?c:[]}catch(e){return[]}};
const save=c=>{try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}badge()};
const badge=()=>{const n=load().reduce((a,i)=>a+i.qty,0);document.querySelectorAll('[data-cart-count]').forEach(e=>{e.textContent=n;e.hidden=!n})};

/* mobile nav */
const b=$('.burger'),l=$('.links');
if(b&&l){b.addEventListener('click',()=>{const o=l.classList.toggle('open');b.setAttribute('aria-expanded',o)});
l.addEventListener('click',e=>{if(e.target.tagName==='A'){l.classList.remove('open');b.setAttribute('aria-expanded',false)}});}

/* menu: size selector updates the price, Add to Cart goes to cart page */
document.querySelectorAll('[data-size-select]').forEach(sel=>{
  const btn=sel.closest('.row').querySelector('.add');
  const sync=()=>{btn.dataset.price=sel.value;btn.dataset.size=sel.selectedOptions[0].dataset.size};
  sel.addEventListener('change',sync);sync();
});
document.addEventListener('click',e=>{
  const a=e.target.closest('button.add');if(!a)return;
  const size=a.dataset.size||'';
  const id=a.dataset.id+(size?'|'+size:'');
  const cart=load();const f=cart.find(i=>i.id===id);
  if(f)f.qty++;else cart.push({id,name:a.dataset.name,size,price:+a.dataset.price,qty:1});
  save(cart);
  location.href='cart.html';
});

/* cart page */
const list=$('#cart-list');
if(list){
  const full=$('#cart-full'),empty=$('#cart-empty');
  const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n};
  const render=()=>{
    const cart=load();
    empty.hidden=cart.length>0;full.hidden=!cart.length;
    list.replaceChildren();
    let total=0;
    cart.forEach(i=>{
      total+=i.price*i.qty;
      const li=el('li','crow');
      const info=el('div','cinfo2');
      info.append(el('b',null,i.name));
      if(i.size)info.append(el('small',null,i.size));
      info.append(el('span','unit',fmt(i.price)));
      const q=el('div','qty');
      const mk=(t,lab,d)=>{const x=el('button',null,t);x.type='button';x.setAttribute('aria-label',lab+' '+i.name);x.dataset.act=d;x.dataset.id=i.id;return x};
      q.append(mk('−','Decrease','dec'),el('span',null,i.qty),mk('+','Increase','inc'));
      const sub=el('b','lt',fmt(i.price*i.qty));
      const rm=mk('✕','Remove','rm');rm.className='rm';
      li.append(info,q,sub,rm);list.append(li);
    });
    $('#subtotal').textContent=fmt(total);$('#total').textContent=fmt(total);
    $('#min-warn').hidden=total>=500||!cart.length;
    badge();
  };
  list.addEventListener('click',e=>{
    const t=e.target.closest('button[data-act]');if(!t)return;
    let cart=load();const i=cart.find(x=>x.id===t.dataset.id);if(!i)return;
    if(t.dataset.act==='inc')i.qty++;
    if(t.dataset.act==='dec')i.qty--;
    if(t.dataset.act==='rm')i.qty=0;
    cart=cart.filter(x=>x.qty>0);save(cart);render();
  });
  $('#clear-cart').addEventListener('click',()=>{save([]);render()});
  $('#checkout').addEventListener('submit',e=>{
    e.preventDefault();
    const cart=load();if(!cart.length)return;
    const name=$('#f-name').value.trim(),phone=$('#f-phone').value.trim(),addr=$('#f-addr').value.trim(),notes=$('#f-notes').value.trim();
    const err=$('#form-err');
    const total=cart.reduce((a,i)=>a+i.price*i.qty,0);
    let m='';
    if(!name||!phone||!addr)m='Please fill in your name, phone number and address.';
    else if(!/^[0-9+\-\s()]{10,15}$/.test(phone))m='Please enter a valid phone number.';
    else if(total<500)m='Minimum order for delivery is PKR 500.';
    err.hidden=!m;err.textContent=m;if(m)return;
    const lines=cart.map(i=>`• ${i.qty} x ${i.name}${i.size?' ('+i.size+')':''} - ${fmt(i.price*i.qty)}`);
    const msg=`New order from Chicken Buckets website\n\n${lines.join('\n')}\n\nTotal: ${fmt(total)}\n\nName: ${name}\nPhone: ${phone}\nAddress: ${addr}${notes?'\nNotes: '+notes:''}`;
    location.href='https://wa.me/923134141187?text='+encodeURIComponent(msg);
  });
  render();
}
badge();
})();
