import { http, HttpResponse, delay } from "msw";
import { faker } from '@faker-js/faker'

export const handlers = [
  http.get("/getSections",async ({ request }) => {
    const url = new URL(request.url);
    const videoDuration = Number(url.searchParams.get('duration'));

    if( videoDuration <= 0 ) return HttpResponse.json([])
    

    const fixedInterval = 5; // 每段 highlight 間隔 15 秒
    const sections = [];
    let currentTime = 0;
    let highlightId = 1;
    let sectionId = 1;

    while (currentTime < videoDuration) {
      const sectionHighlightCount = Math.floor(Math.random() * 3) + 1; // 每個 section 1～3 個 highlight

      const highlights = [];
      for (let i = 0; i < sectionHighlightCount && currentTime < videoDuration; i++) {
        highlights.push({
          id: highlightId++,
          text: faker.lorem.sentence(),
          time: currentTime,
        });
        currentTime += fixedInterval;
      }

      sections.push({
        sectionId: sectionId++,
        title: faker.lorem.word(),
        transcripts: faker.lorem.paragraph(),
        highlights,
      });
    }
    await delay(20);
    return HttpResponse.json(sections);
  })
];