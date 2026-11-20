// EcoSense Carbon Sensor Simulator
// Generates realistic diurnal CO2 ppm readings with Gaussian noise
// Simulates outdoor ambient and urban localized sensor data

export interface SensorReading {
  id: string;
  device_id: string;
  recorded_at: string;
  co2_ppm: number;
  estimated_kg_co2: number;
  is_simulated: boolean;
}

class CarbonSimulator {
  private basePpm = 418.0; // Global ambient background baseline ppm
  private peakPpm = 220.0; // Diurnal peak amplitude (urban traffic and industrial cycle)
  private readingsBuffer: SensorReading[] = [];
  private maxBufferSize = 48; // Store last 48 readings (e.g. 4 hours at 5-minute intervals)

  constructor() {
    this.initializeHistory();
  }

  // Generates 24 historical points for immediate initialization
  private initializeHistory() {
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now - i * 5 * 60 * 1000); // 5-minute intervals
      const reading = this.generateReadingForTime(timestamp);
      this.readingsBuffer.push(reading);
    }
  }

  // Computes realistic CO2 ppm based on hour of day and random atmospheric dispersion
  private generateReadingForTime(date: Date, deviceId: string = 'SIM-MHZ19-01'): SensorReading {
    const hours = date.getHours() + date.getMinutes() / 60;
    // Diurnal curve: peaks at 09:00 and 18:00 (commute & industry), dips at 04:00 and 14:00
    const morningPeak = Math.exp(-Math.pow(hours - 9.5, 2) / 8);
    const eveningPeak = Math.exp(-Math.pow(hours - 18.5, 2) / 10);
    const diurnalComponent = this.peakPpm * (0.6 * morningPeak + 0.4 * eveningPeak);

    // Minor pseudo-random noise between -12 and +12 ppm
    const randomNoise = (Math.random() - 0.5) * 24;
    const co2_ppm = Math.round((this.basePpm + diurnalComponent + randomNoise) * 10) / 10;

    // Estimate kg CO2 in a standard 500m^3 urban street canopy zone
    // Air density ~ 1.225 kg/m^3, molar mass ratio ~ 1.52
    const estimated_kg_co2 = Math.round((co2_ppm * 0.00095) * 100) / 100;

    return {
      id: `sim-${date.getTime()}`,
      device_id: deviceId,
      recorded_at: date.toISOString(),
      co2_ppm,
      estimated_kg_co2,
      is_simulated: true,
    };
  }

  public getNextReading(): SensorReading {
    const reading = this.generateReadingForTime(new Date());
    this.readingsBuffer.push(reading);
    if (this.readingsBuffer.length > this.maxBufferSize) {
      this.readingsBuffer.shift();
    }
    return reading;
  }

  public getHistory(limit: number = 24): SensorReading[] {
    if (this.readingsBuffer.length === 0) {
      this.initializeHistory();
    }
    return this.readingsBuffer.slice(-limit);
  }

  public addRealReading(reading: { device_id: string; co2_ppm: number; estimated_kg_co2?: number }): SensorReading {
    const newEntry: SensorReading = {
      id: `real-${Date.now()}`,
      device_id: reading.device_id,
      recorded_at: new Date().toISOString(),
      co2_ppm: reading.co2_ppm,
      estimated_kg_co2: reading.estimated_kg_co2 || Math.round((reading.co2_ppm * 0.00095) * 100) / 100,
      is_simulated: false,
    };
    this.readingsBuffer.push(newEntry);
    if (this.readingsBuffer.length > this.maxBufferSize) {
      this.readingsBuffer.shift();
    }
    return newEntry;
  }
}

// Global singleton simulator instance across server requests
const globalForSimulator = globalThis as unknown as { carbonSimulator: CarbonSimulator };
export const carbonSimulator = globalForSimulator.carbonSimulator || new CarbonSimulator();
if (process.env.NODE_ENV !== 'production') globalForSimulator.carbonSimulator = carbonSimulator;
