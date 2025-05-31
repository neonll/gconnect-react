// Convert meters to kilometers with 2 decimal places
export function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(2);
}

// Format date as DD.MM
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}`;
}

// Format average speed (m/s) to pace per kilometer (MM:SS)
export function formatPace(speedMps: number | undefined): string {
  if (!speedMps || speedMps <= 0) return '00:00';
  
  // Calculate seconds per kilometer
  const secondsPerKm = 1000 / speedMps;
  
  // Convert to minutes and seconds
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);
  
  // Format as MM:SS
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Format duration in seconds to HH:MM:SS or MM:SS
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

// Round to nearest integer
export function roundToInt(value: number | undefined): string {
  if (value === undefined) return '0';
  return Math.round(value).toString();
}

// Generate report text based on activity data and user inputs
export function generateReportText(
  activity: any,
  temperature: string,
  weatherConditions: { [key: string]: boolean },
  effortLevel: string,
  comments: string
): string {
  if (!activity) return '';
  
  // Format distance
  const distanceKm = formatDistance(activity.distance);
  
  // Format heart rate
  const averageHRInt = roundToInt(activity.averageHR);
  
  // Format pace
  const paceMinSec = formatPace(activity.averageSpeed);
  
  // Format duration
  const durationFormatted = formatDuration(activity.duration);
  
  // Format elevation gain
  const elevationGainInt = roundToInt(activity.elevationGain || 0);
  
  // Format weather emojis
  const weatherEmojis = Object.entries(weatherConditions)
    .filter(([_, isSelected]) => isSelected)
    .map(([condition, _]) => {
      switch (condition) {
        case 'strongWind': return '💨';
        case 'lightRain': return '🌦️';
        case 'strongRain': return '🌧️';
        case 'storm': return '⛈️';
        case 'snow': return '🌨️';
        default: return '';
      }
    })
    .join(' ');
  
  // Generate the report text
  return `${distanceKm} км, ${averageHRInt} пульс, ${paceMinSec}/км,
${durationFormatted}, ${elevationGainInt} м набор, ${temperature}°C, ${weatherEmojis}.
Ощущения: ${effortLevel}.
Комментарий: ${comments}`;
}