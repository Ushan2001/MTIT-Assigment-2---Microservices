# Next.js Frontend Guide — Food Delivery Microservices

> This guide creates a **Next.js 14** frontend that talks to your API Gateway at `http://localhost:5000`.

---

## 1. Create the Next.js App

Run this command **outside** your microservices folder (e.g., in `d:\Y4S2\MTIT\`):

```bash
npx create-next-app@latest frontend --js --app --no-tailwind --eslint
cd frontend
npm install axios js-cookie
```

---

## 2. Folder Structure

```
frontend/
├── app/
│   ├── layout.js              ← Root layout
│   ├── page.js                ← Home / redirect
│   ├── login/page.js          ← Login
│   ├── register/page.js       ← Register
│   ├── restaurants/
│   │   ├── page.js            ← All restaurants
│   │   └── [id]/page.js       ← Restaurant detail & menu
│   ├── orders/
│   │   ├── page.js            ← All orders
│   │   └── [id]/page.js       ← Order detail
│   ├── cart/page.js           ← Cart
│   └── deliveries/page.js     ← Deliveries
├── lib/
│   ├── api.js                 ← Axios instance
│   └── auth.js                ← Auth context
├── .env.local
```

---

## 3. Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_GATEWAY_URL=http://localhost:5000
```

---

## 4. API Helper — `lib/api.js`

```js
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL,
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## 5. Auth Context — `lib/auth.js`

```js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const userId = Cookies.get('userId');
    if (token && userId) setUser({ token, userId });
  }, []);

  const login = (token, userId) => {
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('userId', userId, { expires: 7 });
    setUser({ token, userId });
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## 6. Root Layout — `app/layout.js`

```js
import { AuthProvider } from '@/lib/auth';

export const metadata = { title: 'Food Delivery App' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <nav style={{ padding: '1rem', background: '#333', color: 'white', display: 'flex', gap: '1rem' }}>
            <a href="/" style={{ color: 'white' }}>Home</a>
            <a href="/restaurants" style={{ color: 'white' }}>Restaurants</a>
            <a href="/orders" style={{ color: 'white' }}>Orders</a>
            <a href="/cart" style={{ color: 'white' }}>Cart</a>
            <a href="/deliveries" style={{ color: 'white' }}>Deliveries</a>
            <a href="/login" style={{ color: 'white' }}>Login</a>
            <a href="/register" style={{ color: 'white' }}>Register</a>
          </nav>
          <main style={{ padding: '2rem' }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 7. Register Page — `app/register/page.js`

**API:** `POST http://localhost:5000/customers/register`

```js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers/register', form);
      alert('Registered successfully! Please login.');
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.err || 'Registration failed');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, gap: 12 }}>
        <input placeholder="Name"     value={form.name}     onChange={e => setForm({...form, name: e.target.value})}     required />
        <input placeholder="Email"    value={form.email}    onChange={e => setForm({...form, email: e.target.value})}    required type="email" />
        <input placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required type="password" />
        <input placeholder="Phone"    value={form.phone}    onChange={e => setForm({...form, phone: e.target.value})} />
        <input placeholder="Address"  value={form.address}  onChange={e => setForm({...form, address: e.target.value})} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
```

---

## 8. Login Page — `app/login/page.js`

**API:** `POST http://localhost:5000/customers/login`

```js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/customers/login', form);
      // Response contains: { token, userId }  (or similar)
      login(res.data.token, res.data.userId || res.data._id);
      router.push('/restaurants');
    } catch (err) {
      setError(err.response?.data?.err || 'Login failed');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, gap: 12 }}>
        <input placeholder="Email"    value={form.email}    onChange={e => setForm({...form, email: e.target.value})}    required type="email" />
        <input placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required type="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
```

---

## 9. Restaurants List Page — `app/restaurants/page.js`

**APIs:**
- `GET /restaurants` — list all
- `POST /restaurants` — create one

```js
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', cuisine: '', rating: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const res = await api.get('/restaurants');
    setRestaurants(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/restaurants', { ...form, rating: Number(form.rating) });
    setForm({ name: '', address: '', cuisine: '', rating: '' });
    fetchAll();
  };

  return (
    <div>
      <h1>Restaurants</h1>

      {/* Create Restaurant Form */}
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input placeholder="Name"     value={form.name}    onChange={e => setForm({...form, name: e.target.value})}    required />
        <input placeholder="Address"  value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
        <input placeholder="Cuisine"  value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})} required />
        <input placeholder="Rating"   value={form.rating}  onChange={e => setForm({...form, rating: e.target.value})}  type="number" step="0.1" />
        <button type="submit">Add Restaurant</button>
      </form>

      {/* Restaurant List */}
      <ul>
        {restaurants.map(r => (
          <li key={r._id} style={{ marginBottom: 12 }}>
            <Link href={`/restaurants/${r._id}`}>
              <strong>{r.name}</strong>
            </Link> — {r.cuisine} | ⭐ {r.rating}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 10. Restaurant Detail & Menu — `app/restaurants/[id]/page.js`

**APIs:**
- `GET /restaurants/:id` — get restaurant
- `GET /restaurants/:id/menu` — get menu
- `POST /restaurants/:id/menu` — add menu item

```js
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [item, setItem] = useState({ itemName: '', price: '', description: '', available: true });

  useEffect(() => {
    api.get(`/restaurants/${id}`).then(r => setRestaurant(r.data));
    api.get(`/restaurants/${id}/menu`).then(r => setMenu(r.data));
  }, [id]);

  const addMenuItem = async (e) => {
    e.preventDefault();
    await api.post(`/restaurants/${id}/menu`, { ...item, price: Number(item.price) });
    const res = await api.get(`/restaurants/${id}/menu`);
    setMenu(res.data);
    setItem({ itemName: '', price: '', description: '', available: true });
  };

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.address} | {restaurant.cuisine} | ⭐ {restaurant.rating}</p>

      <h2>Menu</h2>
      <ul>
        {menu.map((m, i) => (
          <li key={i}>{m.itemName} — ${m.price} {m.available ? '✅' : '❌'}</li>
        ))}
      </ul>

      <h3>Add Menu Item</h3>
      <form onSubmit={addMenuItem} style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Item Name"   value={item.itemName}    onChange={e => setItem({...item, itemName: e.target.value})}    required />
        <input placeholder="Price"       value={item.price}       onChange={e => setItem({...item, price: e.target.value})}       required type="number" step="0.01" />
        <input placeholder="Description" value={item.description} onChange={e => setItem({...item, description: e.target.value})} />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}
