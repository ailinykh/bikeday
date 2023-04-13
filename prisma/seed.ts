import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const eventData = [
  {
    title: 'Велодень 2012',
    date: new Date('2012-05-26T09:00:00'),
  },
  {
    title: 'Велодень 2013',
    date: new Date('2013-05-25T09:00:00'),
  },
  {
    title: 'Велодень 2014',
    date: new Date('2014-05-31T09:00:00'),
  },
  {
    title: 'Велодень 2015',
    date: new Date('2015-05-31T09:00:00'),
  },
  {
    title: 'Велодень 2016',
    date: new Date('2016-05-29T09:00:00'),
  },
  {
    title: 'Велодень 2017',
    date: new Date('2017-05-28T09:00:00'),
  },
  {
    title: 'Велодень 2018',
    date: new Date('2018-05-20T09:00:00'),
  },
  {
    title: 'Велодень 2019',
    date: new Date('2019-06-02T09:00:00'),
  },
  {
    title: 'Велодень 2022',
    date: new Date('2022-06-05T09:00:00'),
  },
  {
    title: 'Велодень 2023',
    date: new Date('2023-05-28T09:00:00'),
  },
]

let order = 0

const contestData = [
  {
    title: 'Безумный велосипед',
    status: 'closed',
    kind: 'common',
    order: ++order,
  },
  {
    title: 'Конкурс костюмов',
    status: 'closed',
    kind: 'common',
    order: ++order,
  },
  {
    title: 'Трасса + Змейка',
    status: 'closed',
    kind: 'ranked',
    order: ++order,
  },
  {
    title: 'Драг',
    status: 'closed',
    kind: 'ranked',
    order: ++order,
  },
  {
    title: 'Велобиатлон',
    status: 'closed',
    kind: 'ranked',
    order: ++order,
  },
  {
    title: 'Трекстенд',
    status: 'closed',
    kind: 'ranked',
    order: ++order,
  },
  {
    title: 'Велосилач',
    status: 'closed',
    kind: 'ranked',
    order: ++order,
  },
]

const userData = [] //require('./users.json')

async function main() {
  console.log(`Start seeding ...`)
  for (const e of eventData) {
    const event = await prisma.event.create({
      data: e,
    })
    console.log(`Created event #${event.id} "${event.title}"`)

    for (const c of contestData) {
      const contest = await prisma.contest.create({
        data: {
          ...c,
          eventId: event.id,
          // event: { connect: event}
        },
      })
      console.log(
        `Created contest #${contest.id} "${contest.title}" for ${event.title} event`
      )
    }
  }
  for (const u of userData) {
    const user = await prisma.user.create({
      data: {
        ...u,
        createdAt: new Date(u.createdAt),
      },
    })
    console.log(`Created user #${user.id} "${user.firstName} ${user.lastName}"`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
