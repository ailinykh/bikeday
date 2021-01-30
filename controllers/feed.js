const Router = require('koa-router')

const router = new Router().prefix('/feed')

router.get('/', (ctx) => {
  ctx.body = [
    {
      type: 'announcement',
      category: 'Upcoming',
      title: 'BikeDay 2021',
      description: 'Some descriptive text',
      text: 'A long text',
      backgroundImageURL: 'https://via.placeholder.com/300x500.png/356629/fff',
      date: null
    },
    {
      type: 'promotion',
      category: 'promotion',
      title: 'Our partners',
      items: [
        { src: 'http://via.placeholder.com/300x150.png/09f/fff' },
        { src: 'http://via.placeholder.com/300x150.png/f9c/fff' },
        { src: 'http://via.placeholder.com/300x150.png/099/fff' },
        { src: 'http://via.placeholder.com/300x150.png/f95/fff' },
        { src: 'http://via.placeholder.com/300x150.png/0f3/fff' },
      ]
    },
    {
      type: 'gallery',
      category: 'how it goes',
      title: '',
      items: [
        { src: '' },
      ]
    },
    {
      type: 'timetable',
      category: 'timetable',
      title: 'BikeDay 2021',
    }
  ]
})

module.exports = router.routes()
