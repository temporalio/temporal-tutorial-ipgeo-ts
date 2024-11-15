import axios from 'axios';

// Get the IP address
export async function getIP(): Promise<string> {
  const response = await axios.get('https://icanhazip.com');
  return response.data.trim();
}

// Use the IP address to get the location.
export async function getLocationInfo(ip: string): Promise<string> {
  const url = `http://ip-api.com/json/${ip}`;
  const response = await axios.get(url);
  const data = response.data;
  return `${data.city}, ${data.regionName}, ${data.country}`;
}
