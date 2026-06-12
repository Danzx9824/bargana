// FUTURO: Este arquivo será chamado por um Cron Job (ex: Vercel Cron ou Supabase Edge Function)
// Ele iterará sobre os scrapers ativos e fará o UPSERT no banco de dados.

import { ScraperInterface } from './types';
// import { SteamScraper } from './steam.scraper';
// import { KabumScraper } from './kabum.scraper';

class ScraperOrchestrator {
  private scrapers: ScraperInterface[] = [];

  register(scraper: ScraperInterface) {
    this.scrapers.push(scraper);
  }

  async runAll() {
    for (const scraper of this.scrapers) {
      try {
        console.log(`Running scraper: ${scraper.storeName}`);
        const deals = await scraper.fetchDeals();
        console.log(`Found ${deals.length} deals from ${scraper.storeName}`);
        // Lógica de UPSERT no Supabase entrará aqui
      } catch (error) {
        console.error(`Error running ${scraper.storeName}:`, error);
      }
    }
  }
}

export const orchestrator = new ScraperOrchestrator();
// orchestrator.register(new SteamScraper());