```

---

## 11. Orders Page — `app/orders/page.js`

**APIs:**
- `GET /orders` — list all orders (filter by `?customerId=` or `?restaurantId=`)
- `POST /orders` — place a new order

```js
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ restaurantId: '', items: [{ menuItemId: '', qty: 1, price: 0 }] });

  useEffect(() => {
    const query = user ? `?customerId=${user.userId}` : '';
    api.get(`/orders${query}`).then(r => setOrders(r.data));
  }, [user]);

  const placeOrder = async (e) => {
    e.preventDefault();
    await api.post('/orders', { customerId: user.userId, ...form });
    const res = await api.get(`/orders?customerId=${user.userId}`);
    setOrders(res.data);
  };

  return (
    <div>
      <h1>My Orders</h1>

      <h3>Place New Order</h3>
      <form onSubmit={placeOrder} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input placeholder="Restaurant ID"  value={form.restaurantId} onChange={e => setForm({...form, restaurantId: e.target.value})} required />
        <input placeholder="Menu Item ID"   value={form.items[0].menuItemId} onChange={e => setForm({...form, items: [{...form.items[0], menuItemId: e.target.value}]})} required />
        <input placeholder="Qty"            value={form.items[0].qty}        onChange={e => setForm({...form, items: [{...form.items[0], qty: Number(e.target.value)}]})} type="number" min="1" />
        <input placeholder="Price"          value={form.items[0].price}      onChange={e => setForm({...form, items: [{...form.items[0], price: Number(e.target.value)}]})} type="number" step="0.01" />
        <button type="submit">Place Order</button>
      </form>

      <ul>
        {orders.map(o => (
          <li key={o._id} style={{ marginBottom: 8 }}>
            Order <strong>{o._id}</strong> — Status: <em>{o.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 12. Cart Page — `app/cart/page.js`

**APIs:**
- `GET /orders/cart/:customerId` — get cart
- `POST /orders/cart` — add item to cart

> Note: The cart is handled by **order-service**. Gateway prefix is `/orders`.

```js
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [item, setItem] = useState({ menuItemId: '', qty: 1, price: 0 });

  useEffect(() => {
    if (user) api.get(`/orders/api/cart/${user.userId}`).then(r => setCart(r.data || []));
  }, [user]);

  const addToCart = async (e) => {
    e.preventDefault();
    await api.post('/orders/api/cart', { customerId: user.userId, ...item });
    const res = await api.get(`/orders/api/cart/${user.userId}`);
    setCart(res.data || []);
  };

  return (
    <div>
      <h1>My Cart</h1>

      <form onSubmit={addToCart} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Menu Item ID" value={item.menuItemId} onChange={e => setItem({...item, menuItemId: e.target.value})} required />
        <input placeholder="Qty"          value={item.qty}        onChange={e => setItem({...item, qty: Number(e.target.value)})} type="number" min="1" />
        <input placeholder="Price"        value={item.price}      onChange={e => setItem({...item, price: Number(e.target.value)})} type="number" step="0.01" />
        <button type="submit">Add to Cart</button>
      </form>

      <ul>
        {cart.map((c, i) => (
          <li key={i}>{c.menuItemId} × {c.qty} — ${c.price}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 13. Deliveries Page — `app/deliveries/page.js`

**APIs:**
- `GET /deliveries` — all deliveries
- `POST /deliveries` — create a delivery assignment
- `PUT /deliveries/:id/status` — update delivery status

```js
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const STATUSES = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [form, setForm] = useState({ orderId: '', driverId: '', pickupLocation: '', dropLocation: '', estimatedTime: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const res = await api.get('/deliveries');
    setDeliveries(res.data);
  };

  const createDelivery = async (e) => {
    e.preventDefault();
    await api.post('/deliveries', form);
    fetchAll();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/deliveries/${id}/status`, { status });
    fetchAll();
  };

  return (
    <div>
      <h1>Deliveries</h1>

      <h3>Create Delivery</h3>
      <form onSubmit={createDelivery} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <input placeholder="Order ID"       value={form.orderId}       onChange={e => setForm({...form, orderId: e.target.value})}       required />
        <input placeholder="Driver ID"      value={form.driverId}      onChange={e => setForm({...form, driverId: e.target.value})} />
        <input placeholder="Pickup Location"value={form.pickupLocation} onChange={e => setForm({...form, pickupLocation: e.target.value})} required />
        <input placeholder="Drop Location"  value={form.dropLocation}   onChange={e => setForm({...form, dropLocation: e.target.value})}   required />
        <input placeholder="Est. Time"      value={form.estimatedTime}  onChange={e => setForm({...form, estimatedTime: e.target.value})} />
        <button type="submit">Assign</button>
      </form>

      <ul>
        {deliveries.map(d => (
          <li key={d._id} style={{ marginBottom: 12 }}>
            <strong>Order:</strong> {d.orderId} | <strong>Status:</strong> {d.status}
            <select onChange={e => updateStatus(d._id, e.target.value)} defaultValue={d.status} style={{ marginLeft: 8 }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 14. Run the Frontend

Make sure your **backend is already running**, then:

```bash
cd frontend
npm run dev
```

Visit: **http://localhost:3000**

---

## API Port Reference

| Page | Gateway URL | Service Port |
|------|------------|--------------|
| Register/Login | `localhost:5000/customers/*` | 3003 |
| Restaurants | `localhost:5000/restaurants/*` | 3001 |
| Orders | `localhost:5000/orders/*` | 3002 |
| Cart | `localhost:5000/orders/api/cart/*` | 3002 |
| Deliveries | `localhost:5000/deliveries/*` | 3004 |

## Testing Flow

```
1. Register   → POST /customers/register
2. Login      → POST /customers/login  (save token)
3. Browse     → GET  /restaurants
4. Add Menu   → POST /restaurants/:id/menu
5. Place Order→ POST /orders
6. Assign Del.→ POST /deliveries
7. Track      → GET  /deliveries
```
