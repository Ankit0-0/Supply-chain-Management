#include <WiFi.h>
#include <WiFiClient.h>
#include "DHT.h"

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "123456789";        // Your WiFi SSID
const char* password = "123456789";    // Your WiFi password
const char* host = "192.168.238.223";  // IP address of the server
const int port = 3000;                 // Port of the server
const char* endpoint = "/g";           // Endpoint to which the POST request will be sent

float temperatureArray[10];      // Array to store temperature readings
float humidityArray[10];         // Array to store humidity readings
unsigned long lastPostTime = 0;  // Variable to track the last time POST request was sent
int arrayIndex = 0;              // Index to track the position in the array
int check = 1;                    // Checkpoint counter
int timeCounter = 1;              // Time counter
int loopCounter = 0;              // Loop counter

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }

  // Connected to WiFi
  Serial.println("Connected to the WiFi network");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Read temperature and humidity every second
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (isnan(t) || isnan(h)) {
    Serial.println("Failed to read data from DHT sensor!");
  } else {
    // Store temperature and humidity in the arrays
    temperatureArray[arrayIndex] = t;
    humidityArray[arrayIndex] = h;
    arrayIndex++;

    // If 10 seconds have passed, send the arrays and reset them
    if (millis() - lastPostTime >= 10000) {
      sendPostRequest();
      lastPostTime = millis();
      arrayIndex = 0;
      loopCounter++;  // Increment loop counter
    }
  }

  delay(1000);  // Wait for 1 second before reading data again
  
  // Check if the loop has run 4 times, then exit the program
  if (loopCounter >= 4) {
    Serial.println("Loop completed. Exiting program.");
    exit(0);  // Exit the program
  }
}

void sendPostRequest() {
  Serial.println("Sending HTTP POST request...");

  // Use WiFiClient to create TCP connections
  WiFiClient client;

  if (!client.connect(host, port)) {
    Serial.println("Connection failed!");
    return;
  }

  String postBody = "[";
  for (int i = 0; i < 10; i++) {
    postBody += "{\"temperature\": " + String(temperatureArray[i]) + 
                ", \"humidity\": " + String(humidityArray[i]) + 
                ", \"shock\": \"" + String(random(0, 50)) + "\"" +  // Assuming shock value is a string
                ", \"time\": " + String(timeCounter) +               // Time attribute starting from 1
                ", \"currentCheckpoint\": " + String(check) +        // Assuming checkpoint starts from 0
                ", \"BatchId\": \"" + String(ESP.getEfuseMac()) + "\"}";  // Using ESP32's unique chip ID as BatchId
    if (i < 9) postBody += ",";
    timeCounter++;  // Increment time counter
  }
  postBody += "]";

  // Send the HTTP POST request
  client.print(String("POST ") + endpoint + " HTTP/1.1\r\n" + "Host: " + host + "\r\n" + "Content-Type: application/json\r\n" + "Content-Length: " + postBody.length() + "\r\n" + "Connection: close\r\n\r\n" + postBody);

  Serial.println("Request sent!");

  // Wait for a response from the server
  while (client.connected()) {
    if (client.available()) {
      // Read the response line by line
      String line = client.readStringUntil('\r');
      Serial.print(line);
    }
  }
  check++;
  // Close the connection
  client.stop();
  Serial.println("\nConnection closed.");
}
