# ระบบจัดการกลุ่มแบดมินตัน

## โครงสร้างโปรเจค

```
src/
├── types/              # Type definitions
│   └── index.ts       # Player, Match, Settings types
├── components/        # React components
│   ├── Layout/       # Layout components
│   │   ├── Header.tsx
│   │   └── SettingsModal.tsx
│   ├── Player/       # Player-related components
│   │   ├── AddPlayerForm.tsx
│   │   └── PlayerTable.tsx
│   ├── Match/        # Match-related components
│   │   └── ActiveMatches.tsx
│   └── index.ts      # Component exports
├── hooks/            # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useWaitTime.ts
├── utils/            # Utility functions
│   ├── matchUtils.ts
│   └── costCalculator.ts
├── constants/        # Constants and configuration
│   └── index.ts
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## คำอธิบายโครงสร้าง

### `/types`
- เก็บ TypeScript interface และ type definitions ทั้งหมด
- ทำให้ง่ายต่อการดูแลและแชร์ types ระหว่าง components

### `/components`
- แบ่งตามหน้าที่การทำงาน (Layout, Player, Match)
- แต่ละ component มีหน้าที่เฉพาะตัว
- ใช้ barrel export (`index.ts`) เพื่อความสะดวกในการ import

### `/hooks`
- Custom hooks สำหรับ logic ที่ใช้ซ้ำ
- `useLocalStorage`: จัดการ localStorage พร้อม sync ข้าม tabs
- `useWaitTime`: จัดการการอัปเดตเวลารอของผู้เล่น

### `/utils`
- Utility functions ที่ไม่เกี่ยวกับ React
- `matchUtils`: ฟังก์ชันเกี่ยวกับการจัดแมทช์
- `costCalculator`: ฟังก์ชันคำนวณค่าใช้จ่าย

### `/constants`
- ค่าคงที่และ configuration
- ทำให้ง่ายต่อการปรับแต่งค่าต่างๆ

## การพัฒนาต่อ

### เพิ่ม Feature ใหม่
1. สร้าง type ใน `/types` (ถ้าจำเป็น)
2. สร้าง component ใน folder ที่เหมาะสม
3. เพิ่ม utility functions ใน `/utils` (ถ้าจำเป็น)
4. Export component ผ่าน `/components/index.ts`

### การทดสอบ
- แต่ละ component สามารถทดสอบแยกได้
- Utility functions ทดสอบได้ง่าย เพราะเป็น pure functions

### การดูแลรักษา
- Code แยกตามหน้าที่ ทำให้หาได้ง่าย
- ลด coupling ระหว่าง components
- ง่ายต่อการ refactor ในอนาคต