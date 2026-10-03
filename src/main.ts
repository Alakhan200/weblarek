import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { ProductsData } from './components/Models/ProductsData';
import { BasketData } from './components/Models/BasketData';
import { BuyerData } from './components/Models/BuyerData';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL } from './utils/constants';


// Проверка ProductsData
const productsModel = new ProductsData();
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());

const firstProduct = apiProducts.items[0];
console.log('Первый товар по id:', productsModel.getItem(firstProduct.id));

productsModel.setPreview(firstProduct);
console.log('Выбранный товар:', productsModel.getPreview());

// Проверка BasketData
const basketModel = new BasketData();
basketModel.addItem(firstProduct);
basketModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getQuantity());
console.log('Стоимость товаров в корзине:', basketModel.getTotalPrice());
console.log('Есть ли товар в корзине:', basketModel.contains(firstProduct.id));

basketModel.removeItem(firstProduct);
console.log('Товары в корзине после удаления:', basketModel.getItems());

basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

// Проверка BuyerData
const buyerModel = new BuyerData();
buyerModel.setData({ email: 'test@test.ru' });
console.log('Данные покупателя (только email):', buyerModel.getData());

buyerModel.setData({ phone: '+71234567890', address: 'СПб' });
console.log('Данные покупателя (email + phone + address):', buyerModel.getData());

console.log('Валидация (все поля заполнены):', buyerModel.validate());

buyerModel.clear();
console.log('Валидация (всё пусто):', buyerModel.validate());

const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);

webLarekApi.getProducts()
  .then((data) => {
    productsModel.setItems(data.items);
    console.log('Каталог с сервера:', productsModel.getItems());
  })
  .catch((err) => console.error('Ошибка при загрузке товаров:', err));