import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Models/WebLarekApi';

// Импорты моделей
import { ProductsData } from './components/Models/ProductsData';
import { BasketData } from './components/Models/BasketData';
import { BuyerData } from './components/Models/BuyerData';

// Импорты View компонентов
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { CardCatalog } from './components/view/cards/CardCatalog';
import { CardPreview } from './components/view/cards/CardPreview';
import { CardBasket } from './components/view/cards/CardBasket';
import { OrderForm } from './components/view/forms/OrderForm';
import { ContactsForm } from './components/view/forms/ContactsForm';

const events = new EventEmitter();

const api = new WebLarekApi(new Api('https://larek-api.nomoreparties.co/api/weblarek'));
const productsModel = new ProductsData(events);
const basketModel = new BasketData(events);
const buyerModel = new BuyerData(events);

const headerContainer = document.querySelector('.header') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;

// Находим шаблоны
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;

const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);


api.getProducts().then((data) => {
  productsModel.setItems(data.items);
});

events.on('products:changed', () => {
  const items = productsModel.getItems().map((product) => {
    const cardElement = cardCatalogTemplate.content.cloneNode(true) as HTMLElement;
    const cardContainer = cardElement.querySelector('.card') as HTMLElement;
    const card = new CardCatalog(cardContainer, events);
    card.productId = product.id;
    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: `https://larek-api.nomoreparties.co/content/weblarek${product.image}`,
    });
  });
  gallery.catalog = items;
});

events.on('card:select', (data: { id: string }) => {
  const product = productsModel.getItem(data.id);
  if (product) {
    productsModel.setPreview(product);
  }
});

events.on('preview:changed', () => {
  const product = productsModel.getPreview();
  if (product) {
    const cardElement = cardPreviewTemplate.content.cloneNode(true) as HTMLElement;
    const cardContainer = cardElement.querySelector('.card') as HTMLElement;
    const card = new CardPreview(cardContainer, events);
    
    card.productId = product.id;
    
    modal.content = card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: `https://larek-api.nomoreparties.co/content/weblarek${product.image}`,
      description: product.description,
    });
    
    card.inBasket = basketModel.contains(product.id);
    
    modal.open();
  }
});

events.on('basket:changed', () => {
  header.counter = basketModel.getQuantity();
});

events.on('basket:open', () => {
  const basketContainer = basketTemplate.content.cloneNode(true) as HTMLElement;
  const basketView = new Basket(basketContainer, events);
  
  const items = basketModel.getItems().map((product, index) => {
    const cardElement = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
    const cardContainer = cardElement.querySelector('.basket__item') as HTMLElement;
    const card = new CardBasket(cardContainer, events);
    card.productId = product.id;
    card.index = index + 1;
    return card.render({ title: product.title, price: product.price });
  });
  
  basketView.items = items;
  basketView.total = basketModel.getTotalPrice();

  modal.content = basketView.render();
  modal.open();
});

events.on('card:buy', (data: { id: string }) => {
  const product = productsModel.getItem(data.id);
  if (product) {
    basketModel.addItem(product);
    modal.close();
  }
});

events.on('card:remove', (data: { id: string }) => {
  const product = productsModel.getItem(data.id);
  if (product) {
    basketModel.removeItem(product);
    modal.close();
  }
});

events.on('card:delete', (data: { id: string }) => {
  const product = basketModel.getItems().find(i => i.id === data.id);
  if (product) {
    basketModel.removeItem(product);
    
    const basketContainer = basketTemplate.content.cloneNode(true) as HTMLElement;
    const basketView = new Basket(basketContainer, events);
    const items = basketModel.getItems().map((product, index) => {
      const cardElement = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
      const cardContainer = cardElement.querySelector('.basket__item') as HTMLElement;
      const card = new CardBasket(cardContainer, events);
      card.productId = product.id;
      card.index = index + 1;
      return card.render({ title: product.title, price: product.price });
    });
    basketView.items = items;
    basketView.total = basketModel.getTotalPrice();
    modal.content = basketView.render();
  }
});

events.on('order:open', () => {
  const orderForm = new OrderForm(orderTemplate.content.cloneNode(true) as HTMLElement, events);
  const buyerData = buyerModel.getData();
  orderForm.payment = buyerData.payment;
  orderForm.address = buyerData.address;
  
  modal.content = orderForm.render();
  modal.open();
});

events.on('order.payment:change', (data: { field: string, value: string }) => {
  buyerModel.setData({ payment: data.value as any });
});

events.on('order.address:change', (data: { field: string, value: string }) => {
  buyerModel.setData({ address: data.value });
});

events.on('buyer:changed', () => {
  const errors = buyerModel.validate();

  if (modalContainer.querySelector('form[name="order"]')) {
    const nextButton = modalContainer.querySelector('form[name="order"] button[type="submit"]') as HTMLButtonElement;
    const errorsContainer = modalContainer.querySelector('form[name="order"] .form__errors') as HTMLElement;
    
    const orderErrors = [errors.payment, errors.address].filter(Boolean).join(', ');
    errorsContainer.textContent = orderErrors;
    nextButton.disabled = !!(errors.payment || errors.address);
  }
});

events.on('contacts.email:change', (data: { field: string, value: string }) => {
  buyerModel.setData({ email: data.value });
});

events.on('contacts.phone:change', (data: { field: string, value: string }) => {
  buyerModel.setData({ phone: data.value });
});

events.on('buyer:changed', () => {
  const errors = buyerModel.validate();
  
  if (modalContainer.querySelector('form[name="contacts"]')) {
    const payButton = modalContainer.querySelector('form[name="contacts"] button[type="submit"]') as HTMLButtonElement;
    const errorsContainer = modalContainer.querySelector('form[name="contacts"] .form__errors') as HTMLElement;
    
    const contactErrors = [errors.email, errors.phone].filter(Boolean).join(', ');
    errorsContainer.textContent = contactErrors;
    payButton.disabled = !!(errors.email || errors.phone);
  }
});

events.on('form:submit', () => {
  const data = buyerModel.getData();

  if (data.payment && data.address && !data.email) {
    const contactsForm = new ContactsForm(contactsTemplate.content.cloneNode(true) as HTMLElement, events);
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    
    modal.content = contactsForm.render();
    modal.open();
  } 
  else if (data.email && data.phone) {
    api.postOrder({
      payment: data.payment,
      email: data.email,
      phone: data.phone,
      address: data.address,
      total: basketModel.getTotalPrice(),
      items: basketModel.getItems().map(item => item.id)
    }).then(() => {
      alert('Заказ оформлен!'); 
      modal.close();

      basketModel.clear();
      buyerModel.clear();
    });
  }
});