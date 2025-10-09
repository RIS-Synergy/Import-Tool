import { parseISO } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const timeZone = "Europe/Vienna";

function dateUpdate (date: string) {
  try {
  const parsed = parseISO(date);
  return fromZonedTime(parsed, timeZone);
  } catch (error) {
    console.error('Error parsing date', date, error);
    return null;
  }
}

export function updateData(risData: any) {
  const result = {
    startDate: null,
    endDate: null,
    status: null
  };

  // set startDate and endDate
  result.startDate = dateUpdate(risData.startDate);

  // For endDate, set to end of day (23:59:59)
  const endDate = dateUpdate(risData.endDate);
  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }
  result.endDate = endDate;

  // Status
  result.status = risData.status;

  return result;
}
