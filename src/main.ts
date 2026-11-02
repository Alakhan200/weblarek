import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/Models/WebLarekApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { IFormChange, IProduct, TPayment } from "./types";

// Модели
import { ProductsData } from "./components/Models/ProductsData";
import { BasketData } from "./components/Models/BasketData";
import { BuyerData } from "./components/Models/BuyerData";

// Представления
import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { Modal } from "./components/view/Modal";
import { Basket } from "./components/view/Basket";
import { OrderSuccess } from "./components/view/OrderSuccess";
import { CardCatalog } from "./components/view/cards/CardCatalog";
import { CardPreview } from "./components/view/cards/CardPreview";
import { CardBasket } from "./components/view/cards/CardBasket";
import { OrderForm } from "./components/view/forms/OrderForm";
import { ContactsForm } from "./components/view/forms/ContactsForm";

// Брокер событий, API и модели
const events = new EventEmitter();
const api = new WebLarekApi(new Api(API_URL));

const productsModel = new ProductsData(events);
const basketModel = new BasketData(events);
const buyerModel = new BuyerData(events);

// Представления, которые создаются один раз
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"));

const basketView = new Basket(cloneTemplate("#basket"), events);
const previewCard = new CardPreview(cloneTemplate("#card-preview"), events);
const orderForm = new OrderForm(cloneTemplate("#order"), events);
const contactsForm = new ContactsForm(cloneTemplate("#contacts"), events);
const orderSuccess = new OrderSuccess(cloneTemplate("#success"), {
  onClick: () => modal.close(),
});

// Изменения данных (модель -> представление)
events.on("products:changed", () => {
  const items = productsModel.getItems().map((product) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), {
      onClick: () => events.emit("card:select", product),
    });

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: `${CDN_URL}${product.image}`,
    });
  });

  gallery.render({ catalog: items });
});

events.on("preview:changed", () => {
  const product = productsModel.getPreview();
  if (!product) return;

  let buttonText = "Купить";
  let buttonDisabled = false;

  if (product.price === null) {
    buttonText = "Недоступно";
    buttonDisabled = true;
  } else if (basketModel.contains(product.id)) {
    buttonText = "Удалить из корзины";
  }

  modal.content = previewCard.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: `${CDN_URL}${product.image}`,
    description: product.description,
    buttonText,
    buttonDisabled,
  });
  modal.open();
});

events.on("basket:changed", () => {
  header.render({ counter: basketModel.getQuantity() });

  const items = basketModel.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate("#card-basket"), {
      onClick: () => events.emit("card:delete", product),
    });

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  basketView.render({
    items,
    total: basketModel.getTotalPrice(),
    canOrder: basketModel.getQuantity() > 0,
  });
});

events.on("buyer:changed", () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  orderForm.render({
    payment: buyer.payment,
    address: buyer.address,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean).join("; "),
  });

  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean).join("; "),
  });
});

// Действия пользователя (представление -> модель)
events.on<IProduct>("card:select", (product) => {
  productsModel.setPreview(product);
});

events.on("card:button", () => {
  const product = productsModel.getPreview();
  if (!product) return;

  if (basketModel.contains(product.id)) {
    basketModel.removeItem(product);
  } else {
    basketModel.addItem(product);
  }

  modal.close();
});

events.on<IProduct>("card:delete", (product) => {
  basketModel.removeItem(product);
});

events.on<IFormChange>("order.payment:change", (data) => {
  buyerModel.setData({ payment: data.value as TPayment });
});

events.on<IFormChange>("order.address:change", (data) => {
  buyerModel.setData({ address: data.value });
});

events.on<IFormChange>("contacts.email:change", (data) => {
  buyerModel.setData({ email: data.value });
});

events.on<IFormChange>("contacts.phone:change", (data) => {
  buyerModel.setData({ phone: data.value });
});

// Открытие окон: только передаём разметку в модальное окно
events.on("basket:open", () => {
  modal.content = basketView.render();
  modal.open();
});

events.on("order:open", () => {
  modal.content = orderForm.render();
  modal.open();
});

events.on("order:submit", () => {
  modal.content = contactsForm.render();
  modal.open();
});

events.on("contacts:submit", () => {
  api
    .postOrder({
      ...buyerModel.getData(),
      total: basketModel.getTotalPrice(),
      items: basketModel.getItems().map((item) => item.id),
    })
    .then((response) => {
      modal.content = orderSuccess.render({ total: response.total });
      modal.open();

      basketModel.clear();
      buyerModel.clear();
    })
    .catch((error) => {
      console.error("Ошибка оформления заказа:", error);
    });
});

// Запуск: начальное состояние и загрузка товаров
basketModel.clear();
buyerModel.clear();

api
  .getProducts()
  .then((data) => {
    productsModel.setItems(data.items);
  })
  .catch((error) => {
    console.error("Ошибка загрузки товаров:", error);
  });
