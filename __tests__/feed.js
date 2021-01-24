const app = require('../app')
const supertest = require('supertest')


describe('GET /feed', () => {
  let server

  beforeEach(async () => {
    server = await app.listen(3000)
  })

  afterEach(() => {
    server.close()
  })

  test('it shows a list of items', async () => {
    const request = supertest(server)
    const res = await request.get('/api/feed')

    expect(res.status).toBe(200)
  })

  test('each item have type, category and title properties', async () => {
    const request = supertest(server)
    const res = await request.get('/api/feed')

    res.body.forEach( (item) => {
      expect(item).toHaveProperty('type')
      expect(item).toHaveProperty('category')
      expect(item).toHaveProperty('title')
    })
  })

  test('it contains an announcement', async () => {
    const request = supertest(server)
    const res = await request.get('/api/feed')

    const announcements = res.body.filter(item => item.type == 'announcement')
    expect(announcements.length).toBe(1)

    const announcement = announcements[0]
    expect(announcement).toHaveProperty('description')
    expect(announcement).toHaveProperty('text')
    expect(announcement).toHaveProperty('date')
  })

  test('it contains promotion', async () => {
    const request = supertest(server)
    const res = await request.get('/api/feed')

    const promotions = res.body.filter(item => item.type == 'promotion')
    expect(promotions.length).toBeGreaterThanOrEqual(1)

    const promotion = promotions[0]
    expect(promotion).toHaveProperty('items')
  })

  test('it contains gallery', async () => {
    const request = supertest(server)
    const res = await request.get('/api/feed')

    const galleries = res.body.filter(item => item.type == 'gallery')
    expect(galleries.length).toBeGreaterThanOrEqual(1)
  })

  test('it contains timetable', async () => {
    const request = supertest(server)
    const res = await request.get('/api/feed')

    const timetables = res.body.filter(item => item.type == 'timetable')
    expect(timetables.length).toBe(1)

    // const timetable = timetables[0]
    // expect(timetable).toHaveProperty('items')
  })
})
