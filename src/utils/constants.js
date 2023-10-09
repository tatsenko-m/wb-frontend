export const companyInfo = {
  wildberries: {
    shortName: "OOO Вайлдберриз",
    fullName: "OOO «ВАЙЛДБЕРРИЗ»",
    ogrn: "1067746062449",
    address:
      "142181, Московская область, д. Коледино, тер. Индустриальный Парк Коледино, д. 6 стр. 1",
  },
  megaprofstil: {
    shortName: "OOO Мегапрофстиль",
    fullName: "OOO «МЕГАПРОФСТИЛЬ»",
    ogrn: "5167746237148",
    address:
      "129337, Москва, улица Красная Сосна, 2, корпус 1, стр. 1, помещение 2, офис 34",
  },
};

export const initialItems = [
  {
    image: './images/t-shirt.png',
    name: "Футболка UZcotton мужская",
    features: [
      { name: "Цвет", value: "белый" },
      { name: "Размер", value: 56 },
    ],
    warehouse: "Коледино WB",
    companyInfo: companyInfo.wildberries,
    maxQuantity: 2,
    oldPrice: 1051,
    newPrice: 522,
  },
  {
    image: './images/iphone-case.png',
    name: "Силиконовый чехол картхолдер (отверстия) для карт, прозрачный кейс бампер на Apple iPhone XR, MobiSafe",
    features: [{ name: "Цвет", value: "прозрачный" }],
    warehouse: "Коледино WB",
    companyInfo: companyInfo.megaprofstil,
    maxQuantity: Infinity,
    oldPrice: 11500.235,
    newPrice: 10500.235,
  },
  {
    image: './images/pencils.png',
    name: 'Карандаши цветные Faber-Castell "Замок", набор 24 цвета, заточенные, шестигранные, Faber&#8209;Castell',
    features: [],
    warehouse: "Коледино WB",
    companyInfo: companyInfo.wildberries,
    maxQuantity: 2,
    oldPrice: 475,
    newPrice: 247,
  },
];
