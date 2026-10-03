import { IBuyer, TPayment } from '../../types';

export class BuyerData {
  protected payment: TPayment = '';
  protected email: string = '';
  protected phone: string = '';
  protected address: string = '';

  setData(data: Partial<IBuyer>): void {
    Object.assign(this, data);
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.email) {
      errors.email = 'Укажите email';
    }
    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }
    if (!this.address) {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}