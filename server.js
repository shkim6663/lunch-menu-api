const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// CORS 허용
app.use(cors());
app.use(express.json());

// mockData 불러오기
const lunchMenus = require('./mockData.json');

// 정적 파일 제공 (index.html, script.js, style.css)
app.use(express.static('.'));

// 루트 요청 시 index.html 제공
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' }, err => {
    if (err) {
      console.error(err);
      res.status(500).send('index.html을 불러올 수 없습니다.');
    }
  });
});

// API
// 전체 메뉴 조회
app.get('/lunch-menu', (req, res) => {
  res.json(lunchMenus["lunch-menu"]);
});

// 특정 메뉴 조회
app.get('/lunch-menu/:id', (req, res) => {
  const menu = lunchMenus["lunch-menu"].find(m => m.id === req.params.id);
  if (!menu) return res.status(404).json({ message: '메뉴가 존재하지 않습니다.' });
  res.json(menu);
});

// 메뉴 등록
app.post('/lunch-menu', (req, res) => {
  const newMenu = { id: Date.now().toString(), ...req.body };
  lunchMenus["lunch-menu"].push(newMenu);
  res.status(201).json(newMenu);
});

// fetch 테스트용 라우트 (옵션)
app.get('/fetch-test', async (req, res) => {
  try {
    const menus = lunchMenus["lunch-menu"];
    res.json({ success: true, count: menus.length, menus });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 서버 시작
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
