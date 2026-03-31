import { CollectionAfterChangeHook } from 'payload';

export const afterChange: CollectionAfterChangeHook = async ({
  doc,
  req: { payload },
  operation,
}) => {
  if (operation !== 'create') return doc;
  const customerId = typeof doc.customer === 'object' ? doc.customer.id : doc.customer;
  if (!customerId) return doc;

  const customer = await payload.findByID({
    collection: 'customers',
    id: customerId,
  });
  try {
    await payload.sendEmail({
      to: customer.email,
      subject: `Заказ #${doc.id} принят`,
      html: `<p>Спасибо! Ваш заказ на сумму ${doc.total} ₽ принят в обработку.</p>`,
    });
  } catch (err) {
    payload.logger.error({ err }, 'Failed to send order confirmation email');
  }

  return doc;
};