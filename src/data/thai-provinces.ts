// Thailand provinces data
// Each province has: id, name (Thai), name (English), region, and approximate position for the map
export interface ThaiProvince {
    id: string;
    nameTh: string;
    nameEn: string;
    region: 'north' | 'northeast' | 'central' | 'east' | 'west' | 'south';
    // Position on map (percentage based, 0-100)
    x: number;
    y: number;
}

export const thaiProvinces: ThaiProvince[] = [
    // Northern Region
    { id: 'chiangmai', nameTh: 'เชียงใหม่', nameEn: 'Chiang Mai', region: 'north', x: 28, y: 12 },
    { id: 'chiangrai', nameTh: 'เชียงราย', nameEn: 'Chiang Rai', region: 'north', x: 35, y: 5 },
    { id: 'lampang', nameTh: 'ลำปาง', nameEn: 'Lampang', region: 'north', x: 35, y: 15 },
    { id: 'lamphun', nameTh: 'ลำพูน', nameEn: 'Lamphun', region: 'north', x: 30, y: 16 },
    { id: 'maehongson', nameTh: 'แม่ฮ่องสอน', nameEn: 'Mae Hong Son', region: 'north', x: 18, y: 12 },
    { id: 'nan', nameTh: 'น่าน', nameEn: 'Nan', region: 'north', x: 42, y: 10 },
    { id: 'phayao', nameTh: 'พะเยา', nameEn: 'Phayao', region: 'north', x: 38, y: 10 },
    { id: 'phrae', nameTh: 'แพร่', nameEn: 'Phrae', region: 'north', x: 40, y: 14 },
    { id: 'uttaradit', nameTh: 'อุตรดิตถ์', nameEn: 'Uttaradit', region: 'north', x: 42, y: 18 },

    // Northeastern Region (Isan)
    { id: 'khonkaen', nameTh: 'ขอนแก่น', nameEn: 'Khon Kaen', region: 'northeast', x: 60, y: 30 },
    { id: 'udonthani', nameTh: 'อุดรธานี', nameEn: 'Udon Thani', region: 'northeast', x: 58, y: 22 },
    { id: 'nakhonratchasima', nameTh: 'นครราชสีมา', nameEn: 'Nakhon Ratchasima', region: 'northeast', x: 58, y: 38 },
    { id: 'ubonratchathani', nameTh: 'อุบลราชธานี', nameEn: 'Ubon Ratchathani', region: 'northeast', x: 75, y: 38 },
    { id: 'roi-et', nameTh: 'ร้อยเอ็ด', nameEn: 'Roi Et', region: 'northeast', x: 65, y: 32 },
    { id: 'mahasarakham', nameTh: 'มหาสารคาม', nameEn: 'Maha Sarakham', region: 'northeast', x: 62, y: 32 },
    { id: 'kalasin', nameTh: 'กาฬสินธุ์', nameEn: 'Kalasin', region: 'northeast', x: 65, y: 28 },
    { id: 'nongkhai', nameTh: 'หนองคาย', nameEn: 'Nong Khai', region: 'northeast', x: 58, y: 18 },
    { id: 'loei', nameTh: 'เลย', nameEn: 'Loei', region: 'northeast', x: 50, y: 22 },
    { id: 'sakonnakon', nameTh: 'สกลนคร', nameEn: 'Sakon Nakhon', region: 'northeast', x: 65, y: 22 },
    { id: 'nakhonpanom', nameTh: 'นครพนม', nameEn: 'Nakhon Phanom', region: 'northeast', x: 72, y: 22 },
    { id: 'mukdahan', nameTh: 'มุกดาหาร', nameEn: 'Mukdahan', region: 'northeast', x: 75, y: 28 },
    { id: 'yasothon', nameTh: 'ยโสธร', nameEn: 'Yasothon', region: 'northeast', x: 70, y: 32 },
    { id: 'amnatcharoen', nameTh: 'อำนาจเจริญ', nameEn: 'Amnat Charoen', region: 'northeast', x: 75, y: 32 },
    { id: 'sisaket', nameTh: 'ศรีสะเกษ', nameEn: 'Si Sa Ket', region: 'northeast', x: 70, y: 38 },
    { id: 'surin', nameTh: 'สุรินทร์', nameEn: 'Surin', region: 'northeast', x: 65, y: 40 },
    { id: 'buriram', nameTh: 'บุรีรัมย์', nameEn: 'Buri Ram', region: 'northeast', x: 62, y: 42 },
    { id: 'chaiyaphum', nameTh: 'ชัยภูมิ', nameEn: 'Chaiyaphum', region: 'northeast', x: 55, y: 32 },
    { id: 'nongbualamphu', nameTh: 'หนองบัวลำภู', nameEn: 'Nong Bua Lam Phu', region: 'northeast', x: 55, y: 25 },
    { id: 'buengkan', nameTh: 'บึงกาฬ', nameEn: 'Bueng Kan', region: 'northeast', x: 68, y: 18 },

    // Central Region
    { id: 'bangkok', nameTh: 'กรุงเทพมหานคร', nameEn: 'Bangkok', region: 'central', x: 45, y: 50 },
    { id: 'nonthaburi', nameTh: 'นนทบุรี', nameEn: 'Nonthaburi', region: 'central', x: 44, y: 48 },
    { id: 'pathumthani', nameTh: 'ปทุมธานี', nameEn: 'Pathum Thani', region: 'central', x: 46, y: 46 },
    { id: 'ayutthaya', nameTh: 'พระนครศรีอยุธยา', nameEn: 'Ayutthaya', region: 'central', x: 46, y: 42 },
    { id: 'angthong', nameTh: 'อ่างทอง', nameEn: 'Ang Thong', region: 'central', x: 43, y: 40 },
    { id: 'lopburi', nameTh: 'ลพบุรี', nameEn: 'Lopburi', region: 'central', x: 48, y: 36 },
    { id: 'singburi', nameTh: 'สิงห์บุรี', nameEn: 'Sing Buri', region: 'central', x: 45, y: 38 },
    { id: 'chainat', nameTh: 'ชัยนาท', nameEn: 'Chai Nat', region: 'central', x: 42, y: 36 },
    { id: 'saraburi', nameTh: 'สระบุรี', nameEn: 'Saraburi', region: 'central', x: 50, y: 40 },
    { id: 'nakhonnayok', nameTh: 'นครนายก', nameEn: 'Nakhon Nayok', region: 'central', x: 52, y: 44 },
    { id: 'nakhonpathom', nameTh: 'นครปฐม', nameEn: 'Nakhon Pathom', region: 'central', x: 40, y: 50 },
    { id: 'samutprakan', nameTh: 'สมุทรปราการ', nameEn: 'Samut Prakan', region: 'central', x: 48, y: 52 },
    { id: 'samutsakhon', nameTh: 'สมุทรสาคร', nameEn: 'Samut Sakhon', region: 'central', x: 42, y: 52 },
    { id: 'samutsongkhram', nameTh: 'สมุทรสงคราม', nameEn: 'Samut Songkhram', region: 'central', x: 38, y: 54 },
    { id: 'suphanburi', nameTh: 'สุพรรณบุรี', nameEn: 'Suphan Buri', region: 'central', x: 38, y: 40 },
    { id: 'nakhonsawan', nameTh: 'นครสวรรค์', nameEn: 'Nakhon Sawan', region: 'central', x: 42, y: 30 },
    { id: 'uthaithani', nameTh: 'อุทัยธานี', nameEn: 'Uthai Thani', region: 'central', x: 38, y: 32 },
    { id: 'kamphaengphet', nameTh: 'กำแพงเพชร', nameEn: 'Kamphaeng Phet', region: 'central', x: 38, y: 26 },
    { id: 'phitsanulok', nameTh: 'พิษณุโลก', nameEn: 'Phitsanulok', region: 'central', x: 42, y: 22 },
    { id: 'phichit', nameTh: 'พิจิตร', nameEn: 'Phichit', region: 'central', x: 42, y: 26 },
    { id: 'phetchabun', nameTh: 'เพชรบูรณ์', nameEn: 'Phetchabun', region: 'central', x: 48, y: 28 },
    { id: 'sukhothai', nameTh: 'สุโขทัย', nameEn: 'Sukhothai', region: 'central', x: 38, y: 22 },
    { id: 'tak', nameTh: 'ตาก', nameEn: 'Tak', region: 'central', x: 28, y: 26 },

    // Eastern Region
    { id: 'chonburi', nameTh: 'ชลบุรี', nameEn: 'Chonburi', region: 'east', x: 52, y: 54 },
    { id: 'rayong', nameTh: 'ระยอง', nameEn: 'Rayong', region: 'east', x: 55, y: 56 },
    { id: 'chanthaburi', nameTh: 'จันทบุรี', nameEn: 'Chanthaburi', region: 'east', x: 60, y: 58 },
    { id: 'trat', nameTh: 'ตราด', nameEn: 'Trat', region: 'east', x: 65, y: 58 },
    { id: 'chachoengsao', nameTh: 'ฉะเชิงเทรา', nameEn: 'Chachoengsao', region: 'east', x: 52, y: 48 },
    { id: 'prachinburi', nameTh: 'ปราจีนบุรี', nameEn: 'Prachin Buri', region: 'east', x: 55, y: 44 },
    { id: 'srakaew', nameTh: 'สระแก้ว', nameEn: 'Sa Kaeo', region: 'east', x: 60, y: 46 },

    // Western Region
    { id: 'kanchanaburi', nameTh: 'กาญจนบุรี', nameEn: 'Kanchanaburi', region: 'west', x: 30, y: 44 },
    { id: 'ratchaburi', nameTh: 'ราชบุรี', nameEn: 'Ratchaburi', region: 'west', x: 35, y: 52 },
    { id: 'phetchaburi', nameTh: 'เพชรบุรี', nameEn: 'Phetchaburi', region: 'west', x: 35, y: 58 },
    { id: 'prachuapkhirikhan', nameTh: 'ประจวบคีรีขันธ์', nameEn: 'Prachuap Khiri Khan', region: 'west', x: 35, y: 66 },

    // Southern Region
    { id: 'chumphon', nameTh: 'ชุมพร', nameEn: 'Chumphon', region: 'south', x: 38, y: 72 },
    { id: 'ranong', nameTh: 'ระนอง', nameEn: 'Ranong', region: 'south', x: 32, y: 72 },
    { id: 'suratthani', nameTh: 'สุราษฎร์ธานี', nameEn: 'Surat Thani', region: 'south', x: 38, y: 78 },
    { id: 'phangnga', nameTh: 'พังงา', nameEn: 'Phang Nga', region: 'south', x: 32, y: 80 },
    { id: 'phuket', nameTh: 'ภูเก็ต', nameEn: 'Phuket', region: 'south', x: 30, y: 84 },
    { id: 'krabi', nameTh: 'กระบี่', nameEn: 'Krabi', region: 'south', x: 34, y: 84 },
    { id: 'nakhonsithammarat', nameTh: 'นครศรีธรรมราช', nameEn: 'Nakhon Si Thammarat', region: 'south', x: 42, y: 82 },
    { id: 'trang', nameTh: 'ตรัง', nameEn: 'Trang', region: 'south', x: 36, y: 88 },
    { id: 'phatthalung', nameTh: 'พัทลุง', nameEn: 'Phatthalung', region: 'south', x: 42, y: 86 },
    { id: 'satun', nameTh: 'สตูล', nameEn: 'Satun', region: 'south', x: 34, y: 92 },
    { id: 'songkhla', nameTh: 'สงขลา', nameEn: 'Songkhla', region: 'south', x: 42, y: 90 },
    { id: 'pattani', nameTh: 'ปัตตานี', nameEn: 'Pattani', region: 'south', x: 48, y: 92 },
    { id: 'yala', nameTh: 'ยะลา', nameEn: 'Yala', region: 'south', x: 45, y: 94 },
    { id: 'narathiwat', nameTh: 'นราธิวาส', nameEn: 'Narathiwat', region: 'south', x: 50, y: 95 },
];

// Get province by ID
export function getProvinceById(id: string): ThaiProvince | undefined {
    return thaiProvinces.find(p => p.id === id);
}

// Get provinces by region
export function getProvincesByRegion(region: ThaiProvince['region']): ThaiProvince[] {
    return thaiProvinces.filter(p => p.region === region);
}
