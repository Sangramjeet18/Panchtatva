/*
  EcoSense ESP32 MH-Z19 Carbon Sensor Telemetry Example
  Reads NDIR CO2 PPM from Winsen MH-Z19B sensor via HardwareSerial
  Connects to WiFi and POSTs readings to the EcoSense API route:
  POST /api/carbon/readings
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// EcoSense Ingestion Endpoint
const char* serverUrl = "https://ecosense.onrender.com/api/carbon/readings";
const char* apiKey = "eco_sensor_live_key_9942";
const char* deviceId = "ESP32-MHZ19-KOLKATA-01";

// MH-Z19 UART Pins (Serial2 on ESP32: RX=16, TX=17)
HardwareSerial mhzSerial(2);

byte readCommand[9] = {0xFF, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79};
byte response[9];

int readMHZ19PPM() {
  mhzSerial.write(readCommand, 9);
  memset(response, 0, 9);
  
  unsigned long start = millis();
  while (mhzSerial.available() < 9) {
    if (millis() - start > 1000) return -1; // Timeout
    delay(10);
  }
  
  mhzSerial.readBytes(response, 9);
  
  if (response[0] == 0xFF && response[1] == 0x86) {
    int high = (int)response[2];
    int low = (int)response[3];
    return (high * 256) + low;
  }
  return -1; // Checksum or framing error
}

void setup() {
  Serial.begin(115200);
  mhzSerial.begin(9600, SERIAL_8N1, 16, 17);
  
  Serial.println("EcoSense MH-Z19 Telemetry initializing...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected. IP address: " + WiFi.localIP().toString());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    int co2Ppm = readMHZ19PPM();
    
    if (co2Ppm > 0) {
      Serial.printf("CO2 Reading: %d ppm\n", co2Ppm);
      
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      http.addHeader("X-API-Key", apiKey);
      
      // Calculate estimated kg CO2 in 500m3 canopy area
      float estimatedKg = co2Ppm * 0.00095;
      
      String jsonPayload = String("{\"device_id\":\"") + deviceId + 
                           String("\",\"co2_ppm\":") + co2Ppm + 
                           String(",\"estimated_kg_co2\":") + String(estimatedKg, 2) + 
                           String("}");
      
      int httpResponseCode = http.POST(jsonPayload);
      if (httpResponseCode > 0) {
        String responseBody = http.getString();
        Serial.printf("POST Response [%d]: %s\n", httpResponseCode, responseBody.c_str());
      } else {
        Serial.printf("POST Error: %s\n", http.errorToString(httpResponseCode).c_str());
      }
      http.end();
    } else {
      Serial.println("Sensor read failure, retrying...");
    }
  }
  
  // Transmit telemetry every 15 seconds
  delay(15000);
}
