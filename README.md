# Our Universe 💕

เว็บแอปพลิเคชันสำหรับคู่รักที่ใช้บันทึกความทรงจำร่วมกัน แบบ multi-mode ที่ใช้ข้อมูลชุดเดียว (single source of truth)

## ✨ Features

### 🏠 Home (Hub)
- การ์ดสรุปปี: Days Together, Top Moment, Mood Average
- ปุ่มเมนู 6 โหมดแบบเกม
- สุ่มความทรงจำ (Random Memory)

### 📓 Journal
- บันทึกประจำวันแบบหน้ากระดาษ
- ค้นหาและกรองตาม tags
- เพิ่ม/แก้ไข/ลบ entries
- Mood tracker (1-10)

### 📅 Yearbook
- ปฏิทิน 12 เดือน
- สรุปแต่ละเดือน (entries, moments, photos)
- Year Recap (Lessons, Best Moments, Gratitude, Intentions)

### 🏛️ Museum
- นิทรรศการแบ่งเป็น 3 ห้อง:
  - Firsts (ครั้งแรก)
  - Trips (การเดินทาง)
  - Inside Jokes (มุกภายใน)
- แสดง moments เป็นการ์ด exhibit

### 🗺️ Map
- แผนที่วาดเองพร้อมปักหมุด
- หมุดแยกประเภท (cafe, restaurant, park, beach, home, travel)
- เชื่อมโยงกับ moments

### 💬 Chatlog
- รายการ episodes บทสนทนา
- เล่นข้อความแบบ typing animation
- ควบคุม play/pause/reset

### ⚔️ Quest Log
- รายการภารกิจคู่รัก
- Progress bar
- ระบบ status (todo/doing/done)
- Achievement badges

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with persistence)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone หรือ cd ไปยังโฟลเดอร์โปรเจค
cd girlfriend

# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

## 📁 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── journal/           # Journal pages
│   ├── yearbook/          # Yearbook pages
│   ├── museum/            # Museum pages
│   ├── map/               # Map page
│   ├── chat/              # Chat pages
│   └── quests/            # Quest page
├── components/            # Reusable components
│   ├── AppHeader.tsx
│   ├── YearSwitcher.tsx
│   ├── ThemeToggle.tsx
│   ├── PaperCard.tsx
│   ├── TagChips.tsx
│   ├── SearchBar.tsx
│   ├── RandomMemoryCard.tsx
│   └── GameMenuButtons.tsx
├── lib/                   # Utilities
│   ├── store.ts          # Zustand store
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
│   └── index.ts
└── data/
    └── universe.json     # Seed data
```

## 📊 Data Model

ข้อมูลทั้งหมดเก็บใน `universe.json` และ localStorage:

```json
{
  "meta": {
    "appName": "Our Universe",
    "relationshipStartDate": "2023-06-01",
    "people": { "me": "Nat", "you": "Love" }
  },
  "badges": [...],
  "years": {
    "2025": {
      "entries": [...],      // Journal entries
      "moments": [...],      // Museum exhibits
      "photos": [...],       // Photo gallery
      "notes": [...],        // Short notes
      "yearRecap": {...},    // Year summary
      "chatEpisodes": [...], // Chat conversations
      "quests": [...],       // Quests/wishlist
      "places": [...]        // Map locations
    }
  }
}
```

## ✏️ การเพิ่มข้อมูล

### 1. เพิ่ม Entry (Journal)
- ใช้ UI: ไปที่ Journal → คลิกปุ่ม "เพิ่มบันทึก"
- แก้ไข JSON: เพิ่มใน `years.[year].entries[]`

### 2. เพิ่ม Moment (Museum)
แก้ไข `universe.json`:
```json
{
  "id": "m2025-4",
  "date": "2025-07-01",
  "title": "New Moment",
  "description": "Description...",
  "category": "firsts", // firsts | trips | inside_jokes
  "isTopMoment": false,
  "photos": []
}
```

### 3. เพิ่ม Place (Map)
```json
{
  "id": "pl2025-5",
  "name": "New Place",
  "type": "cafe", // cafe|restaurant|park|beach|home|travel|other
  "x": 50,  // 0-100 (position %)
  "y": 50,
  "description": "Description...",
  "relatedMomentIds": []
}
```

### 4. เพิ่ม Chat Episode
```json
{
  "id": "c2025-3",
  "title": "Episode Title",
  "date": "2025-08-01",
  "messages": [
    { "from": "me", "text": "Hello!", "time": "20:00" },
    { "from": "you", "text": "Hi!", "time": "20:01" }
  ]
}
```

### 5. เพิ่ม Quest
```json
{
  "id": "q2025-6",
  "title": "New Quest",
  "description": "Quest description",
  "difficulty": 3,  // 1-5
  "status": "todo", // todo|doing|done
  "tags": ["tag1", "tag2"],
  "reward": "Optional reward text"
}
```

## 🎨 Themes

- **Cozy Paper** ☀️: โทนอบอุ่น สีครีม/น้ำตาลอ่อน
- **Midnight** 🌙: โทนเข้ม สีน้ำเงิน/ม่วง

สลับ theme ได้ที่ปุ่มมุมขวาบนของ header

## 📌 Year Switching

ใช้ Year Switcher (2025/2026/2027) เพื่อเปลี่ยนปีที่แสดง ทุกหน้าจะ filter ข้อมูลตามปีที่เลือก

## 🔒 Data Persistence

- ข้อมูลเริ่มต้นจาก `universe.json`
- การแก้ไขทั้งหมดเก็บใน localStorage
- ไม่หายแม้ปิดเบราว์เซอร์ (offline friendly)

## 🛠️ Build

```bash
npm run build
npm run start
```

## 📝 License

Made with 💕 for couples
