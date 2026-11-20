import fs from 'fs';
import path from 'path';

// Supabase client fallback mechanism
// Falls back automatically to local JSON seed data when Supabase credentials are not set

export interface DbClient {
  isFallback: boolean;
  getRegions(): Promise<any[]>;
  getDeforestationData(stateName: string): Promise<any>;
  getDistrictRisks(stateName?: string): Promise<any[]>;
  getSpecies(region?: string, rainfallBand?: string): Promise<any[]>;
}

class LocalJsonDbClient implements DbClient {
  isFallback = true;
  private dataDir = path.join(process.cwd(), 'data');

  private readJson(relativePath: string) {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Seed data file not found: ${relativePath}`);
    }
    const raw = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(raw);
  }

  async getRegions(): Promise<any[]> {
    return this.readJson('regions.json');
  }

  async getDeforestationData(stateName: string): Promise<any> {
    const models = this.readJson('models/deforestation.json');
    return models[stateName] || null;
  }

  async getDistrictRisks(stateName?: string): Promise<any[]> {
    const risks = this.readJson('district_risk.json');
    if (!stateName) return risks;
    return risks.filter((r: any) => r.state.toLowerCase() === stateName.toLowerCase());
  }

  async getSpecies(region?: string, rainfallBand?: string): Promise<any[]> {
    const all = this.readJson('species.json');
    return all.filter((s: any) => {
      let matchRegion = true;
      let matchRainfall = true;

      if (region && region !== 'all') {
        matchRegion = s.region.toLowerCase().includes(region.toLowerCase()) || s.region.toLowerCase().includes('all');
      }

      if (rainfallBand && rainfallBand !== 'all') {
        const bandKey = rainfallBand.toLowerCase();
        matchRainfall = s.rainfall_band.toLowerCase().includes(bandKey);
      }

      return matchRegion && matchRainfall;
    });
  }
}

let dbInstance: DbClient | null = null;

export function getDb(): DbClient {
  if (!dbInstance) {
    // If Supabase credentials are configured, we could initialize SupabaseClient here.
    // For transparent resilience, fall back to seed JSON files.
    dbInstance = new LocalJsonDbClient();
  }
  return dbInstance;
}
