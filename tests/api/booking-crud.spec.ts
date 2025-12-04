import { APIResponse } from '@playwright/test';
import { test as base } from '@playwright/test';

const test = base.extend<{
  authToken: string;
}>({
  authToken: async ({ request }, use) => {
    const response = await request.post('/auth', {
      data: {
        username: 'admin',
        password: 'password123',
      },
    });

    const body = await response.json();
    await use(body.token);
  },
});

const expect = test.expect;

test.describe('Restful Booker - Booking CRUD', () => {
  test('Should Create and Retrieve Booking - Status 200', async ({ request }) => {
    const createResponse = await request.post('/booking', {
      data: {
        firstname: 'Jan',
        lastname: 'Kowalski',
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
          checkin: '2025-12-01',
          checkout: '2025-12-05',
        },
        additionalneeds: 'Breakfast',
      },
    });

    expect(createResponse.status()).toBe(200);

    const created = await createResponse.json();
    expect(created).toHaveProperty('bookingid');
    expect(created).toHaveProperty('booking');

    const bookingId = created.bookingid;

    // GET /booking/{id}
    const getResponse = await request.get(`/booking/${bookingId}`);
    expect(getResponse.status()).toBe(200);

    const booking = await getResponse.json();

    expect(booking.firstname).toBe('Jan');
    expect(booking.lastname).toBe('Kowalski');
    expect(booking.totalprice).toBe(150);
  });
});

test('Should Update and Delete Booking', async ({ request, authToken }) => {
  // CREATE
  const createResponse = await request.post('/booking', {
    data: {
      firstname: 'Test',
      lastname: 'User',
      totalprice: 200,
      depositpaid: false,
      bookingdates: {
        checkin: '2025-01-01',
        checkout: '2025-01-10',
      },
      additionalneeds: 'None',
    },
  });

  expect(createResponse.status()).toBe(200);
  const { bookingid } = await createResponse.json();

  // UPDATE (PUT)
  const updateResponse = await request.put(`/booking/${bookingid}`, {
    headers: {
      Cookie: `token=${authToken}`,
    },
    data: {
      firstname: 'Updated',
      lastname: 'User',
      totalprice: 300,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-02-01',
        checkout: '2025-02-10',
      },
      additionalneeds: 'Lunch',
    },
  });

  expect(updateResponse.status()).toBe(200);
  const updated = await updateResponse.json();
  expect(updated.firstname).toBe('Updated');
  expect(updated.totalprice).toBe(300);

  // DELETE
  const deleteResponse = await request.delete(`/booking/${bookingid}`, {
    headers: {
      Cookie: `token=${authToken}`,
    },
  });

  expect(deleteResponse.status()).toBe(201); 

  // GET
  const getAfterDelete = await request.get(`/booking/${bookingid}`);
  expect(getAfterDelete.status()).toBe(404);
});

test('Should not Allow Update Booking Without Auth', async ({ request }) => {
  // CREATE
  const createResponse = await request.post('/booking', {
    data: {
      firstname: 'NoAuth',
      lastname: 'User',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-03-01',
        checkout: '2025-03-05',
      },
      additionalneeds: 'None',
    },
  });

  expect(createResponse.status()).toBe(200);
  const { bookingid } = await createResponse.json();

  // TRY TO UPDATE 
  const updateResponse = await request.put(`/booking/${bookingid}`, {
    data: {
      firstname: 'Hacker',
      lastname: 'User',
      totalprice: 999,
      depositpaid: false,
      bookingdates: {
        checkin: '2025-04-01',
        checkout: '2025-04-10',
      },
      additionalneeds: 'All',
    },
  });

  expect(updateResponse.status()).toBe(403);
});