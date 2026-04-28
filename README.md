# 💸 AranyFolyam Backend

## 🗒️ Tartalomjegyzék

* [Bevezetés](#bevezetés)
* [Projekt szerkezet](#projekt-szerkezet)
* [Adatbázis](#adatbázis)
* [Környezeti változók](#környezeti-változók)
* [Telepítés](#telepítés)
* [Használat](#használat)
* [API végpontok](#api-végpontok)
* [Használt függőségek](#használt-függőségek)
* [Technológiai stack](#technológiai-stack)
* [Fejlesztési lehetőségek](#fejlesztési-lehetőségek)

---

## 🏪 Bevezetés

Az **AranyFolyam Backend** egy zálogház működését támogató REST API, amely lehetővé teszi felhasználók, zálogtárgyak és ügyletek kezelését.

A rendszer fő funkciói:

* Felhasználók regisztrációja és bejelentkezése
* Zálogtárgyak (termékek) kezelése
* Kategóriák kezelése
* Zálog ügyletek (rendelések) létrehozása és nyomon követése
* Admin jogosultságok kezelése

A backend Node.js és Express alapokon működik, és könnyen integrálható frontend alkalmazásokkal.

GitHub repository:
https://github.com/Isumii1/aranyfolyambackend

---

## 📁 Projekt szerkezet

```
├── config/
│   └── dotenvConfig.js
├── controllers/
│   ├── adminControllers.js
│   ├── categoryControllers.js
│   ├── orderControllers.js
│   ├── productsControllers.js
│   └── userControllers.js
├── db/
│   └── db.js
├── middleware/
│   ├── roleMiddleware.js
│   ├── uploadProductImage.js
│   └── userMiddleware.js
├── models/
│   ├── adminModel.js
│   ├── categoryModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   └── userModel.js
├── routes/
│   ├── adminRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── .env.js
├── .gitignore.js
├── app.js
├── package-lock.json
├── package.json
├── server.js
└── README.md
```

---

## 🗃️ Adatbázis

A projekt MySQL adatbázist használ.

### 📊 Diagram

https://drawsql.app/teams/bravo-16/diagrams/aranyfolyam

https://snipboard.io/mpjPiM.jpg

### 🧩 Táblák

#### 👤 users

* user_id
* user_username
* user_email
* user_psw
* user_role

#### 📦 products (zálogtárgyak)

* product_id
* category_id
* product_name
* product_price
* product_image
* product_stock

#### 🗂️ category

* category_id
* category_name

#### 🛒 orders (zálog ügyletek)

* order_id
* user_id
* order_status
* order_date

#### 📄 order_items

* order_item_id
* order_id
* product_id
* order_count

#### ⭐ invisible (kapcsolótábla)

* user_id
* product_id

### 🔗 Kapcsolatok

* Egy user több order-t hozhat létre
* Egy order több product-ot tartalmaz (order_items)
* Egy product egy category-hez tartozik
* Az invisible tábla user és product között kapcsolatot kezel

---

## ⚙️ Környezeti változók

A projekt `.env` fájlt használ.

Példa:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=aranyfolyam
JWT_SECRET=supersecretkey
```

---

## ⬇️ Telepítés

1. Klónozd a projektet:

```bash
git clone https://github.com/Isumii1/aranyfolyambackend.git
```

2. Lépj be a mappába:

```bash
cd aranyfolyambackend
```

3. Függőségek telepítése:

```bash
npm install
```

4. `.env` fájl létrehozása

---

## 🛍️ Használat

Fejlesztői mód:

```bash
npm run dev
```

Normál futtatás:

```bash
npm start
```

Alapértelmezett cím:

```
http://localhost:3000
```

---

## 🔌 API végpontok

### 👤 Felhasználók

| Metódus | Endpoint            | Leírás        |
| ------- | ------------------- | ------------- |
| POST    | /api/users/register | Regisztráció  |
| POST    | /api/users/login    | Bejelentkezés |
| GET     | /api/users/profile  | Profil        |

---

### 📦 Termékek (zálogtárgyak)

| Metódus | Endpoint          | Leírás            |
| ------- | ----------------- | ----------------- |
| GET     | /api/products     | Összes termék     |
| GET     | /api/products/:id | Egy termék        |
| POST    | /api/products     | Új termék (admin) |
| PUT     | /api/products/:id | Módosítás         |
| DELETE  | /api/products/:id | Törlés            |

---

### 🛒 Rendelések

| Metódus | Endpoint        | Leírás         |
| ------- | --------------- | -------------- |
| POST    | /api/orders     | Új rendelés    |
| GET     | /api/orders     | Saját rendelés |
| GET     | /api/orders/:id | Egy rendelés   |

---

### 🗂️ Kategóriák

| Metódus | Endpoint        | Leírás           |
| ------- | --------------- | ---------------- |
| GET     | /api/categories | Összes kategória |
| POST    | /api/categories | Új kategória     |

---

## 📋 Használt függőségek

| Csomag        | Leírás              |
| ------------- | ------------------- |
| express       | Web szerver         |
| mysql2        | Adatbázis kapcsolat |
| jsonwebtoken  | Hitelesítés         |
| bcryptjs      | Jelszó titkosítás   |
| multer        | Képfeltöltés        |
| dotenv        | Környezeti változók |
| cors          | CORS kezelés        |
| cookie-parser | Cookie kezelés      |
| validator     | Validáció           |
| nodemon       | Fejlesztői eszköz   |

---

## 🎮 Tesztelés 

https://documenter.getpostman.com/view/48099737/2sBXqJJfow#6f7fe955-68aa-4e9d-8b98-6595b6f63b3a

---

## 📌 Technológiai stack

* Node.js
* Express.js
* MySQL
* REST API
* JWT Authentication

---

## 🚀 Fejlesztési lehetőségek

* Order státuszok bővítése (pl. aktív, lejárt, kiváltott)
* Fizetési rendszer integráció
* Email értesítések
* Swagger API dokumentáció
* Docker támogatás
* Keresés és szűrés fejlesztése
