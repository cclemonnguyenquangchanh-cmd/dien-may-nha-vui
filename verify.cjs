// Kiểm tra logic độc lập với trình duyệt. Chạy bằng: node tests/verify.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const storage = new Map();
const context = vm.createContext({
  console, URL, URLSearchParams, Date, Math, Blob,
  location: {search:'',hash:'',href:'http://localhost/'},
  localStorage: {getItem:key=>storage.get(key) ?? null, setItem:(key,value)=>storage.set(key,value), removeItem:key=>storage.delete(key)},
  document: {currentScript:{src:'http://localhost/js/app.js'}, body:{dataset:{page:'home'}}, addEventListener:()=>{}},
  window: {addEventListener:()=>{}},
  setInterval:()=>{}, setTimeout:()=>{}, clearTimeout:()=>{},
  FormData: class { constructor(form) {this.data=form.data;} get(key) {return this.data[key] ?? '';} }
});
const index = fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts = [...index.matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]);
assert.equal(scripts.length,15);
for (const script of scripts) vm.runInContext(fs.readFileSync(path.join(root,script),'utf8'),context,{filename:script});
const run = code=>vm.runInContext(code,context);
run(`let modalCalled=false; modal=()=>{modalCalled=true;}; actionHandlers.get('reset-data')({dataset:{action:'reset-data'}});`);
assert.equal(run('modalCalled'),true,'Reset opens its confirmation dialog');
run(`render=()=>{}; toast=()=>{}; let lastNavigation=''; go=hash=>{lastNavigation=hash;};`);
// Mỗi màn hình cũ phải có một file đích thật, kể cả 11 mục quản trị.
const examples = {
  home:'', categories:'', category:'/dien-thoai', brands:'', brand:'/Apple',
  'flash-sale':'', search:'?q=iphone', product:'/iphone-17', cart:'',checkout:'',
  success:'/test-order',login:'',register:'',forgot:'',account:'',profile:'',addresses:'',
  orders:'',order:'/DNV-261020-1024',track:'?code=DNV-261020-1024',favorites:'',compare:'',
  vouchers:'',notifications:'',support:'/shipping',promotions:'',contact:'',stores:'',about:'',reviews:'/iphone-17',admin:''
};
for(const [page,suffix] of Object.entries(examples)) {
  const destination = new URL(run(`pageUrl(${JSON.stringify('#/'+page+suffix)})`));
  assert(fs.existsSync(path.join(root,destination.pathname)),destination.pathname);
}
const views = ['categoriesPage()','category("dien-thoai")','brandsPage()','brandPage("Apple")','flashSalePage()',
  'search("iphone")','authPage()','forgotPage()','accountHome()','profilePage()','addressesPage()',
  'ordersPage()','orderDetailPage("DNV-261020-1024")','trackPage("DNV-261020-1024")',
  'favorites()','comparePage()','vouchersPage()','notificationPage()','supportPage("shipping")',
  'promotions()','contactPage()','storesPage()','aboutPage()','reviewsPage("iphone-17")','missing()'];
for(const section of run('adminLinks.map(item=>item[0])')) views.push(`adminPageV2(${JSON.stringify(section)})`);
for(const expression of views) assert.equal(typeof run(expression),'string',expression);
// Giới hạn tồn kho, cập nhật số lượng và trạng thái giỏ.
run(`inventory['iphone-17']=2; add('iphone-17'); add('iphone-17'); add('iphone-17');`);
assert.equal(run(`cart['iphone-17']`),2);
run(`actionHandlers.get('qty')({dataset:{id:'iphone-17',step:'1'}});`);
assert.equal(run(`cart['iphone-17']`),2);
run(`actionHandlers.get('qty')({dataset:{id:'iphone-17',step:'-1'}});`);
assert.equal(run(`cart['iphone-17']`),1);
run(`coupon='NHAVUI10';`);
assert.equal(run('couponDiscount()'),1000000);
assert.equal(run('payableTotal()'),29990000);
// Đặt đơn phải lưu thông tin, giữ trạng thái chờ xác nhận và xóa giỏ.
run(`formHandlers.get('checkout-form')({data:{name:'Khách kiểm thử',phone:'0900000000',email:'',address:'Địa chỉ mẫu',note:'Ghi chú mẫu',ship:'delivery',payment:'cod'}});`);
assert.equal(run('orders.length'),1);
assert.equal(run('orders[0].status'),'pending');
assert.equal(run('orders[0].total'),29990000);
assert.equal(run('orders[0].note'),'Ghi chú mẫu');
assert.equal(run('nCart()'),0);
assert.equal(run('coupon'),'');
assert(run('lastNavigation.startsWith("#/success/")'));
assert(run('success(orders[0].id).includes(orders[0].id)'));
// Mở lại trang phải đọc được đơn và voucher đã lưu.
assert.equal(JSON.parse(storage.get('dnv_orders'))[0].status,'pending');
assert.equal(storage.get('dnv_savedCoupon'),'""');
run(`cart={'iphone-17':1}; inventory['iphone-17']=0;`);
const before=run('orders.length');
run(`formHandlers.get('checkout-form')({data:{}});`);
assert.equal(run('orders.length'),before);
console.log(`PASS: 31 đích trang, ${views.length} hàm dựng màn hình, giới hạn kho, tổng tiền, voucher và đặt đơn.`);
