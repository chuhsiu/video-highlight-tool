import { http, HttpResponse, delay } from "msw";
import { faker } from "@faker-js/faker";
import type { Section, Highlight } from '@/types'

export const handlers = [
  http.get("/getSections", async ({ request }) => {
    const url = new URL(request.url);
    const videoDuration = Number(url.searchParams.get("duration"));

    if (isNaN(videoDuration) || videoDuration <= 0) {
      return HttpResponse.json<Section[]>([])
    }

    const fixedInterval = 5; // 每段 highlight 間隔 15 秒
    const sections: Section[] = []

    let currentTime = 0;
    let highlightId = 1;
    let sectionId = 1;

    while (currentTime < videoDuration) {
      const sectionHighlightCount = Math.floor(Math.random() * 3) + 1; // 每個 section 1～3 個 highlight
      
      const highlights: Highlight[] = []
      
      for (
        let i = 0;
        i < sectionHighlightCount && currentTime < videoDuration;
        i++
      ) {
        highlights.push({
          id: highlightId++,
          text: faker.lorem.sentence(),
          time: currentTime,
        });
        currentTime += fixedInterval;
      }

      const section: Section = {
        sectionId: sectionId++,
        title: faker.lorem.word(),
        transcripts: faker.lorem.paragraph(),
        highlights,
      }

      sections.push(section)
    }
    await delay(500);
    return HttpResponse.json<Section[]>(sections)
  }),
];
