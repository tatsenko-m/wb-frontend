import tShirtImage from "../images/t-shirt.png";
import iphoneCaseImage from "../images/iphone-case.png";
import pencilsImage from "../images/pencils.png";

export const companyInfo = {
  wildberries: {
    shortName: "OOO Вайлдберриз",
    fullName: "OOO «ВАЙЛДБЕРРИЗ»",
    ogrn: "1067746062449",
    address:
      "142181, Московская обл., д. Коледино, Индустриальный Парк Коледино 6, стр. 1",
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
    id: 1,
    image: tShirtImage,
    name: "Футболка UZcotton мужская",
    features: [
      { name: "Цвет", value: "белый" },
      { name: "Размер", value: 56 },
    ],
    warehouse: "Коледино WB",
    companyInfo: companyInfo.wildberries,
    initialCounterValue: 1,
    maxQuantity: 2,
    oldPrice: 1051,
    newPrice: 522,
    additionalPropertyValue: "56",
  },
  {
    id: 2,
    image: iphoneCaseImage,
    name: "Силиконовый чехол картхолдер (отверстия) для карт, прозрачный кейс бампер на Apple iPhone XR, MobiSafe",
    features: [{ name: "Цвет", value: "прозрачный" }],
    warehouse: "Коледино WB",
    companyInfo: companyInfo.megaprofstil,
    initialCounterValue: 200,
    maxQuantity: Infinity,
    oldPrice: 11500.235,
    newPrice: 10500.235,
  },
  {
    id: 3,
    image: pencilsImage,
    name: 'Карандаши цветные Faber-Castell "Замок", набор 24 цвета, заточенные, шестигранные, Faber&#8209;Castell',
    features: [],
    warehouse: "Коледино WB",
    companyInfo: companyInfo.wildberries,
    initialCounterValue: 2,
    maxQuantity: 2,
    oldPrice: 475,
    newPrice: 247,
    additionalPropertyValue: "56/54/52...",
  },
];
